
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function showToast(message, type = 'info') {

  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '2rem';
    toastContainer.style.right = '2rem';
    toastContainer.style.zIndex = '1050';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '1rem';
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  toast.style.backgroundColor = type === 'success' ? 'var(--success)' :
                               type === 'error' ? '#dc3545' :
                               type === 'warning' ? '#ffc107' : 'var(--primary-500)';
  toast.style.color = 'white';
  toast.style.padding = '1rem 1.5rem';
  toast.style.borderRadius = '0.5rem';
  toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  toast.style.display = 'flex';
  toast.style.justifyContent = 'space-between';
  toast.style.alignItems = 'center';
  toast.style.minWidth = '300px';
  toast.style.transform = 'translateY(100px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.3s ease';

  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  if (type === 'warning') icon = 'exclamation-triangle';

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    </div>
    <button style="background: none; border: none; color: white; cursor: pointer; font-size: 1.125rem;">
      &times;
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);

  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });

  setTimeout(() => {
    removeToast(toast);
  }, 5000);
}

function removeToast(toast) {
  toast.style.transform = 'translateY(100px)';
  toast.style.opacity = '0';

  setTimeout(() => {
    toast.remove();
  }, 300);
}

function initProfilePage() {
  console.log('Profile page initialized');

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (!loggedInUser) {

    window.location.href = '/pages/login.html';
    return;
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {

    for (const key in loggedInUser) {
      const input = profileForm.querySelector(`input[name="${key}"]`);
      if (input) {
        input.value = loggedInUser[key];
        input.defaultValue = loggedInUser[key];
      }
    }

    const profileName = document.querySelector('.profile-header h1');
    if (profileName && loggedInUser.name) {
      profileName.textContent = loggedInUser.name;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'http://localhost:5000'

  initProfilePage();

  const editProfileBtn = document.getElementById('edit-profile-info');
  const profileForm = document.getElementById('profile-form');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const formInputs = profileForm ? profileForm.querySelectorAll('input') : [];
  const formActions = profileForm ? profileForm.querySelector('.form-actions') : null;

  editProfileBtn?.addEventListener('click', function() {

    formInputs.forEach(input => {
      input.disabled = false;
    });

    if (formActions) {
      formActions.style.display = 'flex';
    }

    if (formInputs.length > 0) {
      formInputs[0].focus();
    }
  });

  cancelEditBtn?.addEventListener('click', function() {

    formInputs.forEach(input => {
      input.disabled = true;
    });

    if (formActions) {
      formActions.style.display = 'none';
    }

    formInputs.forEach(input => {
      input.value = input.defaultValue;
    });
  });

  profileForm?.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerText : 'Save';
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      submitBtn.disabled = true;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.email) {
      showToast('You need to be logged in to update your profile', 'error');
      if (submitBtn) { submitBtn.innerHTML = originalText; submitBtn.disabled = false }
      return;
    }

    const formData = new FormData(this);
    const payload = {}
    for (const [key, value] of formData.entries()) payload[key] = value

    fetch(`${API_BASE}/api/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (res.status >= 400) {
        showToast(res.body.error || 'Failed to update profile', 'error')
        return
      }

      const newUser = { ...loggedInUser, ...payload }
      localStorage.setItem('loggedInUser', JSON.stringify(newUser))
      if (window.auth && typeof window.auth.notifyAuthChange === 'function') window.auth.notifyAuthChange()
      showToast('Profile updated successfully!', 'success')

      formInputs.forEach(input => { input.defaultValue = input.value; input.disabled = true })
      if (formActions) formActions.style.display = 'none'
      const profileName = document.querySelector('.profile-header h1');
      if (profileName && newUser.name) profileName.textContent = newUser.name
    })
    .catch((err) => {
      console.error('Profile update error', err)
      showToast('Failed to update profile. Please try again.', 'error')
    })
    .finally(() => {
      if (submitBtn) { submitBtn.innerHTML = originalText; submitBtn.disabled = false }
    })
  });

  const changePasswordBtn = document.getElementById('change-password-btn');
  const changePasswordModal = document.getElementById('change-password-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');

  changePasswordBtn?.addEventListener('click', function() {
    if (changePasswordModal) {
      changePasswordModal.classList.add('active');
    }
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (changePasswordModal) {
        changePasswordModal.classList.remove('active');
      }
    });
  });

  changePasswordModal?.addEventListener('click', function(e) {
    if (e.target === changePasswordModal) {
      changePasswordModal.classList.remove('active');
    }
  });

  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        input.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });

  const newPasswordInput = document.getElementById('new-password');
  const strengthProgress = document.querySelector('.strength-progress');
  const strengthValue = document.querySelector('.strength-value');

  newPasswordInput?.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    let status = 'Weak';
    let color = '#dc3545'; // red

    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;

    if (strengthProgress) {
      strengthProgress.style.width = strength + '%';
    }

    if (strength <= 25) {
      status = 'Weak';
      color = '#dc3545';
    } else if (strength <= 50) {
      status = 'Fair';
      color = '#ffc107';
    } else if (strength <= 75) {
      status = 'Good';
      color = '#0d6efd';
    } else {
      status = 'Strong';
      color = '#198754';
    }

    if (strengthProgress) {
      strengthProgress.style.backgroundColor = color;
    }

    if (strengthValue) {
      strengthValue.textContent = status;
      strengthValue.style.color = color;
    }
  });

  const passwordChangeForm = document.getElementById('password-change-form');

  passwordChangeForm?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.email) {
      showToast('You need to be logged in to change your password', 'error');
      return;
    }

    const hashedCurrent = await hashPassword(currentPassword)
    const hashedNew = await hashPassword(newPassword)
    const submitBtn = this.querySelector('button[type="submit"]')
    const originalText = submitBtn ? submitBtn.innerText : 'Update'
    if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...'; submitBtn.disabled = true }

    fetch(`${API_BASE}/api/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ oldPassword: hashedCurrent, newPassword: hashedNew }),
    })
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (res.status >= 400) {
        showToast(res.body.error || 'Failed to change password', 'error')
        return
      }
      showToast('Password updated successfully!', 'success')
      passwordChangeForm.reset()
      if (changePasswordModal) changePasswordModal.classList.remove('active')
      if (strengthProgress) strengthProgress.style.width = '0%'
      if (strengthValue) { strengthValue.textContent = 'Weak'; strengthValue.style.color = '#dc3545' }
    })
    .catch((err) => {
      console.error('Change password error', err)
      showToast('Failed to update password. Please try again.', 'error')
    })
    .finally(() => { if (submitBtn) { submitBtn.innerHTML = originalText; submitBtn.disabled = false } })
  });
});
