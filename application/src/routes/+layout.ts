export const ssr = false;
export const trailingSlash = 'always';
import { sidebars } from "./data";

export function load() {
    return sidebars;
}