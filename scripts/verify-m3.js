const puppeteer = require("puppeteer-core");
const path = require("path");

const ARTIFACT_DIR = "C:\\Users\\JESUS IS LORD\\.gemini\\antigravity\\brain\\ea8d3f6f-110b-47ed-9464-2ccd702da892";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Launching isolated Chrome session for Milestone 3 verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(ARTIFACT_DIR, "scratch", "chrome_temp_m3")}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Installations Kanban Board
  console.log("1. Testing Installations Pipeline (http://localhost:3000/admin/installations)...");
  await page.goto("http://localhost:3000/admin/installations", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m3-kanban-board.png"), fullPage: true });

  // 2. Test List View Toggle
  console.log("Testing List View toggle...");
  const listToggleBtn = await page.waitForSelector("[data-testid='list-view-btn']", { timeout: 10000 });
  if (listToggleBtn) {
    await listToggleBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m3-installations-list.png"), fullPage: true });
  }

  // 3. Switch back to Kanban and Open Stage Drawer
  console.log("Switching back to Kanban and opening Stage Drawer...");
  const kanbanToggleBtn = await page.waitForSelector("[data-testid='kanban-view-btn']", { timeout: 10000 });
  if (kanbanToggleBtn) {
    await kanbanToggleBtn.click();
    await new Promise((r) => setTimeout(r, 800));
  }

  // Click on the first installation card
  const installCard = await page.waitForSelector("[data-testid='installation-card']", { timeout: 10000 });
  if (installCard) {
    await installCard.click();
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m3-stage-drawer-open.png") });

    // Tick unchecked checkboxes
    console.log("Ticking mandatory checklist items...");
    const checkboxes = await page.$$("input[type='checkbox']");
    for (const cb of checkboxes) {
      const isChecked = await page.evaluate((el) => el.checked, cb);
      if (!isChecked) {
        await cb.click();
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m3-checklist-completed.png") });

    // Close drawer
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 500));
  }

  // 4. Test Customer Portal 10-Stage Tracker (Mobile Viewport)
  console.log("4. Testing Customer Portal 10-Stage Tracker (http://localhost:3000/portal)...");
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto("http://localhost:3000/portal", { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m3-portal-journey-photos.png"), fullPage: true });

  console.log("Milestone 3 browser verification completed successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("M3 verification failed:", err);
  process.exit(1);
});
