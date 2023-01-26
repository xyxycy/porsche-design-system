import type { JssStyle } from 'jss';
import {
  headingSmallStyle,
  getMediaQueryMin,
  textSmallStyle,
  borderRadiusSmall,
  fontLineHeight,
  fontFamily,
  fontSizeTextSmall,
} from '@porsche-design-system/utilities-v2';
import type { Theme } from '../../types';
import type { InlineNotificationState } from './inline-notification-utils';
import { getCss } from '../../utils';
import { addImportantToEachRule, pxToRemWithUnit, getThemedColors } from '../../styles';
import { getThemedIconFilters } from '../../styles/icon-filters';

const mediaQueryS = getMediaQueryMin('s');

export const getComponentCss = (
  state: InlineNotificationState,
  hasAction: boolean,
  hasClose: boolean,
  theme: Theme
): string => {
  const textColor = getThemedColors(theme).primaryColor;
  return getCss({
    '@global': {
      ':host': addImportantToEachRule(getNotificationRootJssStyle(state, theme)),
      h5: headingSmallStyle,
      p: textSmallStyle,
      'h5,p': {
        margin: 0,
        color: textColor,
      },
    },
    icon: getNotificationIconJssStyle(state, theme),
    content: getNotificationContentJssStyle(),
    ...(hasAction && {
      action: {
        gridColumnStart: 1,
        gridRowStart: 2,
        [mediaQueryS]: {
          gridColumnStart: 3,
          gridRowStart: 1,
          marginLeft: pxToRemWithUnit(16),
        },
      },
    }),
    ...(hasClose && { close: getCloseIconJssStyle() }),
  });
};

export const getNotificationRootJssStyle = (state: InlineNotificationState, theme: Theme): JssStyle => {
  const themedColors = getThemedColors(theme);
  return {
    display: 'grid',
    gridTemplateColumns: '1fr auto', // 2 columns for content and close button
    gridTemplateRows: 'auto',
    gridRowGap: pxToRemWithUnit(16),
    alignItems: 'start',
    justifyItems: 'start',
    padding: pxToRemWithUnit(16),
    background: themedColors[`${state}SoftColor`],
    borderRadius: borderRadiusSmall,
    [mediaQueryS]: {
      // 4 columns are for icon, content, action button and close button
      gridTemplateColumns: '2rem 1fr auto auto',
    },
  };
};

export const getNotificationIconJssStyle = (state: InlineNotificationState, theme: Theme): JssStyle => ({
  display: 'none',
  fontFamily: fontFamily,
  fontSize: fontSizeTextSmall,
  width: fontLineHeight,
  height: fontLineHeight,
  [mediaQueryS]: {
    display: 'inline-flex',
    color: 'black', // color needs to be set to ensure filter is applied correctly
    filter: getThemedIconFilters(theme)[state],
  },
});

export const getNotificationContentJssStyle = (): JssStyle => ({
  display: 'grid',
  gridGap: pxToRemWithUnit(4),
  maxWidth: pxToRemWithUnit(800),
});

export const getCloseIconJssStyle = (): JssStyle => ({
  marginLeft: pxToRemWithUnit(16),
});
