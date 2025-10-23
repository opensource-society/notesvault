// Student Dashboard (JavaScript)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components with sequential animation
    initDashboard();
    
    // Upload notes modal functionality
    const uploadBtn = document.getElementById('upload-note-btn');
    const uploadModal = document.getElementById('upload-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (uploadBtn && uploadModal) {
        uploadBtn.addEventListener('click', function() {
            uploadModal.classList.add('active');
        });
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            uploadModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside of it
    uploadModal?.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            uploadModal.classList.remove('active');
        }
    });
    
    // Add note card click handler
    const addNoteCard = document.querySelector('.add-note-card');
    addNoteCard?.addEventListener('click', function() {
        uploadModal.classList.add('active');
    });
    
    // File upload preview
    const fileInput = document.getElementById('note-file');
    const fileLabel = document.querySelector('.file-upload-label');
    
    fileInput?.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            const fileName = this.files[0].name;
            const fileSize = (this.files[0].size / (1024 * 1024)).toFixed(2) + ' MB';
            
            fileLabel.innerHTML = `
                <i class="fas fa-check-circle" style="color: var(--success);"></i>
                <span style="color: var(--primary-600); font-weight: 600;">${fileName}</span>
                <span style="font-size: 0.8rem; margin-top: 0.5rem;">${fileSize}</span>
                <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 1rem;">Click or drag to change file</span>
            `;
        }
    });
});

// Initialize dashboard elements with staggered animations
function initDashboard() {
    // Add hover effects to note cards
    const noteCards = document.querySelectorAll('.note-card');
    noteCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
            
            // Find and animate icons
            const icon = this.querySelector('.note-icon');
            if (icon) icon.style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            // Reset icon animation
            const icon = this.querySelector('.note-icon');
            if (icon) icon.style.transform = '';
        });
    });
    
    // Add staggered animation to stats items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        item.classList.add('fadeIn');
    });
}