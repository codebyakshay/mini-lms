# Code Quality Audit & Improvement Plan

**Date**: June 2, 2026  
**Status**: Identified Issues Requiring Fix  
**Priority Focus**: Data Integrity, Type Safety, Performance

---

## Executive Summary

Your project has excellent architecture and organization, but contains **6 critical-to-medium code quality issues** that need addressing before production. Most fall into three categories:

1. **Data Integrity** — Race conditions can cause data loss
2. **Type Safety** — Untyped API responses bypass TypeScript protection
3. **Performance** — Inefficient filtering and re-renders cause jank

This document outlines each issue, why it matters, and how to fix it.

---

## Issue #1: Race Conditions in LMSContext (CRITICAL)

**File**: `src/context/LMSContext.tsx` (lines 53–98)

### The Problem

The `toggleBookmark` and `enrollInCourse` functions perform state updates and async storage writes **without synchronization**:

```typescript
const toggleBookmark = async (courseId: string) => {
  try {
    setBookmarks((currentBookmarks) => {
      // State updates immediately
      const updatedBookmarks = isBookmarking
        ? [...currentBookmarks, courseId]
        : currentBookmarks.filter((id) => id !== courseId);

      // But the disk write is fire-and-forget
      AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(updatedBookmarks)
      ).catch((err) => console.error("Failed to save bookmarks", err));

      return updatedBookmarks; // Returns before disk write completes
    });
  } catch (error) {
    console.error("Failed to toggle bookmark", error);
  }
};
```

### Why This Is Critical

1. **Data Loss on App Crash**: If the user closes the app (or crashes) before `AsyncStorage.setItem` completes, the state change is lost but never persisted.
2. **Race Conditions on Rapid Clicks**: Multiple rapid bookmark toggles create concurrent writes to AsyncStorage. The last write may overwrite earlier changes, losing data.
3. **No Rollback**: If AsyncStorage fails, the UI state is already committed. You can't undo a failed write.
4. **Silent Failure**: The `.catch()` only logs—it doesn't inform the UI or user that persistence failed.

### The Fix

Use an async function with proper error handling and state rollback:

```typescript
const toggleBookmark = async (courseId: string) => {
  const previousBookmarks = bookmarks;
  const isBookmarking = !bookmarks.includes(courseId);
  const updatedBookmarks = isBookmarking
    ? [...bookmarks, courseId]
    : bookmarks.filter((id) => id !== courseId);

  // Optimistic update
  setBookmarks(updatedBookmarks);

  try {
    // Wait for persistence before returning
    await AsyncStorage.setItem(
      STORAGE_KEYS.BOOKMARKS,
      JSON.stringify(updatedBookmarks)
    );

    // Trigger notification after successful persist
    if (isBookmarking && updatedBookmarks.length === 5) {
      await notificationService.showMilestoneNotification();
    }
  } catch (error) {
    console.error("Failed to save bookmarks, rolling back", error);
    // Rollback on failure
    setBookmarks(previousBookmarks);
    // Show error to user
    Alert.alert("Error", "Failed to update bookmark. Please try again.");
  }
};
```

**Key improvements**:
- Save previous state for rollback
- `await` the AsyncStorage call—don't fire-and-forget
- Rollback on failure instead of silently failing
- Use `Alert.alert` to inform the user of errors

### Why It Matters

**Impact**: User loses data they expected to save. In production, this destroys trust.

**Production Risk**: High. This is a common mobile app bug that users immediately notice and complain about.

**Effort to Fix**: 15 minutes per function (apply pattern to `enrollInCourse` too).

---

## Issue #2: Untyped API Responses (CRITICAL)

**File**: `src/hooks/useCourses.ts` (lines 26–64)

### The Problem

The FreeAPI responses are typed as `any`, losing all TypeScript safety:

```typescript
const productsData = productsRes.data?.data?.data || [];
const usersData = usersRes.data?.data?.data || [];

const combined: Course[] = productsData.map(
  (product: any, index: number) => {  // <-- `any` type
    const user = usersData[index % usersData.length];
    
    return {
      id: product.id.toString(),      // No type checking
      title: product.title || "Untitled Course",
      description: product.description || "No description provided.",
      // ...
    };
  }
);
```

### Why This Is Critical

1. **Runtime Crashes**: If the API response structure changes (e.g., `product.id` is renamed to `product.productId`), the code crashes at runtime—TypeScript won't warn you.
2. **Wrong Data Types**: The API might return `{id: "abc-123"}` instead of `{id: 123}`. You safely assume `.toString()` will work, but it silently fails.
3. **Null/Undefined Handling**: `product.description` might be `null` from the API. Your fallback `"No description provided"` will never execute because you don't type-check.
4. **No Contract Validation**: The API could change without your knowledge. Without types, you have no compile-time safety net.

