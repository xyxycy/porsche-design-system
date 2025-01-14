import sdk from '@stackblitz/sdk';
import { getBackgroundColor, transformSrcAndSrcsetOfImgAndSourceTags } from './helper';
import { getVanillaJsProjectAndOpenOptions } from './getVanillaJsProjectAndOpenOptions';
import { getAngularProjectAndOpenOptions } from './getAngularProjectAndOpenOptions';
import { getReactProjectAndOpenOptions } from './getReactProjectAndOpenOptions';
import type {
  StackBlitzFrameworkOpts,
  GetStackBlitzProjectAndOpenOptions,
  SharedImportKey,
  ExternalDependency,
} from '@/utils';
import type { PlaygroundTheme, BackgroundColor, Framework, PlaygroundDir } from '@/models';
import type { PorscheDesignSystemBundle } from '@/utils/stackblitz/types';

export type OpenInStackBlitzOpts = {
  porscheDesignSystemBundle: PorscheDesignSystemBundle;
  markup: string;
  dir: PlaygroundDir;
  framework: Exclude<Framework, 'shared' | 'vue'>; // we don't have stackblitz integration for vue yet, therefore excluding vue
  theme: PlaygroundTheme;
  backgroundColor: BackgroundColor;
  externalDependencies: ExternalDependency[];
  sharedImportKeys: SharedImportKey[];
  pdsVersion: string;
};

export const openInStackBlitz = (opts: OpenInStackBlitzOpts): void => {
  const { markup, framework, theme, backgroundColor, ...rest } = opts;

  const stackBlitzFrameworkOpts: StackBlitzFrameworkOpts = {
    ...rest,
    markup: transformSrcAndSrcsetOfImgAndSourceTags(markup),
    title: `Porsche Design System ${framework} sandbox`,
    description: 'Porsche Design System component example',
    globalStyles:
      theme === 'auto'
        ? `body { background: ${getBackgroundColor('light', backgroundColor)}; }
          @media (prefers-color-scheme: dark) {
            body { background: ${getBackgroundColor('dark', backgroundColor)}; }
          }`
        : `body { background: ${getBackgroundColor(theme, backgroundColor)}; }`,
  };

  const getProjectAndOpenOptionsMap: Record<
    Exclude<Framework, 'shared' | 'vue'>, // we don't have stackblitz integration for vue yet, therefore excluding vue
    GetStackBlitzProjectAndOpenOptions
  > = {
    'vanilla-js': getVanillaJsProjectAndOpenOptions,
    angular: getAngularProjectAndOpenOptions,
    react: getReactProjectAndOpenOptions,
  };

  const { openFile, ...project } = getProjectAndOpenOptionsMap[framework](stackBlitzFrameworkOpts);

  sdk.openProject(project, { openFile });
};
