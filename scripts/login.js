document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const messageBox = document.getElementById("messageBox");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.querySelector(".password-toggle");
    const passwordIcon = passwordToggle.querySelector("i");
    const rememberMe = document.getElementById("remember-me");
    const loginBtn = document.getElementById("loginBtn");
    const spinner = document.getElementById("spinner");
    const btnText = document.getElementById("btnText");

    const getStoredTheme = () => {
        return localStorage.getItem("theme") || "light";
    };
    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
    };
    setTheme(getStoredTheme());

    function initForm() {
        const rememberedEmail = localStorage.getItem("rememberEmail");
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberMe.checked = true;
            emailInput.parentNode.classList.add("focused");
        }
        initFloatingLabels();
        initPasswordToggle();
    }

    function initFloatingLabels() {
        document.querySelectorAll(".floating-input input").forEach((input) => {
            input.addEventListener("focus", () => {
                input.parentNode.classList.add("focused");
            });
            input.addEventListener("blur", () => {
                if (!input.value) {
                    input.parentNode.classList.remove("focused");
                }
            });
            if (input.value) {
                input.parentNode.classList.add("focused");
            }
        });
    }

    function initPasswordToggle() {
        passwordToggle.addEventListener("click", togglePasswordVisibility);
        updatePasswordToggle(passwordInput.type === "password");
    }

    function togglePasswordVisibility() {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        updatePasswordToggle(!isPassword);
    }

    function updatePasswordToggle(isPassword) {
        passwordIcon.className = isPassword ? "far fa-eye-slash" : "far fa-eye";
        passwordToggle.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );
    }

    function showMessage(message, type = "success") {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type} show`;
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 3000);
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            spinner.classList.remove("hidden");
            btnText.textContent = "Signing in...";
            loginBtn.disabled = true;
        } else {
            spinner.classList.add("hidden");
            btnText.textContent = "Sign in";
            loginBtn.disabled = false;
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoadingState(true);

        const formData = new FormData(loginForm);

        try {
            const response = await fetch('http://localhost/notesvault/pages/login.php', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem("isLoggedIn", "true");
                
                // --- THIS LINE IS REMOVED TO PREVENT THE ERROR ---
                // updateHeader(); 

                showMessage(data.message, "success");
                setTimeout(() => {
                    window.location.href = "dashboard.php"; // Redirect
                }, 1500);

            } else {
                showMessage(data.message, "error");
            }
        } catch (error) {
            console.error("Login error:", error);
            showMessage("An error occurred. Please try again.", "error");
        } finally {
            setLoadingState(false);
        }
    }

    loginForm.addEventListener("submit", handleLogin);
    initForm();
});