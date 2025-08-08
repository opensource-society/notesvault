// Authentication Utility for NotesVault

class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('notesvault-users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('notesvault-current-user')) || null;
    }

    // Register a new user
    register(name, email, password) {
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // In a real app, this should be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('notesvault-users', JSON.stringify(this.users));

        return { success: true, message: 'Registration successful' };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Store current user session
        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        localStorage.setItem('notesvault-current-user', JSON.stringify(this.currentUser));

        return { success: true, message: 'Login successful', user: this.currentUser };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('notesvault-current-user');
        return { success: true, message: 'Logout successful' };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) {
            return { success: false, message: 'No user logged in' };
        }

        // Find and update user in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        // Update user data (excluding password from currentUser session)
        const sessionUpdates = { ...updates };
        delete sessionUpdates.password; // Don't store password in session
        
        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        localStorage.setItem('notesvault-users', JSON.stringify(this.users));

        // Update current user session (without password)
        this.currentUser = { ...this.currentUser, ...sessionUpdates };
        localStorage.setItem('notesvault-current-user', JSON.stringify(this.currentUser));

        return { success: true, message: 'Profile updated successfully' };
    }
}

// Global auth instance
const auth = new AuthManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, auth };
}
