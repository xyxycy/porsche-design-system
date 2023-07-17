import { Component, Element, forceUpdate, h, Host, type JSX, Listen, Prop, State } from '@stencil/core';
import { MultiSelectOptionUpdateEvent } from '../multi-select-option/multi-select-option-utils';
import {
  createNativeSelect,
  nativeSelect,
  updateMultiSelectOptions,
  updateNativeOption,
  updateNativeSelectOptions,
} from './multi-select-utils';
import {
  AllowedTypes,
  attachComponentCss,
  getDirectChildHTMLElements,
  getPrefixedTagNames,
  hasLabel,
  observeAttributes,
  THEMES,
  validateProps,
  isClickOutside,
} from '../../../utils';
import type { BreakpointCustomizable, PropTypes, Theme } from '../../../types';
import { Required } from '../../common/required/required';
import { getComponentCss } from './multi-select-styles';

const propTypes: PropTypes<typeof MultiSelect> = {
  label: AllowedTypes.string,
  name: AllowedTypes.string,
  hideLabel: AllowedTypes.breakpoint('boolean'),
  disabled: AllowedTypes.boolean,
  required: AllowedTypes.boolean,
  theme: AllowedTypes.oneOf<Theme>(THEMES),
};

@Component({
  tag: 'p-multi-select',
  shadow: true,
})
export class MultiSelect {
  @Element() public host!: HTMLElement;

  /** The label text. */
  @Prop() public label?: string = '';

  /** This attribute is used to specify the name of the control. */
  @Prop() public name: string;

  /** Show or hide label. For better accessibility it is recommended to show the label. */
  @Prop() public hideLabel?: BreakpointCustomizable<boolean> = false;

  /** This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example <fieldset>; if there is no containing element with the disabled attribute set, then the control is enabled. */
  @Prop() public disabled? = false;

  /** A Boolean attribute indicating that an option with a non-empty string value must be selected. */
  @Prop() public required? = false;

  /** Adapts the select color depending on the theme. */
  @Prop() public theme?: Theme = 'light';

  @State() private selectedString = '';
  @State() private isOpen = false;

  private multiSelectOptions: HTMLPMultiSelectOptionElement[];

  @Listen('update')
  public updateOptionHandler(event: CustomEvent<MultiSelectOptionUpdateEvent>): void {
    const index = this.multiSelectOptions.findIndex((el) => el === event.detail.optionElement);
    const nativeOption = nativeSelect.children[index] as HTMLOptionElement;
    updateNativeOption(nativeOption, event.detail.optionElement);
    this.updateSelectedString();
  }

  public connectedCallback(): void {
    this.observeAttributes(); // on every reconnect
    createNativeSelect(this.host, this.name, this.disabled, this.required);
  }

  public componentWillLoad(): void {
    this.observeAttributes(); // on every reconnect
    // TODO: registered only once?
    document.addEventListener('mousedown', this.onClickOutside, true);
  }

  public componentDidLoad(): void {
    this.updateOptions();
  }

  public disconnectedCallback(): void {
    document.removeEventListener('mousedown', this.onClickOutside, true);
  }

  public render(): JSX.Element {
    validateProps(this, propTypes);
    attachComponentCss(this.host, getComponentCss, this.disabled, this.hideLabel, 'none', this.theme);

    const PrefixedTagNames = getPrefixedTagNames(this.host);

    return (
      <Host>
        <div class="root">
          <label class="label">
            {!this.hideLabel && hasLabel(this.host, this.label) && (
              <span class="label__text">
                {this.label || <slot name="label" />}
                {this.required && <Required />}
              </span>
            )}
          </label>
          <div class="input-container">
            <input
              placeholder={this.selectedString || null}
              autoComplete="off"
              onInput={this.onFilterChange}
              onClick={this.onInputClick}
            />
            <PrefixedTagNames.pIcon
              class="icon"
              name="arrow-head-down"
              theme={this.theme}
              color={this.disabled ? 'state-disabled' : 'primary'}
              aria-hidden="true"
              // ref={(el) => (this.iconElement = el)}
            />
          </div>
          <PrefixedTagNames.pMultiSelectDropdown
            isOpen={this.isOpen}
            onOpenChange={this.onDropdownOpenChange}
            theme={this.theme}
          >
            <slot onSlotchange={() => this.updateOptions()} />
          </PrefixedTagNames.pMultiSelectDropdown>
        </div>
      </Host>
    );
  }

  private updateOptions = (): void => {
    this.defineMultiSelectOptions();
    updateNativeSelectOptions(this.multiSelectOptions);
    this.updateSelectedString();
  };

  private defineMultiSelectOptions(): void {
    // TODO: Validation
    // TODO: Prefix
    this.multiSelectOptions = getDirectChildHTMLElements(this.host, 'p-multi-select-option');
  }

  private onFilterChange = (e: Event): void => {
    updateMultiSelectOptions((e.target as HTMLInputElement).value, this.multiSelectOptions);
  };

  private updateSelectedString = (): void => {
    this.selectedString = Array.from(nativeSelect.selectedOptions)
      .map((option) => option.textContent)
      .join(', ');
  };

  private onInputClick = (): void => {
    this.isOpen = true;
  };

  private onDropdownOpenChange = (isOpen: boolean): void => {
    this.isOpen = isOpen;
  };

  private observeAttributes(): void {
    observeAttributes(nativeSelect, ['disabled', 'required'], () => forceUpdate(this.host));
  }

  private onClickOutside = (e: MouseEvent): void => {
    if (this.isOpen && isClickOutside(e, this.host)) {
      this.isOpen = false;
    }
  };
}
