// Theme selector logic
document.addEventListener("DOMContentLoaded", () => {
    const themeSelector = document.getElementById("theme-selector");
    const savedTheme = localStorage.getItem("theme") || "light";

    // Apply saved theme
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (themeSelector) themeSelector.value = savedTheme;

    // Change event listener
    if (themeSelector) {
        themeSelector.addEventListener("change", () => {
            const theme = themeSelector.value;
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        });
    }
});
