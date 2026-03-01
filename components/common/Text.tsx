import { Text as UIText, TextVariantProps } from "../ui/text";
import { Text as RNText } from "react-native";


type Props = {
  children: string;
  font?: "Poppins_400Regular" | "Poppins_500Medium" | "Poppins_600SemiBold" | "Poppins_700Bold";
  fontSize?: number;
};
export const Text = ({ children, ...props }: Props & React.ComponentProps<typeof RNText> &
  TextVariantProps &
  React.RefAttributes<RNText> & {
    asChild?: boolean;
  }) => {
  return (
    <UIText style={{ fontFamily: props.font ? props.font : "Poppins_400Regular", }} {...props}>{children}</UIText>


  );
};
