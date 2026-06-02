import { Text, View } from "react-native";
import { styles } from "../ProfileScreen.styles";

interface DetailsCardProps {
  role?: string;
  joinDate: string;
}

export function DetailsCard({ role, joinDate }: DetailsCardProps) {
  const formattedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : "User";

  return (
    <View style={styles.detailsCard}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Account Role</Text>
        <Text style={styles.detailValue}>{formattedRole}</Text>
      </View>
      <View style={styles.detailRowLast}>
        <Text style={styles.detailLabel}>Member Since</Text>
        <Text style={styles.detailValue}>{joinDate}</Text>
      </View>
    </View>
  );
}
