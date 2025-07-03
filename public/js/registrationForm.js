// Open registration modal-------------------------------------------------------------------------------------------
const modal = document.getElementById("registrationModal");
const btn = document.getElementById("registrationBtn");
const span = document.getElementById("closeRegistration");
const form = document.getElementById("registrationForm");

document.addEventListener("DOMContentLoaded", function () {
    
    btn.onclick = function () {
      modal.style.display = "block";
    }
  
    span.onclick = function () {
      modal.style.display = "none";
    }
  
  });
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
  
    if (password !== confirm) {
      alert("Паролите не съвпадат!");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await res.json();
  
      if (res.ok && data.token) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);

        window.location.href = "/protected/index.html";
        alert(data.message || "Грешка при регистрацията.");
      }
  
    } catch (err) {
      console.error(err);
      alert("Възникна грешка. Опитайте по-късно.");
    }
  });
  
// Open sign in form -----------------------------------------------------------------------------------------------------------------------------------
const signInbtn = document.getElementById("signInBtn");
const signInModal = document.getElementById("signInModal");
const closeSingIn = document.getElementById("closeSignIn");
const signInForm = document.getElementById("signInForm");

document.addEventListener("DOMContentLoaded", function () {
    
  signInbtn.onclick = function () {
    signInModal.style.display = "block";
  }

  closeSingIn.onclick = function () {
    signInModal.style.display = "none";
  }

});
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
  if (event.target === signInModal) {
    signInModal.style.display = "none";
  }
};
signInForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);
      window.location.href = "/protected/index.html";
    } else {
      alert(data.message || "Невалидни данни за вход.");
    }
  } catch (err) {
    console.error(err);
    alert("Грешка при входа.");
  }
});
function showSidebar(){
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}
function hideSidebar(){
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}
