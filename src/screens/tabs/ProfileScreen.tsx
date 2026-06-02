import { Button } from "@/components";
import { colors } from "@/constants/colors";
import { useProfile } from "@/hooks";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ProfileScreen.styles";
import {
  DetailsCard,
  ProfileHeader,
  ProgressCard,
  StatsRow,
} from "./components";

export default function ProfileScreen() {
  const {
    user,
    joinDate,
    userInitial,
    bookmarksCount,
    enrollmentsCount,
    progress,
    isUploading,
    isAuthLoading,
    handleLogout,
    handleSelectAvatar,
  } = useProfile();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile User Avatar & Credentials Header */}
        <ProfileHeader
          avatarUrl={user?.avatar?.url}
          username={user?.username}
          email={user?.email}
          userInitial={userInitial}
          isUploading={isUploading}
          onSelectAvatar={handleSelectAvatar}
        />

        {/* Statistics Cards Row */}
        <StatsRow
          enrollmentsCount={enrollmentsCount}
          bookmarksCount={bookmarksCount}
        />

        {/* Course Completion Progress */}
        <ProgressCard progress={progress} />

        {/* User Specific Registration details */}
        <DetailsCard role={user?.role} joinDate={joinDate} />

        {/* Logout Button */}
        <Button
          title="Log Out"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={{ color: colors.error }}
          isLoading={isAuthLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
