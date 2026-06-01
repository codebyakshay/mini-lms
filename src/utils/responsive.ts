import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Design base dimensions (e.g. standard iPhone 14 size)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scales size horizontally based on device screen width.
 */
export const scaleWidth = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Scales size vertically based on device screen height.
 */
export const scaleHeight = (size: number): number => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Scales font sizes responsively using device screen width.
 */
export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const deviceDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
} as const;
