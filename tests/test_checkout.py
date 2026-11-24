"""
QuickCart — Automated Browser Tests (Selenium + Python)

Four test cases for the Fynd Hiring Hackathon:
  1. Successful checkout produces a confirmation with order reference
  2. Missing name field blocks checkout (inline error message)
  3. Quantity change updates the exact total
  4. Duplicate submission does not produce a second confirmation

Requirements:
  pip install selenium
  Chrome browser + chromedriver in PATH
"""

import unittest
import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestCheckout(unittest.TestCase):
    """Browser tests for the QuickCart checkout page."""

    def setUp(self):
        """Start a fresh Chrome browser and load the page before each test."""
        self.driver = webdriver.Chrome()
        # Build the file:// URL to our index.html
        file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "index.html")
        )
        self.driver.get("file:///" + file_path.replace("\\", "/"))

    def tearDown(self):
        """Close the browser after each test."""
        self.driver.quit()

    # ------------------------------------------------------------------
    # TEST 1: Successful checkout shows confirmation with order reference
    # ------------------------------------------------------------------
    def test_successful_checkout_shows_confirmation(self):
        """
        Add a product, enter a name, place the order.
        The confirmation section should appear with the customer's name
        and a unique order reference number (ORD-XXXXXX format).
        """
        driver = self.driver

        # Click "Add to Cart" on the first product
        add_buttons = driver.find_elements(By.CSS_SELECTOR, ".btn-add")
        add_buttons[0].click()

        # Enter customer name
        name_input = driver.find_element(By.ID, "customer-name")
        name_input.send_keys("Test User")

        # Click Place Order
        driver.find_element(By.ID, "place-order-btn").click()

        # Confirmation section should now be visible
        confirmation = driver.find_element(By.ID, "confirmation-section")
        self.assertTrue(
            confirmation.is_displayed(),
            "Confirmation section should be visible after a successful order"
        )

        # Customer name should appear in the confirmation
        conf_name = driver.find_element(By.ID, "conf-name").text
        self.assertEqual(conf_name, "Test User")

        # Confirmation total should equal the product price (₹499 × 1)
        conf_total = driver.find_element(By.ID, "conf-total").text
        self.assertEqual(conf_total, "499")

        # Order reference should be present and match ORD-<timestamp>-<random> format
        conf_ref = driver.find_element(By.ID, "conf-ref").text
        self.assertTrue(
            conf_ref.startswith("ORD-") and len(conf_ref.split("-")) == 3,
            "Order reference should be in ORD-<timestamp>-<random> format, got: " + conf_ref
        )

    # ------------------------------------------------------------------
    # TEST 2: Missing name blocks checkout (inline error)
    # ------------------------------------------------------------------
    def test_missing_name_blocks_checkout(self):
        """
        Add a product but leave the name empty. Place the order.
        An inline error message should appear and confirmation should NOT show.
        """
        driver = self.driver

        # Add a product to the cart
        add_buttons = driver.find_elements(By.CSS_SELECTOR, ".btn-add")
        add_buttons[0].click()

        # Leave name field empty and click Place Order
        driver.find_element(By.ID, "place-order-btn").click()

        # Inline error message should appear near the name field
        name_error = driver.find_element(By.ID, "name-error").text
        self.assertTrue(
            len(name_error) > 0,
            "An inline error message should appear when name is missing"
        )
        self.assertIn("name", name_error.lower(),
                      "Error message should mention the missing name")

        # Confirmation section should still be hidden
        confirmation = driver.find_element(By.ID, "confirmation-section")
        self.assertFalse(
            confirmation.is_displayed(),
            "Confirmation should NOT be visible when name is missing"
        )

        # Place Order button should NOT be disabled (user can retry)
        order_btn = driver.find_element(By.ID, "place-order-btn")
        self.assertFalse(
            order_btn.get_attribute("disabled"),
            "Button should remain enabled after validation failure"
        )

    # ------------------------------------------------------------------
    # TEST 3: Quantity change updates the exact total
    # ------------------------------------------------------------------
    def test_quantity_change_updates_total(self):
        """
        Add a product (₹499), verify total is 499.
        Increase quantity to 2, verify total is 998.
        """
        driver = self.driver

        # Add first product (₹499)
        add_buttons = driver.find_elements(By.CSS_SELECTOR, ".btn-add")
        add_buttons[0].click()

        # Order total should be 499
        total = driver.find_element(By.ID, "total-amount").text
        self.assertEqual(
            total, "499",
            "Total should be 499 after adding one item at ₹499"
        )

        # Click the "+" button to increase quantity to 2
        increase_btn = driver.find_element(
            By.CSS_SELECTOR, '.btn-increase[data-id="1"]'
        )
        increase_btn.click()

        # Order total should now be 998 (499 × 2)
        total = driver.find_element(By.ID, "total-amount").text
        self.assertEqual(
            total, "998",
            "Total should be 998 after increasing quantity to 2"
        )

    # ------------------------------------------------------------------
    # TEST 4: Duplicate submission does not produce a second confirmation
    # ------------------------------------------------------------------
    def test_duplicate_submission_prevented(self):
        """
        Place an order successfully, then try calling placeOrder() again.
        The confirmation should remain unchanged — no second order generated.
        The Place Order button should be disabled after the first order.
        """
        driver = self.driver

        # Add first product to cart
        add_buttons = driver.find_elements(By.CSS_SELECTOR, ".btn-add")
        add_buttons[0].click()

        # Enter customer name
        name_input = driver.find_element(By.ID, "customer-name")
        name_input.send_keys("Test User")

        # Click Place Order — first submission
        driver.find_element(By.ID, "place-order-btn").click()

        # Confirm the order was placed
        confirmation = driver.find_element(By.ID, "confirmation-section")
        self.assertTrue(confirmation.is_displayed())

        # Verify button is now disabled
        order_btn = driver.find_element(By.ID, "place-order-btn")
        self.assertTrue(
            order_btn.get_attribute("disabled"),
            "Button should be disabled after successful order"
        )

        # Capture the confirmation content after the first order
        first_conf_name = driver.find_element(By.ID, "conf-name").text
        first_conf_total = driver.find_element(By.ID, "conf-total").text
        first_conf_ref = driver.find_element(By.ID, "conf-ref").text
        first_conf_items_html = driver.find_element(By.ID, "conf-items").get_attribute("innerHTML")

        # Try to submit again by calling placeOrder() directly via JavaScript
        driver.execute_script("placeOrder()")

        # The confirmation content should be exactly the same (no second order)
        second_conf_name = driver.find_element(By.ID, "conf-name").text
        second_conf_total = driver.find_element(By.ID, "conf-total").text
        second_conf_ref = driver.find_element(By.ID, "conf-ref").text
        second_conf_items_html = driver.find_element(By.ID, "conf-items").get_attribute("innerHTML")

        self.assertEqual(first_conf_name, second_conf_name,
                         "Customer name should not change after duplicate submission")
        self.assertEqual(first_conf_total, second_conf_total,
                         "Order total should not change after duplicate submission")
        self.assertEqual(first_conf_ref, second_conf_ref,
                         "Order reference should not change after duplicate submission")
        self.assertEqual(first_conf_items_html, second_conf_items_html,
                         "Order items should not change after duplicate submission")


if __name__ == "__main__":
    unittest.main()
