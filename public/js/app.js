let selectedFiles = [];

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("preview-container");



dropzone.addEventListener("click", () => fileInput.click());
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (!token || !email) {
      alert("Трябва да влезеш в акаунта си!");
      window.location.href = "/";
    }
    const logoutButtons = document.querySelectorAll("#logoutBtn");

    logoutButtons.forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault(); 
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
        window.location.href = "/";
      });
    });
  });

// Handle file selection (both drag-drop & normal selection)
function handleFiles(files) {
    selectedFiles = [...selectedFiles, ...files];

    for (let file of files) {
        if (!file.type.startsWith("image/")) continue;

        let reader = new FileReader();
        reader.onload = function (e) {
            let previewItem = document.createElement("div");
            previewItem.classList.add("preview-item");

            let img = document.createElement("img");
            img.src = e.target.result;

            let removeBtn = document.createElement("button");
            removeBtn.classList.add("remove-btn");
            removeBtn.innerHTML = "x";
            removeBtn.onclick = function () {
                selectedFiles = selectedFiles.filter(f => f !== file);
                previewItem.remove();
            };

            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    }
}


fileInput.addEventListener("change", (event) => handleFiles(event.target.files));

// Drag & drop for PC users
dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragover");
    handleFiles(event.dataTransfer.files);
});

function showSidebar(){
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "flex";
}
function hideSidebar(){
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "none";
}

document.getElementById("uploadBtn").addEventListener("click", function () {
    if (selectedFiles.length === 0) {
        document.getElementById("message").innerText = "No files selected.";
        return;
    }

    let formData = new FormData();
    selectedFiles.forEach(file => formData.append("images", file));
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    
    fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
            "user-email": userEmail,
            "user-name": userName,
            "authorization": `Bearer ${localStorage.getItem("token")}`
          }
        
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").innerHTML = "Upload successful!";
        previewContainer.innerHTML = "";
        selectedFiles = [];
    })
    .catch(error => {
        document.getElementById("message").innerText = "Upload failed.";
        console.error(error);
    });
});

