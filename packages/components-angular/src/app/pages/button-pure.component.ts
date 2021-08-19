import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-button-pure',
  styles: [
    `
      p-button-pure:not(:last-child) {
        margin-right: 0.5rem;
      }
    `,
  ],
  template: `
    <div class="playground light" title="should render button with label">
      <p-button-pure>Some label</p-button-pure>
      <p-button-pure [disabled]="true">Some label</p-button-pure>
      <p-button-pure [loading]="true">Some label</p-button-pure>
    </div>
    <div class="playground dark" title="should render button with label on dark theme">
      <p-button-pure [theme]="'dark'">Some label</p-button-pure>
      <p-button-pure [disabled]="true" [theme]="'dark'">Some label</p-button-pure>
      <p-button-pure [loading]="true" [theme]="'dark'">Some label</p-button-pure>
    </div>

    <div class="playground light" title="should render button without label">
      <p-button-pure [hideLabel]="true">Some label</p-button-pure>
      <p-button-pure [hideLabel]="true" [disabled]="true">Some label</p-button-pure>
      <p-button-pure [hideLabel]="true" [loading]="true">Some label</p-button-pure>
    </div>
    <div class="playground dark" title="should render button without label on dark theme">
      <p-button-pure [hideLabel]="true" [theme]="'dark'">Some label</p-button-pure>
      <p-button-pure [hideLabel]="true" [disabled]="true" [theme]="'dark'">Some label</p-button-pure>
      <p-button-pure [hideLabel]="true" [loading]="true" [theme]="'dark'">Some label</p-button-pure>
    </div>

    <div class="playground light" title="should render button with responsive label">
      <p-button-pure [hideLabel]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }"
        >Some label
      </p-button-pure>
      <p-button-pure [hideLabel]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }"
        >Some label
        <p slot="subline">Some subline</p>
      </p-button-pure>
    </div>

    <div class="playground light" title="should render button with different size">
      <p-button-pure [size]="'x-small'">Some label</p-button-pure>
      <br />
      <p-button-pure [size]="'small'">Some label</p-button-pure>
      <br />
      <p-button-pure [size]="'medium'">Some label</p-button-pure>
      <br />
      <p-button-pure [size]="'large'">Some label</p-button-pure>
      <br />
      <p-button-pure [size]="'x-large'">Some label</p-button-pure>
      <br />
      <p-button-pure [size]="'inherit'" style="font-size: 48px;">Some label</p-button-pure>
    </div>

    <div class="playground light" title="should render button with responsive size">
      <p-button-pure
        [size]="{ base: 'x-small', xs: 'small', s: 'medium', m: 'large', l: 'x-large', xl: 'inherit' }"
        style="font-size: 48px;"
        >Some label
      </p-button-pure>
    </div>

    <div class="playground light" title="should render button with different weight">
      <p-button-pure [weight]="'thin'">Some label</p-button-pure>
      <p-button-pure [weight]="'regular'">Some label</p-button-pure>
      <p-button-pure [weight]="'semibold'">Some label</p-button-pure>
      <p-button-pure [weight]="'bold'">Some label</p-button-pure>
    </div>

    <div class="playground light" title="should render button with specific icon">
      <p-button-pure [icon]="'delete'">Some label</p-button-pure>
      <p-button-pure [iconSource]="'assets/icon-custom-kaixin.svg'">Some label</p-button-pure>
    </div>

    <div class="playground light" title="should render button with multiline label">
      <p-button-pure style="width: 240px;">Lorem ipsum dolor sit amet, consetetur sadipscing</p-button-pure>
    </div>

    <div class="playground light" title="should render button-pure with custom clickable area">
      <p-button-pure style="padding: 1rem;">Some label</p-button-pure>
      <p-button-pure [hideLabel]="true" style="padding: 1rem;">Some label</p-button-pure>
    </div>

    <div class="playground light" title="should render with subline">
      <p-button-pure [size]="'small'"
        >Some label
        <p slot="subline">Some subline</p></p-button-pure
      >
      <p-button-pure [size]="'medium'"
        >Some label
        <p slot="subline">Some subline</p></p-button-pure
      >
      <p-button-pure [size]="'large'"
        >Some label
        <p slot="subline">Some subline</p></p-button-pure
      >
      <p-button-pure [size]="'x-large'"
        >Some label
        <p slot="subline">Some subline</p></p-button-pure
      >
      <p-button-pure [size]="'medium'" [disabled]="true"
        >Some label
        <p slot="subline">Some subline</p></p-button-pure
      >
    </div>

    <div class="playground light" title="should render with no icon">
      <p-button-pure [icon]="'none'">Without icon</p-button-pure>
      <p-button-pure [size]="'small'" [icon]="'none'"
        >Without icon
        <p slot="subline">Some subline</p></p-button-pure
      >
    </div>

    <div class="playground light" title="should render icon if hide-label and icon none is set">
      <p-button-pure [hideLabel]="true" [icon]="'none'">With hideLabel and no icon</p-button-pure>
      <p-button-pure [hideLabel]="true" [size]="'small'" [icon]="'none'"
        >With hideLabel and no icon
        <p slot="subline">Some subline</p></p-button-pure
      >
    </div>

    <div class="playground light" title="should align label to the left">
      <p-button-pure [alignLabel]="'left'">Align-label left</p-button-pure>
    </div>
    <div class="playground light" title="should align label to the left or right depending on viewport">
      <p-button-pure
        href="https://www.porsche.com"
        [alignLabel]="{ base: 'left', xs: 'right', s: 'left', m: 'right', l: 'left', xl: 'right' }"
      >
        With breakpoint customizable align-label
      </p-button-pure>
    </div>

    <div class="playground light" title="should render with stretched label">
      <p-button-pure [stretch]="true">Stretched icon left</p-button-pure>
      <p-button-pure [stretch]="true" [alignLabel]="'left'">Stretched icon right</p-button-pure>
    </div>
    <div class="playground light" title="should render with stretched label depending on viewport">
      <p-button-pure
        href="https://www.porsche.com"
        [stretch]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }"
        >Stretched depending on viewport</p-button-pure
      >
    </div>

    <div class="playground light" title="should not align label left or stretch if it has a subline">
      <p-button-pure [alignLabel]="'left'">
        With align-label and subline
        <p slot="subline">Some subline</p>
      </p-button-pure>
      <p-button-pure [stretch]="true">
        With stretch and subline
        <p slot="subline">Some subline</p>
      </p-button-pure>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPureComponent {}
