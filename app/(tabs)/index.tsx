import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Text } from "@/components/common/Text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type Props = {};
export default function Alarms({ }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background" >
      <Text className="text-foreground"  >Alarms Component</Text>
      <ThemeToggle />
    </SafeAreaView>
  );
}
