import type { MultiSelectDropdownDirection, MultiSelectState } from './multi-select-utils';
import {
  getDropdownDirection,
  getHighlightedOption,
  getHighlightedOptionIndex,
  getSelectedOptions,
  getSelectedOptionsString,
  getSelectedOptionValues,
  hasFilterOptionResults,
  initNativeSelect,
  MultiSelectOption,
  MultiSelectUpdateEvent,
  resetFilteredOptions,
  resetHighlightedOptions,
  resetSelectedOptions,
  setFirstOptionHighlighted,
  setLastOptionHighlighted,
  setSelectedOptions,
  syncMultiSelectOptionProps,
  syncNativeSelect,
  updateHighlightedOption,
  updateNativeOptions,
  updateOptionsFilterState,
} from './multi-select-utils';
import type { BreakpointCustomizable, PropTypes, Theme } from '../../../types';
import type { SelectDropdownDirectionInternal } from '../../../utils/select/select-dropdown';
import { SELECT_DROPDOWN_DIRECTIONS } from '../../../utils/select/select-dropdown';
import type { HTMLElementWithRequiredProp } from '../../../utils/form/isRequired';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  type JSX,
  Listen,
  Prop,
  State,
} from '@stencil/core';
import {
  AllowedTypes,
  attachComponentCss,
  FORM_STATES,
  getPrefixedTagNames,
  hasDescription,
  hasLabel,
  hasMessage,
  hasPropValueChanged,
  isClickOutside,
  isRequiredAndParentNotRequired,
  isWithinForm,
  THEMES,
  throwIfElementIsNotOfKind,
  validateProps,
} from '../../../utils';
import { Required } from '../../common/required/required';
import { getComponentCss } from './multi-select-styles';
import { StateMessage } from '../../common/state-message/state-message';
import { getFilterInputAriaAttributes, getListAriaAttributes } from '../../../utils/a11y/select/select-aria';

