const modal = document.querySelector("#modalBox");
const deleteForm = document.getElementById("deleteForm");
const cancelBtn = document.getElementById("cancelBtn");

// hide variables
const hideModal = document.querySelector("#hideModalBox");
const hideForm = document.getElementById("hidePostForm");
const cancelHideBtn = document.getElementById("cancelHideBtn")

document.querySelectorAll(".hide-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const postId = btn.dataset.postId;

        hideForm.action = `/posts/${postId}/hide`;
        hideModal.classList.remove("hidden")
    })
})

cancelHideBtn.addEventListener("click", () => {
    hideModal.classList.add("hidden")
    hideForm.action = ""
})

document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const postId = btn.dataset.postId;

        deleteForm.action = `/posts/${postId}/delete`;
        modal.classList.remove("hidden");
    });
});

cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    deleteForm.action = "";
});


hideModal.addEventListener("click", (e) => {
    if (e.target === hideModal) {
        hideModal.classList.add("hidden");
        hideForm.action = "";
    }
});


modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
        deleteForm.action = "";
    }
});
