const puppeteer = require("puppeteer-core");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\JESUS IS LORD\\.gemini\\antigravity\\brain\\ea8d3f6f-110b-47ed-9464-2ccd702da892";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Launching Chrome session for Milestone 5 verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(ARTIFACT_DIR, "scratch", "chrome_temp_m5")}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Tickets Desk & SLA Timers
  console.log("1. Testing Tickets Desk (http://localhost:3000/admin/tickets)...");
  await page.goto("http://localhost:3000/admin/tickets", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-tickets-desk.png"), fullPage: true });

  // Open first ticket detail drawer
  console.log("Opening ticket detail drawer...");
  const ticketRow = await page.waitForSelector("[data-testid^='ticket-row-']", { timeout: 10000 }).catch(() => null);
  if (ticketRow) {
    await ticketRow.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-ticket-drawer.png") });
    // Close drawer
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));
  }

  // 2. PAYG Defaulters Queue & Remote Contactor Disconnect Handshake
  console.log("2. Testing PAYG & Defaulters Desk (http://localhost:3000/admin/payg)...");
  await page.goto("http://localhost:3000/admin/payg", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-payg-defaulters.png"), fullPage: true });

  // Click disconnect on first account
  console.log("Testing single disconnect modal and handshake execution...");
  const disconnectBtn = await page.waitForSelector("[data-testid^='disconnect-btn-']", { timeout: 10000 }).catch(() => null);
  if (disconnectBtn) {
    await disconnectBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Confirm Disconnect
    const confirmBtn = await page.waitForSelector("[data-testid='confirm-disconnect-btn']", { timeout: 5000 });
    if (confirmBtn) {
      await confirmBtn.click();
      // Wait for 3-step handshake execution (sent -> acknowledged -> confirmed)
      await new Promise((r) => setTimeout(r, 2200));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-disconnect-handshake.png") });

      // Click Close & Finish
      const doneBtn = await page.waitForSelector("[data-testid='disconnect-done-btn']", { timeout: 5000 }).catch(() => null);
      if (doneBtn) await doneBtn.click();
    }
  }

  // 3. Customer Portal Payments & Paystack Modal (Mobile Viewport)
  console.log("3. Testing Customer Portal Payments (Mobile Viewport 390x844)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/portal/payments", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-portal-payments.png"), fullPage: true });

  // Click Recharge Power Now -> Paystack Modal
  console.log("Opening Paystack payment modal...");
  const payNowBtn = await page.waitForSelector("[data-testid='pay-now-btn']", { timeout: 10000 });
  if (payNowBtn) {
    await payNowBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-paystack-modal.png") });

    // Submit Paystack payment
    console.log("Submitting simulated Paystack payment...");
    const submitPayBtn = await page.waitForSelector("[data-testid='paystack-submit-btn']", { timeout: 5000 });
    if (submitPayBtn) {
      await submitPayBtn.click();
      await new Promise((r) => setTimeout(r, 1800));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-payment-success.png") });

      const closePaystackBtn = await page.waitForSelector("[data-testid='paystack-close-btn']", { timeout: 5000 }).catch(() => null);
      if (closePaystackBtn) await closePaystackBtn.click();
    }
  }

  // 4. Customer Support Troubleshooter & Raise Ticket Flow
  console.log("4. Testing Customer Support Troubleshooter (http://localhost:3000/portal/support)...");
  await page.goto("http://localhost:3000/portal/support", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Switch to report issue tab
  const raiseTab = await page.waitForSelector("[data-testid='tab-raise-ticket']", { timeout: 5000 });
  if (raiseTab) {
    await raiseTab.click();
    await new Promise((r) => setTimeout(r, 500));
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-portal-support.png"), fullPage: true });

  console.log("Milestone 5 browser verification complete!");
  await browser.close();
}

run().catch((err) => {
  console.error("M5 verification failed:", err);
  process.exit(1);
});
