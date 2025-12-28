/*
// const request = require('request')
const puppeteer = require("puppeteer-extra");
const stealPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer-extra-plugin-stealth");

// url
// const url = "https://seller.indiamart.com/";

puppeteer.use(stealPlugin());

const loadBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });
  const page = await browser.newPage();
  await page.goto(url);

  // browser.close()
};

const stealthLogin = async (page) => {
  await page.waitForSelector(".banner-input", { timeout: 4000 });
  // await page.type('textarea', 'facebook.com', {delay: 100})
  await page.click(".npttxt");
  await page.type(".npttxt", "7020653153", { delay: 100 });
  await page.keyboard.press("Enter");
  await page.waitForSelector("#reqOtpMobBtn", { timeout: 4000 });
  await page.click("#reqOtpMobBtn");
};

// MIGRATE TO BUY LEAD PAGE
const gotoBuyLead = async (page) => {
  await page.waitForSelector("#lead_cen", { timeout: 4000 });
  await page.click("#lead_cen");
  return;
};

const gotoRecentPage = async (page) => {
  await page.waitForSelector('a[tab-id="home"]', {
    visible: true,
    timeout: 15000,
  });

  await page.click('a[tab-id="home"]');
};

const moreFilterNavigator = async (page) => {
  await page.waitForSelector("#vw_svd_fltr_btn_id", { timeout: 4000 });
  await page.click("#vw_svd_fltr_btn_id");
  return;
};

const applyBasicFilter = async (page) => {
  await page.waitForSelector("#saved_fltr_main_sec", { timeout: 4000 });
  await page.check("#quantity_type_id", { delay: 100 });
  await page.check("#mobile_type_id", { delay: 100 });
  return;
};

// RELOAD PAGE FUNCTION
// const reloadPage = async (page) => {
//   await page.reload()
// }


*/

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerCore = require("puppeteer");

puppeteer.use(StealthPlugin());

// ---------------- CONFIG ----------------
const URL = "https://seller.indiamart.com/";
const MOBILE = "7020653153";

// ---------------- MAIN ----------------
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteerCore.executablePath(),
    defaultViewport: {
      width: 1366,
      height: 768,
    },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(URL, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  await stealthLogin(page);
  await gotoBuyLead(page);
  await gotoRecentPage(page);
  await applyForeignLocationFilter(page);
  await moreFilterNavigator(page);
  await applyBasicFilter(page);

  // await browser.close();
})();

// ---------------- FUNCTIONS ----------------

/**
 * Login using mobile & OTP
 */
const stealthLogin = async (page) => {
  await page.waitForSelector(".npttxt", { visible: true });
  await page.type(".npttxt", MOBILE, { delay: 120 });
  await page.keyboard.press("Enter");

  await page.waitForSelector("#reqOtpMobBtn", { visible: true });
  await page.click("#reqOtpMobBtn");

  console.log("OTP requested — waiting for manual entry");

  // 🔥 WAIT FOR OTP SUCCESS
  await page.waitForFunction(() => !location.href.includes("login"), {
    timeout: 0,
  });

  console.log("Login successful");
  return;
};

/**
 * Navigate to Buy Leads section
 */
const gotoBuyLead = async (page) => {
  await page.waitForSelector("#lead_cen", {
    visible: true,
    timeout: 20000,
  });

  await page.click("#lead_cen");
  return;
};

/**
 * go to recents tab
 */

const gotoRecentPage = async (page) => {
  await page.waitForSelector(
    'a[onclick*="pref=recent"]', 
    {
      visible: true,
      timeout: 30000,
    });

  // Click Recent
  await page.click('a[onclick*="pref=recent"]');

  console.log("Recent tab clicked");
  return;
};

/**
 * apply foreign filter
 */
const applyForeignLocationFilter = async (page) => {
  // Hover on Location container
  await page.waitForSelector('#location_filter', { visible: true });
  await page.hover('#location_filter');

  // Select Foreign radio
  await page.waitForSelector('#location_3');

  await page.evaluate(() => {
    const radio = document.querySelector('#location_3');
    if (radio && !radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  console.log('Foreign location filter applied');
  return
};

/**
 * Open More Filters panel
 */
const moreFilterNavigator = async (page) => {
  await page.waitForSelector(
    "#vw_svd_fltr_btn_id",
    {
      visible: true,
      timeout: 20000,
    });

  await page.click("#vw_svd_fltr_btn_id");
  return;
};

/**
 * Apply basic filters
 */
const applyBasicFilter = async (page) => {
  await page.waitForSelector(
    "#saved_fltr_main_sec",
    {
      visible: true,
      timeout: 20000,
    });

  // quantity checkbox
  await page.evaluate(() => {
    const cb = document.querySelector('#quantity_type_id');
    if (cb && !cb.checked) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // email checkbox
  await page.evaluate(() => {
    const cb = document.querySelector('#email_type_id');
    if (cb && !cb.checked) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Mobile checkbox
  await page.evaluate(() => {
    const cb = document.querySelector('#mobile_type_id');
    if (cb && !cb.checked) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Apply filters
  // await page.evaluate(() => {
  //   document.querySelector('.SLC_cp')?.click();
  // });
  await page.click('.SLC_cp')
  console.log('Basic filters applied');
  return;
};
