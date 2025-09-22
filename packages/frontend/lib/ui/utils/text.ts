import * as stylex from '@stylexjs/stylex';
import { fontFamily } from './fontFamily.stylex';

export const text = stylex.create({
  defaultRegular: {
    fontFamily: fontFamily.base,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '140%'
  },
  defaultMedium: {
    fontFamily: fontFamily.base,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '140%'
  },
  defaultSemibold: {
    fontFamily: fontFamily.base,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '140%'
  },
  defaultBold: {
    fontFamily: fontFamily.base,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '140%'
  },
  smallMedium: {
    fontFamily: fontFamily.base,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '140%'
  },
  smallSemibold: {
    fontFamily: fontFamily.base,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '140%'
  },
  subheaderMedium: {
    fontFamily: fontFamily.base,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '140%'
  },
  subheaderSemibold: {
    fontFamily: fontFamily.base,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '110%'
  },
  subheaderBold: {
    fontFamily: fontFamily.base,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '110%'
  },
  captionMedium: {
    fontFamily: fontFamily.base,
    fontSize: 10,
    fontWeight: 500,
    lineHeight: '140%'
  }
});
