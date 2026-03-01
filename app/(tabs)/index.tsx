import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

type Props = {};
export default function Alarms({ }: Props) {
  return (
    <View className="flex-1 bg-background">
      <Text className="text-foreground">Alarms Component</Text>
      <Button variant="secondary"  ><Text>Button</Text></Button>
      <ThemeToggle />
    </View>
  );
}
