// Sign Up (JavaScript)
document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordIcon = passwordToggle.querySelector('i');
    const termsCheckbox = document.getElementById('terms');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');
    const termsError = document.getElementById('termsError');

    const signupBtn = document.getElementById('signupBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btnText');

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    // --- Utility Functions ---
    const getStoredTheme = () => {
        return localStorage.getItem("theme") || "light";
    };
    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
    };
    setTheme(getStoredTheme());

    passwordToggle.addEventListener('click', function () {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        passwordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye';
        passwordToggle.setAttribute(
            'aria-label',
            isPassword ? 'Hide password' : 'Show password'
        );
        if (confirmPasswordInput) {
            confirmPasswordInput.type = passwordInput.type;
        }
    });

    document.querySelectorAll('.floating-input input').forEach((input) => {
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentNode.classList.remove('focused');
            }
        });
    });

    function clearErrors() {
        [nameError, emailError, passwordError, confirmError, termsError].forEach(
            (e) => {
                e.textContent = '';
                e.style.display = 'none';
            }
        );
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function setFormLoading(isLoading) {
        if (isLoading) {
            spinner.classList.remove('hidden');
            btnText.style.visibility = 'hidden';
            signupBtn.disabled = true;
        } else {
            spinner.classList.add('hidden');
            btnText.style.visibility = 'visible';
            signupBtn.disabled = false;
        }
    }

    function validateForm(name, emailVal, password, confirmPassword) {
        clearErrors();
        let valid = true;

        if (name.length < 2) {
            showError(nameError, 'Name is required and must be at least 2 characters.');
            valid = false;
        }

        if (!EMAIL_REGEX.test(emailVal)) {
            showError(emailError, 'Please enter a valid email address.');
            valid = false;
        }

        if (!PASSWORD_REGEX.test(password)) {
            showError(
                passwordError,
                'Password must contain at least 1 capital letter, 1 small letter, 1 number, 1 special symbol, and be at least 6 characters long.'
            );
            valid = false;
        }

        if (password !== confirmPassword) {
            showError(confirmError, 'Passwords do not match.');
            valid = false;
        }

        if (!termsCheckbox.checked) {
            showError(termsError, 'Please agree to the Terms of Service.');
            valid = false;
        }

        return valid;
    }

    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!validateForm(name, emailVal, password, confirmPassword)) {
            return;
        }

        setFormLoading(true);

        try {
            const formData = new FormData(signupForm);

            const response = await fetch(signupForm.action, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                alert(result.message + ' Redirecting to login...');
                signupForm.reset();
                window.location.href = 'login.html';
            } else {
                alert('Registration Failed: ' + result.message);

                if (result.message.includes('email is already registered')) {
                    showError(emailError, result.message);
                }
            }

        } catch (error) {
            console.error('Submission Error:', error);
            alert('An unexpected error occurred. Please check your connection and try again.');
        } finally {
            setFormLoading(false);
        }
    });
});