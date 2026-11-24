# QuickCart – Mini Checkout System

## Project Overview

QuickCart is a simple, single-page online shopping checkout application developed for the **Fynd Hiring Hackathon**.

The application allows customers to browse two products, add items to a shopping cart, manage quantities, calculate the order total and complete checkout by entering their name.

It also handles common checkout errors and prevents duplicate order submissions. Automated browser testing is implemented using Python and Selenium to verify the main checkout functionalities.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the webpage |
| CSS3 | Layout, styling and responsive design |
| JavaScript | Cart management, calculations and validation |
| Python | Automated test scripts |
| Selenium WebDriver | Browser automation and testing |
| unittest | Execution of automated test cases |

The application does not require a backend, database or payment gateway. It runs locally in a web browser.

## Project Structure

```text
Checkout system/
│
├── index.html
├── style.css
├── script.js
│
├── tests/
│   └── test_checkout.py
│
├── README.md
└── test_plan.md
```

## Installation and Setup

### Prerequisites

- Python 3.x
- Google Chrome
- Visual Studio Code (recommended)

### Running the Application

1. Download or clone the project repository.
2. Open the project folder.
3. Locate `index.html`.
4. Double-click the file or open it using Google Chrome.

### Setting Up Automated Tests

Install Selenium using the following command:

```bash
pip install selenium
```

### Running the Tests

Open the terminal inside the project folder and execute:

```bash
cd tests
python -m unittest test_checkout -v
```

Selenium WebDriver will launch Chrome and execute the automated test cases.

## Application Features

### 1. Product Listing

The application contains two products with fixed prices:

| Product | Price |
|---|---:|
| The Art of Letting Go | ₹499 |
| Think and Grow Rich | ₹399 |

Each product is displayed with its name, price and an Add to Cart button.

### 2. Shopping Cart Management

Customers can:

- Add products to the shopping cart.
- Increase or decrease product quantities.
- Remove products from the cart.
- View individual product totals.
- View the updated order total.

All calculations are updated automatically whenever the cart changes.

**Calculation formulas:**

Line Total = Product Price × Quantity

Order Total = Sum of All Line Totals

### 3. Customer Details and Validation

The checkout section includes a required Customer Name field.

The application handles the following situations:

- Empty cart: Checkout is prevented when no products have been added.
- Missing customer name: Checkout is prevented when the name field is left blank.
- Error messages: Relevant validation messages are displayed directly on the webpage.
- Input preservation: Existing cart items and customer information are retained when validation fails.

### 4. Order Confirmation

After successful checkout, the application:

- Displays an order confirmation message.
- Generates a unique order reference.
- Displays the customer's name.
- Shows the purchased products and quantities.
- Displays the final order total.
- Clears the shopping cart.

The order reference follows this format:

`ORD-<timestamp>-<random>`

Example: `ORD-1764000123456-7K9X2P`

### 5. Duplicate Order Prevention

The application uses a JavaScript submission-state variable (`isSubmitting`) to prevent the same checkout from being processed multiple times.

The Place Order button is also disabled after a successful submission to prevent accidental repeated clicks.

## Automated Browser Testing

The project includes four automated test cases developed using Python, Selenium WebDriver and unittest.

| No. | Test Case | Expected Result |
|---|---|---|
| 1 | Successful checkout | Order confirmation appears with customer details, total and reference number. |
| 2 | Missing name validation | Checkout is blocked and an appropriate error message appears. |
| 3 | Quantity calculation | Order total updates correctly when product quantity changes. |
| 4 | Duplicate submission prevention | Repeated submission does not generate another order confirmation. |

Each test starts with a fresh browser session to ensure independent execution.

## Manual Testing

Additional manual testing is performed to verify the customer checkout journey.

The test scenarios include:

- Attempting checkout with an empty cart.
- Attempting checkout without entering a customer name.
- Adding and removing products.
- Increasing and decreasing quantities.
- Verifying individual product totals.
- Checking the overall order total.
- Completing a successful checkout.
- Checking the generated order reference.
- Testing rapid repeated clicks on Place Order.

Refer to `test_plan.md` for the detailed test steps, expected results and actual observations.

## Test Results

The automated test execution results and manual testing observations are documented in `test_plan.md`.

The test results should reflect the actual output obtained during execution.

## Conclusion

QuickCart demonstrates the basic functionality of an online checkout system, including product selection, shopping cart management, accurate calculations, input validation and order confirmation.

The project also uses Selenium-based browser automation to verify important checkout scenarios and improve application reliability.

## AI Assistance

ChatGPT was used as an AI pair-programming assistant during development to understand implementation approaches, improve code structure, prepare automated test cases and organize project documentation. The application was tested locally using the browser and Python-based automated tests.