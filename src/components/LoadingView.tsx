import { colors } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingView() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary.default} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral[50],
  },
});
