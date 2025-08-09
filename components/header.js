document.addEventListener('DOMContentLoaded', () => {
    // Load header HTML
    fetch('../components/header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header-holder').innerHTML = data;
        // Wait a bit for DOM to be ready, then update header
        setTimeout(() => {
            updateHeaderForAuth();
        }, 100);
    });
});

// Also update header when page becomes visible (for cases where user comes back to tab)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            updateHeaderForAuth();
        }, 100);
    }
});

function updateHeaderForAuth() {
    const signupBox = document.getElementById('header-signup-box');
    
    if (!signupBox) {
        console.log('Signup box not found, retrying...');
        setTimeout(updateHeaderForAuth, 100);
        return;
    }
    
    // Clear the signup box completely first
    signupBox.innerHTML = '';
    
    if (auth.isLoggedIn()) {
        // User is logged in - show profile button that looks like signup button
        const currentUser = auth.getCurrentUser();
        signupBox.innerHTML = `
            <div class="profile-dropdown">
                <p onclick="toggleProfileDropdown()">Profile</p>
                <div class="profile-dropdown-content" id="profileDropdown">
                    <a href="#" onclick="editProfile()">
                        <i class="fas fa-edit"></i> Edit Profile
                    </a>
                    <a href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
        `;
        console.log('Profile button displayed for user:', currentUser.name);
    } else {
        // User is not logged in - show signup button
        signupBox.innerHTML = `
            <p onclick="window.location.href='../pages/signup.html'">Sign Up</p>
        `;
        console.log('Sign up button displayed');
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    } else {
        dropdown.classList.add('show');
    }
}

function editProfile() {
    // Redirect to profile edit page
    window.location.href = '../pages/profile.html';
}

function logout() {
    auth.logout();
    // Force immediate header update
    setTimeout(() => {
        updateHeaderForAuth();
    }, 50);
    // Redirect to home page
    window.location.href = '../pages/index.html';
}

// Function to force refresh header (can be called from other pages)
function refreshHeader() {
    updateHeaderForAuth();
}

// Debug function to check authentication status
function debugAuth() {
    console.log('Auth status:', auth.isLoggedIn());
    if (auth.isLoggedIn()) {
        console.log('Current user:', auth.getCurrentUser());
    }
    console.log('Signup box exists:', !!document.getElementById('header-signup-box'));
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown && !profileDropdown.contains(event.target)) {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});
