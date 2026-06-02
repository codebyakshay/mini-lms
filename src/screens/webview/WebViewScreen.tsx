import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { colors } from "@/constants/colors";
import { storage } from "@/utils";
import { useAuth } from "@/hooks";
import { Course } from "@/types";
import { getCoursePlayerHTML } from "@/utils/courseContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

export default function WebViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const webViewRef = useRef<WebView>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0); // Used for retry mechanism to recreate WebView

  // Load course details and secure auth token
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cachedCourses, accessToken] = await Promise.all([
          AsyncStorage.getItem("@lms_courses_cache"),
          storage.getAccessToken(),
        ]);

        setToken(accessToken);

        if (cachedCourses) {
          const coursesList: Course[] = JSON.parse(cachedCourses);
          const found = coursesList.find((c) => c.id === id);
          if (found) {
            setCourse(found);
          }
        }
      } catch (err) {
        console.error("Failed to load webview data", err);
      } finally {
        setIsLoadingCourse(false);
      }
    };

    loadData();
  }, [id]);

  const handleRetry = () => {
    setHasError(false);
    setWebViewLoading(true);
    setKey((prev) => prev + 1);
  };

  if (isLoadingCourse) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={48} color={colors.error} />
        <Text style={styles.errorText}>Course content not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Construct headers for injection
  const headers = {
    "X-LMS-User-Token": token || "anonymous_token",
    "X-LMS-User-Role": user?.role || "student",
    "X-LMS-Course-Id": id || "unknown_course",
  };

  // Generate HTML source string
  const htmlContent = getCoursePlayerHTML({
    courseTitle: course.title,
    courseCategory: course.category,
    instructorName: `${course.instructor?.name.first || ""} ${course.instructor?.name.last || ""}`.trim(),
  });

  // Inject headers into the HTML's window object
  const injectedJS = `
    window.LMS_HEADERS = ${JSON.stringify(headers)};
    if (window.onHeadersReceived) {
      window.onHeadersReceived(window.LMS_HEADERS);
    }
    true;
  `;

  // Handle bidirectional postMessage calls from WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "COMPLETE") {
        router.back();
      } else if (data.type === "STATUS") {
        console.log(`WebView content state update: ${data.message}`);
      }
    } catch (err) {
      console.warn("Failed to parse WebView message", err);
    }
  };

  return (
    <View style={styles.container}>
      {hasError ? (
        <View style={styles.centerContainer}>
          <Feather name="wifi-off" size={48} color={colors.neutral[400]} />
          <Text style={styles.errorTitle}>Failed to load course player</Text>
          <Text style={styles.errorSubtitle}>
            Please check your connection and try again.
          </Text>
          <Pressable onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry Loading</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.webviewWrapper}>
          <WebView
            key={key}
            ref={webViewRef}
            source={{
              html: htmlContent,
              headers: headers,
            }}
            injectedJavaScript={injectedJS}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onError={() => setHasError(true)}
            onHttpError={() => setHasError(true)}
            onMessage={handleMessage}
            style={styles.webview}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          {webViewLoading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color={colors.primary.default} />
              <Text style={styles.loaderText}>Initializing course player...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  webviewWrapper: {
    flex: 1,
    position: "relative",
  },
  webview: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: colors.dark.background,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.dark.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    color: colors.neutral[300],
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: colors.neutral[300],
    marginTop: 12,
    marginBottom: 20,
    fontWeight: "600",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary.default,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[100],
    marginTop: 16,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 13,
    color: colors.neutral[400],
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary.default,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
