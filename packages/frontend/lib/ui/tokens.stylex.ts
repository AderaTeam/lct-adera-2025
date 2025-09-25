import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  // Text&Icon colors

  textPrimaryDefault: '#EBEDF2', // black-2
  textPrimaryHover: '#F5F6FA', // black-1
  textPrimaryActive: '#DADEE8', // black-4
  textPrimaryWhite: '#FFFFFF', // white

  textSecondaryDefault: '#B6BDCF', // black-10
  textSecondaryHover: '#CACFDB', // black-5
  textSecondaryActive: '#A3ADC7', // black-20

  textTertiaryDefault: '#737D99', // black-40
  textTertiaryHover: '#737D99', // black-40

  textErrorDefault: '#EA604A', // error-default
  textErrorActive: '#FF806C', // error-active

  textBlueDefault: '#4367DE', // blue-80
  textBlueHover: '#4A6FEA', // blue-70
  textBlueActive: '#3657C3', // blue-90

  // Outline colors

  outlinePrimaryDefault: '#2E364D', // black-80
  outlinePrimaryHover: '#3F4861', // black-70
  outlinePrimaryActive: '#262D40', // black-90

  outlineErrorDefault: '#EA604A', // error-default
  outlineErrorHover: '#FF806C', // error-active
  outlineErrorActive: '#EB4025', // error-active-dark

  // States colors

  statusError: '#EA604A',
  statusNeutral: '#F2D849',
  statusSuccess: '#39BF73',

  // Button colors

  buttonPrimaryDefault: '#1E52FF', // blue-90
  buttonPrimaryHover: '#4772FF', // blue-80
  buttonPrimaryActive: '#023DFF', // blue-100

  buttonSecondaryDefault: '#262D40', // black-90
  buttonSecondaryHover: '#2E364D', // black-80
  buttonSecondaryActive: '#1D1D29', // black-100-darker

  buttonTertiaryDefault: '#C8D5FF', // blue-20
  buttonTertiaryHover: '#DAE3FF', // blue-10
  buttonTertiaryActive: '#DAE3FF', // blue-10

  // Background colors

  backgroundPrimary: '#12121E',
  backgroundSecondary: '#1D1D29',

  // Basic colors

  black100: '#202435',
  black90: '#262D40',
  black80: '#2E364D',
  black70: '#3F4861',
  black60: '#4B5570',
  black50: '#65708C',
  black40: '#737D99',
  black30: '#8994B0',
  black20: '#A3ADC7',
  black10: '#B6BDCF',
  black5: '#CACFDB',
  black4: '#DADEE8',
  black3: '#E4E6ED',
  black2: '#EBEDF2',
  black1: '#F5F6FA',

  blue100: '#023DFF',
  blue90: '#1E52FF',
  blue80: '#4772FF',
  blue70: '#5A80FF',
  blue60: '#6C8EFF',
  blue50: '#7F9DFF',
  blue40: '#91ABFF',
  blue30: '#B5C6FF',
  blue20: '#C8D5FF',
  blue10: '#DAE3FF',
  blue5: '#F1F4FF',
  blue1: '#F8FAFF'
});
