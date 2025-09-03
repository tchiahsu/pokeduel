// Makes an element shake
export const shake = (element?: HTMLElement | null, duration = 400) => {
    if (!element) return;
    element.classList.remove("shake")
    void element.offsetWidth; // restart the animation
    element.classList.add("shake");
    window.setTimeout(() => element.classList.remove("shake"), duration);
}

// Removes the hyphens of a pokemon name
export const removeHyphen = (name: string | undefined) => {
    if (!name) return;
    return name.trim().replace(/-/g, " ");
}

// Adds the hyphen for searching pokemon name
export const addHyphen = (name: string | undefined) => {
    if (!name) return;
    return name.trim().replace(/ /g, "-");
}

// Convert text to title case
export const toTitleCase = (name: string | undefined) => {
    if (!name) return;
    return name
        .toLowerCase()
        .split(/\s+/) // split on one or more spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}