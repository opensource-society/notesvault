document.addEventListener("DOMContentLoaded", () => {
    const themeSelector = document.getElementById("theme-selector");
    if (!themeSelector) return;

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeSelector.value = savedTheme;

    themeSelector.addEventListener("change", () => {
        const theme = themeSelector.value;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    });
});
