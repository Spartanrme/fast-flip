import { MODULE_NAME } from "./constants";

export function getIcon(icon: string): string {
    return `modules/${MODULE_NAME}/icons/${icon}.svg`;
}