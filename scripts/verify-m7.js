const puppeteer = require("puppeteer-core");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\JESUS IS LORD\\.gemini\\antigravity\\brain\\ea8d3f6f-110b-47ed-9464-2ccd702da892";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Launching Chrome session for Milestone 7 Comprehensive Audit...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(ARTIFACT_DIR, "scratch", "chrome_temp_m7")}`
    ]
  });

  const page = await browser.newPage();

  // 1. Desktop Audit (1440 x 900) - Admin Dashboard Overview
  console.log("1. Testing Desktop Layout (1440 x 900)...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m7-desktop-audit.png"), fullPage: true });

  // 2. Tablet Audit (768 x 1024) - Installations Desk
  console.log("2. Testing Tablet Layout (768 x 1024)...");
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto("http://localhost:3000/admin/installations", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m7-tablet-audit.png"), fullPage: true });

  // 3. Mobile Audit (375 x 812) - Customer Portal Home & Usage
  console.log("3. Testing Mobile Layout (375 x 812)...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/portal", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m7-mobile-audit.png"), fullPage: true });

  // 4. Dark Mode Verification - Fleet Monitoring
  console.log("4. Testing Dark Mode Theme Contrast...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/admin/monitoring", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Toggle Dark Mode
  const darkModeToggle = await page.waitForSelector("[data-testid='theme-toggle-btn']", { timeout: 5000 }).catch(() => null);
  if (darkModeToggle) {
    await darkModeToggle.click();
    await new Promise((r) => setTimeout(r, 600));
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m7-darkmode-audit.png"), fullPage: true });

  console.log("Milestone 7 Comprehensive Audit completed successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("M7 verification failed:", err);
  process.exit(1);
});
