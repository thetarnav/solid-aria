/*
 * Copyright 2022 Solid Aria Working Group.
 * MIT License
 *
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { KeyboardEvents } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";

export interface CreateKeyboardProps extends KeyboardEvents {
  /**
   * Whether the keyboard events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

type KeyboardProps = Required<Pick<KeyboardEvents, "onKeyDown" | "onKeyUp">>;

export interface KeyboardResult {
  /**
   * Props to spread onto the target element.
   */
  keyboardProps: KeyboardProps;
}

/**
 * Handles keyboard events for the target.
 */
export function createKeyboard(props: CreateKeyboardProps): KeyboardResult {
  const isDisabled = () => access(props.isDisabled) ?? false;

  const onKeyDown: CreateKeyboardProps["onKeyDown"] = event => {
    if (isDisabled()) {
      return;
    }

    props.onKeyDown?.(event);
  };

  const onKeyUp: CreateKeyboardProps["onKeyUp"] = event => {
    if (isDisabled()) {
      return;
    }

    props.onKeyUp?.(event);
  };

  const keyboardProps: KeyboardProps = {
    onKeyDown,
    onKeyUp
  };

  return { keyboardProps };
}
