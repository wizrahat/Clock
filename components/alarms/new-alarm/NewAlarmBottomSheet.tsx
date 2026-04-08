import { Text } from '@/components/common/Text';
import { useColorScheme } from '@/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import { Easing } from 'react-native-reanimated';
import TimePicker from './TimePicker';
import ScheduleCard from './ScheduleCard';

type Props = {
  bottomSheetRef?: React.Ref<BottomSheetModal>;
};

export default function NewAlarmBottomSheet({ bottomSheetRef }: Props) {
  // HOOKS
  const { colors } = useColorScheme();
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 350, // change later if needed
    easing: Easing.bezier(0.2, 0.8, 0.3, 1), // change later if needed
  });

  return (
    <BottomSheetModal
      handleIndicatorStyle={{
        backgroundColor: colors.mutedForeground,
        width: 60, // change this later if needed
        height: 3, // change this later if needed
        borderRadius: 10, // change this later if needed
      }}
      backgroundStyle={{
        borderRadius: 12,
        backgroundColor: colors.card,
      }}
      ref={bottomSheetRef}
      snapPoints={['93.5%']} // change this later if needed
      enableDynamicSizing={false}
      enablePanDownToClose
      overDragResistanceFactor={1}
      enableOverDrag
      backdropComponent={(props) => {
        return (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        );
      }}
      animationConfigs={animationConfigs}>
      <BottomSheetView style={{ flex: 1, padding: 20 }}>
        <TimePicker />
        <ScheduleCard />
      </BottomSheetView>
    </BottomSheetModal>
  );
}
