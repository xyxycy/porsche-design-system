import { type Theme } from '../types';
import { type Styles } from 'jss';
import { isDisabledOrLoading, isHighContrastMode, supportsChromiumMediaQuery } from '../utils';
import {
  getHighContrastColors,
  getInsetJssStyle,
  getThemedColors,
  getTransition,
  hoverMediaQuery,
  prefersColorSchemeDarkMediaQuery,
} from '.';
import { borderWidthBase, fontFamily, fontLineHeight, fontSizeTextSmall } from '@porsche-design-system/utilities-v2';
import { type FormState } from '../utils/form/form-state';
import { getThemedFormStateColors } from './form-state-color-styles';

// TODO: move to form-styles.ts
export const getSlottedCheckboxRadioButtonStyles = (
  state: FormState,
  isDisabled: boolean,
  isLoading: boolean,
  theme: Theme
): Styles => {
  const { primaryColor, contrastMediumColor, contrastHighColor, disabledColor, focusColor } = getThemedColors(theme);
  const {
    primaryColor: primaryColorDark,
    contrastMediumColor: contrastMediumColorDark,
    contrastHighColor: contrastHighColorDark,
    disabledColor: disabledColorDark,
    focusColor: focusColorDark,
  } = getThemedColors('dark');
  const { formStateColor, formStateHoverColor } = getThemedFormStateColors(theme, state);
  const { formStateColor: formStateColorDark, formStateHoverColor: formStateHoverColorDark } = getThemedFormStateColors(
    'dark',
    state
  );
  const { canvasTextColor } = getHighContrastColors();
  const disabledOrLoading = isDisabledOrLoading(isDisabled, isLoading);

  // TODO: needs to be extracted into a color function
  const uncheckedColor = disabledOrLoading ? disabledColor : formStateColor || contrastMediumColor;
  const uncheckedColorDark = disabledOrLoading ? disabledColorDark : formStateColorDark || contrastMediumColorDark;
  const uncheckedHoverColor = formStateHoverColor || primaryColor;
  const uncheckedHoverColorDark = formStateHoverColorDark || primaryColorDark;
  const checkedColor = isHighContrastMode
    ? canvasTextColor
    : disabledOrLoading
      ? disabledColor
      : formStateColor || primaryColor;
  const checkedColorDark = isHighContrastMode
    ? canvasTextColor
    : disabledOrLoading
      ? disabledColorDark
      : formStateColorDark || primaryColorDark;
  const checkedHoverColor = formStateHoverColor || contrastHighColor;
  const checkedHoverColorDark = formStateHoverColorDark || contrastHighColorDark;

  return {
    '::slotted': {
      '&(input)': {
        position: 'relative', // TODO: can be removed as soon as focus style was adjusted
        width: fontLineHeight,
        height: fontLineHeight,
        font: `${fontSizeTextSmall} ${fontFamily}`, // needed for correct width and height definition based on ex-unit
        display: 'block',
        margin: 0,
        padding: 0,
        WebkitAppearance: 'none', // iOS safari
        appearance: 'none',
        boxSizing: 'content-box',
        background: `transparent 0% 0% / ${fontLineHeight}`,
        transition: `${getTransition('background-color')}, ${getTransition('border-color')}`,
        border: `2px solid ${uncheckedColor}`,
        outline: 0,
        ...(disabledOrLoading
          ? {
              pointerEvents: 'none', // to prevent form element becomes clickable/toggleable
            }
          : {
              cursor: 'pointer',
            }),
        ...prefersColorSchemeDarkMediaQuery(theme, {
          borderColor: uncheckedColorDark,
        }),
      },
      '&(input:checked)': {
        // background-image is merged in later
        borderColor: checkedColor,
        backgroundColor: checkedColor,
        ...prefersColorSchemeDarkMediaQuery(theme, {
          borderColor: checkedColorDark,
          backgroundColor: checkedColorDark,
        }),
      },
      ...(!disabledOrLoading &&
        !isHighContrastMode &&
        hoverMediaQuery({
          '&(input:hover),label:hover~.wrapper &(input)': {
            borderColor: uncheckedHoverColor,
            ...prefersColorSchemeDarkMediaQuery(theme, {
              borderColor: uncheckedHoverColorDark,
            }),
          },
          '&(input:checked:hover),label:hover~.wrapper &(input:checked)': {
            borderColor: checkedHoverColor,
            backgroundColor: checkedHoverColor,
            ...prefersColorSchemeDarkMediaQuery(theme, {
              borderColor: checkedHoverColorDark,
              backgroundColor: checkedHoverColorDark,
            }),
          },
          'label:hover~.wrapper &(input)': supportsChromiumMediaQuery({
            transition: 'unset', // Fixes chrome bug where transition properties are stuck on hover
          }),
        })),
      ...(!isDisabled && {
        // TODO: can be done with getFocusStyle() in the meantime
        '&(input:focus)::before': {
          content: '""',
          position: 'absolute',
          ...getInsetJssStyle(-6),
          border: `${borderWidthBase} solid ${focusColor}`,
          ...prefersColorSchemeDarkMediaQuery(theme, {
            borderColor: focusColorDark,
          }),
        },
        '&(input:focus:not(:focus-visible))::before': {
          borderColor: 'transparent',
        },
      }),
    },
  };
};
