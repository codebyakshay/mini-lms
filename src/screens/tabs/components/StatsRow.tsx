import { Text, View } from "react-native";
import { styles } from "../ProfileScreen.styles";

interface StatsRowProps {
  enrollmentsCount: number;
  bookmarksCount: number;
}

export function StatsRow({ enrollmentsCount, bookmarksCount }: StatsRowProps) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{enrollmentsCount}</Text>
        <Text style={styles.statLabel}>Enrolled</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{bookmarksCount}</Text>
        <Text style={styles.statLabel}>Bookmarks</Text>
      </View>
    </View>
  );
}
