document.addEventListener("DOMContentLoaded", () => {
    // DROPDOWN
    const avatarBtn = document.getElementById("avatarButton");
    const dropdown = document.getElementById("profileDropdown");

    if (avatarBtn && dropdown) {
        avatarBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });
        window.addEventListener("click", () => {
            dropdown.classList.remove("show");
        });
        dropdown.addEventListener("click", (e) => e.stopPropagation());
    }

    // DARK MODE
    const themeToggle = document.getElementById("themeToggle");
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        if(themeToggle) themeToggle.textContent = "☀️";
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            themeToggle.textContent = isDark ? "☀️" : "🌙";
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }
});