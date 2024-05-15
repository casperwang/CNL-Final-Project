import unittest
from fastapi.testclient import TestClient
from server import app
import json

class TestServer(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.user_ids = dict()
        response = self.client.post("/create_user/", json={
            "username": "qingyun",
            "email": "qingyun@gmail.com"}
        )
        self.user_ids["qingyun"] = response.json()["user_id"]
        response = self.client.post("/create_user/", json={
            "username": "casperwang",
            "email": "casperwang@gmail.com"
        })
        self.user_ids["casperwang"] = response.json()["user_id"]
        response = self.client.post("/create_user/", json={
            "username": "thomaswang",
            "email": "thomaswang@gmail.com"
        })
        self.user_ids["thomaswang"] = response.json()["user_id"]
        self.set_ids = dict()
        response = self.client.post("/make_friend/", json={
            "userA": self.user_ids["casperwang"],
            "userB": self.user_ids["qingyun"]
        })
        self.set_ids["friend_test"] = response.json()["set_id"]
        response = self.client.post("/create_group/", json={
            "groupname": "group_test",
            "user_list": [self.user_ids["casperwang"], self.user_ids["qingyun"]]}
        )
        self.set_ids["group_test"] = response.json()["set_id"]
        self.transaction_ids = dict()
        response = self.client.post("/create_transaction/", json={
            "name": "test1",
            "set_id": self.set_ids["group_test"],
            "label": "Food",
            "date": "2021-01-01",
            "user_list": [self.user_ids["casperwang"], self.user_ids["qingyun"]],
            "split_type": "payment",
            "payers": [(self.user_ids["casperwang"], 20)],
            "owners": [(self.user_ids["qingyun"], "share", 100)]
        })
        self.transaction_ids["test1"] = response.json()["transaction_id"]
        response = self.client.post("/create_transaction/", json={
            "name": "test2",
            "set_id": self.set_ids["group_test"],
            "label": "Food",
            "date": "2021-01-02",
            "user_list": [self.user_ids["casperwang"], self.user_ids["qingyun"]],
            "split_type": "payment",
            "payers": [(self.user_ids["qingyun"], 30)],
            "owners": [(self.user_ids["casperwang"], "exact", 30)]
        })
        self.transaction_ids["test2"] = response.json()["transaction_id"]
    
    def tearDown(self):
        for user_id in self.user_ids.values():
            self.client.post("/del_user/", params={"user_id": user_id})
        for set_id in self.set_ids.values():
            self.client.post("/del_transaction_set/", params={"set_id": set_id})
        for transaction_id in self.transaction_ids.values():
            self.client.post("/del_transaction/", params={"transaction_id": transaction_id})

    def test_create_user(self):
        response = self.client.post("/create_user/", json={"username": "testuser", "email": "test@example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("user_id", response.json())
        self.user_ids["testuser"] = response.json()["user_id"]

    def test_make_friend(self):
        response = self.client.post("/make_friend/", json={
            "userA": self.user_ids["casperwang"],
            "userB": self.user_ids["qingyun"]})
        self.assertEqual(response.status_code, 200)
        self.assertIn("set_id", response.json())
        self.set_ids["friend_test"] = response.json()["set_id"]

    def test_create_group(self):
        response = self.client.post("/create_group/", json={
            "groupname": "group_test_2",
            "user_list": [self.user_ids["casperwang"], self.user_ids["qingyun"]]}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("set_id", response.json())
        self.set_ids["group_test_2"] = response.json()["set_id"]

    def test_create_transaction(self):
        response = self.client.post("/create_transaction/", json={
            "name": "Lunch",
            "set_id": self.set_ids["group_test"],
            "label": "Food",
            "date": "2021-01-01",
            "user_list": [self.user_ids["casperwang"], self.user_ids["qingyun"]],
            "split_type": "payment",
            "payers": [(self.user_ids["casperwang"], 20)],
            "owners": [(self.user_ids["qingyun"], "share", 100)]
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("transaction_id", response.json())
        self.transaction_ids["Lunch"] = response.json()["transaction_id"]

    def test_add_user(self):
        response = self.client.post("/add_user/", json={
            "user_id": self.user_ids["thomaswang"],
            "set_id": self.set_ids["group_test"]})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["res"])
    
    def test_get_user(self):
        response = self.client.get("/get_user/", params={"email": "casperwang@gmail.com"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual("casperwang", response.json()["name"])
    
    def test_get_friends(self):
        response = self.client.get("/get_friends/", params={"user_id": self.user_ids["casperwang"]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual("qingyun", response.json()[0]["name"])

if __name__ == '__main__':
    unittest.main()
