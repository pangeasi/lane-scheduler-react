import { test, expect, type Locator, type Page } from "@playwright/test";

const STORYBOOK_URL = process.env.STORYBOOK_URL ?? "http://localhost:6006";

const dragWithMouse = async (
  page: Page,
  source: Locator,
  target: Locator,
  sourcePosition = { x: 10, y: 10 },
  targetPosition = { x: 10, y: 10 }
) => {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Unable to resolve drag source or target bounds");
  }

  await page.mouse.move(
    sourceBox.x + sourcePosition.x,
    sourceBox.y + sourcePosition.y
  );
  await page.mouse.down();
  await page.waitForTimeout(50);
  await page.mouse.move(
    targetBox.x + targetPosition.x,
    targetBox.y + targetPosition.y,
    { steps: 12 }
  );
  await page.waitForTimeout(50);
  await page.mouse.up();
};

test.describe("Scheduler collisionStrategy swap", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `${STORYBOOK_URL}/iframe.html?globals=&args=&id=components-scheduler--swap-appointments&viewMode=story`
    );
    await page.waitForLoadState("networkidle");
  });

  test("swaps appointments within the same lane", async ({ page }) => {
    const focusBlock = page.locator('[data-appointment-id="swap-a-focus"]');
    const teamSync = page.locator('[data-appointment-id="swap-a-sync"]');

    await dragWithMouse(page, focusBlock, teamSync);

    await expect(focusBlock).toContainText("7 - 10");
    await expect(teamSync).toContainText("2 - 4");
  });

  test("swaps appointments between lanes", async ({ page }) => {
    const focusBlock = page.locator('[data-appointment-id="swap-a-focus"]');
    const designReview = page.locator(
      '[data-appointment-id="swap-b-review"]'
    );

    await dragWithMouse(page, focusBlock, designReview);

    await expect(focusBlock).toContainText("5 - 8");
    await expect(designReview).toContainText("2 - 5");
  });

  test("rejects swapping with locked appointments", async ({ page }) => {
    const focusBlock = page.locator('[data-appointment-id="swap-a-focus"]');
    const lockedHold = page.locator('[data-appointment-id="swap-a-locked"]');

    await dragWithMouse(page, focusBlock, lockedHold);

    await expect(focusBlock).toContainText("2 - 5");
    await expect(lockedHold).toContainText("12 - 15");
  });

  test("rejects swaps when the displaced appointment cannot use blocked origin slots", async ({
    page,
  }) => {
    const vipOverride = page.locator('[data-appointment-id="swap-b-vip"]');
    const focusBlock = page.locator('[data-appointment-id="swap-a-focus"]');

    await dragWithMouse(page, vipOverride, focusBlock);

    await expect(vipOverride).toContainText("2 - 4");
    await expect(focusBlock).toContainText("2 - 5");
  });

  test("places the displaced appointment in adjacent free space for unequal same-lane swaps", async ({
    page,
  }) => {
    const clientCall = page.locator('[data-appointment-id="swap-c-client"]');
    const designReview = page.locator('[data-appointment-id="swap-c-review"]');

    await dragWithMouse(page, designReview, clientCall);

    await expect(designReview).toContainText("3 - 6");
    await expect(clientCall).toContainText("6 - 8");
  });
});

test.describe("Scheduler default collision behavior", () => {
  test("keeps rejecting invalid overlaps when collisionStrategy is omitted", async ({
    page,
  }) => {
    await page.goto(
      `${STORYBOOK_URL}/iframe.html?globals=&args=&id=components-lane--default&viewMode=story`
    );
    await page.waitForLoadState("networkidle");

    const clientCall = page.locator('[data-appointment-id="call-1"]');
    const teamMeeting = page.locator('[data-appointment-id="meeting-1"]');

    await dragWithMouse(page, clientCall, teamMeeting);

    await expect(clientCall).toContainText("12 - 16");
  });
});
