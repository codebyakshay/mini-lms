# Mini-LMS Mobile Application 🎓

A performance-optimized, production-ready Mini LMS Mobile Application built using **React Native Expo (SDK 56)**, featuring secure authentication, offline-first course catalog rendering, an embedded interactive WebView lesson content viewer, and intelligent local notifications.

---

## 🚀 Key Features

### 1. Secure Authentication & User Management (Part 1)
*   **Zod & React Hook Form Validation:** Implements strict client-side validation schema constraints.
*   **Expo SecureStore Token persistence:** Access and Refresh tokens are secured in device-level hardware keychain storage.
*   **Auto-Login & Silent Refresh:** Postpones session timeout checks and handles transparent, background JWT token refresh interceptors.
*   **Profile Customization:** Integrates `expo-image-picker` to upload user avatar via `PATCH /users/avatar`.

### 2. Native Course Catalog & Bookmarking (Part 2 & Part 5.2)
*   **LegendList Render Feed:** High-performance catalog feed with extremely low rendering overhead.
*   **Zipped Datasets:** Parallels fetches of random products (courses) and random users (instructors) zipped dynamically.
*   **Instant Bookmark Sync:** Reactively updates state using standard `extraData` props.
*   **Smooth Pull-to-Refresh & Search:** Features instant query matching on title, description, and instructors.
*   **List Caching:** Automatically saves data to `AsyncStorage` to serve catalog details during network outages.

### 3. Embedded Lesson Player via WebView (Part 3 & Part 6.2)
*   **Bidirectional WebView Bridge:** Full interface wrapper allowing safe postMessage feedback loops to automatically record course completions.
*   **Authentication Injection Handshake:** Securely passes custom headers (`X-LMS-User-Token`, `X-LMS-User-Role`, `X-LMS-Course-Id`) to authenticate web sessions.
*   **Network Failure Interception:** Implements custom fallback error overlay routes with instant manual reload actions.

### 4. Intelligent Local Notifications (Part 4)
*   **Milestone Alerts:** Detects when active bookmark catalogs cross the 5+ milestone and alerts the user.
*   **24-Hour Postponed Idle Reminder:** Automatically schedules reminders that reschedule themselves whenever the app transitions between active lifecycle segments.

### 5. Network Resilience & Offline-First UI (Part 6.1)
*   **Transient Request Retry Interceptor:** Retries failed or timed-out server operations up to 3 times using exponential backoff.
*   **Slide-Down Global Offline Warning Banner:** Real-time network detection that shifts into display when offline, and slides away when online.

---

## 🛠️ Technology Stack

*   **Framework:** React Native Expo (SDK 56)
*   **Language:** TypeScript (Strict Mode)
*   **State Management:** React Context (Auth + LMS states) & Custom Hooks (logic-view separation)
*   **List Renderer:** `@legendapp/list/react-native`
*   **Styling:** StyleSheet (Vanilla CSS design systems)
*   **Network Client:** Axios (with custom retry interceptors)
*   **Animations:** `react-native-reanimated`

---

## 📂 Project Structure

```
src/
├── app/                      # Expo Router files (Tab and Course routes)
│   ├── (auth)/              # Register & Login screens
│   ├── (tabs)/              # Courses, Bookmarks, and Profile tabs
│   ├── course/[id].tsx      # Native Course Details Screen
│   ├── webview.tsx          # WebView Embedded Content Player route
│   └── _layout.tsx          # App entry point, layouts, and global banner
├── components/               # Custom presentational components
│   ├── ui/                  # Reusable form elements (Button, InputField)
│   ├── CourseCard.tsx       # Performance-memoized list card item
│   ├── EmptyState.tsx       # Standard empty feeds layout
│   ├── LoadingView.tsx      # Standardized visual loading spinner
│   └── OfflineBanner.tsx    # Slide-down top banner for network detection
├── constants/                # Theme colors and constants
├── hooks/                    # Logic Separation (useAuth, useCourses, useBookmarks, etc.)
├── services/                 # External bindings (Axios api configuration, NotificationManager)
├── types/                    # Domain schemas and interfaces
└── utils/                    # Common functions (Responsive metrics, Image placeholders)
```

---

## ⚙️ Installation & Setup

Follow these steps to launch the project locally:

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Install Dependencies
Clone the repository, navigate to the folder, and run:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (if needed by your server configs) or configure backend targets in [src/services/api.ts](file:///Users/razerak/Desktop/Mini-LMS/src/services/api.ts). The API Base points by default to:
`https://api.freeapi.app/api/v1`

### 4. Run Metro Bundler
Start the Metro server cleanly:
```bash
npx expo start -c
```

### 5. Launch Client Devices
*   Press **`i`** to load the iOS Simulator.
*   Press **`a`** to load the Android Emulator.
*   Scan the QR code with the Expo Go mobile app (iOS/Android) to test on a physical device.

---

## 🛡️ Key Architectural & Security Decisions

### Custom Logic Separation (Hooks & Layouts)
Following professional React Native patterns, screen rendering files (`CoursesScreen.tsx`, `ProfileScreen.tsx`, `BookmarksScreen.tsx`) contain **no inline API, data mutations, or asynchronous handlers**. All operations are delegated cleanly to custom, highly typed hooks (`useCourses`, `useProfile`, `useBookmarks`), making the views thin, declarative, and easy to maintain.

### Secure Offline Cache Interceptor
Instead of blocking UI on transient timeouts or cellular dropouts, requests failing due to offline status or 5xx failures are captured by a custom interceptor. It retries the operation up to 3 times (using an exponential delay backoff of `1s`, `2s`, `4s`). If the retries fail, it falls back to zipping locally persisted AsyncStorage cache data, offering uninterrupted access.

### Bidirectional Webview authentication Injection
To authenticate content requests securely inside the embedded player, the app injects authentication tokens and course context on the fly:
1. Injects secure session parameters into the `headers` prop of the WebView request.
2. Injects a global script payload via `injectedJavaScript` directly into the WebView's document memory pool to display interactive debug handshakes inside the mock player.
3. Receives JSON message handlers over `onMessage` from the WebView to record progress milestones and pop the screen cleanly back to the native layer.
