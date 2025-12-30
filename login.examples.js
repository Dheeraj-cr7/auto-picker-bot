/**
 * Examples of using the login module
 * These are common patterns for working with the session management system
 */

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerCore = require("puppeteer");
const {
  handleLogin,
  isSessionValid,
  clearSessionData,
  saveSessionData,
  restoreSessionData,
} = require("./login");

puppeteer.use(StealthPlugin());

// ==================== EXAMPLE 1: Basic Usage ====================
// This is the recommended way for most use cases
async function example1_basicUsage() {
  const URL = "https://seller.indiamart.com/";
  const MOBILE = "7020653153";
  
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteerCore.executablePath(),
    });

    const page = await browser.newPage();
    // This handles everything: restore session or login
    const loginResult = await handleLogin(page, URL, MOBILE);
    console.log(`Login type: ${loginResult.loginType}`);
    console.log(`Success: ${loginResult.success}`);

    // Your scraping code here...

    // await browser.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// // ==================== EXAMPLE 2: Check Session Before Starting ====================
// // Useful if you want to inform user upfront about session status
// async function example2_checkSessionFirst() {
//   const valid = await isSessionValid();

//   if (valid) {
//     console.log("✅ You have a valid session. Script will run fast!");
//   } else {
//     console.log("📝 No saved session. You'll need to enter OTP this time.");
//   }

//   // Now proceed with handleLogin...
// }

// // ==================== EXAMPLE 3: Force Fresh Login ====================
// // Use this when user explicitly wants to logout
// async function example3_forceLogout() {
//   console.log("Logging out and clearing session...");
//   await clearSessionData();
//   console.log("✅ Session cleared. Next run will require fresh login.");
// }

// // ==================== EXAMPLE 4: Multiple Runs in Sequence ====================
// // If you're running multiple scraping tasks in one session
// async function example4_multipleTasks() {
//   const URL = "https://seller.indiamart.com/";
//   const MOBILE = "7020653153";

//   const browser = await puppeteer.launch({
//     headless: false,
//     executablePath: puppeteerCore.executablePath(),
//   });

//   const page = await browser.newPage();

//   // Login once
//   const loginResult = await handleLogin(page, URL, MOBILE);
//   console.log(`Logged in via: ${loginResult.loginType}`);

//   // Task 1
//   console.log("\n--- Running Task 1 ---");
//   await runTask1(page);

//   // Task 2 (reuses same session, no re-login needed)
//   console.log("\n--- Running Task 2 ---");
//   await runTask2(page);

//   // Save session after all tasks (optional - already auto-saved on first login)
//   await saveSessionData(page);

//   // await browser.close();
// }

// // ==================== EXAMPLE 5: Error Handling ====================
// // Comprehensive error handling example
// async function example5_errorHandling() {
//   const URL = "https://seller.indiamart.com/";
//   const MOBILE = "7020653153";

//   try {
//     // Check if session is valid
//     const sessionValid = await isSessionValid();

//     if (!sessionValid) {
//       console.log("Preparing for fresh login...");
//     }

//     const browser = await puppeteer.launch({
//       headless: false,
//       executablePath: puppeteerCore.executablePath(),
//     });

//     const page = await browser.newPage();

//     // Attempt login with comprehensive error handling
//     const loginResult = await handleLogin(page, URL, MOBILE);

//     if (!loginResult.success) {
//       throw new Error("Login failed");
//     }

//     console.log(`✅ Login successful via ${loginResult.loginType}`);

//     // Your scraping code here...

//   } catch (error) {
//     if (error.message.includes("timeout")) {
//       console.error("❌ Timeout: Session could not be restored or login took too long");
//       console.log("💡 Try: npm start again or delete the session/ folder");
//     } else if (error.message.includes("login")) {
//       console.error("❌ Login failed. Check your mobile number and internet.");
//     } else {
//       console.error("❌ Error:", error.message);
//     }

//     // Optionally clear session on error
//     // await clearSessionData();
//   }
// }

