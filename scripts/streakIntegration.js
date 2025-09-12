// [StudyStreak] Study Streak Integration - Integrates streak tracking with note activities
// This module handles streak updates when users view or upload notes

class StudyStreakIntegration {
  constructor() {
    // [StudyStreak] Initialize integration
    this.streakCounter = window.studyStreakCounter
    this.isInitialized = false
    
    // [StudyStreak] Bind methods to preserve context
    this.init = this.init.bind(this)
    this.updateStreakDisplay = this.updateStreakDisplay.bind(this)
    this.handleNoteActivity = this.handleNoteActivity.bind(this)
    this.setupNoteViewingTracking = this.setupNoteViewingTracking.bind(this)
    this.setupNoteUploadTracking = this.setupNoteUploadTracking.bind(this)
    this.setupDashboardTracking = this.setupDashboardTracking.bind(this)
  }

  // [StudyStreak] Initialize the streak integration
  init() {
    if (this.isInitialized) return
    
    // [StudyStreak] Wait for streak counter to be available
    if (!this.streakCounter) {
      setTimeout(() => this.init(), 100)
      return
    }
    
    // [StudyStreak] Update streak display initially
    this.updateStreakDisplay()
    
    // [StudyStreak] Setup tracking for different note activities
    this.setupNoteViewingTracking()
    this.setupNoteUploadTracking()
    this.setupDashboardTracking()
    
    this.isInitialized = true
    console.log('[StudyStreak] Streak integration initialized successfully')
  }

  // [StudyStreak] Update streak display in all streak counter elements
  updateStreakDisplay() {
    if (!this.streakCounter) return
    
    const streakText = this.streakCounter.getStreakDisplayText()
    
    // [StudyStreak] Update desktop streak counter
    const desktopStreak = document.getElementById('streak-counter')
    if (desktopStreak) {
      const textElement = desktopStreak.querySelector('.streak-text')
      if (textElement) {
        textElement.textContent = streakText.replace('🔥 ', '')
      }
    }
    
    // [StudyStreak] Update mobile streak counter
    const mobileStreak = document.getElementById('mobile-streak-counter')
    if (mobileStreak) {
      const textElement = mobileStreak.querySelector('.streak-text')
      if (textElement) {
        textElement.textContent = streakText.replace('🔥 ', '')
      }
    }
  }

  // [StudyStreak] Handle note activity and update streak
  handleNoteActivity() {
    if (!this.streakCounter) return
    
    // [StudyStreak] Update streak based on current activity
    const newStreak = this.streakCounter.updateStreak()
    
    // [StudyStreak] Update display with new streak
    this.updateStreakDisplay()
    
    // [StudyStreak] Log streak update for debugging
    console.log(`[StudyStreak] Streak updated to: ${newStreak} days`)
    
    return newStreak
  }

  // [StudyStreak] Setup tracking for note viewing activities
  setupNoteViewingTracking() {
    // [StudyStreak] Track when notes are viewed in the notes page
    if (window.location.pathname.includes('notes.html')) {
      // [StudyStreak] Track note modal opening (note viewing)
      const noteModal = document.getElementById('noteDetailModal')
      if (noteModal) {
        // [StudyStreak] Use MutationObserver to detect when modal opens
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'style' && 
                noteModal.style.display === 'flex') {
              // [StudyStreak] Note modal opened - update streak
              this.handleNoteActivity()
            }
          })
        })
        
        observer.observe(noteModal, { attributes: true, attributeFilter: ['style'] })
      }
      
      // [StudyStreak] Track note card clicks (alternative tracking)
      document.addEventListener('click', (e) => {
        if (e.target.closest('.view-button')) {
          // [StudyStreak] View button clicked - update streak
          setTimeout(() => this.handleNoteActivity(), 100)
        }
      })
    }
  }

  // [StudyStreak] Setup tracking for note upload activities
  setupNoteUploadTracking() {
    // [StudyStreak] Track when notes are uploaded
    if (window.location.pathname.includes('upload.html')) {
      const uploadForm = document.getElementById('uploadForm')
      if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
          // [StudyStreak] Note upload form submitted - update streak
          setTimeout(() => this.handleNoteActivity(), 100)
        })
      }
    }
  }

  // [StudyStreak] Setup tracking for dashboard activities
  setupDashboardTracking() {
    // [StudyStreak] Track when dashboard is accessed
    if (window.location.pathname.includes('dashboard.html')) {
      // [StudyStreak] Dashboard accessed - update streak
      this.handleNoteActivity()
    }
  }

  // [StudyStreak] Public method to manually trigger streak update
  triggerStreakUpdate() {
    return this.handleNoteActivity()
  }

  // [StudyStreak] Public method to get current streak
  getCurrentStreak() {
    return this.streakCounter ? this.streakCounter.getCurrentStreak() : 0
  }

  // [StudyStreak] Public method to reset streak (for testing)
  resetStreak() {
    if (this.streakCounter) {
      const newStreak = this.streakCounter.resetStreak()
      this.updateStreakDisplay()
      return newStreak
    }
    return 0
  }
}

// [StudyStreak] Create global instance for use across the application
window.streakIntegration = new StudyStreakIntegration()

// [StudyStreak] Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // [StudyStreak] Wait a bit for other scripts to load
  setTimeout(() => {
    window.streakIntegration.init()
  }, 200)
})

// [StudyStreak] Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StudyStreakIntegration
}
