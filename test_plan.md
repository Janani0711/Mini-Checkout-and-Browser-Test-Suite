# QuickCart — Test Plan

## Automated Browser Tests (Selenium)

| # | Test Case | Automated? | Expected Result |
|---|-----------|-----------|-----------------|
| 1 | Successful checkout shows confirmation | ✅ Yes | Confirmation section visible with customer name, items, correct total, and unique order reference (`ORD-<timestamp>-<random>`) |
| 2 | Missing name blocks checkout | ✅ Yes | Inline error message appears under name input, checkout blocked, confirmation stays hidden, button remains enabled |
| 3 | Quantity change updates total | ✅ Yes | Total updates accurately from ₹499 to ₹998 when quantity goes from 1 to 2 |
| 4 | Duplicate submission prevented | ✅ Yes | Button is disabled after order placement; invoking submission again does not generate duplicate confirmation or alter order details |

### How to Run Automated Tests
```bash
pip install selenium
cd tests
python -m unittest test_checkout -v
```

---

## Manual Test Cases

| # | Test Case | Steps | Expected Result | Actual Result | Pass/Fail |
|---|-----------|-------|-----------------|---------------|-----------|
| 1 | Empty cart checkout | Click "Place Order" with no items in cart | Inline error: "Your cart is empty. Please add items before placing an order." | Inline error displayed near cart | ✅ Pass |
| 2 | Missing name checkout | Add an item → leave name blank → click "Place Order" | Inline error: "Please enter your name to place an order." Customer input preserved. | Inline error displayed under name field; cart/form state preserved | ✅ Pass |
| 3 | Successful checkout | Add items → enter name → click "Place Order" | Confirmation section appears with unique order reference (`ORD-<timestamp>-<random>`), customer name, items list, and total | Confirmation displayed with reference ID and order breakdown | ✅ Pass |
| 4 | Button disabled & rapid click protection | Add item → enter name → click "Place Order" | "Place Order" button disables immediately upon click, preventing duplicate orders | Button disabled immediately; only 1 order confirmation generated | ✅ Pass |
| 5 | Add to cart | Click "Add to Cart" on each product | Product appears in cart with quantity 1 | Both products added correctly | ✅ Pass |
| 6 | Increase quantity | Click "+" button on a cart item | Quantity increases by 1, line total updates | Quantity and line total updated | ✅ Pass |
| 7 | Decrease quantity | Click "−" button when quantity > 1 | Quantity decreases by 1, line total updates | Quantity and line total updated | ✅ Pass |
| 8 | Decrease to zero | Click "−" button when quantity = 1 | Item removed from cart entirely | Item removed, total recalculated | ✅ Pass |
| 9 | Remove from cart | Click "✕" remove button on a cart item | Item removed, order total recalculated | Item removed correctly | ✅ Pass |
| 10 | Total calculation accuracy | Add "The Art of Letting Go" ×2 (₹998) + "Think and Grow Rich" ×1 (₹399) | Order Total = ₹1397 (accurate line totals and sum) | Total displayed accurately as ₹1397 | ✅ Pass |

---

## Defects Found & Verification

No defects found during testing. All validations, edge cases, calculations, and UI states behaved according to specification.

---

## Test Environment

- **Browser:** Google Chrome (latest)
- **Framework:** Python `unittest` + Selenium WebDriver 4.x
- **OS:** Windows
- **Test Execution:** All 4 automated checks passing; manual verification passed