### The Fix

Create response types and validate at the API boundary:

```typescript
// src/types/api.ts (new file)

export interface FreeAPIProduct {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
}

export interface FreeAPIUser {
  id: number;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface APIResponse<T> {
  status: number;
  message: string;
  data: {
    data: T[];
  };
}
```

Then use these types in the hook:

```typescript
import { FreeAPIProduct, FreeAPIUser, APIResponse } from "@/types/api";

// Fetch with proper types
const [productsRes, usersRes] = await Promise.all([
  api.get<APIResponse<FreeAPIProduct>>("/public/randomproducts?page=1&limit=20"),
  api.get<APIResponse<FreeAPIUser>>("/public/randomusers?page=1&limit=20"),
]);

const productsData: FreeAPIProduct[] = productsRes.data?.data?.data || [];
const usersData: FreeAPIUser[] = usersRes.data?.data?.data || [];

const combined: Course[] = productsData.map((product, index) => {
  const user = usersData[index % usersData.length];
  // TypeScript now catches errors at compile time
  return {
    id: product.id.toString(),
    title: product.title || "Untitled Course",
    // ...
  };
});
```

### Why It Matters

**Impact**: Silent data corruption or runtime crashes in production.

**Production Risk**: High. Users see blank screens or wrong data.

**Effort to Fix**: 30 minutes (create types + update hook).

---

## Issue #3: Hardcoded Layout Values (MEDIUM)

**File**: `src/components/CourseCard.tsx` (lines 96–150)

### The Problem

The bookmark button position is hardcoded based on a fixed thumbnail height:

```typescript
bookmarkButtonAbsolute: {
  position: "absolute",
  top: 176,  // = 160 (thumbnail) + 16 (padding)
  right: 16,
  // ...
},
thumbnail: {
  width: "100%",
  height: 160,  // Hardcoded thumbnail height
  // ...
},
```

### Why This Breaks

1. **Design Changes**: If designers want to change thumbnail height to 180, the button stays at `top: 176`—now it's misaligned.
2. **Platform Differences**: iOS vs Android might render images differently. A fixed value won't adapt.
3. **Maintenance Burden**: The relationship between `thumbnail.height` and `bookmarkButtonAbsolute.top` is implicit. Future developers won't know why the button is at 176.
4. **No Flexibility**: You can't reuse this component with different thumbnail sizes.

### The Fix

Calculate the position dynamically. Use a layout-aware approach:

**Option A: Use component state to measure**
```typescript
import { useState } from "react";

function CourseCardComp({ item, isBookmarked, onPress, onToggleBookmark }: CourseCardProps) {
  const [thumbnailHeight, setThumbnailHeight] = useState(160);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => onPress(item.id)} style={styles.pressableContent}>
        <Image
          source={{ uri: getCourseThumbnail(item) }}
          style={[styles.thumbnail, { height: thumbnailHeight }]}
          onLayout={(e) => setThumbnailHeight(e.nativeEvent.layout.height)}
          resizeMode="cover"
        />
        {/* ... */}
      </Pressable>

      {/* Bookmark positioned relative to measured height */}
      <Pressable
        onPress={() => onToggleBookmark(item.id)}
        style={[
          styles.bookmarkButtonAbsolute,
          { top: thumbnailHeight + 16 },  // Dynamic calculation
        ]}
        hitSlop={12}
      >
        <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={18} />
      </Pressable>
    </View>
  );
}
```

**Option B: Use a constant with documentation**
```typescript
const COURSE_CARD = {
  THUMBNAIL_HEIGHT: 160,
  CARD_PADDING: 16,
} as const;

const styles = StyleSheet.create({
  thumbnail: {
    width: "100%",
    height: COURSE_CARD.THUMBNAIL_HEIGHT,
  },
  bookmarkButtonAbsolute: {
    position: "absolute",
    top: COURSE_CARD.THUMBNAIL_HEIGHT + COURSE_CARD.CARD_PADDING,
    right: COURSE_CARD.CARD_PADDING,
  },
});
```

### Why It Matters

**Impact**: Fragile UI that breaks on design changes.

**Production Risk**: Medium. Won't crash, but looks broken.

**Effort to Fix**: 20 minutes.

---

## Issue #4: Verbose and Brittle Memo Comparison (MEDIUM)

**File**: `src/components/CourseCard.tsx` (lines 194–203)

### The Problem

The memo comparison function manually lists every prop:

```typescript
export default memo(CourseCardComp, (prevProps, nextProps) => {
  return (
    prevProps.isBookmarked === nextProps.isBookmarked &&
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.thumbnail === nextProps.item.thumbnail &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.item.category === nextProps.item.category
  );
});
```

