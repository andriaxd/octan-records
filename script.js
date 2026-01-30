document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");

    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
        links.classList.toggle("active");
        toggle.classList.toggle("active");
        toggle.setAttribute("aria-expanded", String(links.classList.contains("active")));
    });

    links.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "a") {
            links.classList.remove("active");
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
});

