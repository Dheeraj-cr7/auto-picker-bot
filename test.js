// const puppeteer = require("puppeteer-extra");
// const puppeteerCore = require("puppeteer");
// // const { executablePath } = require("puppeteer");
// const stealthPlugin = require("puppeteer-extra-plugin-stealth");

// puppeteer.use(stealthPlugin());

// const url = "https://www.amazon.in/";

// const URL = 'https://www.amazon.in/ap/signin?openid.pape.max_auth_age=900&openid.return_to=https%3A%2F%2Fwww.amazon.in%2Fgp%2Fyourstore%2Fhome%3Fpath%3D%252Fgp%252Fyourstore%252Fhome%26signIn%3D1%26useRedirectOnSuccess%3D1%26action%3Dsign-out%26ref_%3Dnav_AccountFlyout_signout&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0';

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     executablePath: puppeteerCore.executablePath(),
//   });
//   const page = await browser.newPage();
// //   await page.goto("https://www.amazon.in/");
//   await page.goto(
//     // "https://www.amazon.in/ap/signin",
//     URL,
//     { waitUntil: 'networkidle2', timeout: 0 }
// );
//   console.log("Current URL:", page.url());
//   await page.screenshot({ path: "debug.png", fullPage: true });

//   await gotoSigninPage(page);
//   await enterCredentials(page);
//   browser.close();
// })();

// // const gotoSigninPage = async(page) => {
// //     await page.waitForSelector(
// //         '#nav-belt',
// //         {timeout: 4000}
// //     )
// //     await page.waitForSelector(
// //         '#nav-link-accountList',
// //         {timeout: 4000}
// //     )
// //     await page.click('#nav-link-accountList')
// // }

// const gotoSigninPage = async (page) => {
//   await page.waitForSelector("#nav-link-accountList", {
//     visible: true,
//     timeout: 15000,
//   });

//   await page.click("#nav-link-accountList");
// };

// // const enterCredentials = async (page) => {
// //   await page.waitForSelector("#claim-collection-container", { timeout: 4000 });

// //   await page.type(
// //     "#ap_email_login",
// //     // '7020653153',
// //     // '7020481452',
// //     "9359323417",
// //     { delay: 100 }
// //   );

// //   await page.waitForSelector('input[type="submit"]', { timeout: 4000 });

// //   await page.click('input[type="button"]');
  
// //   await page.waitForSelector('input[type="password"]', { timeout: 4000 });
  
// //   await page.type('input[type="password"]', "Dheeraj.amazon@123");
  
// //   await page.click('input[type="button"]');
// // };


// const enterCredentials = async (page) => {
//     await page.waitForSelector('#claim-collection-container', { visible: true, timeout: 20000 })
    
//   await page.type('#claim-collection-container', '9359323417', { delay: 120 })
//     await page.click('#continue')
// //   await page.click('input[type="button"]');
  
//   await page.waitForSelector('input[type="password"]', { visible: true, timeout: 20000 })

//   await page.type('input[type="password"]', 'Dheeraj.amazon@123', { delay: 120 })
//   await page.click('#signInSubmit')
// //   await page.click('input[type="button"]');
// }



const puppeteer = require("puppeteer-extra");
const puppeteerCore = require("puppeteer");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// ---------------- CONFIG ----------------
const AMAZON_URL = "https://www.amazon.in";

// ⚠️ Move these to .env in real projects
const EMAIL = "9359323417";
const PASSWORD = "Dheeraj.amazon@123";

// ---------------- MAIN ----------------
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteerCore.executablePath(),
    // defaultViewport: {
    //   width: 1366,
    //   height: 768,
    // },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  const page = await browser.newPage();

  await page.goto(AMAZON_URL, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  console.log("Loaded:", page.url());

  await gotoSigninPage(page);
  await enterCredentials(page);

  // await browser.close(); // close when you want
})();

// ---------------- FUNCTIONS ----------------

/**
 * From homepage → click Sign In
 */
const gotoSigninPage = async (page) => {
  await page.waitForSelector("#nav-link-accountList", {
    visible: true,
    timeout: 20000,
  });

  await page.click("#nav-link-accountList");
  return
};

/**
 * Handle Amazon login form
 */
const enterCredentials = async (page) => {
  // EMAIL STEP
  await page.waitForSelector("#ap_email_login", {
    visible: true,
    timeout: 20000,
  });

  await page.type("#ap_email_login", EMAIL, { delay: 120 });
  await page.click("#continue");

  // PASSWORD STEP
  await page.waitForSelector("#ap_password", {
    visible: true,
    timeout: 20000,
  });

  await page.type("#ap_password", PASSWORD, { delay: 120 });
  await page.click("#signInSubmit");
};
