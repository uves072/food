#!/usr/bin/env python3
"""
Comprehensive backend API tests for Food Ordering System
Tests all endpoints with realistic food ordering data
"""

import requests
import json
import uuid
from datetime import datetime
import base64

# Configuration
BACKEND_URL = "https://food-queue-sys.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

# Test results storage
test_results = []

def log_test(test_name, status, details=""):
    """Log test results"""
    result = {
        "test": test_name,
        "status": status,
        "details": details,
        "timestamp": datetime.now().isoformat()
    }
    test_results.append(result)
    status_icon = "✅" if status == "PASS" else "❌"
    print(f"{status_icon} {test_name}: {status}")
    if details:
        print(f"   Details: {details}")

def generate_sample_image():
    """Generate a sample base64 encoded image for testing"""
    # Simple 1x1 pixel PNG image in base64
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

def test_health_check():
    """Test health check endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "status" in data and data["status"] == "healthy":
                log_test("Health Check", "PASS", f"Status: {data['status']}")
                return True
            else:
                log_test("Health Check", "FAIL", f"Invalid response: {data}")
                return False
        else:
            log_test("Health Check", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("Health Check", "FAIL", f"Exception: {str(e)}")
        return False

def test_root_endpoint():
    """Test root API endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "Food Ordering System API" in data["message"]:
                log_test("Root Endpoint", "PASS", f"Message: {data['message']}")
                return True
            else:
                log_test("Root Endpoint", "FAIL", f"Invalid response: {data}")
                return False
        else:
            log_test("Root Endpoint", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("Root Endpoint", "FAIL", f"Exception: {str(e)}")
        return False

def test_admin_login():
    """Test admin login with existing credentials"""
    try:
        login_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        response = requests.post(f"{BACKEND_URL}/admin/login", json=login_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "username" in data and "token" in data:
                log_test("Admin Login", "PASS", f"Username: {data['username']}, Token received")
                return True, data["token"]
            else:
                log_test("Admin Login", "FAIL", f"Missing username or token in response: {data}")
                return False, None
        elif response.status_code == 401:
            log_test("Admin Login", "FAIL", "Admin credentials not found - need to register admin first")
            return False, None
        else:
            log_test("Admin Login", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
            return False, None
    except Exception as e:
        log_test("Admin Login", "FAIL", f"Exception: {str(e)}")
        return False, None

def test_admin_register():
    """Register admin if login fails"""
    try:
        register_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        response = requests.post(f"{BACKEND_URL}/admin/register", json=register_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "username" in data and "token" in data:
                log_test("Admin Registration", "PASS", f"Username: {data['username']}, Token received")
                return True, data["token"]
            else:
                log_test("Admin Registration", "FAIL", f"Missing username or token in response: {data}")
                return False, None
        elif response.status_code == 400:
            log_test("Admin Registration", "INFO", "Admin already exists - this is expected")
            return True, None
        else:
            log_test("Admin Registration", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
            return False, None
    except Exception as e:
        log_test("Admin Registration", "FAIL", f"Exception: {str(e)}")
        return False, None

def test_menu_operations():
    """Test all menu CRUD operations"""
    menu_item_id = None
    
    # 1. Test GET menu (should work even if empty)
    try:
        response = requests.get(f"{BACKEND_URL}/menu", timeout=10)
        if response.status_code == 200:
            menu_items = response.json()
            log_test("Get Menu Items", "PASS", f"Retrieved {len(menu_items)} menu items")
        else:
            log_test("Get Menu Items", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("Get Menu Items", "FAIL", f"Exception: {str(e)}")
        return False
    
    # 2. Test GET categories
    try:
        response = requests.get(f"{BACKEND_URL}/menu/categories", timeout=10)
        if response.status_code == 200:
            categories_data = response.json()
            if "categories" in categories_data:
                categories = categories_data["categories"]
                log_test("Get Menu Categories", "PASS", f"Retrieved categories: {categories}")
            else:
                log_test("Get Menu Categories", "FAIL", f"No 'categories' key in response: {categories_data}")
                return False
        else:
            log_test("Get Menu Categories", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("Get Menu Categories", "FAIL", f"Exception: {str(e)}")
        return False
    
    # 3. Test POST menu item (create)
    try:
        new_menu_item = {
            "name": "Margherita Pizza",
            "description": "Classic pizza with fresh tomatoes, mozzarella cheese, and basil",
            "price": 12.99,
            "category": "Pizza",
            "image": generate_sample_image(),
            "available": True
        }
        response = requests.post(f"{BACKEND_URL}/menu", json=new_menu_item, timeout=10)
        
        if response.status_code == 200:
            created_item = response.json()
            if "id" in created_item and "name" in created_item:
                menu_item_id = created_item["id"]
                log_test("Create Menu Item", "PASS", f"Created item: {created_item['name']} (ID: {menu_item_id})")
            else:
                log_test("Create Menu Item", "FAIL", f"Missing id or name in response: {created_item}")
                return False
        else:
            log_test("Create Menu Item", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("Create Menu Item", "FAIL", f"Exception: {str(e)}")
        return False
    
    # 4. Test PUT menu item (update) - only if we have an ID
    if menu_item_id:
        try:
            update_data = {
                "price": 14.99,
                "description": "Classic pizza with fresh tomatoes, premium mozzarella cheese, and fresh basil"
            }
            response = requests.put(f"{BACKEND_URL}/menu/{menu_item_id}", json=update_data, timeout=10)
            
            if response.status_code == 200:
                updated_item = response.json()
                if updated_item["price"] == 14.99:
                    log_test("Update Menu Item", "PASS", f"Updated price to ${updated_item['price']}")
                else:
                    log_test("Update Menu Item", "FAIL", f"Price not updated correctly: {updated_item['price']}")
                    return False
            else:
                log_test("Update Menu Item", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            log_test("Update Menu Item", "FAIL", f"Exception: {str(e)}")
            return False
    
    # 5. Test DELETE menu item - only if we have an ID
    if menu_item_id:
        try:
            response = requests.delete(f"{BACKEND_URL}/menu/{menu_item_id}", timeout=10)
            
            if response.status_code == 200:
                delete_response = response.json()
                if "message" in delete_response:
                    log_test("Delete Menu Item", "PASS", f"Message: {delete_response['message']}")
                else:
                    log_test("Delete Menu Item", "FAIL", f"No message in response: {delete_response}")
                    return False
            else:
                log_test("Delete Menu Item", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            log_test("Delete Menu Item", "FAIL", f"Exception: {str(e)}")
            return False
    
    return True

def test_order_operations():
    """Test order creation, retrieval, and status updates"""
    order_id = None
    
    # First, create a sample menu item for the order
    sample_menu_item = {
        "name": "Chicken Burger",
        "description": "Grilled chicken breast with lettuce and tomato",
        "price": 8.99,
        "category": "Burgers",
        "image": generate_sample_image(),
        "available": True
    }
    
    # Create menu item for order test
    try:
        response = requests.post(f"{BACKEND_URL}/menu", json=sample_menu_item, timeout=10)
        if response.status_code == 200:
            menu_item = response.json()
            menu_item_id = menu_item["id"]
        else:
            log_test("Create Sample Menu Item for Order", "FAIL", f"Could not create menu item for order test")
            return False
    except Exception as e:
        log_test("Create Sample Menu Item for Order", "FAIL", f"Exception: {str(e)}")
        return False
    
    # 1. Test POST order (create)
    try:
        new_order = {
            "items": [
                {
                    "menu_item_id": menu_item_id,
                    "name": "Chicken Burger",
                    "price": 8.99,
                    "quantity": 2,
                    "image": generate_sample_image()
                },
                {
                    "menu_item_id": menu_item_id,
                    "name": "French Fries",
                    "price": 3.99,
                    "quantity": 1,
                    "image": generate_sample_image()
                }
            ],
            "total": 21.97,
            "table_number": "Table 5",
            "notes": "Extra sauce please"
        }
        
        response = requests.post(f"{BACKEND_URL}/orders", json=new_order, timeout=10)
        
        if response.status_code == 200:
            created_order = response.json()
            if "id" in created_order and "status" in created_order:
                order_id = created_order["id"]
                log_test("Create Order", "PASS", f"Created order ID: {order_id}, Status: {created_order['status']}")
            else:
                log_test("Create Order", "FAIL", f"Missing id or status in response: {created_order}")
                return False
        else:
            log_test("Create Order", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("Create Order", "FAIL", f"Exception: {str(e)}")
        return False
    
    # 2. Test GET all orders
    try:
        response = requests.get(f"{BACKEND_URL}/orders", timeout=10)
        if response.status_code == 200:
            orders = response.json()
            log_test("Get All Orders", "PASS", f"Retrieved {len(orders)} orders")
        else:
            log_test("Get All Orders", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("Get All Orders", "FAIL", f"Exception: {str(e)}")
        return False
    
    # 3. Test GET specific order
    if order_id:
        try:
            response = requests.get(f"{BACKEND_URL}/orders/{order_id}", timeout=10)
            if response.status_code == 200:
                order = response.json()
                if order["id"] == order_id:
                    log_test("Get Specific Order", "PASS", f"Retrieved order: {order['id']}")
                else:
                    log_test("Get Specific Order", "FAIL", f"Order ID mismatch: expected {order_id}, got {order['id']}")
                    return False
            else:
                log_test("Get Specific Order", "FAIL", f"Status code: {response.status_code}")
                return False
        except Exception as e:
            log_test("Get Specific Order", "FAIL", f"Exception: {str(e)}")
            return False
    
    # 4. Test order status updates
    if order_id:
        statuses = ["preparing", "ready", "completed"]
        for status in statuses:
            try:
                status_update = {"status": status}
                response = requests.put(f"{BACKEND_URL}/orders/{order_id}/status", json=status_update, timeout=10)
                
                if response.status_code == 200:
                    updated_order = response.json()
                    if updated_order["status"] == status:
                        log_test(f"Update Order Status to {status}", "PASS", f"Status updated successfully")
                    else:
                        log_test(f"Update Order Status to {status}", "FAIL", f"Status not updated correctly")
                        return False
                else:
                    log_test(f"Update Order Status to {status}", "FAIL", f"Status code: {response.status_code}")
                    return False
            except Exception as e:
                log_test(f"Update Order Status to {status}", "FAIL", f"Exception: {str(e)}")
                return False
    
    return True

def test_invalid_operations():
    """Test error handling for invalid operations"""
    
    # Test invalid order status
    try:
        # First create a quick order to test invalid status on
        order_data = {
            "items": [{
                "menu_item_id": "test",
                "name": "Test Item", 
                "price": 5.99,
                "quantity": 1,
                "image": generate_sample_image()
            }],
            "total": 5.99
        }
        response = requests.post(f"{BACKEND_URL}/orders", json=order_data, timeout=10)
        
        if response.status_code == 200:
            order = response.json()
            order_id = order["id"]
            
            # Try invalid status
            invalid_status = {"status": "invalid_status"}
            response = requests.put(f"{BACKEND_URL}/orders/{order_id}/status", json=invalid_status, timeout=10)
            
            if response.status_code == 400:
                log_test("Invalid Order Status Handling", "PASS", "Correctly rejected invalid status")
            else:
                log_test("Invalid Order Status Handling", "FAIL", f"Should have returned 400, got {response.status_code}")
        else:
            log_test("Invalid Order Status Handling", "SKIP", "Could not create test order")
    except Exception as e:
        log_test("Invalid Order Status Handling", "FAIL", f"Exception: {str(e)}")
    
    # Test non-existent order
    try:
        fake_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but non-existent
        response = requests.get(f"{BACKEND_URL}/orders/{fake_id}", timeout=10)
        
        if response.status_code == 404:
            log_test("Non-existent Order Handling", "PASS", "Correctly returned 404 for non-existent order")
        else:
            log_test("Non-existent Order Handling", "FAIL", f"Should have returned 404, got {response.status_code}")
    except Exception as e:
        log_test("Non-existent Order Handling", "FAIL", f"Exception: {str(e)}")

def main():
    """Run all backend tests"""
    print("🚀 Starting Food Ordering System Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Basic health checks
    test_health_check()
    test_root_endpoint()
    
    # Authentication tests
    login_success, token = test_admin_login()
    if not login_success:
        # Try to register admin if login fails
        register_success, token = test_admin_register()
        if register_success:
            # Try login again after registration
            login_success, token = test_admin_login()
    
    # Menu operations
    print("\n📋 Testing Menu Operations")
    test_menu_operations()
    
    # Order operations
    print("\n📦 Testing Order Operations")
    test_order_operations()
    
    # Error handling tests
    print("\n⚠️  Testing Error Handling")
    test_invalid_operations()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in test_results if result["status"] == "PASS")
    failed = sum(1 for result in test_results if result["status"] == "FAIL")
    total = len([r for r in test_results if r["status"] in ["PASS", "FAIL"]])
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("🎉 All tests passed!")
    else:
        print(f"❌ {failed} tests failed")
        print("\nFailed Tests:")
        for result in test_results:
            if result["status"] == "FAIL":
                print(f"  - {result['test']}: {result['details']}")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)