// // ==================== EXAMPLE 6: Conditional Session Restore ====================
// // Restore session only if user decides to
// async function example6_conditionalRestore() {
//   const sessionValid = await isSessionValid();

//   let page;
//   let shouldRestore = true;

//   if (sessionValid) {
//     // Ask user if they want to use saved session
//     console.log("📝 Saved session found. Use saved login? (yes/no)");
//     // shouldRestore = await getUserInput(); // Your implementation
//   }

//   const browser = await puppeteer.launch({
//     headless: false,
//     executablePath: puppeteerCore.executablePath(),
//   });

//   page = await browser.newPage();

//   if (shouldRestore && sessionValid) {
//     // Restore existing session
//     try {
//       console.log("🔄 Restoring session...");
//       await restoreSessionData(page);
//       console.log("✅ Session restored");
//     } catch (error) {
//       console.log("⚠️ Could not restore session. Please login fresh.");
//       await handleLogin(page, URL, MOBILE);
//     }
//   } else {
//     // Force fresh login
//     await handleLogin(page, URL, MOBILE);
//   }

//   // Your scraping code here...
// }

// // ==================== EXAMPLE 7: Session Management Utilities ====================
// // Helper functions for managing sessions
// async function sessionManagementUtils() {
//   // Check session status
//   const isValid = await isSessionValid();
//   console.log(`Session valid: ${isValid}`);

//   if (isValid) {
//     // Get session info from metadata.json
//     const fs = require("fs").promises;
//     const path = require("path");

//     try {
//       const metadata = JSON.parse(
//         await fs.readFile(
//           path.join(__dirname, "session", "metadata.json"),
//           "utf8"
//         )
//       );
//       console.log(`Session expires at: ${metadata.expiresAt}`);
//       console.log(`Days remaining: ${daysUntilExpiry(metadata.expiresAt)}`);
//     } catch (error) {
//       console.error("Could not read session metadata");
//     }
//   }
// }

function daysUntilExpiry(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysMs = expiry - now;
  const days = Math.ceil(daysMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

// ==================== EXAMPLE 8: Debugging - Session Info ====================
// Print session debug info
// async function example8_debugSessionInfo() {
//   const fs = require("fs").promises;
//   const path = require("path");

//   const sessionPath = path.join(__dirname, "session");

//   try {
//     // Check if session folder exists
//     const files = await fs.readdir(sessionPath);
//     console.log("📁 Session files found:", files);

//     // Get metadata
//     const metadata = JSON.parse(
//       await fs.readFile(path.join(sessionPath, "metadata.json"), "utf8")
//     );
//     console.log("\n📋 Session Metadata:");
//     console.log(`   Saved at: ${metadata.savedAt}`);
//     console.log(`   Expires at: ${metadata.expiresAt}`);
//     console.log(`   Days remaining: ${daysUntilExpiry(metadata.expiresAt)}`);

//     // Get file sizes
//     for (const file of files) {
//       const stat = await fs.stat(path.join(sessionPath, file));
//       console.log(`   ${file}: ${Math.round(stat.size / 1024)} KB`);
//     }
//   } catch (error) {
//     console.log("❌ No session found");
//   }
// }

// ==================== HELPER FUNCTIONS ====================

// async function runTask1(page) {
//   // Your task 1 implementation
//   console.log("Task 1 completed");
// }

// async function runTask2(page) {
//   // Your task 2 implementation
//   console.log("Task 2 completed");
// }

// ==================== EXPORTS ====================
// module.exports = {
//   example1_basicUsage
//   example2_checkSessionFirst,
//   example3_forceLogout,
//   example4_multipleTasks,
//   example5_errorHandling,
//   example6_conditionalRestore,
//   sessionManagementUtils,
//   example8_debugSessionInfo,
// };
module.exports = {
  example1_basicUsage
};

// Uncomment to run examples:
// example1_basicUsage();
// example5_errorHandling();
// example8_debugSessionInfo();
