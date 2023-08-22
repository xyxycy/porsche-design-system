import { Component, Element, Event, type EventEmitter, h, Host, type JSX, Prop } from '@stencil/core';
import type { BreakpointCustomizable, PropTypes, Theme, ValidatorFunction } from '../../types';
import type { PinCodeState, PinCodeType, PinCodeUpdateEvent } from './pin-code-utils';
import {
  AllowedTypes,
  attachComponentCss,
  FORM_STATES,
  hasDescription,
  hasLabel,
  hasMessage,
  hasPropValueChanged,
  isWithinForm,
  THEMES,
  validateProps,
} from '../../utils';
import { getComponentCss } from './pin-code-styles';
import {
  initHiddenInput,
  inputIsSingleDigit,
  joinInputValues,
  PIN_CODE_TYPES,
  syncHiddenInput,
} from './pin-code-utils';
import { StateMessage } from '../common/state-message/state-message';
import { Required } from '../common/required/required';

const propTypes: PropTypes<typeof PinCode> = {
  label: AllowedTypes.string,
  description: AllowedTypes.string,
  name: AllowedTypes.string,
  length: AllowedTypes.number,
  hideLabel: AllowedTypes.breakpoint('boolean'),
  state: AllowedTypes.oneOf<PinCodeState>(FORM_STATES),
  disabled: AllowedTypes.boolean,
  required: AllowedTypes.boolean,
  message: AllowedTypes.string,
  type: AllowedTypes.oneOf<PinCodeType>(PIN_CODE_TYPES),
  value: AllowedTypes.oneOf<ValidatorFunction>([AllowedTypes.string, AllowedTypes.number]),
  theme: AllowedTypes.oneOf<Theme>(THEMES),
};

@Component({
  tag: 'p-pin-code',
  shadow: { delegatesFocus: true },
})
export class PinCode {
  @Element() public host!: HTMLElement;

  /** The label text. */
  @Prop() public label?: string = '';

  /** The description text. */
  @Prop() public description?: string = '';

  /** Name of the control. */
  @Prop() public name: string;

  /** Number of characters of the Pin Code. */
  @Prop() public length?: number = 4;

  /** Show or hide label and description text. For better accessibility it is recommended to show the label. */
  @Prop() public hideLabel?: BreakpointCustomizable<boolean> = false;

  /** The validation state. */
  @Prop() public state?: PinCodeState = 'none';

  /** Disables the Pin Code. No events will be triggered while disabled state is active. */
  @Prop() public disabled?: boolean = false;

  /** Marks the Pin Code as required. */
  @Prop() public required?: boolean = false;

  /** The message styled depending on validation state. */
  @Prop() public message?: string = '';

  /** Pin Code type. */
  @Prop() public type?: PinCodeType = 'number';

  /** Sets the initial value of the Pin Code. */
  @Prop() public value?: string = '';

  /** Adapts the color depending on the theme. */
  @Prop() public theme?: Theme = 'light';

  /** Emitted when selected element changes. */
  @Event({ bubbles: false }) public update: EventEmitter<PinCodeUpdateEvent>;

  private isWithinForm: boolean;
  private hiddenInput: HTMLInputElement;
  private pinCodeElements: HTMLInputElement[] = [];
  // TODO: private ariaElement: HTMLSpanElement;

  public connectedCallback(): void {
    this.isWithinForm = isWithinForm(this.host);
  }

  public componentWillLoad(): void {
    // make sure initial value is not longer than pin code length
    if (this.value) {
      this.value = this.value.toString().slice(0, this.length);
    }
    if (this.isWithinForm) {
      this.hiddenInput = initHiddenInput(this.host, this.name, this.value, this.disabled, this.required);
    }
  }

  public componentShouldUpdate(newVal: unknown, oldVal: unknown): boolean {
    return hasPropValueChanged(newVal, oldVal);
  }

