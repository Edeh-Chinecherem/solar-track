const puppeteer = require("puppeteer-core");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\JESUS IS LORD\\.gemini\\antigravity\\brain\\ea8d3f6f-110b-47ed-9464-2ccd702da892";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Launching isolated Chrome session for Milestone 2 verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(ARTIFACT_DIR, "scratch", "chrome_temp_m2")}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Customers Registry
  console.log("1. Testing Customers Registry (http://localhost:3000/admin/customers)...");
  await page.goto("http://localhost:3000/admin/customers", { waitUntil: "networkidle0", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-customers-table.png"), fullPage: true });

  // Open QR modal on first row
  console.log("Opening QR Code modal from table...");
  const qrButton = await page.$("button[title='Click to view and print QR label']");
  if (qrButton) {
    await qrButton.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-qr-modal.png") });
    // Close modal by clicking backdrop or escape
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));
  }

  // 2. Test Add Customer Wizard
  console.log("2. Testing Add Customer Wizard (http://localhost:3000/admin/customers/new)...");
  await page.goto("http://localhost:3000/admin/customers/new", { waitUntil: "networkidle0", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-wizard-step1.png"), fullPage: true });

  // Advance through steps to Step 6
  for (let s = 1; s <= 5; s++) {
    const continueBtn = await page.$("button:has(svg.lucide-arrow-right)");
    if (continueBtn) {
      await continueBtn.click();
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  console.log("Arrived at Step 6 Review & Issue Tag...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-wizard-step6.png"), fullPage: true });

  // Submit and issue tag
  const issueBtn = await page.$("button:has(svg.lucide-shield-check)");
  if (issueBtn) {
    await issueBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-post-create-qr.png") });
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));
  }

  // 3. Test Customer Profile Page
  console.log("3. Testing Customer Profile (http://localhost:3000/admin/customers/cust_001)...");
  await page.goto("http://localhost:3000/admin/customers/cust_001", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-customer-profile-overview.png"), fullPage: true });

  // Click on Live System Telemetry Tab
  console.log("Switching to Tab 3: Live System Telemetry...");
  const tabs = await page.$$("button[role='tab'], button");
  for (const t of tabs) {
    const text = await page.evaluate((el) => el.textContent, t);
    if (text && text.includes("3. Live System")) {
      await t.click();
      await new Promise((r) => setTimeout(r, 600));
      break;
    }
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-customer-profile-telemetry.png") });

  // Click on Usage Graphs Tab
  console.log("Switching to Tab 4: Usage Graphs...");
  const tabs2 = await page.$$("button");
  for (const t of tabs2) {
    const text = await page.evaluate((el) => el.textContent, t);
    if (text && text.includes("4. Usage Graphs")) {
      await t.click();
      await new Promise((r) => setTimeout(r, 600));
      break;
    }
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-customer-profile-usage.png") });

  // Test Disconnect Modal Trigger
  console.log("Testing Remote Disconnect Confirmation Modal...");
  const disconnectBtn = await page.$("button:has(svg.lucide-power-off), button:has(svg.lucide-power)");
  if (disconnectBtn) {
    await disconnectBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m2-disconnect-modal.png") });
    await page.keyboard.press("Escape");
  }

  console.log("Milestone 2 browser verification completed successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("M2 verification failed:", err);
  process.exit(1);
});
