# NotesVault Critical Path Testing Plan

## Prerequisites
- Ensure XAMPP Apache and MySQL services are running
- Database tables are created (run backend/sql/create_tables.sql if not done)
- Application is accessible at http://localhost/web_technoloyg_project/notesvault/

## Test Cases

### 1. User Registration (Signup)
**Objective:** Verify user can successfully create an account

**Steps:**
1. Navigate to http://localhost/web_technoloyg_project/notesvault/frontend/pages/signup.html
2. Fill in the signup form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
3. Click "Sign Up" button
4. Verify success message appears: "Account Created Successfully! Redirecting To Login..."
5. Verify automatic redirect to login page after 2 seconds

**Expected Results:**
- Form validation works (required fields, email format, password length)
- API call to /backend/api/auth/register.php succeeds
- User is created in database
- Redirect to login.html

**Pass/Fail Criteria:**
- [ ] Success message displayed
- [ ] Redirect to login page
- [ ] User can be found in database

### 2. User Login
**Objective:** Verify registered user can log in

**Steps:**
1. On login page (http://localhost/web_technoloyg_project/notesvault/frontend/pages/login.html)
2. Fill in login form:
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Sign In" button
4. Verify success message and redirect to dashboard

**Expected Results:**
- API call to /backend/api/auth/login.php succeeds
- JWT token is generated and stored
- Redirect to dashboard.html

**Pass/Fail Criteria:**
- [ ] Login successful
- [ ] Redirect to dashboard
- [ ] JWT token in localStorage

### 3. Dashboard Access
**Objective:** Verify dashboard loads correctly after login

**Steps:**
1. After login, verify dashboard page loads
2. Check if user name is displayed
3. Verify navigation elements are present
4. Look for "Add Note" button or similar

**Expected Results:**
- Dashboard page renders correctly
- User-specific data loads
- Navigation works

**Pass/Fail Criteria:**
- [ ] Dashboard loads
- [ ] User data displayed
- [ ] Navigation functional

### 4. Note Creation
**Objective:** Verify user can create a new note

**Steps:**
1. On dashboard, click "Add Note" button (may open modal)
2. Fill note creation form:
   - Title: Test Note
   - Content: This is a test note content
   - Category: (if applicable)
3. Submit the form
4. Verify note appears in the list

**Expected Results:**
- API call to /backend/api/notes/create.php succeeds
- Note is saved to database
- Note appears in UI

**Pass/Fail Criteria:**
- [ ] Note created successfully
- [ ] Note visible in dashboard/list
- [ ] Database entry created

### 5. Logout
**Objective:** Verify user can logout successfully

**Steps:**
1. Click logout button on dashboard
2. Verify redirect to login page
3. Try accessing dashboard directly (should redirect to login)

**Expected Results:**
- JWT token is cleared
- Redirect to login.html
- Protected routes require authentication

**Pass/Fail Criteria:**
- [ ] Logout successful
- [ ] Redirect to login
- [ ] Cannot access dashboard without login

## Test Data
- Test User: test@example.com / TestPassword123
- Test Note: Title - "Test Note", Content - "This is a test note content"

## Environment Setup
- Browser: Chrome/Firefox latest
- Screen Resolution: 1920x1080
- Network: Stable internet connection

## Reporting
After completing all tests, document:
- [ ] All test cases passed
- [ ] Any failures with screenshots/error messages
- [ ] Performance observations
- [ ] Browser console errors
- [ ] Recommendations for fixes
