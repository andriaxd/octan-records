document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");

    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
        links.classList.toggle("open");
        toggle.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(links.classList.contains("open")));
    });

    links.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "a") {
            links.classList.remove("open");
            toggle.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
});

