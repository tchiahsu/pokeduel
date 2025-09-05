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

// Convert roomID to a number between 1 and 9
export const roomIdToNumber = (id: string | undefined) => {
    if (!id) return 0;

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 3
}

// Preload images
export const preloadImg = (images: string[]) => {
    images.forEach((img) => {
        const image = new Image();
        image.decoding = "async";
        image.src = img;
    })
}