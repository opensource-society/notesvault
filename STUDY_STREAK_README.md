# 🔥 Study Streak Counter Feature

## Overview

The Study Streak Counter is a motivational feature that tracks users' daily study activity by monitoring when they view or upload notes. It encourages consistent study habits by maintaining a streak counter that increases with daily activity and resets when days are missed.

## Features

- **Daily Streak Tracking**: Counts consecutive days of study activity
- **Automatic Updates**: Streaks update automatically based on user actions
- **Persistent Storage**: Uses localStorage to maintain streak data across sessions
- **Responsive Design**: Works on both desktop and mobile devices
- **Non-Intrusive**: Seamlessly integrates with existing UI without modifying core functionality

## How It Works

### Streak Logic

1. **Same Day Activity**: If user views/uploads a note on the same day → streak unchanged
2. **Next Calendar Day**: If it's the next calendar day → increment streak by 1
3. **Missed Days**: If more than one day is missed → reset streak to 1

### Data Storage

The feature uses two localStorage keys:
- `streakCount`: Stores the current streak number
- `lastActivityDate`: Stores the last date of activity (YYYY-MM-DD format)

### Activity Tracking

The streak counter automatically tracks:
- **Note Viewing**: When users open note detail modals
- **Note Uploading**: When users submit note upload forms
- **Dashboard Access**: When users visit the dashboard page

## Implementation Details

### Files Added

1. **`scripts/streakCounter.js`** - Core streak tracking logic
2. **`scripts/streakIntegration.js`** - Integration with existing note activities
3. **`styling/streakCounter.css`** - Styling for the streak counter component
4. **`test-streak.html`** - Test page for demonstrating functionality

### Files Modified

1. **`components/header.html`** - Added streak counter to navbar and mobile menu
2. **`pages/dashboard.html`** - Added streak counter CSS and scripts
3. **`pages/notes.html`** - Added streak counter CSS and scripts
4. **`pages/upload.html`** - Added streak counter CSS and scripts

### Integration Points

The feature integrates with existing functionality through:
- **Header Component**: Streak counter appears in the main navigation
- **Note Viewing**: Tracks when users view note details
- **Note Uploading**: Tracks when users upload new notes
- **Dashboard Access**: Tracks when users access the dashboard

## Usage

### For Users

1. **View Streak**: The streak counter is always visible in the header
2. **Maintain Streak**: View or upload notes daily to maintain your streak
3. **Track Progress**: Watch your streak grow with consistent study habits

### For Developers

1. **Manual Streak Update**: Call `window.streakIntegration.triggerStreakUpdate()`
2. **Get Current Streak**: Call `window.streakIntegration.getCurrentStreak()`
3. **Reset Streak**: Call `window.streakIntegration.resetStreak()`

## Testing

### Test Page

Use `test-streak.html` to test the streak functionality:

1. **Simulate Note View**: Click "Simulate Note View" to test note viewing tracking
2. **Simulate Note Upload**: Click "Simulate Note Upload" to test upload tracking
3. **Reset Streak**: Click "Reset Streak" to reset the counter to 0
4. **View Data**: Click "Show Streak Data" to see current streak information

### Console Logging

The feature includes comprehensive console logging for debugging:
- Streak updates are logged with `[StudyStreak]` prefix
- Initialization status is logged
- Error conditions are logged

## Technical Architecture

### Class Structure

- **`StudyStreakCounter`**: Core streak logic and localStorage management
- **`StudyStreakIntegration`**: Integration with existing note activities

### Event Handling

- **MutationObserver**: Detects when note modals open
- **Event Listeners**: Track form submissions and button clicks
- **Automatic Initialization**: Self-initializes when DOM is ready

### Responsive Design

- **Desktop**: Streak counter appears in navbar actions
- **Mobile**: Streak counter appears in mobile navigation menu
- **Adaptive Styling**: Automatically adjusts for different screen sizes

## Browser Compatibility

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **localStorage**: Requires browsers with localStorage support
- **ES6 Classes**: Uses modern JavaScript features

## Accessibility Features

- **High Contrast Support**: Adapts to high contrast mode preferences
- **Reduced Motion**: Respects user's motion preferences
- **Screen Reader Friendly**: Proper semantic structure and ARIA labels

## Performance Considerations

- **Lightweight**: Minimal impact on page load times
- **Efficient Storage**: Only stores essential data in localStorage
- **Lazy Initialization**: Initializes only when needed

## Future Enhancements

Potential improvements could include:
- **Streak Milestones**: Celebrate specific streak achievements
- **Statistics Dashboard**: Show streak history and patterns
- **Social Features**: Share streaks with friends
- **Backup Storage**: Sync streaks across devices

## Troubleshooting

### Common Issues

1. **Streak Not Updating**: Check browser console for error messages
2. **Display Issues**: Ensure streakCounter.css is properly loaded
3. **localStorage Errors**: Verify browser supports localStorage

### Debug Mode

Enable debug logging by checking the browser console for `[StudyStreak]` messages.

## Contributing

When modifying the Study Streak Counter:

1. **Follow Naming Convention**: Use `[StudyStreak]` prefix for all new code
2. **Maintain Isolation**: Don't modify existing functionality
3. **Test Thoroughly**: Use the test page to verify changes
4. **Update Documentation**: Keep this README current with changes

## License

This feature follows the same license as the main NotesVault project.
