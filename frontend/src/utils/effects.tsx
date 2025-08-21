export const shake = (element?: HTMLElement | null, duration = 400) => {
    if (!element) return;
    element.classList.remove("shake")
    void element.offsetWidth; // restart the animation
    element.classList.add("shake");
    window.setTimeout(() => element.classList.remove("shake"), duration);
}