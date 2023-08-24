/* Auto Generated File */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { componentsReady } from '@porsche-design-system/components-angular';

@Component({
  selector: 'page-select-wrapper',
  template: `
    <div
      class="playground light"
      title="should render in focus state and be open"
      style="padding-bottom: calc(1rem + 422px)"
    >
      <p-select-wrapper [label]="'Some label'">
        <select>
          <option [value]="'a'">
            Multiline options could be quite long, especially on smaller screens. Let's check if the height of the option is
            displaying correctly. Also, the selected icon checkmark should show up on the right of the text, aligned to the
            top.
          </option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
          <option [value]="'d'">Option D</option>
          <option [value]="'e'">Option E</option>
          <option [value]="'f'">Option F</option>
          <option [value]="'g'">Option G</option>
          <option [value]="'h'">Option H</option>
          <option [value]="'i'">Option I</option>
          <option [value]="'j'">Option J</option>
          <option [value]="'k'">Option K</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render native dropdown with label">
      <p-select-wrapper [label]="'Native'" [native]="true">
        <select>
          <option></option>
          <option [value]="'a'" selected>Option A</option>
          <option [value]="'b'" disabled>Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with label">
      <p-select-wrapper [label]="'Some label'">
        <select>
          <option></option>
          <option [value]="'a'" selected>Option A</option>
          <option [value]="'b'" disabled>Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with label and description">
      <p-select-wrapper [label]="'Some label'" [description]="'Some description'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render without label and without description">
      <p-select-wrapper [label]="'Some label'" [description]="'Some description'" [hideLabel]="true">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with responsive label and description">
      <p-select-wrapper
        [label]="'Some label'"
        [description]="'Some description'"
        [hideLabel]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }"
      >
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with filter">
      <p-select-wrapper [label]="'Some label with filter'" [filter]="true">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render in disabled state with filter">
      <p-select-wrapper [label]="'Some label disabled with filter'" [filter]="true">
        <select disabled>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render in required state">
      <p-select-wrapper [label]="'Some label'">
        <select required>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
      <p-select-wrapper [label]="'This is a very insanely super long label across multiple lines'">
        <select required>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render in disabled state">
      <p-select-wrapper [label]="'Some label disabled'" [description]="'Some description'">
        <select disabled>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with error state and error message">
      <p-select-wrapper [label]="'Some label'" [state]="'error'" [message]="'Some error message.'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with error state and error message with filter">
      <p-select-wrapper [label]="'Some label with filter'" [filter]="true" [state]="'error'" [message]="'Some error message.'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with error state and no error message">
      <p-select-wrapper [label]="'Some label'" [state]="'error'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with success state and success message">
      <p-select-wrapper [label]="'Some label'" [state]="'success'" [message]="'Some success message.'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with success state and success message with filter">
      <p-select-wrapper [label]="'Some label with filter'" [filter]="true" [state]="'success'" [message]="'Some success message.'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with success state and no success message">
      <p-select-wrapper [label]="'Some label'" [state]="'success'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render with default state and no message">
      <p-select-wrapper [label]="'Some label'" [state]="'none'" [message]="'Some message which should not be rendered.'">
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
      </p-select-wrapper>
    </div>

    <div class="playground light" title="should render label, description and message by slotted content with error state">
      <p-select-wrapper [state]="'error'">
        <span slot="label">
          <span>
            Slotted label. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>, <strong>strong</strong>,
            <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
        <span slot="description">
          <span>
            Slotted description. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
        <span slot="message">
          <span>
            Slotted error message. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
      </p-select-wrapper>
    </div>

    <div
      class="playground light"
      title="should render label, description and message by slotted content with success state"
    >
      <p-select-wrapper [state]="'success'">
        <span slot="label">
          <span>
            Slotted label. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>, <strong>strong</strong>,
            <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
        <span slot="description">
          <span>
            Slotted description. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
        <select>
          <option [value]="'a'">Option A</option>
          <option [value]="'b'">Option B</option>
          <option [value]="'c'">Option C</option>
        </select>
        <span slot="message">
          <span>
            Slotted success message. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
      </p-select-wrapper>
    </div>

    <div
      class="playground light"
      title="should render with multiline label, description and message and cut off too long option text"
    >
      <p-select-wrapper
        [label]="'Lorem ipsum dolor sit amet, consetetur sadipscing'"
        [description]="'Lorem ipsum dolor sit amet, consetetur sadipscing lorem ipsum dolor sit amet'"
        [state]="'error'"
        [message]="'At vero eos et accusam et justo duo dolores et ea rebum.'"
        style="max-width: 15rem"
      >
        <select>
          <option [value]="'a'">Lorem ipsum dolor sit amet, consetetur sadipscing elitr,</option>
          <option [value]="'b'">sed diam nonumy eirmod tempor invidunt ut labore</option>
          <option [value]="'c'">et dolore magna aliquyam erat, sed diam voluptua</option>
        </select>
      </p-select-wrapper>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWrapperComponent implements OnInit {
  public allReady: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    componentsReady().then(() => {
      this.allReady = true;
      this.cdr.markForCheck();
    });
  }
}
