import { Text, View } from "react-native";
import { styles } from "../ProfileScreen.styles";

interface ProgressCardProps {
  progress: number;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Overall Progress</Text>
        <Text style={styles.progressValue}>{progress}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}
