import {
  createFocus,
  CreateFocusProps,
  createKeyboard,
  CreateKeyboardProps,
  FocusElementProps,
  keyboardElementProps
} from "@solid-aria/interactions";
import { combineProps } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, createSignal, onMount } from "solid-js";

export interface CreateFocusableProps extends CreateFocusProps, CreateKeyboardProps {
  /**
   * Whether focus should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element should receive focus on render.
   */
  autoFocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether to exclude the element from the sequential tab order. If true,
   * the element will not be focusable via the keyboard by tabbing. This should
   * be avoided except in rare scenarios where an alternative means of accessing
   * the element or its functionality via the keyboard is available.
   */
  excludeFromTabOrder?: MaybeAccessor<boolean | undefined>;
}

export type FocusableElementProps = FocusElementProps &
  keyboardElementProps & { tabIndex?: number };

export interface FocusableResult {
  /**
   * Props to spread onto the target element.
   */
  focusableProps: Accessor<FocusableElementProps>;
}

// TODO: add all the focus provider stuff when needed

/**
 * Make an element focusable, capable of auto focus and excludable from tab order.
 */
export function createFocusable(
  props: CreateFocusableProps,
  ref: Accessor<HTMLElement | undefined>
): FocusableResult {
  const [autoFocus, setAutoFocus] = createSignal(!!access(props.autoFocus));

  const { focusProps } = createFocus(props);
  const { keyboardProps } = createKeyboard(props);

  // const interactionProps = createMemo(() => {
  //   return props.isDisabled ? {} : useFocusableContext(ref);
  // });

  const focusableProps: Accessor<FocusableElementProps> = createMemo(() => {
    return combineProps(
      focusProps(),
      keyboardProps(),
      {
        tabIndex: access(props.excludeFromTabOrder) && !access(props.isDisabled) ? -1 : undefined
      }
      // interactionProps()
    );
  });

  onMount(() => {
    autoFocus() && access(ref)?.focus();
    setAutoFocus(false);
  });

  return { focusableProps };
}
