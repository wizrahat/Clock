import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/common/Text";
import { View } from "react-native";
import { Badge } from "@/components/ui/badge";

type Props = {};
export default function Alarms({ }: Props) {
  return (
    <View className="flex-1 bg-background" >
      <Text className="text-foreground"  >Alarms Component</Text>
      {/* <ThemeToggle /> */}
    </View>
  );
}
