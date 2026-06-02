import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  message: string;
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <View style={styles.centerContainer}>
      <Feather name={icon} size={48} color={colors.neutral[300]} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
});
