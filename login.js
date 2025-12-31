const fs = require("fs").promises;
const path = require("path");

// Session file paths
const COOKIES_FILE = path.join(__dirname, "session", "cookies.json");
const SESSION_STORAGE_FILE = path.join(__dirname, "session", "sessionStorage.json");
const LOCAL_STORAGE_FILE = path.join(__dirname, "session", "localStorage.json");
const SESSION_METADATA_FILE = path.join(__dirname, "session", "metadata.json");

/**
 * Initialize session directory - creating session folder if not exist
 */
const initSessionDirectory = async () => {
  try {
    const sessionDir = path.dirname(COOKIES_FILE);
    await fs.mkdir(sessionDir, { recursive: true });
  } catch (error) {
    console.error("❌ Error creating session directory:", error.message);
    throw error;
  }
};

/**
 * Save session data (cookies, storage) after login
 */
const saveSessionData = async (page) => {
  try {
    console.log("💾 Saving session data...");

    // Get cookies
    const cookies = await page.cookies();
    const cookiesJSON = JSON.stringify(cookies, null, 2);

    // Get sessionStorage
    const sessionStorage = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        data[key] = window.sessionStorage.getItem(key);
      }
      return data;
    });
    const sessionStorageJSON = JSON.stringify(sessionStorage, null, 2);

    // Get localStorage
    const localStorage = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        data[key] = window.localStorage.getItem(key);
      }
      return data;
    });
    const localStorageJSON = JSON.stringify(localStorage, null, 2);

    // Save to files
    await fs.writeFile(COOKIES_FILE, cookiesJSON);
    await fs.writeFile(SESSION_STORAGE_FILE, sessionStorageJSON);
    await fs.writeFile(LOCAL_STORAGE_FILE, localStorageJSON);

    // Save metadata
    const metadata = {
      savedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };
    await fs.writeFile(SESSION_METADATA_FILE, JSON.stringify(metadata, null, 2));

    console.log("✅ Session data saved successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error saving session data:", error.message);
    throw error;
  }
};

/**
 * Check if session data exists and is valid
 */
const isSessionValid = async () => {
  try {
    const metadataExists = await fileExists(SESSION_METADATA_FILE);
    if (!metadataExists) return false;

    const metadata = JSON.parse(await fs.readFile(SESSION_METADATA_FILE, "utf8"));
    const expiresAt = new Date(metadata.expiresAt);
    const now = new Date();

    if (now > expiresAt) {
      console.log("⏰ Session expired. Need to login again.");
      return false;
    }

    // Check if all session files exist
    const cookiesExist = await fileExists(COOKIES_FILE);
    const sessionStorageExist = await fileExists(SESSION_STORAGE_FILE);
    const localStorageExist = await fileExists(LOCAL_STORAGE_FILE);

    return cookiesExist && sessionStorageExist && localStorageExist;
  } catch (error) {
    console.error("❌ Error checking session validity:", error.message);
    return false;
  }
};

/**
 * Helper function to check if file exists
 */
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Restore session data to page (cookies, storage)
 */
const restoreSessionData = async (page) => {
  try {
    console.log("🔄 Restoring session data...");

    // Restore cookies
    const cookiesData = JSON.parse(await fs.readFile(COOKIES_FILE, "utf8"));
    if (cookiesData.length > 0) {
      await page.setCookie(...cookiesData);
      console.log(`✅ Restored ${cookiesData.length} cookies`);
    }

    // Restore sessionStorage
    const sessionStorageData = JSON.parse(
      await fs.readFile(SESSION_STORAGE_FILE, "utf8")
    );
    await page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        window.sessionStorage.setItem(key, value);
      }
    }, sessionStorageData);
    console.log(`✅ Restored ${Object.keys(sessionStorageData).length} sessionStorage items`);

    // Restore localStorage
    const localStorageData = JSON.parse(
      await fs.readFile(LOCAL_STORAGE_FILE, "utf8")
    );
    await page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        window.localStorage.setItem(key, value);
      }
    }, localStorageData);
    console.log(`✅ Restored ${Object.keys(localStorageData).length} localStorage items`);

    return true;
  } catch (error) {
    console.error("❌ Error restoring session data:", error.message);
    throw error;
  }
};

