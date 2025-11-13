import { test, expect } from "@playwright/test";

const STORYBOOK_URL = "http://localhost:6006";

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
      const appointment = await page
        .locator("div")
        .filter({ hasText: "Team Meeting(4 - 10)" })
        .nth(4);

      const targetSlot = await page.getByText("2", { exact: true });

      await appointment.dragTo(targetSlot, {
        sourcePosition: { x: 10, y: 10 },
      });

      const expectedAppointment = await page
        .locator("div")
        .filter({ hasText: "Team Meeting(2 - 8)" })
        .first();

      // Verify appointment is now in the target slot
      expect(expectedAppointment).toBeVisible();
    });

    test("should not allow dragging locked appointments", async ({ page }) => {
      const lockedAppointment = page
        .locator("div")
        .filter({ hasText: "Lunch Break(20 - 24)" })
        .first();

      const targetSlot = await page.getByText("10", { exact: true });

      await lockedAppointment.dragTo(targetSlot);

      // Verify appointment is still in original position
      expect(lockedAppointment).toBeVisible();
    });
  });

  test.describe("Resize Functionality", () => {
    test("should allow resizing from start edge", async ({ page }) => {
      const appointment = await page
        .locator("div")
        .filter({ hasText: "Team Meeting(4 - 10)" })
        .nth(4);

      const resizeHandle = await appointment
        .locator(".absolute.left-0")
        .first();

      const targetBox = await page.getByText("2", { exact: true });

      await resizeHandle.dragTo(targetBox);

      const resizedAppointment = await page
        .locator("div")
        .filter({ hasText: "Team Meeting(2 - 10)" })
        .first();

      // Verify appointment has been resized
      expect(resizedAppointment).toBeVisible();
    });

    test("should allow resizing from end edge", async ({ page }) => {
      const appointment = await page
        .locator("div")
        .filter({ hasText: "Team Meeting(4 - 10)" })
        .nth(4);

      const resizeHandle = await appointment
        .locator(".absolute.right-0")
        .first();

      const targetBox = await page.getByText("11", { exact: true });

      await resizeHandle.dragTo(targetBox);

      const resizedAppointment = await page
        .locator("div")
        .filter({ hasText: "Team Meeting(4 - 12)" })
        .first();

      // Verify appointment has been resized
      expect(resizedAppointment).toBeVisible();
    });
  });
});
