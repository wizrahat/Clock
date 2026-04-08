import React, { memo, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export const Picker = memo(
  ({
    items,
    onItemChange,
    initialIndex = 0,
    itemHeight = 64,
    rowGap = 0,
    fontSize = 32,
    width = 85,
    textColor = '#FFFFFF',
    font = 'Poppins_500Medium',
    fontWeight = '700',
    deceleration = 0.998,
  }: any) => {
    const effectiveItemHeight = itemHeight + rowGap;
    const totalHeight = effectiveItemHeight * 5;
    const scrollY = useSharedValue(initialIndex * effectiveItemHeight);
    const lastIndex = useSharedValue(initialIndex);
    const soundRef = useRef<Audio.Sound | null>(null);

    const activeIndex = useDerivedValue(() => scrollY.value / effectiveItemHeight);

    useEffect(() => {
      async function setup() {
        try {
          const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/tick.wav'), {
            shouldPlay: false,
            volume: 1.0,
          });
          soundRef.current = sound;
        } catch (e) {}
      }
      setup();
      return () => {
        soundRef.current?.unloadAsync();
      };
    }, []);

    const playSound = useCallback(() => {
      if (!soundRef.current) return;
      soundRef.current
        .setPositionAsync(0)
        .then(() => soundRef.current?.playAsync().catch(() => {}))
        .catch(() => {});
    }, []);

    const handleScrollSettle = useCallback(
      (e: any) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / effectiveItemHeight);
        if (index >= 0 && index < items.length) {
          onItemChange?.(items[index]);
        }
      },
      [effectiveItemHeight, items, onItemChange]
    );

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        const currentIndex = Math.round(event.contentOffset.y / effectiveItemHeight);
        if (currentIndex !== lastIndex.value && currentIndex >= 0 && currentIndex < items.length) {
          lastIndex.value = currentIndex;
          runOnJS(playSound)();
          if (onItemChange) runOnJS(onItemChange)(items[currentIndex]);
        }
      },
    });

    return (
      <MaskedView
        style={{ width, height: totalHeight }}
        maskElement={
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.5)',
              'rgba(255,255,255,0.9)',
              'white',
              'white',
              'rgba(255,255,255,0.9)',
              'rgba(255,255,255,0.5)',
              'transparent',
            ]}
            locations={[0, 0.03, 0.1, 0.2, 0.8, 0.9, 0.97, 1]}
            style={{ flex: 1 }}
          />
        }>
        <AnimatedFlashList
          data={items}
          keyExtractor={(_, index) => index.toString() + items.toString()}
          onScroll={onScroll}
          scrollEventThrottle={16}
          snapToInterval={effectiveItemHeight}
          snapToAlignment="center"
          decelerationRate={deceleration}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ paddingVertical: effectiveItemHeight * 2 }}
          drawDistance={effectiveItemHeight * 6}
          initialScrollIndex={initialIndex}
          onMomentumScrollEnd={handleScrollSettle}
          onScrollEndDrag={handleScrollSettle}
          renderItem={({ item, index }) => (
            <PickerItem
              item={item}
              index={index}
              activeIndex={activeIndex}
              itemHeight={effectiveItemHeight}
              fontSize={fontSize}
              textColor={textColor}
              font={font}
              fontWeight={fontWeight}
            />
          )}
        />
      </MaskedView>
    );
  }
);

const PickerItem = memo(
  ({ item, index, activeIndex, itemHeight, fontSize, textColor, font, fontWeight }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      const distance = Math.abs(index - activeIndex.value);

      if (distance >= 2) {
        return { opacity: 0.15 };
      }

      return {
        opacity: interpolate(distance, [0, 0.8, 1.5, 2], [1, 0.7, 0.3, 0.15], Extrapolation.CLAMP),
      };
    });

    return (
      <Animated.View style={[styles.itemContainer, { height: itemHeight }, animatedStyle]}>
        <Text
          allowFontScaling={false}
          style={{
            color: textColor,
            fontSize,
            fontFamily: font,
            fontWeight,
            lineHeight: itemHeight,
            textAlign: 'center',
          }}>
          {item}
        </Text>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  } as ViewStyle,
});
