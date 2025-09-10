# Critical Path Testing TODO

## Completed
- [x] Create comprehensive test plan (test_plan.md)
- [x] Analyze application structure and components
- [x] Review frontend pages (signup, login, dashboard)
- [x] Review backend APIs (auth, notes, categories)
- [x] Review database schema and configuration

## Manual Testing Steps
- [ ] Ensure XAMPP Apache and MySQL are running
- [ ] Create database 'notesvaultproject' if not exists
- [ ] Run backend/sql/create_tables.sql to set up tables
- [ ] Launch browser at signup page
- [ ] Fill and submit signup form
- [ ] Verify redirect to login page
- [ ] Fill and submit login form
- [ ] Verify redirect to dashboard page
- [ ] Click add note button to open modal
- [ ] Fill note creation form
- [ ] Submit note creation
- [ ] Verify note creation success
- [ ] Click logout button
- [ ] Verify redirect to login page
- [ ] Document test results

## Additional Testing
- [ ] Test form validation (empty fields, invalid email, weak password)
- [ ] Test duplicate user registration
- [ ] Test invalid login credentials
- [ ] Test note editing and deletion
- [ ] Test category creation and assignment
- [ ] Test JWT token expiration and refresh
- [ ] Test API error handling
- [ ] Test responsive design on mobile devices
