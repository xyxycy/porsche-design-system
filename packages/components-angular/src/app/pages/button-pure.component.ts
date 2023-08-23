/* Auto Generated File */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-button-pure',
  template: `
    <div class="playground light auto-layout" title="should render button with label">
      <p-button-pure>Label default</p-button-pure>
      <p-button-pure [disabled]="true">Label disabled</p-button-pure>
      <p-button-pure [loading]="true">Label loading</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render button without label">
      <p-button-pure [hideLabel]="true">Some label</p-button-pure>
      <p-button-pure [hideLabel]="true" [disabled]="true">Some label</p-button-pure>
      <p-button-pure [hideLabel]="true" [loading]="true">Some label</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render button with responsive label">
      <p-button-pure [hideLabel]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }">
        Label responsive
      </p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render button without icon">
      <p-button-pure [icon]="'none'">Label default</p-button-pure>
      <p-button-pure [icon]="'none'" [disabled]="true">Label disabled</p-button-pure>
      <p-button-pure [icon]="'none'" [loading]="true">Label loading</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should not render button with different weight">
      <p-button-pure [weight]="'regular'">Label weight regular</p-button-pure>
      <p-button-pure [weight]="'semi-bold'">Label weight semi-bold</p-button-pure>
      <p-button-pure [weight]="'bold'">Label weight bold</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render with active state">
      <p-button-pure [active]="true">Label active</p-button-pure>
      <p-button-pure [active]="true" [disabled]="true">Label active disabled</p-button-pure>
      <p-button-pure [active]="true" [loading]="true">Label active loading</p-button-pure>
      <p-button-pure [active]="true" [icon]="'none'">Label active</p-button-pure>
      <p-button-pure [active]="true" [icon]="'none'" [disabled]="true">Label active disabled</p-button-pure>
      <p-button-pure [active]="true" [icon]="'none'" [loading]="true">Label active loading</p-button-pure>
      <p-button-pure [active]="true" [hideLabel]="true">Label active</p-button-pure>
      <p-button-pure [active]="true" [hideLabel]="true" [disabled]="true">Label active disabled</p-button-pure>
      <p-button-pure [active]="true" [hideLabel]="true" [loading]="true">Label active loading</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render button with specific icon">
      <p-button-pure [icon]="'delete'">Label with specific icon</p-button-pure>
      <p-button-pure [iconSource]="'./assets/icon-custom-kaixin.svg'">Label with local icon-source</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render button with multiline label">
      <p-button-pure style="width: 15rem">Label multiline lorem ipsum dolor sit amet, consetetur sadipscing</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render button-pure with custom clickable area">
      <p-button-pure style="padding: 1rem">Label with custom click-area</p-button-pure>
      <p-button-pure [hideLabel]="true" style="padding: 1rem">Label with custom click-area</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render with no icon">
      <p-button-pure [icon]="'none'">Label icon none</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render icon if hide-label and icon none is set">
      <p-button-pure [hideLabel]="true" [icon]="'none'">Label hide-label icon none</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should align label to the left">
      <p-button-pure [alignLabel]="'left'">Label align left</p-button-pure>
    </div>
    <div class="playground light auto-layout" title="should align label to the left or right depending on viewport">
      <p-button-pure [alignLabel]="{ base: 'left', xs: 'right', s: 'left', m: 'right', l: 'left', xl: 'right' }">
        Label align responsive
      </p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render with stretched label">
      <p-button-pure [stretch]="true">Label stretch</p-button-pure>
      <p-button-pure [stretch]="true" [alignLabel]="'left'">Label stretch align left</p-button-pure>
    </div>
    <div class="playground light auto-layout" title="should render with stretched label depending on viewport">
      <p-button-pure [stretch]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }">
        Label stretch responsive
      </p-button-pure>
    </div>

    <div class="playground light" title="should render button with different size">
      <p-button-pure [size]="'xx-small'">Label size xx-small</p-button-pure>
      <br />
      <p-button-pure [size]="'x-small'">Label size x-small</p-button-pure>
      <br />
      <p-button-pure [size]="'small'">Label size small</p-button-pure>
      <br />
      <p-button-pure [size]="'medium'">Label size medium</p-button-pure>
      <br />
      <p-button-pure [size]="'large'">Label size large</p-button-pure>
      <br />
      <p-button-pure [size]="'x-large'">Label size x-large</p-button-pure>
      <br />
      <p-button-pure [size]="'inherit'" style="font-size: 48px">Label size inherit</p-button-pure>
    </div>

    <div class="playground light auto-layout" title="should render button with responsive size">
      <p-button-pure
        [size]="{ base: 'x-small', xs: 'small', s: 'medium', m: 'large', l: 'x-large', xl: 'inherit' }"
        style="font-size: 48px"
      >
        Label size responsive
      </p-button-pure>
    </div>

    <div class="playground light" title="should render with no icon and size inherit">
      <p-button-pure [icon]="'none'" [size]="'inherit'" style="font-size: 48px">Label icon none size inherit</p-button-pure>
      <br />
      <p-button-pure
        [icon]="'none'"
        [size]="{ base: 'x-small', xs: 'small', s: 'medium', m: 'large', l: 'x-large', xl: 'inherit' }"
        style="font-size: 48px"
        >Label icon none size responsive
      </p-button-pure>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPureComponent {}
