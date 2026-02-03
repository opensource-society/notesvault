// Function to hash password using SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Toast notification function
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Add styles
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '2rem';
    toastContainer.style.right = '2rem';
    toastContainer.style.zIndex = '1050';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '1rem';
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Set toast styles
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
  
  // Set icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  
  // Add content
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    </div>
    <button style="background: none; border: none; color: white; cursor: pointer; font-size: 1.125rem;">
      &times;
    </button>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);
  
  // Close button functionality
  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });
  
  // Auto dismiss after 5 seconds
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

// Initialize profile page components
function initProfilePage() {
  console.log('Profile page initialized');
  
  // Load user data from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  if (!loggedInUser) {
    // Redirect to login page if not logged in
    window.location.href = 'login.html';
    return;
  }
  
  // Populate profile form with user data
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    // Set default values for all inputs based on stored user data
    for (const key in loggedInUser) {
      const input = profileForm.querySelector(`input[name="${key}"]`);
      if (input) {
        input.value = loggedInUser[key];
        input.defaultValue = loggedInUser[key];
      }
    }
    
    // Display user name in profile header
    const profileName = document.querySelector('.profile-header h1');
    if (profileName && loggedInUser.name) {
      profileName.textContent = loggedInUser.name;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initProfilePage();

  // Edit profile functionality
  const editProfileBtn = document.getElementById('edit-profile-info');
  const profileForm = document.getElementById('profile-form');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const formInputs = profileForm ? profileForm.querySelectorAll('input') : [];
  const formActions = profileForm ? profileForm.querySelector('.form-actions') : null;

  // Edit profile button click handler
  editProfileBtn?.addEventListener('click', function() {
    // Enable all form inputs
    formInputs.forEach(input => {
      input.disabled = false;
    });
    
    // Show form actions
    if (formActions) {
      formActions.style.display = 'flex';
    }
    
    // Focus on first input
    if (formInputs.length > 0) {
      formInputs[0].focus();
    }
  });

  // Cancel edit button click handler
  cancelEditBtn?.addEventListener('click', function() {
    // Disable all form inputs
    formInputs.forEach(input => {
      input.disabled = true;
    });
    
    // Hide form actions
    if (formActions) {
      formActions.style.display = 'none';
    }
    
    // Reset form values (assumes original values are set as defaultValue)
    formInputs.forEach(input => {
      input.value = input.defaultValue;
    });
  });

  // Profile form submit handler
  profileForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    // Get the current user data
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!loggedInUser || !loggedInUser.email) {
      showToast('You need to be logged in to update your profile', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }
    
    // Get form data and update user data
    const formData = new FormData(this);
    const userData = { ...loggedInUser };
    
    for (const [key, value] of formData.entries()) {
      userData[key] = value;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Update user data in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        
        // Also update the user data in their email record
        const storedUser = JSON.parse(localStorage.getItem(userData.email));
        if (storedUser) {
          // Preserve password hash
          const userPassword = storedUser.password;
          // Update all other fields
          Object.assign(storedUser, userData);
          storedUser.password = userPassword;
          localStorage.setItem(userData.email, JSON.stringify(storedUser));
        }
        
        // Update default values to current values
        formInputs.forEach(input => {
          input.defaultValue = input.value;
        });
        
        // Display success message
        showToast('Profile updated successfully!', 'success');
        
        // Update profile name display
        const profileName = document.querySelector('.profile-header h1');
        if (profileName && userData.name) {
          profileName.textContent = userData.name;
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Failed to update profile. Please try again.', 'error');
      } finally {
        // Reset button and form state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Disable inputs and hide actions
        formInputs.forEach(input => {
          input.disabled = true;
        });
        
        if (formActions) {
          formActions.style.display = 'none';
        }
      }
    }, 1500);
  });

  // Change password modal functionality
  const changePasswordBtn = document.getElementById('change-password-btn');
  const changePasswordModal = document.getElementById('change-password-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  
  // Show password change modal
  changePasswordBtn?.addEventListener('click', function() {
    if (changePasswordModal) {
      changePasswordModal.classList.add('active');
    }
  });
  
  // Close modals
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (changePasswordModal) {
        changePasswordModal.classList.remove('active');
      }
    });
  });
  
  // Close modal when clicking outside
  changePasswordModal?.addEventListener('click', function(e) {
    if (e.target === changePasswordModal) {
      changePasswordModal.classList.remove('active');
    }
  });
  
  // Toggle password visibility
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
  
  // Password strength meter
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
  
  // Password change form submission
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
    
    // Get current user data
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.email) {
      showToast('You need to be logged in to change your password', 'error');
      return;
    }
    
    // Get the stored user data with password hash
    const storedUserData = JSON.parse(localStorage.getItem(loggedInUser.email));
    if (!storedUserData) {
      showToast('User data not found', 'error');
      return;
    }
    
    // Verify current password
    const hashedCurrentPassword = await hashPassword(currentPassword);
    if (storedUserData.password !== hashedCurrentPassword) {
      showToast('Current password is incorrect', 'error');
      return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    submitBtn.disabled = true;
    
    try {
      // Hash the new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update the password in localStorage
      storedUserData.password = hashedNewPassword;
      localStorage.setItem(loggedInUser.email, JSON.stringify(storedUserData));
      
      // Display success message
      showToast('Password updated successfully!', 'success');
      
      // Reset form
      this.reset();
      
      // Close modal
      if (changePasswordModal) {
        changePasswordModal.classList.remove('active');
      }
      
      // Reset strength meter
      if (strengthProgress) {
        strengthProgress.style.width = '0%';
      }
      
      if (strengthValue) {
        strengthValue.textContent = 'Weak';
        strengthValue.style.color = '#dc3545';
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Failed to update password. Please try again.', 'error');
    } finally {
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
});
