import { MODULE_NAME } from "./constants";

export function getIcon(icon: string): string {
    return `modules/${MODULE_NAME}/icons/${icon}.svg`;
}

type AltKeys = typeof KeyboardManager.MODIFIER_CODES.Alt[number];
type CtrlKeys = typeof KeyboardManager.MODIFIER_CODES.Control[number];
type ShiftKeys = typeof KeyboardManager.MODIFIER_CODES.Shift[number];

export function normalizeKeys(keys: Set<string>): Set<string> {
    const normalizedKeys = new Set<string>();

    for (const key of keys) {
        if (KeyboardManager.MODIFIER_CODES.Alt.indexOf(key as AltKeys) >= 0) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.ALT);
            continue;
        }

        if (
            KeyboardManager.MODIFIER_CODES.Control.indexOf(key as CtrlKeys) >= 0
        ) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.CONTROL);
            continue;
        }

        if (
            KeyboardManager.MODIFIER_CODES.Shift.indexOf(key as ShiftKeys) >= 0
        ) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.SHIFT);
            continue;
        }

        normalizedKeys.add(key);
    }

    return normalizedKeys;
}
