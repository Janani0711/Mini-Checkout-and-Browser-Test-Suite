# QuickCart — Mini Checkout System

A lightweight, functional single-page online shopping checkout website developed for the **Fynd Hiring Hackathon**.

Customers can browse two synthetic book products, manage their shopping cart with real-time recalculations, input customer details, and securely place orders with duplicate prevention.

---

## 🌟 Project Evolution & Value-Added Enhancements (Phase 1 → Phase 2)

To demonstrate iterative software engineering and quality assurance best practices, this project was developed and refined across two planned phases:

### Phase 1: Baseline MVP (Core Requirements)
- **Product & Cart Basics**: Synthetic products (`The Art of Letting Go` at ₹499 and `Think and Grow Rich` at ₹399) with full quantity increment/decrement/removal controls and automatic total calculations.
- **Initial Validation**: Standard validation using browser `alert()` pop-ups for empty cart and blank name fields.
- **Core Automation**: 3 automated Selenium browser test checks (Successful Checkout, Missing Name, Quantity Total Calculation).

### Phase 2: Professional UX & Production-Grade Improvements (Extra Features)
Rather than stopping at the baseline MVP, we introduced critical improvements to make the application production-ready:
1. **Contextual Inline Error Messages (No Annoying Alerts)**:
   - Replaced browser `alert()` pop-ups with clean, contextual inline error messages appearing directly below the affected elements (inside cart and under the customer name input).
   - Preserves user input so customers can easily correct mistakes and retry without lost progress.
2. **Immediate Button Disabling on Submission**:
   - The "Place Order" button disables immediately upon submission (`disabled = true`, distinct greyed-out styling, and `cursor: not-allowed`), preventing accidental or rapid double-clicks.
3. **Structured Unique Order Reference Generation**:
   - Implemented a production-style order reference generator:
     ```javascript
     function generateOrderRef() {
         var timestamp = Date.now();
         var random = Math.random().toString(36).substring(2, 8).toUpperCase();
         return "ORD-" + timestamp + "-" + random;
     }
     ```
   - Produces a unique, traceable order identifier (`ORD-<timestamp>-<random>`) shown in the confirmation breakdown.
4. **4th Automated Selenium Test (Duplicate Order Guard)**:
   - Added an automated test specifically testing duplicate submission prevention by verifying that rapid or repeated execution of the submission logic does not generate duplicate orders or alter order data.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure, accessible two-column layout |
| **CSS3** | Clean minimal blue/white theme, responsive cards, disabled button state |
| **Vanilla JavaScript** | State management, live recalculations, inline validation, order generator |
| **Python + Selenium** | End-to-end automated browser testing (4 automated checks) |

- **Zero External Dependencies**: Runs entirely in any modern web browser from local files (no server, database, or payment gateway required).

---

## Project Structure

```
Checkout system/
├── index.html           — Semantic page structure & templates
├── style.css            — Styling, layout & interactive states
├── script.js            — Cart state, inline validation & order logic
├── tests/
│   └── test_checkout.py — 4 automated Selenium browser tests
├── test_plan.md         — Comprehensive test plan & execution report
└── README.md            — Project documentation & setup guide
```

---

## Installation & Execution

### 1. Running the Web Application
1. Download or clone this repository.
2. Open `index.html` directly in Google Chrome or any modern browser:
   - Double-click `index.html`, OR
   - Right-click `index.html` → **Open With** → **Google Chrome**.

### 2. Running Automated Selenium Tests
Ensure Python 3.x and Google Chrome are installed:
```bash
# 1. Install Selenium
pip install selenium

# 2. Navigate to tests folder and run unittest
cd tests
python -m unittest test_checkout -v
```

---

## Application Features & Business Rules

### 1. Product Section
- Fixed synthetic products:
  - *The Art of Letting Go* — ₹499
  - *Think and Grow Rich* — ₹399
- Each product card contains the book title, formatted price, placeholder book visual, and an "Add to Cart" action.

### 2. Shopping Cart & Real-Time Calculation
- Add products, increase/decrease quantities, or remove items.
- Real-time formula enforcement:
  $$\text{Line Total} = \text{Product Price} \times \text{Quantity}$$
  $$\text{Order Total} = \sum \text{Line Totals}$$

### 3. Customer Information & Inline Validation
- Customer Name field (required).
- **Empty Cart Validation**: Highlights inline message in cart if customer tries checking out without items.
- **Missing Name Validation**: Displays clear inline red text under the name input.
- **Input Preservation**: Cart items and previously entered text remain intact during validation errors.

### 4. Order Confirmation & Duplicate Prevention
- Generates a unique reference: `ORD-<timestamp>-<random>` (e.g., `ORD-1764000123456-7K9X2P`).
- Displays summary: customer name, items purchased, quantities, line totals, and grand total.
- Clears the cart upon successful order placement.
- Button disabling combined with internal `isSubmitting` flag guarantees no duplicate orders can be created.

---

## Automated Test Suite Summary (4/4 Passed)

| # | Automated Test Case | Assertion & Validation | Result |
|---|---------------------|------------------------|--------|
| 1 | `test_successful_checkout_shows_confirmation` | Verifies confirmation section visibility, customer name, total, and `ORD-<timestamp>-<random>` reference format | ✅ Pass |
| 2 | `test_missing_name_blocks_checkout` | Verifies checkout is blocked on empty name, inline error is displayed, and button remains active for retry | ✅ Pass |
| 3 | `test_quantity_change_updates_total` | Verifies line & order total dynamically recalculate from ₹499 to ₹998 upon quantity increment | ✅ Pass |
| 4 | `test_duplicate_submission_prevented` | Verifies button disables upon submission and repeated submission invocations do not duplicate order confirmations | ✅ Pass |

---

## Manual Test Scenarios

Refer to [`test_plan.md`](test_plan.md) for full steps, expectations, and actual results for all 10 verified test cases including empty cart, double-click protection, and quantity edge cases.

---

## Acknowledgements & AI Assistance

- **AI Tools Used**: ChatGPT was used as an AI pair-programming assistant to help architect the solution, write clean beginner-friendly code, structure the Selenium automated test suite, and document test plans and verification steps.

