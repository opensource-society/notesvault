// [StudyStreak] Study Streak Counter - Tracks user's daily study activity
// This module provides streak tracking functionality using localStorage

class StudyStreakCounter {
  constructor() {
    // [StudyStreak] Initialize streak tracking keys
    this.STREAK_KEY = 'streakCount'
    this.LAST_ACTIVITY_KEY = 'lastActivityDate'
    
    // [StudyStreak] Initialize streak data
    this.streakCount = this.getStoredStreak()
    this.lastActivityDate = this.getStoredLastActivity()
    
    // [StudyStreak] Bind methods to preserve context
    this.updateStreak = this.updateStreak.bind(this)
    this.resetStreak = this.resetStreak.bind(this)
    this.getStoredStreak = this.getStoredStreak.bind(this)
    this.getStoredLastActivity = this.getStoredLastActivity.bind(this)
    this.saveStreakData = this.saveStreakData.bind(this)
    this.getCurrentDate = this.getCurrentDate.bind(this)
    this.isSameDay = this.isSameDay.bind(this)
    this.isNextDay = this.isNextDay.bind(this)
    this.isMoreThanOneDayGap = this.isMoreThanOneDayGap.bind(this)
  }

  // [StudyStreak] Get stored streak count from localStorage
  getStoredStreak() {
    const stored = localStorage.getItem(this.STREAK_KEY)
    return stored ? parseInt(stored, 10) : 0
  }

  // [StudyStreak] Get stored last activity date from localStorage
  getStoredLastActivity() {
    const stored = localStorage.getItem(this.LAST_ACTIVITY_KEY)
    return stored ? stored : null
  }

  // [StudyStreak] Save streak data to localStorage
  saveStreakData() {
    localStorage.setItem(this.STREAK_KEY, this.streakCount.toString())
    localStorage.setItem(this.LAST_ACTIVITY_KEY, this.lastActivityDate)
  }

  // [StudyStreak] Get current date in YYYY-MM-DD format
  getCurrentDate() {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // [StudyStreak] Check if two dates are the same day
  isSameDay(date1, date2) {
    return date1 === date2
  }

  // [StudyStreak] Check if date2 is the next calendar day after date1
  isNextDay(date1, date2) {
    if (!date1 || !date2) return false
    
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    
    // [StudyStreak] Add one day to date1 and check if it equals date2
    d1.setDate(d1.getDate() + 1)
    return d1.toISOString().split('T')[0] === date2
  }

  // [StudyStreak] Check if there's more than one day gap between dates
  isMoreThanOneDayGap(date1, date2) {
    if (!date1 || !date2) return true
    
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    
    // [StudyStreak] Calculate difference in days
    const timeDiff = d2.getTime() - d1.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
    return daysDiff > 1
  }

  // [StudyStreak] Update streak based on current activity
  updateStreak() {
    const currentDate = this.getCurrentDate()
    
    // [StudyStreak] If no previous activity, start streak at 1
    if (!this.lastActivityDate) {
      this.streakCount = 1
      this.lastActivityDate = currentDate
      this.saveStreakData()
      return this.streakCount
    }
    
    // [StudyStreak] If same day activity, streak unchanged
    if (this.isSameDay(this.lastActivityDate, currentDate)) {
      return this.streakCount
    }
    
    // [StudyStreak] If next calendar day, increment streak
    if (this.isNextDay(this.lastActivityDate, currentDate)) {
      this.streakCount++
      this.lastActivityDate = currentDate
      this.saveStreakData()
      return this.streakCount
    }
    
    // [StudyStreak] If more than one day missed, reset streak to 1
    if (this.isMoreThanOneDayGap(this.lastActivityDate, currentDate)) {
      this.streakCount = 1
      this.lastActivityDate = currentDate
      this.saveStreakData()
      return this.streakCount
    }
    
    return this.streakCount
  }

  // [StudyStreak] Reset streak to 0 (for testing or manual reset)
  resetStreak() {
    this.streakCount = 0
    this.lastActivityDate = null
    this.saveStreakData()
    return this.streakCount
  }

  // [StudyStreak] Get current streak count
  getCurrentStreak() {
    return this.streakCount
  }

  // [StudyStreak] Get formatted streak display text
  getStreakDisplayText() {
    if (this.streakCount === 0) {
      return '🔥 Study Streak: 0 days'
    } else if (this.streakCount === 1) {
      return '🔥 Study Streak: 1 day'
    } else {
      return `🔥 Study Streak: ${this.streakCount} days`
    }
  }
}

// [StudyStreak] Create global instance for use across the application
window.studyStreakCounter = new StudyStreakCounter()

// [StudyStreak] Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StudyStreakCounter
}
