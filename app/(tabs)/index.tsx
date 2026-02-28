import { Text, View } from "react-native";

type Props = {};
export default function Alarms({ }: Props) {
  return (
    <View className="flex-1 bg-background">
      <Text className="text-foreground">Alarms Component</Text>
    </View>
  );
};
