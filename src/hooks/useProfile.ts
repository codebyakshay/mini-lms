import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./useAuth";
import { useLMS } from "./useLMS";

export function useProfile() {
  const { user, logout, updateAvatar, isLoading: isAuthLoading } = useAuth();
  const { bookmarks, enrollments, progress, clearLMSState } = useLMS();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await clearLMSState();
      await logout();
    } catch (err: any) {
      Alert.alert("Logout Failed", err.message || "Something went wrong.");
    }
  };

  const handleSelectAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          "Permission Denied",
          "We need camera roll permissions to update your profile photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setIsUploading(true);
        await updateAvatar(imageUri);
        Alert.alert("Success", "Avatar updated successfully!");
      }
    } catch (err: any) {
      Alert.alert("Upload Failed", err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const userInitial = user?.username ? user.username[0].toUpperCase() : "?";

  return {
    user,
    joinDate,
    userInitial,
    bookmarksCount: bookmarks.length,
    enrollmentsCount: enrollments.length,
    progress,
    isUploading,
    isAuthLoading,
    handleLogout,
    handleSelectAvatar,
  };
}
