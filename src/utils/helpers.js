import {Dimensions, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const heightPercentageToDP = heightPercent => {
  const percent =
    typeof heightPercent === 'string'
      ? parseFloat(heightPercent)
      : heightPercent;
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * percent) / 100);
};

export const widthPercentageToDP = widthPercent => {
  const percent =
    typeof widthPercent === 'string' ? parseFloat(widthPercent) : widthPercent;
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * percent) / 100);
};

export const responsiveFontSize = fontSize => {
  const scaleFactor = SCREEN_WIDTH / 375;
  return PixelRatio.roundToNearestPixel(fontSize * scaleFactor);
};

export const screenWidth = () => SCREEN_WIDTH;
export const screenHeight = () => SCREEN_HEIGHT;

export const formatDate = date => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
