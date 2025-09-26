<?php
// Start a session
session_start();
// Set a default response message
$message = '';
$isTokenValid = false;

// Check if a token is present in the URL
if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Database connection details
    $servername = "localhost";
    $username = "root";
    $password = "your_password";
    $dbname = "your_database";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        $message = "Database connection failed.";
    } else {
        // Prepare and execute a query to find the token
        $stmt = $conn->prepare("SELECT user_id, expires FROM password_resets WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            // Check if the token has expired
            if (time() < $row['expires']) {
                $isTokenValid = true;
                $_SESSION['reset_user_id'] = $row['user_id'];
                $_SESSION['reset_token'] = $token;
            } else {
                $message = "This password reset link has expired.";
            }
        } else {
            $message = "Invalid password reset link.";
        }
        $stmt->close();
    }
    $conn->close();
} else {
    $message = "No password reset token provided.";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NotesVault - Reset Password</title>
    <link rel="stylesheet" href="../styling/forgot-password.css">
    <link rel="stylesheet" href="../styling/base.css">
    <link rel="stylesheet" href="../styling/variables.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body class="login-page">
    <div class="login-card">
        <div class="login-header">
            <h2>Reset Your Password</h2>
            <p><?php echo htmlspecialchars($message); ?></p>
        </div>
        
        <?php if ($isTokenValid): ?>
        <form id="resetPasswordForm" class="login-form">
            <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
            
            <div class="form-group floating-input">
                <input type="password" id="new-password" name="new-password" required placeholder=" " autocomplete="new-password">
                <label for="new-password">New Password</label>
                <div class="input-border"></div>
            </div>

            <div class="form-group floating-input">
                <input type="password" id="confirm-password" name="confirm-password" required placeholder=" " autocomplete="new-password">
                <label for="confirm-password">Confirm Password</label>
                <div class="input-border"></div>
            </div>

            <button type="submit" class="btn btn-primary" id="resetBtn">
                <span id="btnText">Reset Password</span>
                <i class="fas fa-arrow-right btn-icon"></i>
            </button>
        </form>
        <?php endif; ?>
    </div>
    
    <script src="../scripts/reset-password.js"></script>
</body>
</html>