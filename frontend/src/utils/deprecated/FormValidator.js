/**
 * Checks if data is empty, undefined, or null.
 *
 * @param {any} data - The input value to check.
 * @returns {boolean} True if empty, false if not.
 */
export function isEmpty(data) {
    return data === null || data === "" || data === undefined;
}
