import { Redirect } from "expo-router";

export default function IndexRedirect() {
  // Scaffold redirects directly to auth flow
  return <Redirect href="/(auth)/login" />;
}
