document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resetPasswordForm');
    if (!form) return;

    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const resetBtn = document.getElementById('resetBtn');

    function showMessage(message, type) {
        // You'll need to create a message box element in your HTML for this
        // For simplicity, let's use an alert for now.
        alert(message);
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const token = form.querySelector('input[name="token"]').value;

        if (newPassword.length < 8) {
            showMessage('Password must be at least 8 characters long.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('Passwords do not match.', 'error');
            return;
        }

        // Disable button to prevent multiple submissions
        resetBtn.disabled = true;

        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('password', newPassword);

            const response = await fetch('../php/reset_password_handler.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            showMessage(result.message, result.success ? 'success' : 'error');

            if (result.success) {
                // Redirect to login page after a successful reset
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }

        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            resetBtn.disabled = false;
        }
    });
});