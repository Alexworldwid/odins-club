const btn = document.getElementById("toggleBtn");
const panel = document.querySelector(".panels");

//become a member modal
const memberBtn = document.querySelector("#memberBtn");
const memberFormWrapper = document.querySelector("#memberFormWrapper")

// become admin 
const adminBtn = document.querySelector("#adminBtn");
const adminFormWrapper = document.querySelector("#adminFormWrapper")

btn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("open")
})

memberBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    memberFormWrapper.classList.toggle("open");
    adminFormWrapper.classList.remove("open");
})

adminBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    adminFormWrapper.classList.toggle("open");
    memberFormWrapper.classList.remove("open");
})

document.addEventListener("click", (e) => {
    if (!panel.contains(e.target)) {
        panel.classList.remove("open");
    }
})



