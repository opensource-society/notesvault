// forgot-password.js

document.addEventListener("DOMContentLoaded", () => {
  const formId = document.querySelector("form")?.id;

  if (formId === "forgotPasswordForm") handleForgotPassword();
  else if (formId === "verifyOtpForm") handleOtpVerification();
  else if (formId === "resetPasswordForm") handlePasswordReset();
});

function showMessage(msg, type = "success") {
  const box = document.getElementById("messageBox");
  box.textContent = msg;
  box.className = `message-box show ${type}`;
  setTimeout(() => box.classList.remove("show"), 3000);
}

function handleForgotPassword() {
  document.getElementById("forgotPasswordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    if (!email) return showMessage("Please enter your email", "error");

    const otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("resetEmail", email);
    localStorage.setItem("resetOTP", otp);
    localStorage.setItem("otpExpiry", Date.now() + 5 * 60 * 1000); // valid for 5 mins

    showMessage(`OTP sent to ${email} (Demo OTP: ${otp})`, "success");
    setTimeout(() => (window.location.href = "verify-otp.html"), 1500);
  });
}

function handleOtpVerification() {
  document.getElementById("verifyOtpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const otp = document.getElementById("otp").value.trim();
    const storedOtp = localStorage.getItem("resetOTP");
    const expiry = localStorage.getItem("otpExpiry");

    if (Date.now() > expiry) {
      showMessage("OTP expired! Please request a new one.", "error");
      return (window.location.href = "forgot-password.html");
    }

    if (otp === storedOtp) {
      showMessage("OTP verified successfully!", "success");
      setTimeout(() => (window.location.href = "reset-password.html"), 1000);
    } else {
      showMessage("Invalid OTP. Try again.", "error");
    }
  });
}

function handlePasswordReset() {
  document.getElementById("resetPasswordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (newPass !== confirmPass) return showMessage("Passwords do not match", "error");

    showMessage("Password updated successfully!", "success");
    localStorage.removeItem("resetOTP");
    setTimeout(() => (window.location.href = "/pages/login.html"), 1500);
  });
}


async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


async function handlePasswordReset() {
  document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPass = document.getElementById("newPassword").value.trim();
    const confirmPass = document.getElementById("confirmPassword").value.trim();

    if (newPass !== confirmPass)
      return showMessage("Passwords do not match", "error");

    const email = localStorage.getItem("resetEmail");
    if (!email) return showMessage("No reset email found", "error");

    const hashedPass = await hashPassword(newPass);

    // Update user password in localStorage
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let nvUser = JSON.parse(localStorage.getItem("nv_currentUser"));

    let found = false;

    if (nvUser && nvUser.email === email) {
      if (currentUser) currentUser.password = hashedPass;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      found = true;
    } else if (loggedInUser && loggedInUser.email === email) {
      if (currentUser) currentUser.password = hashedPass;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      found = true;
    }

    if (!found) {
      showMessage("User not found!", "error");
      return setTimeout(() => (window.location.href = "signup.html"), 1500);
    }

    localStorage.removeItem("resetEmail");
    localStorage.removeItem("resetOTP");
    localStorage.removeItem("otpExpiry");

    showMessage("Password updated successfully!", "success");
    setTimeout(() => (window.location.href = "/pages/login.html"), 1500);
  });
}