/**
 * Verify if session is still active (check if user is logged in)
 */
const isUserLoggedIn = async (page, URL) => {
  try {
    // Check current URL - no need to navigate again
    const currentUrl = page.url();
    
    // Check if login page is detected (indicating session is invalid)
    const isOnLoginPage = currentUrl.includes("login");

    return !isOnLoginPage;
  } catch (error) {
    console.error("❌ Error verifying login status:", error.message);
    return false;
  }
};

/**
 * Clear old session data
 */
const clearSessionData = async () => {
  try {
    console.log("🗑️ Clearing old session data...");

    await Promise.all([
      fs.unlink(COOKIES_FILE).catch(() => {}),
      fs.unlink(SESSION_STORAGE_FILE).catch(() => {}),
      fs.unlink(LOCAL_STORAGE_FILE).catch(() => {}),
      fs.unlink(SESSION_METADATA_FILE).catch(() => {}),
    ]);

    console.log("✅ Session data cleared");
  } catch (error) {
    console.error("❌ Error clearing session data:", error.message);
  }
};

/**
 * Main login function with session management
 * Returns { sessionRestored: boolean, needsLogin: boolean }
 */
const initializeLogin = async (page, URL, MOBILE) => {
  try {
    await initSessionDirectory();

    // Check if valid session exists
    const hasValidSession = await isSessionValid();

    if (hasValidSession) {
      console.log("🔐 Valid session found. Attempting to restore...");

      try {
        // CRITICAL: Restore cookies BEFORE navigating to URL
        console.log("🔄 Restoring session data...");
        
        // Navigate to URL first (without cookies)
        await page.goto(URL, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        
        // Restore cookies
        const cookiesData = JSON.parse(await fs.readFile(COOKIES_FILE, "utf8"));
        if (cookiesData.length > 0) {
          await page.setCookie(...cookiesData);
          console.log(`✅ Restored ${cookiesData.length} cookies`);
          
          // DEBUG: Show first few cookie names
          const cookieNames = cookiesData.map(c => c.name).slice(0, 5);
          console.log(`📋 Cookie names: ${cookieNames.join(", ")}`);
        }

        // RELOAD page with cookies applied
        console.log(`🔄 Reloading page with cookies...`);
        await page.reload({
          waitUntil: "networkidle2",
          timeout: 30000,
        });
        
        console.log(`📍 Current URL after reload: ${page.url()}`);
        
        // DEBUG: Check if page has auth indicators
        const pageTitle = await page.title();
        console.log(`📄 Page title: ${pageTitle}`);

        // Now restore storage on the loaded page
        const sessionStorageData = JSON.parse(
          await fs.readFile(SESSION_STORAGE_FILE, "utf8")
        );
        await page.evaluate((data) => {
          for (const [key, value] of Object.entries(data)) {
            window.sessionStorage.setItem(key, value);
          }
        }, sessionStorageData);
        console.log(`✅ Restored ${Object.keys(sessionStorageData).length} sessionStorage items`);

        const localStorageData = JSON.parse(
          await fs.readFile(LOCAL_STORAGE_FILE, "utf8")
        );
        await page.evaluate((data) => {
          for (const [key, value] of Object.entries(data)) {
            window.localStorage.setItem(key, value);
          }
        }, localStorageData);
        console.log(`✅ Restored ${Object.keys(localStorageData).length} localStorage items`);

        // Verify if restored session is still active
        const loggedIn = await isUserLoggedIn(page, URL);

        if (loggedIn) {
          console.log("✅ Successfully restored session! User is logged in.");
          return { sessionRestored: true, needsLogin: false };
        } else {
          console.log("⚠️ Session data exists but user is not logged in. Need fresh login.");
          await clearSessionData();
          return { sessionRestored: false, needsLogin: true };
        }
      } catch (error) {
        console.error("⚠️ Error restoring session:", error.message);
        await clearSessionData();
        return { sessionRestored: false, needsLogin: true };
      }
    } else {
      console.log("📝 No valid session found. Fresh login required.");
      return { sessionRestored: false, needsLogin: true };
    }
  } catch (error) {
    console.error("❌ Error in initializeLogin:", error.message);
    return { sessionRestored: false, needsLogin: true };
  }
};

/**
 * Perform manual login with error handling
 */
// const manualLogin = async (page, MOBILE) => {
//   try {
//     console.log("🔑 Starting manual login process...");

//     // Wait for mobile input field
//     await page.waitForSelector(".npttxt", { visible: true, timeout: 15000 });
//     await page.type(".npttxt", MOBILE, { delay: 120 });
//     await page.keyboard.press("Enter");

//     console.log("📱 Mobile number entered. Requesting OTP...");

//     // Wait for OTP button
//     await page.waitForSelector("#reqOtpMobBtn", { visible: true, timeout: 10000 });
//     await page.click("#reqOtpMobBtn");

//     console.log("📤 OTP requested — waiting for manual entry (timeout: 5 minutes)");

//     // Wait for successful login (URL change from login page)
//     await page.waitForFunction(
//       () => {
//         const url = page.url();
//         return !url.includes("login");
//       },
//       { timeout: 5 * 60 * 1000 } // 5 minutes timeout
//     );

//     console.log("✅ Login successful!");

//     // Save session for future use
//     await saveSessionData(page);

//     return true;
//   } catch (error) {
//     if (error.name === "TimeoutError") {
//       console.error("❌ Login timeout: OTP entry took too long (5+ minutes)");
//     } else {
//       console.error("❌ Login error:", error.message);
//     }
//     throw error;
//   }
// };
const manualLogin = async (page, MOBILE) => {
  try {
    console.log("🔑 Starting manual login process...");
    await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
    );

    await page.goto("https://seller.indiamart.com/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.screenshot({ path: "debug.png" });

    console.log("🌐 Page loaded:", page.url());

    // await page.waitForTimeout(5000); // VERY IMPORTANT for IndiaMART

    // Generic safe selector
    await page.waitForSelector('.npttxt, input[type="text"]', {
      visible: true,
      timeout: 30000,
    });

    const input = await page.$('input[type="tel"], input[type="text"]');
    await input.click({ clickCount: 3 });
    await input.type(MOBILE, { delay: 120 });

    console.log("📱 Mobile entered");
    await page.click('.login_btn')
    // OTP button (generic)
    await page.waitForSelector('.reqOTPbtn', {
        visible: true,
        timeout: 5000
    })
    await page.click(".reqOTPbtn");

    console.log("📤 OTP requested — waiting for manual entry");

    // WAIT FOR URL CHANGE AFTER OTP
    await page.waitForFunction(
      () => !location.href.includes("login"),
      { timeout: 5 * 60 * 1000 }
    );

    console.log("✅ Login successful!");

    await saveSessionData(page);
    return true;

  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
};
/**
 * Combined login handler - tries session first, then manual login if needed
 */
const handleLogin = async (page, URL, MOBILE) => {
  try {
    console.log("🚀 Starting login handler...\n");

    const { sessionRestored, needsLogin } = await initializeLogin(page, URL, MOBILE);

    if (sessionRestored && !needsLogin) {
      console.log("✨ Using restored session!\n");
      return { loginType: "session", success: true };
    }

    if (needsLogin) {
      console.log("⏳ Proceeding with manual login...\n");
      await manualLogin(page, MOBILE);
      return { loginType: "manual", success: true };
    }
  } catch (error) {
    console.error("\n❌ Critical login error:", error.message);
    throw error;
  }
};

module.exports = {
  handleLogin,
  saveSessionData,
  restoreSessionData,
  isSessionValid,
  clearSessionData,
  manualLogin,
  initializeLogin,
};
