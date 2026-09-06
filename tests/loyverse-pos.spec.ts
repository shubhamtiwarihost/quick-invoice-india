import { test, expect } from "@playwright/test";

test.describe("Loyverse POS UX Flow Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth API for offline/dev test environment
    await page.route("**/api/auth.php*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "success",
          user: {
            id: "usr_test_123",
            businessName: "Sharma Kirana Store",
            ownerName: "Ramesh Sharma",
            email: "store@example.com",
            phone: "9876543210",
            storeType: "Kirana",
            cashierPin: "1234",
            address: "Shop 12, Main Market, Jaipur",
            gstin: "08ABCDE1234F1Z5",
            upiId: "sharma@upi",
          },
        }),
      });
    });

    await page.route("**/api/track.php*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "success" }),
      });
    });

    // Seed authenticated merchant session
    await page.addInitScript(() => {
      localStorage.setItem("swiftgst_auth_token", "test-token-playwright");
      localStorage.setItem(
        "swiftgst_auth_user",
        JSON.stringify({
          id: "usr_test_123",
          businessName: "Sharma Kirana Store",
          ownerName: "Ramesh Sharma",
          email: "store@example.com",
          phone: "9876543210",
          storeType: "Kirana",
          cashierPin: "1234",
          address: "Shop 12, Main Market, Jaipur",
          gstin: "08ABCDE1234F1Z5",
          upiId: "sharma@upi",
        })
      );
      localStorage.setItem("swiftgst_auth_locked", "false");
    });

    // Navigate to POS counter with test seed enabled
    await page.goto("/pos?testSeed=true");
    await page.waitForLoadState("domcontentloaded");

    // Ensure product catalog has loaded and product cards are rendered
    await expect(page.getByTestId("product-card").first()).toBeVisible({ timeout: 10000 });
  });

  test("Test 1: Rapid Tap Increment - tapping product card twice increments quantity to 2", async ({ page }) => {
    const firstProduct = page.getByTestId("product-card").first();
    await expect(firstProduct).toBeVisible();

    // Tap once -> adds to cart with Qty 1
    await firstProduct.click();
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
    await expect(page.getByTestId("cart-item-qty")).toHaveText("1");

    // Tap again -> increments Qty to 2
    await firstProduct.click();
    await expect(page.getByTestId("cart-item-qty")).toHaveText("2");
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
  });

  test("Test 2: Cart Item Modifier - opens sheet with numeric keypad, discounts, and delete action", async ({ page }) => {
    // Add item to cart
    await page.getByTestId("product-card").first().click();
    await expect(page.getByTestId("cart-item")).toBeVisible();

    // Click cart item row to trigger modifier sheet
    await page.getByTestId("cart-item").first().click();

    // Verify modifier sheet is open
    const modifierSheet = page.getByTestId("modifier-sheet");
    await expect(modifierSheet).toBeVisible();

    // Verify quantity override / numeric keypad controls
    await expect(modifierSheet.getByText("Quantity", { exact: false })).toBeVisible();
    await expect(modifierSheet.getByText("C", { exact: true })).toBeVisible();
    await expect(modifierSheet.getByTestId("keypad-backspace")).toBeVisible();

    // Verify discount toggle and preset chips
    await expect(modifierSheet.getByText("% Percent", { exact: false })).toBeVisible();
    await expect(modifierSheet.getByText("₹ Flat Amount", { exact: false })).toBeVisible();

    // Verify delete action exists
    await expect(page.getByTestId("modifier-delete-button")).toBeVisible();

    // Test delete action from modifier
    await page.getByTestId("modifier-delete-button").click();
    await expect(modifierSheet).not.toBeVisible();
    await expect(page.getByText("Cart is Empty")).toBeVisible();
  });

  test("Test 3: Open Tickets / Hold Bill - holds cart and restores parked items", async ({ page }) => {
    // Add product to cart
    await page.getByTestId("product-card").first().click();
    await expect(page.getByTestId("cart-item")).toBeVisible();

    // Click Hold Bill
    const holdBtn = page.getByTestId("hold-bill-button");
    await expect(holdBtn).toBeEnabled();
    await holdBtn.click();

    // Enter ticket reference name in modal
    const ticketInput = page.getByTestId("hold-ticket-name-input");
    await expect(ticketInput).toBeVisible();
    await ticketInput.fill("Table 4 - Sharma");

    // Confirm Hold
    await page.getByTestId("confirm-hold-button").click();

    // Verify cart is now empty and ticket counter incremented
    await expect(page.getByText("Cart is Empty")).toBeVisible();
    const openTicketsBtn = page.getByTestId("open-tickets-button");
    await expect(openTicketsBtn).toContainText("1");

    // Open tickets modal to inspect parked bill
    await openTicketsBtn.click();
    await expect(page.getByText("Table 4 - Sharma", { exact: true })).toBeVisible();

    // Click Restore button
    const restoreBtn = page.getByTestId("restore-ticket-button").first();
    await expect(restoreBtn).toBeVisible();
    await restoreBtn.click();

    // Verify items are restored into cart and tickets counter decrements to 0
    await expect(page.getByTestId("cart-item")).toBeVisible();
    await expect(openTicketsBtn).toContainText("0");
  });

  test("Test 4: CHARGE Button & Cash Tender Calculator - displays CHARGE CTA and real-time Change Due", async ({ page }) => {
    // Add product to cart
    await page.getByTestId("product-card").first().click();
    await expect(page.getByTestId("cart-item")).toBeVisible();

    // Verify primary checkout button displays 'CHARGE ₹'
    const chargeBtn = page.getByTestId("charge-button");
    await expect(chargeBtn).toBeVisible();
    await expect(chargeBtn).toContainText("CHARGE ₹");

    // Extract grand total amount from button text
    const btnText = await chargeBtn.innerText();
    const match = btnText.match(/₹\s*([0-9.]+)/);
    const grandTotal = match ? parseFloat(match[1]) : 65;

    // Open payment checkout modal
    await chargeBtn.click();
    await expect(page.getByTestId("checkout-charge-button")).toBeVisible();

    // Set cash tender amount higher than grand total
    const cashTendered = grandTotal + 135;
    const expectedChange = (cashTendered - grandTotal).toFixed(2);

    const cashInput = page.getByTestId("cash-tender-input");
    await cashInput.fill(String(cashTendered));

    // Verify Change Due card displays exact calculated refund amount
    const changeDueEl = page.getByTestId("change-due-amount");
    await expect(changeDueEl).toBeVisible();
    await expect(changeDueEl).toContainText(`₹${expectedChange}`);
  });

  test("Test 5: Post-Sale & New Sale Reset - presents Print, WhatsApp, New Sale options and resets cleanly", async ({ page }) => {
    // Add item to cart
    await page.getByTestId("product-card").first().click();
    await expect(page.getByTestId("cart-item")).toBeVisible();

    // Open checkout
    await page.getByTestId("charge-button").click();
    const completeSaleBtn = page.getByTestId("checkout-charge-button");
    await expect(completeSaleBtn).toBeVisible();

    // Complete payment
    await completeSaleBtn.click();

    // Verify Post-Payment Success Screen appears
    const successModal = page.getByTestId("success-modal");
    await expect(successModal).toBeVisible({ timeout: 8000 });
    await expect(successModal.getByText("Payment Successful!")).toBeVisible();

    // Verify 3 prominent options: Print, WhatsApp, and New Sale
    await expect(page.getByTestId("print-receipt-button")).toBeVisible();
    await expect(page.getByTestId("whatsapp-bill-button")).toBeVisible();
    const newSaleBtn = page.getByTestId("new-sale-button");
    await expect(newSaleBtn).toBeVisible();

    // Click New Sale
    await newSaleBtn.click();

    // Verify workspace resets cleanly: modal closes and cart is empty
    await expect(successModal).not.toBeVisible();
    await expect(page.getByText("Cart is Empty")).toBeVisible();
  });
});
