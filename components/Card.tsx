import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, runOnJS, withTiming, Easing } from "react-native-reanimated";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { Colors } from '../theme/Colors';
import * as Types from '../api/types';
import { SCREEN_WIDTH, snapPointAnimation, Viewport } from '../utils';
import { RoverPhoto } from './RoverPhoto';

export const CARD_WIDTH = SCREEN_WIDTH - 32;
export const CARD_HEIGHT = Viewport.height / (484 / 328);
const SNAP_POINT = [-SCREEN_WIDTH, 0, SCREEN_WIDTH];

interface CardProps {
  onSwipe: (direction: 'left' | 'right') => void;
  index: number;
  item: Types.RoverPhoto;
}

export const Card = React.memo<CardProps>((props) => {
  const { onSwipe, index, item } = props;

  const animatedIndex = useDerivedValue(() => {
    return withTiming(index, {
      duration: 200,
    });
  });

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      translateX.value = translationX + ctx.x;
      translateY.value = translationY + ctx.y;
    },
    onEnd: ({ velocityX, velocityY }) => {
      translateY.value = withSpring(0, {
        velocity: velocityY,
      });
      const dest = snapPointAnimation(translateX.value, velocityX, SNAP_POINT);
      translateX.value = withSpring(
        dest,
        {
          overshootClamping: dest === 0 ? false : true,
          restSpeedThreshold: dest === 0 ? 0.10 : 100,
          restDisplacementThreshold: dest === 0 ? 0.01 : 100,
        },
        () => {
          if (dest !== 0) {
            runOnJS(onSwipe)(dest > 0 ? 'right' : 'left')
          }
        }
      );
    },
  });



  const handlePressDislike = React.useCallback(() => {
    setIsActiveDislike(false);
    translateX.value = withTiming(
      -SCREEN_WIDTH,
      { duration: 300 },
      () => runOnJS(onSwipe)('left')
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => {
    const indentTop =  animatedIndex.value * (16 * 2.4);
    const scale = interpolate(
      animatedIndex.value,
      [0, 3],
      [0.81, 1.09],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY: translateY.value + indentTop },
        { translateX: translateX.value },
        { scale },
      ],
    };
  });

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents={index === 2 ? 'auto' : 'none'}
    >

      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.card, cardStyle]}>
          <RoverPhoto
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            item={item}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 1,
    top: -26,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    elevation: 8,
  },
});
