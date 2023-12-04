import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { LinkTileProductUpdateEvent } from '@porsche-design-system/components-angular';

@Component({
  selector: 'page-link-tile-product-example',
  template: `
    <p-link-tile-product
      [heading]="'Some product name'"
      [price]="'911€'"
      [info]="'Some info'"
      [href]="'https://www.porsche.com'"
      [liked]="liked"
      (likeChange)="handleLikeChange($event)"
    >
      <p-tag slot="header" [color]="'background-base'">New</p-tag>
      <img src="/assets/image-grid.png" width="3000" height="2000" alt="Some alt text" />
    </p-link-tile-product>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkTileProductExampleComponent {
  liked = false;
  handleLikeChange(e: CustomEvent<LinkTileProductUpdateEvent>) {
    this.liked = !e.detail.liked;
  }
}