  public render(): JSX.Element {
    validateProps(this, propTypes);
    attachComponentCss(this.host, getComponentCss, this.hideLabel, this.state, this.disabled, this.theme);

    // reset array of input elements
    this.pinCodeElements = [];
    if (this.isWithinForm) {
      syncHiddenInput(this.hiddenInput, this.name, this.value, this.disabled, this.required);
    }

    return (
      <Host>
        <label class="label">
          {hasLabel(this.host, this.label) && (
            <span class="label__text">
              {this.label || <slot name="label" />}
              {this.required && <Required />}
            </span>
          )}
          {hasDescription(this.host, this.description) && (
            <span class="label__text">{this.description || <slot name="description" />}</span>
          )}
          <div class="pin-code-container" onKeyDown={this.onKeyDown} onPaste={this.onPaste} onClick={this.onClick}>
            {this.isWithinForm && <slot name="hidden-input" />}
            {...Array.from({ length: this.length }).map((_value, index) => (
              <input
                type={this.type === 'number' ? 'text' : this.type}
                // aria-label={}
                // aria-labelledby={}
                // aria-describedby={}
                autoComplete="one-time-code"
                pattern="\d*"
                inputMode="numeric" // get numeric keyboard on mobile
                maxLength={1}
                value={this.value[index]}
                disabled={this.disabled}
                required={this.required}
                ref={(el) => this.pinCodeElements.push(el)}
              />
            ))}
          </div>
        </label>
        {hasMessage(this.host, this.message, this.state) && (
          <StateMessage state={this.state} message={this.message} theme="light" host={this.host} />
        )}
      </Host>
    );
  }

  private onClick = (
    e: MouseEvent & { target: HTMLInputElement & { previousElementSibling: HTMLInputElement } }
  ): void => {
    // only allow focus on filled inputs or the first empty input
    if (!e.target.value && e.target.previousElementSibling && !e.target.previousElementSibling.value) {
      this.pinCodeElements.find((pinCodeElement) => !pinCodeElement.value).focus();
    }
  };

  private onKeyDown = (
    e: KeyboardEvent & {
      target: HTMLInputElement & { previousElementSibling: HTMLInputElement; nextElementSibling: HTMLInputElement };
    }
  ): void => {
    const {
      key,
      target,
      target: {previousElementSibling, nextElementSibling},
    } = e;

    // if input is valid overwrite old value
    if (inputIsSingleDigit(key)) {
      target.value = key;
      if (nextElementSibling) {
        nextElementSibling.focus();
      }
      e.preventDefault();
      this.value = joinInputValues(this.pinCodeElements);
      this.updateValue();
      // handle alphanumeric keys
    } else if (key.length === 1) {
      e.preventDefault();
      // handle backspace
    } else if (key === 'Backspace') {
      // transfer focus backward, if the input value is empty, and it is not the first input field
      if (!target.value && previousElementSibling) {
        previousElementSibling.value = '';
        previousElementSibling.focus();
      } else {
        target.value = '';
      }
      e.preventDefault();
      this.value = joinInputValues(this.pinCodeElements);
      this.updateValue();
    }
  };

  private onPaste = (e: ClipboardEvent): void => {
    // remove whitespaces and cut string if pasted value is longer than pin code length
    const optimizedPastedData = e.clipboardData.getData('Text').replace(/\s/g, '').slice(0, this.length);
    if (/^[0-9]+$/.test(optimizedPastedData) && optimizedPastedData !== this.value) {
      this.value = optimizedPastedData;
      this.updateValue();
      if (optimizedPastedData.length === this.length) {
        this.pinCodeElements[this.value.length - 1]?.focus();
      } else {
        this.pinCodeElements[this.value.length]?.focus();
      }
    }
    e.preventDefault();
  };

  private updateValue = (): void => {
    this.update.emit({ value: this.value });
    // TODO: reminder to remove console.log
    /* eslint-disable no-console */
    console.log('value', this.value);
  };
}
