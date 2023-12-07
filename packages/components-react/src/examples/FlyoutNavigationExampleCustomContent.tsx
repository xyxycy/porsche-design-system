import { useCallback, useState } from 'react';
import {
  type FlyoutNavigationUpdateEvent,
  PButton,
  PFlyoutNavigation,
  PFlyoutNavigationItem,
  PLinkPure,
  PLinkTile,
} from '@porsche-design-system/components-react';

export const FlyoutNavigationExampleCustomContentPage = (): JSX.Element => {
  const [isFlyoutNavigationOpen, setIsFlyoutNavigationOpen] = useState<boolean>(false);
  const [flyoutNavigationActiveIdentifier, setFlyoutNavigationActiveIdentifier] = useState<string>('item-1');
  const onOpen = useCallback(() => {
    setIsFlyoutNavigationOpen(true);
  }, []);
  const onDismiss = useCallback(() => {
    setIsFlyoutNavigationOpen(false);
  }, []);
  const onUpdate = useCallback(
    (e: CustomEvent<FlyoutNavigationUpdateEvent>) => setFlyoutNavigationActiveIdentifier(e.detail.activeIdentifier),
    []
  );

  return (
    <>
      <PButton type="button" aria={{ 'aria-haspopup': 'dialog' }} onClick={onOpen}>
        Open Flyout Navigation
      </PButton>
      <PFlyoutNavigation
        open={isFlyoutNavigationOpen}
        activeIdentifier={flyoutNavigationActiveIdentifier}
        onDismiss={onDismiss}
        onUpdate={onUpdate}
      >
        <PFlyoutNavigationItem identifier="item-1" label="Some Label">
          <PLinkTile
            href="#"
            label="Some label"
            description="Some Description"
            weight="semi-bold"
            compact="true"
            aspectRatio="1:1"
          >
            <img
              srcSet="https://porsche-design-system.github.io/porsche-design-system/porsche-963@2x.webp 2x"
              src="https://porsche-design-system.github.io/porsche-design-system/porsche-963.webp"
              width="636"
              height="847"
              alt="Porsche 963"
            />
          </PLinkTile>
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor" aria-current="page">
            Some anchor
          </a>
          <a href="#some-anchor">Some anchor</a>
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
        </PFlyoutNavigationItem>
        <PFlyoutNavigationItem identifier="item-2" label="Some Label">
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
        </PFlyoutNavigationItem>
        <PFlyoutNavigationItem identifier="item-3" label="Some Label">
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
        </PFlyoutNavigationItem>
        <PFlyoutNavigationItem identifier="item-4" label="Some Label">
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
        </PFlyoutNavigationItem>
        <PFlyoutNavigationItem identifier="item-5" label="Some Label">
          <h3>Some heading</h3>
          <a href="#some-anchor">Some anchor</a>
          <a href="#some-anchor">Some anchor</a>
        </PFlyoutNavigationItem>
        <PLinkPure
          size="medium"
          href="#"
          icon="external"
          style={{ padding: 'clamp(8px, 0.5vw + 6px, 16px)', margin: '0 calc(clamp(8px, 0.5vw + 6px, 16px) * -1)' }}
        >
          Some external anchor
        </PLinkPure>
      </PFlyoutNavigation>
    </>
  );
};
