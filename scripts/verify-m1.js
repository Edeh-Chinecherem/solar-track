const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const ARTIFACT_DIR = "C:\\Users\\JESUS IS LORD\\.gemini\\antigravity\\brain\\ea8d3f6f-110b-47ed-9464-2ccd702da892";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Launching isolated Chrome session...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(ARTIFACT_DIR, "scratch", "chrome_temp")}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("1. Testing Home / Launcher (http://localhost:3000)...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m1-home.png"), fullPage: true });

  console.log("2. Testing Admin Dashboard (http://localhost:3000/admin)...");
  await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle0", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m1-admin-overview.png"), fullPage: true });

  // Test Role Switcher
  console.log("Testing Role Switcher dropdown...");
  const roleDropdownBtn = await page.waitForSelector("[data-testid='role-switcher-btn']", { timeout: 10000 });
  if (roleDropdownBtn) {
    await roleDropdownBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Click Finance
    const financeBtn = await page.waitForSelector("[data-testid='role-option-finance']", { timeout: 5000 });
    if (financeBtn) {
      await financeBtn.click();
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, "m1-admin-role-finance.png"), fullPage: true });
    }
  }

  // Test Theme Toggle
  console.log("Testing Dark/Light Theme toggle...");
  const themeToggle = await page.waitForSelector("[data-testid='theme-toggle-btn']", { timeout: 5000 });
  if (themeToggle) {
    await themeToggle.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m1-admin-dark-mode.png"), fullPage: true });
  }

  // Test Tech View (Mobile Viewport)
  console.log("3. Testing Tech View in Mobile Viewport...");
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto("http://localhost:3000/tech", { waitUntil: "networkidle0", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m1-tech-mobile.png"), fullPage: true });

  // Test Customer Portal (Mobile Viewport)
  console.log("4. Testing Customer Portal in Mobile Viewport...");
  await page.goto("http://localhost:3000/portal", { waitUntil: "networkidle0", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m1-portal-mobile.png"), fullPage: true });

  // Test Public QR Landing (Desktop Viewport)
  console.log("5. Testing Public QR Tag (http://localhost:3000/q/ST-LGS-001-X9)...");
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto("http://localhost:3000/q/ST-LGS-001-X9", { waitUntil: "networkidle0", timeout: 30000 });

  // Privacy assertions: verify customer name and phone are NOT present in HTML
  const content = await page.content();
  const hasCustomerName = content.includes("Babatunde Adeleke");
  const hasPhone = content.includes("0803 419 8821") || content.includes("+234 803");
  console.log(`Privacy Check: Customer name leaked = ${hasCustomerName}, Phone leaked = ${hasPhone}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m1-public-qr.png"), fullPage: true });

  console.log("All screenshots captured successfully in artifact directory!");
  await browser.close();
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
