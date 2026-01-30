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

const artistButtonSubmit = document.querySelector(".artistButtonSubmit")
const artistInput = document.getElementById("artistsInput")
const artistInput1 = document.getElementById("artistsInput1")
const returnToDiv = document.getElementById("saxeli1")

artistButtonSubmit.addEventListener("click", () => updateName(artistInput.value , artistInput1.value))

function updateName(saxeli, gvari){

    returnToDiv.textContent =  `${saxeli} ${gvari}`
}

const dogButton = document.getElementById("dogButton");
const dogImage = document.createElement("img");
document.body.appendChild(dogImage);

dogButton.addEventListener("click", async() =>{

 const response = await fetch("https://dog.ceo/api/breeds/image/random");
 const data = await response.json(); 
 console.log(data);
 dogImage.src = data.message;

});

const removeButton = document.getElementById("removeButton");

removeButton.addEventListener("click", () => {
    dogImage.src = "";
}); 

// davamato punqcia rom dacheraze ramdenime surati amoagdos