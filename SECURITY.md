# Security notes — NotesVault (local dev)

This repository currently contains a static frontend served from `pages/` and a small Flask backend under `backend/`.

Important security notes (what's implemented)
- Client-side checks: the frontend uses `localStorage` to store a `loggedInUser` object and client-side JavaScript checks redirect guests away from protected UI pages. These checks improve UX but are not a security boundary.

What's NOT protected (and why this matters)
- There is currently no server-side authentication or authorization. The Flask app does not validate requests or sessions. Any data or future API endpoints will be publicly accessible unless server-side checks are added.
- Client-side checks are trivial to bypass (browser DevTools, manipulating `localStorage`, or crafting direct HTTP requests).

Recommended next steps to harden the app
1. Implement server-side auth and sessions
   - Add user authentication endpoints in the Flask backend (login/logout), and set a secure session cookie (use `flask-login` or signed cookies).
   - Protect any API routes (uploads, profile updates, download endpoints) on the server by checking session or token.

2. Use secure cookies, not localStorage, for auth-sensitive tokens
   - Store session identifiers in HttpOnly, Secure cookies. Avoid storing authentication tokens or passwords in `localStorage`.

3. Add HTTPS (TLS) in production
   - Always serve the app over TLS in production (use a reverse proxy like nginx or deploy to a platform that terminates TLS).

4. Validate & authorize on the server for all actions
   - Server must validate the authenticated user is allowed to perform requested actions (e.g., only owner can delete/edit a file).

5. Protect file uploads and downloads
   - Validate file types and sizes, store uploads outside of webroot or use signed URLs, and scan for malware if relevant.

6. Rate-limiting, brute-force protection, and logging
   - Add rate-limiting on auth endpoints, and log suspicious activity.

7. CORS and CSRF
   - If you expose APIs to cross-origin clients, configure CORS carefully.
   - Protect state-changing endpoints from CSRF (use SameSite cookies or CSRF tokens).

Quick dev notes
- For now, the frontend will keep using client-side checks for development UX. Treat these as convenience features, not security controls.
- If you want, I can implement a minimal Flask session-based auth flow next (login route, protected endpoints, and cookie-based sessions).
# 🔒 Security Policy

## 📅 Supported Versions

This project is actively maintained. If you discover a vulnerability, we encourage responsible disclosure.

| Version | Supported |
|---------|-----------|
| Latest  | ✅         |

---

## 📢 Reporting a Vulnerability

If you find a security issue or vulnerability in **NotesVault**, please report it **privately** so we can address it promptly.

### 🔐 How to Report

- Open a GitHub [Issue](https://github.com/opensource-society/NotesVault/issues) with `[SECURITY]` in the title, OR
- Contact a maintainer directly via email

We will:

- Respond within 48–72 hours
- Investigate the report
- Work on a fix
- Credit the responsible disclosure (optional)

---

## 🤝 Responsible Disclosure

Please avoid:

- Publicly disclosing the vulnerability before it's fixed
- Testing attacks on active users
- Exploiting the issue for personal or public gain

---

Thank you for helping us keep **NotesVault** safe and secure! 🔐
