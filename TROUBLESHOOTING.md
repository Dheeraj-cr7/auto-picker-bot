# Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Issue 1: "Session expired. Need to login again."

**Symptoms:**
- You see: `⏰ Session expired. Need to login again.`
- Script prompts for login even though you logged in before

**Causes:**
- Session data is older than 30 days
- Session metadata corrupted

**Solutions:**
```bash
# Delete old session data
rm -rf session/

# Run again - this will prompt for fresh login
npm start
```

---

### Issue 2: "Error restoring session - User is not logged in"

**Symptoms:**
- Script restores session but then asks to login
- You see: `⚠️ Session data exists but user is not logged in`

**Causes:**
- Session became invalid (logged out on another device)
- Cookies expired on the server
- Browser session was cleared

**Solutions:**
```bash
# Clear and login fresh
rm -rf session/
npm start
```

---

### Issue 3: "OTP timeout - OTP entry took too long"

**Symptoms:**
- Script waits for 5 minutes
- Error: `❌ Login timeout: OTP entry took too long (5+ minutes)`

**Causes:**
- You took more than 5 minutes to enter OTP
- Network delay during OTP submission

**Solutions:**
- Run script again
- Have OTP ready before running
- Check internet connection

---

### Issue 4: "Cannot find module './login'"

**Symptoms:**
- Error: `Cannot find module './login'`
- Script won't start

**Causes:**
- `login.js` file missing or not in right location
- File was deleted or not properly created

**Solutions:**
```bash
# Check if login.js exists
ls -la | grep login.js

# If missing, re-download or recreate the file
# Ensure login.js is in project root directory
```

---

### Issue 5: "Error creating session directory"

**Symptoms:**
- Error: `❌ Error creating session directory`
- Session data not being saved

**Causes:**
- No write permissions in project folder
- Disk is full
- Antivirus blocking file creation

**Solutions:**
```bash
# Check permissions (Windows)
# Right-click project folder → Properties → Security
# Ensure your user has "Full Control"

# Or try running as Administrator
# Right-click VS Code → Run as administrator
```

---

### Issue 6: "Session data restored but page still shows login"

**Symptoms:**
- Cookies/storage restored successfully
- But website still shows login page

**Causes:**
- Website requires additional headers or validation
- Server-side session validation failed
- Browser version or IP changed

**Solutions:**
```javascript
// Edit index.js to add a delay after restoration
const loginResult = await handleLogin(page, URL, MOBILE);

// Add this:
await page.waitForTimeout(2000); // Wait 2 seconds

// Then reload to ensure session is valid
await page.goto(URL);
```

---

### Issue 7: "Cannot read property 'cookies' of undefined"

**Symptoms:**
- Error during session save/restore
- Script crashes

**Causes:**
- Page object is null or undefined
- Browser closed unexpectedly

**Solutions:**
```javascript
// Ensure page is created before calling handleLogin
const page = await browser.newPage();
if (!page) throw new Error("Failed to create page");

await handleLogin(page, URL, MOBILE);
```

---

### Issue 8: ".gitignore not working - session/ gets committed"

**Symptoms:**
- Session files appearing in git
- `.gitignore` changes not taking effect

**Causes:**
- Session files already in git history
- `.gitignore` not updated properly

**Solutions:**
```bash
# Remove session files from git tracking
git rm --cached -r session/

# Update .gitignore (already done for you)
# Verify it has: session/

# Commit changes
git add .gitignore
git commit -m "Add session/ to gitignore"
```

---

### Issue 9: "Session saves but never restores"

**Symptoms:**
- Session saves successfully
- But next run doesn't restore it
- Always asks for login

**Causes:**
- Session validation always fails
- Browser can't accept restored cookies
- Network prevents session verification

**Solutions:**
```javascript
// Edit login.js, find isUserLoggedIn function
// Add logging to debug:
const isUserLoggedIn = async (page, URL) => {
  try {
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 30000 });
    
    const currentUrl = page.url();
    console.log("Current URL after navigation:", currentUrl); // DEBUG
    
    const isOnLoginPage = currentUrl.includes("login");
    console.log("On login page?", isOnLoginPage); // DEBUG
    
    return !isOnLoginPage;
  } catch (error) {
    console.error("Login check error:", error.message);
    return false;
  }
};
```

---

### Issue 10: "ENOENT: no such file or directory"

**Symptoms:**
- Error: `ENOENT: no such file or directory, open './session/cookies.json'`
- Happens on second run

**Causes:**
- Session folder created but JSON files not written
- Race condition during file save
- Disk full during save

**Solutions:**
```bash
# Delete partial session data
rm -rf session/

# Check available disk space
df -h  # Linux/Mac
wmic logicaldisk get name,freespace  # Windows

# Run again
npm start
```

---

## 🆘 Still Having Issues?

### Debug Checklist

- [ ] Session folder exists: `ls -la session/`
- [ ] JSON files exist: `session/*.json`
- [ ] Files have content: `cat session/metadata.json`
- [ ] Mobile number correct: Check `MOBILE` in `index.js`
- [ ] URL correct: Check `URL` in `index.js`
- [ ] NPM dependencies installed: `npm install`
- [ ] No other scripts using same browser port
- [ ] Internet connection stable
- [ ] Antivirus not blocking filesystem

### Debugging Steps

1. **Check session metadata:**
   ```bash
   cat session/metadata.json
   ```

2. **Check cookie count:**
   ```bash
   cat session/cookies.json | grep "name" | wc -l
   ```

3. **Enable verbose logging:**
   Edit `login.js`, search for `console.log` and ensure none are commented

4. **Check browser console:**
   With `headless: false`, check the browser's console for errors

5. **Clear everything and start fresh:**
   ```bash
   rm -rf session/
   npm start
   ```

---

## 📞 Getting Help

If you can't find your issue here:

1. **Check console output carefully**
   - Look for first error message
   - Note the exact error text

2. **Check session files:**
   - Do they exist?
   - Are they valid JSON? (Use VS Code to view)
   - Are they recent?

3. **Try the nuclear option:**
   ```bash
   rm -rf session/
   npm start
   # Login fresh, see if it works
   ```

4. **Check logs:**
   - See [SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md#console-output-examples)
   - Compare your output with expected output

---

## ⚠️ Important Notes

- **5-minute OTP timeout:** You have 5 minutes to enter OTP after clicking "Request OTP"
- **30-day expiry:** Sessions automatically expire and require fresh login
- **One session at a time:** Only one active session can be saved
- **Local only:** Session data stored locally only (not in cloud)

---

**Last Updated:** December 29, 2025
