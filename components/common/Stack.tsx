import { withLayoutContext } from 'expo-router';
import {
  createBlankStackNavigator,
  type BlankStackNavigationOptions,
} from 'react-native-screen-transitions/blank-stack';

const { Navigator } = createBlankStackNavigator();
// @ts-ignore
export const Stack = withLayoutContext<BlankStackNavigationOptions, typeof Navigator>(
  Navigator
);
