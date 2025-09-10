# How to Install PHP CLI on Windows 11 and Configure PATH

## Step 1: Download PHP
1. Go to the official PHP downloads page: https://windows.php.net/download/
2. Under the "Latest Releases" section, download the latest **Thread Safe** ZIP package for your system architecture (e.g., `php-8.x.x-Win32-vs16-x64.zip`).

## Step 2: Extract PHP
1. Extract the downloaded ZIP file to a directory of your choice, e.g., `C:\php`.

## Step 3: Configure Environment Variables
1. Open the Start menu and search for **Environment Variables**.
2. Click on **Edit the system environment variables**.
3. In the System Properties window, click **Environment Variables**.
4. Under **System variables**, find and select the `Path` variable, then click **Edit**.
5. Click **New** and add the path to your PHP folder, e.g., `C:\php`.
6. Click **OK** on all dialogs to save changes.

## Step 4: Verify Installation
1. Open a new Command Prompt window.
2. Run the command:
   ```
   php -v
   ```
3. You should see the PHP version information displayed.

## Step 5: Restart VSCode
1. Close and reopen VSCode to ensure it picks up the updated PATH.
2. You can now run PHP CLI commands from the VSCode terminal.

---

If you want, I can assist you further with testing or debugging after PHP CLI is set up.
