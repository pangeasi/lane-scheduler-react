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

test.describe("Lane Component - Interactive Features", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to interactive story
    await page.goto(
      `${STORYBOOK_URL}/iframe.html?globals=&args=&id=components-lane--default&viewMode=story`
    );
    await page.waitForLoadState("networkidle");
  });

  test.describe("Drag and Drop", () => {
    test("should allow dragging an appointment within the same lane", async ({
      page,
    }) => {
      // Get the first appointment
      const appointment = page.locator('[data-appointment-id="meeting-1"]');

      const targetSlot = await page.getByText("2", { exact: true });

      await dragWithMouse(page, appointment, targetSlot);

      // Verify appointment is now in the target slot
      await expect(appointment).toContainText("2 - 8");
    });

    test("should not allow dragging locked appointments", async ({ page }) => {
      const lockedAppointment = page.locator(
        '[data-appointment-id="lunch-1"]'
      );

      const targetSlot = await page.getByText("10", { exact: true });

      await dragWithMouse(page, lockedAppointment, targetSlot);

      // Verify appointment is still in original position
      await expect(lockedAppointment).toContainText("20 - 24");
    });
  });

  test.describe("Resize Functionality", () => {
    test("should allow resizing from start edge", async ({ page }) => {
      const appointment = page.locator('[data-appointment-id="meeting-1"]');

      const resizeHandle = await appointment
        .locator(".absolute.left-0")
        .first();

      const targetBox = await page.getByText("2", { exact: true });

      await dragWithMouse(page, resizeHandle, targetBox, { x: 5, y: 10 });

      // Verify appointment has been resized
      await expect(appointment).toContainText("2 - 10");
    });

    test("should allow resizing from end edge", async ({ page }) => {
      const appointment = page.locator('[data-appointment-id="meeting-1"]');

      const resizeHandle = await appointment
        .locator(".absolute.right-0")
        .first();

      const targetBox = await page.getByText("11", { exact: true });

      await dragWithMouse(
        page,
        resizeHandle,
        targetBox,
        { x: 5, y: 10 },
        { x: 56, y: 10 }
      );

      // Verify appointment has been resized
      await expect(appointment).toContainText("4 - 12");
    });
  });
});
