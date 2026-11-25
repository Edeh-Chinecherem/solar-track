const puppeteer = require("puppeteer-core");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\JESUS IS LORD\\.gemini\\antigravity\\brain\\ea8d3f6f-110b-47ed-9464-2ccd702da892";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Launching isolated Chrome session for Milestone 4 verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(ARTIFACT_DIR, "scratch", "chrome_temp_m4")}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Fleet Monitoring Overview
  console.log("1. Testing Fleet Monitoring Overview (http://localhost:3000/admin/monitoring)...");
  await page.goto("http://localhost:3000/admin/monitoring", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m4-fleet-monitoring-overview.png"), fullPage: true });

  // Filter to Overload Trip
  console.log("Filtering fleet to Overload Trip...");
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text && text.includes("Overload Trip")) {
      await b.click();
      await new Promise((r) => setTimeout(r, 600));
      break;
    }
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m4-fleet-filtered-overload.png") });

  // 2. Test System Health & Diagnosis on sys_001 (Overload Anomaly)
  console.log("2. Testing System Health & Diagnosis (http://localhost:3000/admin/monitoring/sys_001)...");
  await page.goto("http://localhost:3000/admin/monitoring/sys_001", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m4-system-health-gauges.png"), fullPage: true });

  // 3. Test Attach to Ticket Modal
  console.log("Testing Attach to Ticket Modal...");
  const attachBtn = await page.waitForSelector("[data-testid='attach-ticket-btn']", { timeout: 10000 });
  if (attachBtn) {
    await attachBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m4-attach-ticket-modal.png") });
    await page.keyboard.press("Escape");
  }

  console.log("Milestone 4 browser verification completed successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("M4 verification failed:", err);
  process.exit(1);
});
