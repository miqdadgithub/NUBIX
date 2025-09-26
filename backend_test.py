import requests
import sys
from datetime import datetime
import json

class NubixAPITester:
    def __init__(self, base_url="https://quickstart-app-5.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:300]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_login(self, email, password):
        """Test login and get token"""
        success, response = self.run_test(
            "Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True, response.get('user', {})
        return False, {}

    def test_user_profile(self):
        """Test user profile endpoint"""
        return self.run_test("Get User Profile", "GET", "api/user/profile", 200)

    def test_markets_list(self):
        """Test markets list endpoint"""
        return self.run_test("Markets List", "GET", "api/markets/list?limit=10", 200)

    def test_crypto_prices(self):
        """Test crypto prices endpoint"""
        return self.run_test("Crypto Prices", "GET", "api/crypto/prices", 200)

    def test_quote_request(self):
        """Test quote request"""
        return self.run_test(
            "Quote Request",
            "POST",
            "api/orders/quote",
            200,
            data={"symbol": "BTC", "amountUSD": 50}
        )

    def test_create_order(self, quote_id):
        """Test order creation"""
        return self.run_test(
            "Create Order",
            "POST",
            "api/orders/create",
            200,
            data={"quoteId": quote_id, "paymentMethod": "bank_transfer"}
        )

    def test_confirm_payment(self, order_id):
        """Test payment confirmation"""
        return self.run_test(
            "Confirm Payment",
            "POST",
            "api/orders/confirm-payment",
            200,
            data={"orderId": order_id, "reference": f"TEST-{order_id[:8]}"}
        )

    def test_inbox_threads(self):
        """Test inbox threads"""
        return self.run_test("Inbox Threads", "GET", "api/inbox/threads", 200)

    def test_create_thread(self):
        """Test create inbox thread"""
        return self.run_test(
            "Create Thread",
            "POST",
            "api/inbox/threads",
            200,
            data={"subject": "Test Support Request", "category": "Payment"},
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )

def main():
    print("🚀 Starting Nubix API Testing...")
    print("=" * 50)
    
    # Setup
    tester = NubixAPITester()
    
    # Test 1: Health Check
    print("\n📋 BASIC CONNECTIVITY TESTS")
    print("-" * 30)
    tester.test_health()
    
    # Test 2: Authentication
    print("\n🔐 AUTHENTICATION TESTS")
    print("-" * 30)
    login_success, user_data = tester.test_login("test@nubix.com", "123456")
    if not login_success:
        print("❌ Login failed - cannot proceed with authenticated tests")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1
    
    # Test 3: User Profile
    tester.test_user_profile()
    
    # Test 4: Markets & Prices
    print("\n📈 MARKETS & PRICING TESTS")
    print("-" * 30)
    tester.test_markets_list()
    tester.test_crypto_prices()
    
    # Test 5: Order Flow
    print("\n💰 ORDER FLOW TESTS")
    print("-" * 30)
    quote_success, quote_data = tester.test_quote_request()
    
    if quote_success and 'quote' in quote_data:
        quote_id = quote_data['quote']['id']
        order_success, order_data = tester.test_create_order(quote_id)
        
        if order_success and 'order' in order_data:
            order_id = order_data['order']['id']
            tester.test_confirm_payment(order_id)
    
    # Test 6: Inbox
    print("\n📬 INBOX TESTS")
    print("-" * 30)
    tester.test_inbox_threads()
    # Note: Create thread test might need form data format
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Expected {failure.get('expected')}, got {failure.get('actual')}")
            print(f"   • {failure['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())