### Why This Breaks

1. **Easy to Forget**: If you add a new prop `onLongPress`, the memo doesn't compare it. The component re-renders even when it shouldn't (or vice versa).
2. **Maintenance Burden**: Every prop change requires updating two places (component signature + memo comparison).
3. **Inconsistent Behavior**: The component might re-render unexpectedly, causing jank.

### The Fix

Use `useMemo` in the parent component instead—it's clearer and more maintainable:

**In `CoursesScreen.tsx`**:
```typescript
const renderItem = useCallback(
  ({ item }: { item: Course }) => (
    <CourseCard
      key={item.id}
      item={item}
      isBookmarked={bookmarks.includes(item.id)}
      onPress={handleCoursePress}
      onToggleBookmark={toggleBookmark}
    />
  ),
  [bookmarks, handleCoursePress, toggleBookmark]
);

return (
  <LegendList
    data={courses}
    renderItem={renderItem}
    keyExtractor={(item: Course) => item.id}
    // ...
  />
);
```

**Remove the custom memo from `CourseCard.tsx`**:
```typescript
export default memo(CourseCardComp);
```

This uses React's default shallow comparison, which works correctly when the parent memoizes its callbacks.

### Why It Matters

**Impact**: Unnecessary re-renders cause UI jank (especially on large lists).

**Production Risk**: Medium. Users notice stutter when scrolling.

**Effort to Fix**: 10 minutes.

---

## Issue #5: Missing useMemo for Search Filtering (MEDIUM)

**File**: `src/hooks/useCourses.ts` (lines 92–111)

### The Problem

The search filter recalculates on every render, even when the data hasn't changed:

```typescript
useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredCourses(courses);
    return;
  }

  const query = searchQuery.toLowerCase();
  const filtered = courses.filter((course) => {
    const titleMatch = course.title?.toLowerCase().includes(query);  // Expensive string ops
    const descMatch = course.description?.toLowerCase().includes(query);
    const firstName = course.instructor?.name?.first?.toLowerCase() || "";
    const lastName = course.instructor?.name?.last?.toLowerCase() || "";
    const instructorMatch =
      firstName.includes(query) || lastName.includes(query);

    return titleMatch || descMatch || instructorMatch;
  });

  setFilteredCourses(filtered);
}, [searchQuery, courses]);
```

### Why This Causes Performance Issues

1. **String Operations on Every Render**: `.toLowerCase()` and `.includes()` run even if `searchQuery` and `courses` are identical.
2. **Jank During Typing**: As the user types each letter, the entire course list is re-filtered. With 20+ courses, this causes noticeable lag.
3. **Excessive State Updates**: `setFilteredCourses` is called even when the filtered result hasn't changed.
4. **Mobile Impact**: React Native is slower than web. Performance issues are more visible.

### The Fix

Wrap the filter logic in `useMemo`:

```typescript
import { useMemo } from "react";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... fetchCoursesAndInstructors logic ...

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    const query = searchQuery.toLowerCase();
    return courses.filter((course) => {
      const titleMatch = course.title?.toLowerCase().includes(query);
      const descMatch = course.description?.toLowerCase().includes(query);
      const firstName = course.instructor?.name?.first?.toLowerCase() || "";
      const lastName = course.instructor?.name?.last?.toLowerCase() || "";
      const instructorMatch =
        firstName.includes(query) || lastName.includes(query);

      return titleMatch || descMatch || instructorMatch;
    });
  }, [searchQuery, courses]);

  return {
    courses: filteredCourses,
    searchQuery,
    setSearchQuery,
    isLoading,
    isRefreshing,
    error,
    handleRefresh,
  };
}
```

### Why It Matters

**Impact**: Users experience lag when typing. Search becomes unusable on slow devices.

**Production Risk**: Medium. Impacts UX directly—users will notice.

**Effort to Fix**: 5 minutes.

---

## Issue #6: Fragile User-Product Mapping (MEDIUM)

**File**: `src/hooks/useCourses.ts` (lines 34–64)

### The Problem

The code pairs products with users using a modulo index:

```typescript
const combined: Course[] = productsData.map(
  (product: any, index: number) => {
    const user = usersData[index % usersData.length];  // What if usersData is empty?
    // ...
  }
);
```

### Why This Breaks

1. **Empty Array Edge Case**: If `usersData` is empty, `usersData.length = 0`. The modulo operation returns `0 % 0 = NaN`, and `usersData[NaN]` is `undefined`. The instructor becomes `{id: "instructor-0", name: {...}}` with empty values.
2. **Unintuitive Logic**: The modulo wrap-around isn't documented. Future developers won't understand why user #1 is assigned to products 1, 21, 41, etc.
3. **No Validation**: If the API returns fewer users than products, some products get duplicate instructors by chance.

