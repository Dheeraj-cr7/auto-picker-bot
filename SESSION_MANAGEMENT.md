# Automated Session Management & Login Guide

## Overview

The project now includes an automated session management system that:
- ✅ **Saves login credentials** (cookies, sessionStorage, localStorage) after first login
- ✅ **Reuses saved sessions** on subsequent runs - no need to login repeatedly
- ✅ **Validates session expiry** - sessions expire after 30 days
- ✅ **Handles session failures gracefully** - falls back to manual login if needed
- ✅ **Error handling** - comprehensive error messages and recovery

## How It Works

### First Run
1. Script starts
2. No saved session found → prompts for manual login
3. User enters mobile number and OTP
4. After successful login, session data is **automatically saved** to `session/` folder
5. Script proceeds with scraping

### Subsequent Runs
1. Script starts
2. Valid session found in `session/` folder
3. Session data is **automatically restored** (cookies, storage)
4. Script verifies the session is still active
5. If valid, proceeds directly to scraping **without login**
6. If invalid, falls back to manual login

### Session Expiry
- Sessions expire after **30 days**
- After expiration, user will need to login again
- All old session files are automatically cleared

## File Structure

```
indiamartScraper/
├── login.js              # Session management module (NEW)
├── index.js              # Main entry point (UPDATED)
├── session/              # Session data folder (auto-created)
│   ├── cookies.json
│   ├── sessionStorage.json
│   ├── localStorage.json
│   └── metadata.json
├── .gitignore            # Updated to ignore session/
└── ...
```

## Session Files

### `session/cookies.json`
Stores browser cookies required for authentication

### `session/sessionStorage.json`
Stores session-level storage data

### `session/localStorage.json`
Stores local storage data

### `session/metadata.json`
Stores session metadata:
```json
{
  "savedAt": "2025-12-29T10:30:00.000Z",
  "expiresAt": "2026-01-28T10:30:00.000Z"
}
```

## Usage

### Start the project
```bash
npm start
```

### First Login
- Mobile number will be requested via the browser
- OTP will be requested
- You have **5 minutes** to enter the OTP
- Session will be saved automatically

### Subsequent Runs
- Script will automatically restore your session
- You'll see: `✅ Successfully restored session! User is logged in.`
- No manual login needed

### Force Fresh Login
To clear saved session and login again:
```javascript
const { clearSessionData } = require('./login');

// Run this once to clear old session
await clearSessionData();
```

Or manually delete the `session/` folder.

## Features & Error Handling

### Automatic Error Recovery
- ✅ Invalid session → automatically falls back to manual login
- ✅ Expired session → automatically requested to login again
- ✅ Network errors → clear error messages with recovery options
- ✅ Timeout errors → 5-minute timeout for OTP entry with clear message

### Session Validation
- ✅ Checks if session files exist
- ✅ Checks if session hasn't expired (30-day limit)
- ✅ Verifies session is still active by checking login status
- ✅ Graceful fallback to manual login if any check fails

### Console Output Examples

#### Successful Session Restoration
```
🚀 Starting login handler...

🔐 Valid session found. Attempting to restore...
✅ Restored 10 cookies
✅ Restored 25 sessionStorage items
✅ Restored 15 localStorage items
✅ Successfully restored session! User is logged in.
```

#### Manual Login Required
```
🚀 Starting login handler...

📝 No valid session found. Fresh login required.
⏳ Proceeding with manual login...

🔑 Starting manual login process...
📱 Mobile number entered. Requesting OTP...
📤 OTP requested — waiting for manual entry (timeout: 5 minutes)
✅ Login successful!
💾 Saving session data...
✅ Session data saved successfully!
```

#### Session Expired
```
🚀 Starting login handler...

🔐 Valid session found. Attempting to restore...
⏰ Session expired. Need to login again.
⏳ Proceeding with manual login...
```

## API Reference

### `handleLogin(page, URL, MOBILE)`
Main function to handle login with session management.

**Parameters:**
- `page` (Page): Puppeteer page object
- `URL` (string): Target URL to navigate to
- `MOBILE` (string): Mobile number for login

**Returns:**
```javascript
{
  loginType: "session" | "manual",  // How login was performed
  success: boolean                   // Login success status
}
```

**Example:**
```javascript
const { handleLogin } = require('./login');

const loginResult = await handleLogin(page, URL, MOBILE);
if (loginResult.success) {
  console.log(`✅ Logged in using ${loginResult.loginType}`);
}
```

### `saveSessionData(page)`
Manually save current session data.

**Example:**
```javascript
const { saveSessionData } = require('./login');
await saveSessionData(page);
```

### `isSessionValid()`
Check if a valid session exists.

**Returns:** `boolean`

**Example:**
```javascript
const { isSessionValid } = require('./login');
const valid = await isSessionValid();
```

### `clearSessionData()`
Clear all saved session data.

**Example:**
```javascript
const { clearSessionData } = require('./login');
await clearSessionData();
```

## Troubleshooting

### Q: Session keeps getting cleared
**A:** Sessions expire after 30 days. Clear old session and login again.

### Q: OTP timeout error
**A:** You have 5 minutes to enter the OTP. If taking longer, the script will timeout and you'll need to run again.

### Q: Session restored but still asks to login
**A:** The saved session became invalid (e.g., account logout on another device). Clear session manually and login again:
```bash
# Delete session folder
rm -rf session/
```

### Q: Want to logout
**A:** Simply delete the `session/` folder or run:
```javascript
await clearSessionData();
```

Next time you run the script, you'll be prompted to login again.

## Security Notes

⚠️ **Important:**
- Session files are stored locally in the `session/` folder
- `.gitignore` is configured to prevent accidental commit of session data
- Never share the `session/` folder - it contains your authentication tokens
- Use only on secure machines

## Next Steps

You can extend this functionality by:
1. **Multiple accounts**: Store multiple session folders with user IDs
2. **Session refresh**: Auto-refresh session validity periodically
3. **Encryption**: Encrypt sensitive session data at rest
4. **Database storage**: Store sessions in a database instead of files

---

**Created:** December 29, 2025  
**Last Updated:** December 29, 2025