const propTypes: Omit<PropTypes<typeof MultiSelect>, 'value'> = {
  label: AllowedTypes.string,
  description: AllowedTypes.string,
  name: AllowedTypes.string,
  state: AllowedTypes.oneOf<MultiSelectState>(FORM_STATES),
  message: AllowedTypes.string,
  hideLabel: AllowedTypes.breakpoint('boolean'),
  disabled: AllowedTypes.boolean,
  required: AllowedTypes.boolean,
  dropdownDirection: AllowedTypes.oneOf<MultiSelectDropdownDirection>(SELECT_DROPDOWN_DIRECTIONS),
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

  /** The description text. */
  @Prop() public description?: string = '';

  /** This attribute is used to specify the name of the control. */
  @Prop() public name: string;

  /** The initial selected values. */
  @Prop() public value: (string | number)[] = [];

  /** The validation state. */
  @Prop() public state?: MultiSelectState = 'none';

  /** The message styled depending on validation state. */
  @Prop() public message?: string = '';

  /** Show or hide label. For better accessibility it is recommended to show the label. */
  @Prop() public hideLabel?: BreakpointCustomizable<boolean> = false;

  /** Disables the multi-select */
  @Prop() public disabled?: boolean = false;

  /** A Boolean attribute indicating that an option with a non-empty string value must be selected. */
  @Prop() public required?: boolean = false;

  /** Changes the direction to which the dropdown list appears. */
  @Prop() public dropdownDirection?: MultiSelectDropdownDirection = 'auto';

  /** Adapts the select color depending on the theme. */
  @Prop() public theme?: Theme = 'light';

  /** Emitted when sorting is changed. */
  @Event({ bubbles: false }) public update: EventEmitter<MultiSelectUpdateEvent>;

  @State() private isOpen = false;
  @State() private srHighlightedOptionText = '';
  @State() private hasFilterResults = true;

  private nativeSelect: HTMLSelectElement;
  private multiSelectOptions: MultiSelectOption[] = [];
  private inputContainer: HTMLDivElement;
  private inputElement: HTMLInputElement;
  private listElement: HTMLUListElement;
  private isWithinForm: boolean;

  private get currentValue(): (string | number)[] {
    return getSelectedOptionValues(this.multiSelectOptions);
  }

  @Listen('internalOptionUpdate')
  public updateOptionHandler(e: Event & { target: MultiSelectOption }): void {
    e.target.selected = !e.target.selected;
    forceUpdate(e.target);
    forceUpdate(this.host);
    e.stopPropagation();
    if (this.isWithinForm) {
      updateNativeOptions(this.nativeSelect, this.multiSelectOptions);
    }
    this.update.emit({
      value: this.currentValue,
      name: this.name,
    });
  }

  public connectedCallback(): void {
    document.addEventListener('mousedown', this.onClickOutside, true);
    this.isWithinForm = isWithinForm(this.host);
  }

  public componentWillLoad(): void {
    if (this.isWithinForm) {
      this.nativeSelect = initNativeSelect(this.host, this.name, this.disabled, this.required);
    }
    this.updateOptions();
  }

  public componentShouldUpdate(newVal: unknown, oldVal: unknown): boolean {
    return hasPropValueChanged(newVal, oldVal);
  }

  public componentWillUpdate(): void {
    if (this.isWithinForm) {
      syncNativeSelect(this.nativeSelect, this.name, this.disabled, this.required);
    }
  }

  public disconnectedCallback(): void {
    document.removeEventListener('mousedown', this.onClickOutside, true);
  }

  public render(): JSX.Element {
    validateProps(this, propTypes);
    attachComponentCss(
      this.host,
      getComponentCss,
      getSelectedOptions(this.multiSelectOptions).length > 0,
      getDropdownDirection(this.dropdownDirection, this.inputContainer, this.multiSelectOptions),
      this.isOpen,
      this.disabled,
      this.hideLabel,
      this.state,
      this.isWithinForm,
      this.theme
    );
    syncMultiSelectOptionProps(this.multiSelectOptions, this.theme);

    const PrefixedTagNames = getPrefixedTagNames(this.host);
    const dropdownId = 'list';

    return (
      <Host>
        <div class="root">
          <label class="label" id="label">
            {this.currentValue && (
              <span class="sr-text">{getSelectedOptions(this.multiSelectOptions).length} options selected</span>
            )}
            {!this.hideLabel && hasLabel(this.host, this.label) && (
              <span class="label__text" onClick={() => this.inputElement.focus()}>
                {this.label || <slot name="label" />}
                {isRequiredAndParentNotRequired(this.host, this.host as HTMLElementWithRequiredProp) && <Required />}
              </span>
            )}
            {/* TODO: Description should be separated from the label (affects all form components) */}
            {hasDescription(this.host, this.description) && (
              <span class="label__text" id="description" onClick={() => this.inputElement.focus()} aria-hidden="true">
                {this.description || <slot name="description" />}
              </span>
            )}
          </label>
          <div class={{ 'input-container': true, disabled: this.disabled }} ref={(el) => (this.inputContainer = el)}>
            <input
              role="combobox"
              placeholder={getSelectedOptionsString(this.multiSelectOptions) || null}
              autoComplete="off"
              disabled={this.disabled}
              required={this.required}
              onInput={this.onInputChange}
              onClick={this.onInputClick}
              onKeyDown={this.onInputKeyDown}
              ref={(el) => (this.inputElement = el)}
              {...getFilterInputAriaAttributes(this.isOpen, this.required, 'label', 'description', dropdownId)}
            />
            <PrefixedTagNames.pButtonPure
              class="icon reset-icon"
              icon="close"
              hideLabel="true"
              theme={this.theme}
              color={this.disabled ? 'state-disabled' : 'primary'}
              onClick={this.onResetClick}
            >
              Reset selection
            </PrefixedTagNames.pButtonPure>
            <PrefixedTagNames.pIcon
              class={{ icon: true, 'toggle-icon': true, 'toggle-icon--open': this.isOpen }}
              name="arrow-head-down"
              theme={this.theme}
              color={this.disabled ? 'state-disabled' : 'primary'}
              onClick={this.onIconClick}
              aria-hidden="true"
            />
          </div>
          <ul
            id={dropdownId}
            {...getListAriaAttributes(this.label, this.required, true, this.isOpen, true)}
            ref={(el) => (this.listElement = el)}
          >
            {!this.hasFilterResults && (
              <li class="no-results" aria-live="polite" role="status">
                <span aria-hidden="true">---</span>
                <span class="no-results__sr">No results found</span>
              </li>
            )}
            <slot onSlotchange={this.updateOptions} />
          </ul>
        </div>
        {this.isWithinForm && <slot name="select" />}
        {hasMessage(this.host, this.message, this.state) && (
          <StateMessage state={this.state} message={this.message} theme={this.theme} host={this.host} />
        )}
        <span class="sr-text" role="status" aria-live="assertive" aria-relevant="additions text">
          {this.srHighlightedOptionText}
        </span>
      </Host>
    );
  }

  private updateOptions = (): void => {
    this.multiSelectOptions = Array.from(this.host.children).filter(
      (el) => el.tagName !== 'SELECT'
    ) as HTMLPMultiSelectOptionElement[];
    this.multiSelectOptions.forEach((child) => throwIfElementIsNotOfKind(this.host, child, 'p-multi-select-option'));
    setSelectedOptions(this.multiSelectOptions, this.value);
    if (this.isWithinForm) {
      updateNativeOptions(this.nativeSelect, this.multiSelectOptions);
    }
  };

  private onInputChange = (e: Event): void => {
    if ((e.target as HTMLInputElement).value.startsWith(' ')) {
      this.resetFilter();
    } else {
      updateOptionsFilterState((e.target as HTMLInputElement).value, this.multiSelectOptions);
      this.hasFilterResults = hasFilterOptionResults(this.multiSelectOptions);
    }
    // in case input is focused via tab instead of click
    this.isOpen = true;
  };

  private onInputClick = (): void => {
    this.isOpen = true;
  };

  private onIconClick = (): void => {
    this.isOpen = !this.isOpen;
  };

  private onResetClick = (): void => {
    resetSelectedOptions(this.multiSelectOptions);
    this.inputElement.focus();
    forceUpdate(this.host);
  };

  private onClickOutside = (e: MouseEvent): void => {
    if (this.isOpen && isClickOutside(e, this.inputContainer) && isClickOutside(e, this.listElement)) {
      this.isOpen = false;
      this.resetFilter();
    }
  };

  private resetFilter = (): void => {
    this.inputElement.value = '';
    resetFilteredOptions(this.multiSelectOptions);
  };

  private onInputKeyDown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'ArrowUp':
      case 'Up':
        e.preventDefault();
        this.cycleDropdown('up');
        break;
      case 'ArrowDown':
      case 'Down':
        e.preventDefault();
        this.cycleDropdown('down');
        break;
      case 'Enter':
        const highlightedOption = getHighlightedOption(this.multiSelectOptions);
        if (highlightedOption) {
          highlightedOption.selected = !highlightedOption.selected;
          forceUpdate(highlightedOption);
        }
        this.updateSrHighlightedOptionText();
        break;
      case 'Escape':
      case 'Tab':
        // TODO: only close when on reset button
        this.isOpen = false;
        resetHighlightedOptions(this.multiSelectOptions);
        break;
      case 'PageUp':
        if (this.isOpen) {
          e.preventDefault();
          setFirstOptionHighlighted(this.listElement, this.multiSelectOptions);
        }
        break;
      case 'PageDown':
        if (this.isOpen) {
          e.preventDefault();
          setLastOptionHighlighted(this.listElement, this.multiSelectOptions);
        }
        break;
      default:
      // TODO: seems to be difficult to combine multiple keys as native select does
    }
  };

  private cycleDropdown(direction: SelectDropdownDirectionInternal): void {
    this.isOpen = true;
    updateHighlightedOption(this.listElement, this.multiSelectOptions, direction);
    this.updateSrHighlightedOptionText();
  }

  private updateSrHighlightedOptionText = (): void => {
    const highlightedOptionIndex = getHighlightedOptionIndex(this.multiSelectOptions);
    const highlightedOption = this.multiSelectOptions[highlightedOptionIndex];
    this.srHighlightedOptionText =
      highlightedOption &&
      `${highlightedOption.textContent}${highlightedOption.selected ? ', selected' : ' not selected'} (${
        highlightedOptionIndex + 1
      } of ${this.multiSelectOptions.length})`;
  };
}
