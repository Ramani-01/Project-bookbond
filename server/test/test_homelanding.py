from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
import time

class TestAuthFlow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        options = Options()
        options.add_argument("--window-size=1920,1080")
        # options.add_argument("--headless")  # Uncomment for headless test
        service = Service("C:\\Users\\gopal\\Downloads\\edgedriver_win64\\msedgedriver.exe")
        cls.driver = webdriver.Edge(service=service, options=options)
        cls.wait = WebDriverWait(cls.driver, 10)
        cls.url = "http://localhost:5173"

        # Test credentials
        cls.valid_email = "thejasrim27062007@gmail.com"
        cls.valid_password = "123456"
        cls.invalid_password = "wrongpassword"

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_register_user(self):
        """Test user registration"""
        print("\nRunning registration test...")
        self.driver.get(self.url)
        toggle = self.wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "form-toggle")))
        toggle.click()

        name_input = self.wait.until(EC.presence_of_element_located((By.NAME, "name")))
        name_input.send_keys("Thejasri")

        self.driver.find_element(By.NAME, "email").send_keys(self.valid_email)
        self.driver.find_element(By.NAME, "password").send_keys(self.valid_password)
        self.driver.find_element(By.NAME, "confirmPassword").send_keys(self.valid_password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        time.sleep(2)  # wait for alert
        print("✅ Registration attempted (check for duplicate or success manually)")

    def test_successful_login(self):
        """Test valid login"""
        print("\nRunning successful login test...")
        self.driver.get(self.url)

        email_field = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_field.send_keys(self.valid_email)

        password_field = self.driver.find_element(By.NAME, "password")
        password_field.send_keys(self.valid_password)

        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        try:
            self.wait.until(EC.url_contains("/genres"))
            print("✅ Login success: redirected to /genres")
        except Exception as e:
            self.driver.save_screenshot("login_failed.png")
            self.fail(f"Login did not redirect: {e}")

    def test_invalid_password(self):
        """Test login with invalid password"""
        print("\nRunning invalid password test...")
        self.driver.get(self.url)

        email_field = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_field.send_keys(self.valid_email)

        password_field = self.driver.find_element(By.NAME, "password")
        password_field.send_keys(self.invalid_password)

        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        try:
            error = self.wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "error-message")))
            self.assertIn("Invalid credentials", error.text)
            print("✅ Invalid login test passed")
        except Exception as e:
            self.driver.save_screenshot("invalid_login_error.png")
            self.fail(f"No error message shown for invalid login: {e}")

    def test_logout_functionality(self):
        """Test logout button after successful login"""
        print("\nRunning logout test...")
        self.driver.get(self.url)

        email_field = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_field.send_keys(self.valid_email)
        self.driver.find_element(By.NAME, "password").send_keys(self.valid_password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        self.wait.until(EC.url_contains("/genres"))

        logout_btn = self.wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "logout-button")))
        logout_btn.click()

        try:
            self.wait.until(EC.url_contains("/login"))
            print("✅ Logout test passed")
        except Exception as e:
            self.driver.save_screenshot("logout_failed.png")
            self.fail(f"Logout did not redirect to login page: {e}")


if __name__ == "__main__":
    unittest.main()