### The Fix

Add validation and document the pairing strategy:

```typescript
const fetchCoursesAndInstructors = async (showRefreshIndicator = false) => {
  // ... loading states ...

  try {
    const [productsRes, usersRes] = await Promise.all([
      api.get<APIResponse<FreeAPIProduct>>("/public/randomproducts?page=1&limit=20"),
      api.get<APIResponse<FreeAPIUser>>("/public/randomusers?page=1&limit=20"),
    ]);

    const productsData: FreeAPIProduct[] = productsRes.data?.data?.data || [];
    const usersData: FreeAPIUser[] = usersRes.data?.data?.data || [];

    // Validate both arrays have data
    if (productsData.length === 0) {
      setError("No courses available. Please try again later.");
      return;
    }
    if (usersData.length === 0) {
      setError("Unable to load instructor information. Please try again.");
      return;
    }

    // Pair by index modulo—ensures every product gets an instructor
    // If fewer instructors than products, they cycle (e.g., 5 instructors, 20 products → repeats)
    const combined: Course[] = productsData.map((product, index) => {
      const user = usersData[index % usersData.length];

      const instructor: Instructor = {
        id: user.id.toString(),
        name: {
          title: user.name.title || "",
          first: user.name.first || "Unknown",
          last: user.name.last || "Instructor",
        },
        email: user.email || "",
        picture: {
          large: user.picture.large || "",
          medium: user.picture.medium || "",
          thumbnail: user.picture.thumbnail || "",
        },
      };

      return {
        id: product.id.toString(),
        title: product.title || "Untitled Course",
        description: product.description || "No description provided.",
        thumbnail: product.thumbnail || "",
        price: product.price || 0,
        category: product.category || "General",
        instructor,
      };
    });

    setCourses(combined);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(combined));
  } catch (err: any) {
    console.error("Failed to fetch courses from FreeAPI", err);
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      setCourses(JSON.parse(cached));
    } else {
      setError(
        err.message ||
          "Failed to load courses. Please check your internet connection."
      );
    }
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};
```

### Why It Matters

**Impact**: Edge cases cause data inconsistencies.

**Production Risk**: Low-medium. Users won't crash, but might see odd pairings.

**Effort to Fix**: 10 minutes.

---

## Minor Issues (Lower Priority)

### Issue #7: No Error Boundary for LMSProvider
**File**: `src/app/_layout.tsx`

If `LMSProvider` throws an error (e.g., during AsyncStorage reads), it crashes the entire app. Consider wrapping it in an Error Boundary or adding try-catch.

**Effort**: 15 minutes.

---

### Issue #8: No Request Abort on Navigation
**File**: `src/hooks/useCourses.ts`

If the user navigates away while `fetchCoursesAndInstructors` is running, the fetch still completes and calls `setCourses`. This causes a "can't set state on unmounted component" warning in React.

**Fix**: Use an AbortController to cancel in-flight requests on unmount.

**Effort**: 20 minutes.

---

### Issue #9: Console.error Spam
**File**: Multiple files

Too many `console.error` calls make production logs noisy. Use a logging service or `__DEV__` checks instead.

**Effort**: 10 minutes.

---

## Fix Priority & Timeline

| Priority | Issue | Risk | Effort | Timeline |
|----------|-------|------|--------|----------|
| 🔴 Critical | #1: Race conditions | Data loss | 30 min | **Do immediately** |
| 🔴 Critical | #2: Untyped APIs | Crashes | 30 min | **Do immediately** |
| 🟡 High | #3: Hardcoded layouts | UI breaks | 20 min | This week |
| 🟡 High | #4: Verbose memo | Jank | 10 min | This week |
| 🟡 High | #5: Search perf | Lag | 5 min | Today |
| 🟡 High | #6: Fragile mapping | Edge cases | 10 min | This week |
| 🟢 Medium | #7–9: Minor issues | Warnings | 45 min | Next week |

**Total effort**: ~2.5 hours to fix all issues.

---

## How to Apply These Fixes

1. Start with **Issue #1** (LMSContext race conditions) — this is data-critical.
2. Then **Issue #2** (API types) — prevents runtime crashes.
3. Then **Issue #5** (search memoization) — quick win for UX.
4. Fill in the rest based on available time.

Each fix is relatively isolated—you can apply them one at a time without conflicts.

---

## Next Steps

1. Review this document with your team
2. Create a checklist or GitHub issues for each fix
3. Start with the critical issues (#1, #2)
4. Test on both iOS and Android simulators after each fix
5. Add unit tests for the hooks once types are fixed

---

## Questions?

Refer to specific line numbers in this plan when discussing issues. Use the code examples as templates for refactoring.
