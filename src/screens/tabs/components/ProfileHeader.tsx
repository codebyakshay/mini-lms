import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { styles } from "../ProfileScreen.styles";

interface ProfileHeaderProps {
  avatarUrl?: string;
  username?: string;
  email?: string;
  userInitial: string;
  isUploading: boolean;
  onSelectAvatar: () => void;
}

export function ProfileHeader({
  avatarUrl,
  username,
  email,
  userInitial,
  isUploading,
  onSelectAvatar,
}: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>{userInitial}</Text>
          </View>
        )}
        <Pressable
          onPress={onSelectAvatar}
          style={styles.editBadge}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Feather name="camera" size={14} color="#ffffff" />
          )}
        </Pressable>
      </View>
      <Text style={styles.name}>{username || "Learner"}</Text>
      <Text style={styles.email}>{email || "No email provided"}</Text>
    </View>
  );
}
