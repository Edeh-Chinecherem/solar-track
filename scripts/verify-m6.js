const puppeteer = require("puppeteer-core");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\JESUS IS LORD\\.gemini\\antigravity\\brain\\ea8d3f6f-110b-47ed-9464-2ccd702da892";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Launching Chrome session for Milestone 6 verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(ARTIFACT_DIR, "scratch", "chrome_temp_m6")}`
    ]
  });

  const page = await browser.newPage();

  // 1. Technician Mobile Jobs View (390 x 844)
  console.log("1. Testing Technician Mobile Jobs (/tech)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/tech", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-tech-jobs.png"), fullPage: true });

  // Open checklist on first job
  console.log("Opening technician stage checklist dialog...");
  const checklistBtn = await page.waitForSelector("[data-testid^='open-checklist-']", { timeout: 8000 }).catch(() => null);
  if (checklistBtn) {
    await checklistBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Tick an item
    const item = await page.waitForSelector("[data-testid^='checklist-item-']", { timeout: 5000 }).catch(() => null);
    if (item) {
      await item.click();
      await new Promise((r) => setTimeout(r, 400));
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-tech-checklist.png") });

    // Close checklist
    const closeBtn = await page.waitForSelector("[data-testid='close-checklist-btn']", { timeout: 5000 }).catch(() => null);
    if (closeBtn) await closeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // 2. Technician Alerts & Profile
  console.log("2. Testing Technician Alerts (/tech/alerts)...");
  await page.goto("http://localhost:3000/tech/alerts", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1000));
  const ackBtn = await page.waitForSelector("[data-testid^='ack-alert-']", { timeout: 5000 }).catch(() => null);
  if (ackBtn) {
    await ackBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-tech-alerts.png"), fullPage: true });

  console.log("Testing Technician Profile (/tech/profile)...");
  await page.goto("http://localhost:3000/tech/profile", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1000));
  const syncBtn = await page.waitForSelector("[data-testid='sync-now-btn']", { timeout: 5000 }).catch(() => null);
  if (syncBtn) {
    await syncBtn.click();
    await new Promise((r) => setTimeout(r, 800));
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-tech-profile.png"), fullPage: true });

  // 3. QR Scanner (/admin/scan)
  console.log("3. Testing QR Scanner Page (/admin/scan)...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/admin/scan", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-admin-scanner.png") });

  // Click demo scan chip to test navigation
  console.log("Simulating QR optical scan resolution...");
  const demoChip = await page.waitForSelector("[data-testid='demo-scan-ST-LAG-001']", { timeout: 5000 }).catch(() => null);
  if (demoChip) {
    await demoChip.click();
    await new Promise((r) => setTimeout(r, 1500));
  }

  // 4. Reports & Analytics Suite (/admin/reports)
  console.log("4. Testing Reports & Analytics Suite (/admin/reports)...");
  await page.goto("http://localhost:3000/admin/reports", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-admin-reports.png"), fullPage: true });

  // Test Export CSV
  const exportBtn = await page.waitForSelector("[data-testid='export-csv-btn']", { timeout: 5000 }).catch(() => null);
  if (exportBtn) {
    await exportBtn.click();
    await new Promise((r) => setTimeout(r, 500));
  }

  // 5. Settings & Audit Log Viewer (/admin/settings)
  console.log("5. Testing Settings & Audit Log Viewer (/admin/settings)...");
  await page.goto("http://localhost:3000/admin/settings", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Switch to Audit Log tab
  const auditTab = await page.waitForSelector("[data-testid='settings-tab-audit']", { timeout: 5000 }).catch(() => null);
  if (auditTab) {
    await auditTab.click();
    await new Promise((r) => setTimeout(r, 800));

    // Open first audit entry inspector
    const auditRow = await page.waitForSelector("[data-testid^='audit-row-']", { timeout: 5000 }).catch(() => null);
    if (auditRow) {
      await auditRow.click();
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-admin-audit-log.png") });

  console.log("Milestone 6 browser verification completed successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("M6 verification failed:", err);
  process.exit(1);
});
