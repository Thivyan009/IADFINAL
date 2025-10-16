function validateSignup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("❌ Passwords do not match!");
    return false;
  }

  alert(`🌿 Welcome to Organo, ${name}!`);
  return true;
}

function validateLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("⚠️ Please fill in all fields!");
    return false;
  }

  alert("✅ Login successful!");
  return true;

  // Password visibility toggle for sign-in page
  document.addEventListener('DOMContentLoaded', function() {
    const pwd = document.getElementById('loginPassword');
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');
    const eyeIcon = document.querySelector('.eye-icon');
    if (eyeIcon && pwd && eyeOpen && eyeClosed) {
      eyeIcon.addEventListener('click', function() {
        if (pwd.type === 'password') {
          pwd.type = 'text';
          eyeOpen.style.display = 'none';
          eyeClosed.style.display = 'inline';
        } else {
          pwd.type = 'password';
          eyeOpen.style.display = 'inline';
          eyeClosed.style.display = 'none';
        }
      });
    }
  });
}

function resetPassword() {
  const email = document.getElementById("resetEmail").value;
  if (!email) {
    alert("Please enter your registered email.");
    return false;
  }
  alert("📩 A password reset link has been sent to your email!");
  return true;
}



// Filter functionality for bundles
const buttons = document.querySelectorAll(".filter-btn");
const bundles = document.querySelectorAll(".bundle");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.getAttribute("data-filter");

    bundles.forEach(bundle => {
      if (filter === "all" || bundle.classList.contains(filter)) {
        bundle.style.display = "block";
      } else {
        bundle.style.display = "none";
      }
    });
  });
});


const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const quantityInput = document.getElementById('quantity');

increaseBtn.addEventListener('click', () => {
  let value = parseInt(quantityInput.value);
  quantityInput.value = value + 1;
});

decreaseBtn.addEventListener('click', () => {
  let value = parseInt(quantityInput.value);
  if (value > 1) {
    quantityInput.value = value - 1;
  }
});

function goBack() {
  window.history.back();
}







