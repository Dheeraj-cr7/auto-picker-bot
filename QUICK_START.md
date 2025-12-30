# Quick Start Guide - Session Management

## What's New? 🎉

Your IndiaMART scraper now has **automated session management**! You no longer need to login every time you run the script.

## First Run

```bash
npm start
```

1. Browser opens
2. Enter your mobile number
3. Enter OTP
4. Session is automatically saved
5. Scraping starts

## Every Run After

```bash
npm start
```

1. Browser opens
2. **Session automatically restored** ✨
3. No login needed
4. Scraping starts immediately

## That's It! 

Your session will be saved for 30 days. After that, you'll need to login once more.

---

## Common Tasks

### Force a fresh login
Delete the `session/` folder or run in your Node console:
```javascript
const { clearSessionData } = require('./login');
await clearSessionData();
```

### Check if session is valid
```javascript
const { isSessionValid } = require('./login');
const valid = await isSessionValid();
console.log(valid ? "Session OK" : "Need to login");
```

### Manual session save
```javascript
const { saveSessionData } = require('./login');
await saveSessionData(page);
```

---

## File Structure
```
session/                    ← Auto-created folder
├── cookies.json           ← Your login cookies
├── sessionStorage.json    ← Browser session data
├── localStorage.json      ← Browser local data
└── metadata.json          ← Session expiry info
```

## Logs You'll See

✅ **Session restored (Good!)**
```
✅ Restored 10 cookies
✅ Restored 25 sessionStorage items
✅ Successfully restored session! User is logged in.
```

📝 **Need manual login (First run or expired)**
```
📝 No valid session found. Fresh login required.
🔑 Starting manual login process...
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Session expired" | Delete `session/` folder and run again |
| "OTP timeout" | You have 5 minutes to enter OTP |
| Want to logout | Delete `session/` folder |
| Can't login | Check your mobile number and internet connection |

---

**Need more details?** See [SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md) for complete documentation.
