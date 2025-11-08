import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const heightPercentageToDP = (heightPercent) => {
  const percent =
    typeof heightPercent === 'string'
      ? parseFloat(heightPercent)
      : heightPercent;
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * percent) / 100);
};

export const widthPercentageToDP = (widthPercent) => {
  const percent =
    typeof widthPercent === 'string' ? parseFloat(widthPercent) : widthPercent;
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * percent) / 100);
};

export const responsiveFontSize = (fontSize) => {
  const scaleFactor = SCREEN_WIDTH / 375;
  return PixelRatio.roundToNearestPixel(fontSize * scaleFactor);
};

export const screenWidth = () => SCREEN_WIDTH;
export const screenHeight = () => SCREEN_HEIGHT;
