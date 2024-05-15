import mongomock
import unittest
from unittest.mock import patch

from model import *

class TestModel(unittest.TestCase):
    def setUp(self):
        self.patcher = patch('model.get_client', return_value=mongomock.MongoClient())
        self.mock_client = self.patcher.start()
        self.db = self.mock_client()["SplitwiseWeb"]
        global users_collection, transaction_sets_collection, transactions_collection
        users_collection = self.db['users']
        transaction_sets_collection = self.db['transaction_sets']
        transactions_collection = self.db['transactions']

        self.user_id = dict()
        self.user_id["qingyun"] = create_user("qingyun", "qingyun@gmail.com")
        self.user_id["casperwang"] = create_user("casperwang", "casperwang@gmail.com")
        self.user_id["thomaswang"] = create_user("thomaswang", "thomaswang@gmail.com")
        self.set_id = dict()
        self.set_id["friend_test"] = make_friend(self.user_id["qingyun"], self.user_id["casperwang"])
        self.set_id["group_test"] = create_group("group_test", [self.user_id["qingyun"], self.user_id["casperwang"]])

    def tearDown(self):
        self.patcher.stop()

    def test_create_user(self):
        self.assertEqual("qingyun", users_collection.find_one({"_id": self.user_id["qingyun"]})["name"])
        self.assertEqual(3, users_collection.count_documents({}))
    
    def test_make_friend(self):
        self.assertSequenceEqual(
            [self.user_id["qingyun"], self.user_id["casperwang"]],
            transaction_sets_collection.find_one({"_id": self.set_id["friend_test"]})["user_list"]
        )
        self.assertEqual(
            self.set_id["friend_test"],
            users_collection.find_one({"_id": self.user_id["qingyun"]})["friend_list"][0]
        )
    
    def test_create_group(self):
        self.assertEqual(
            "group_test",
            transaction_sets_collection.find_one({"_id": self.set_id["group_test"]})["name"]
        )
        self.assertEqual(
            self.set_id["group_test"],
            users_collection.find_one({"_id": self.user_id["casperwang"]})["group_list"][0]
        )
    
    def test_create_transaction(self):
        transaction = Transaction(
            "test1",
            self.set_id["friend_test"],
            0,
            "2024-04-21",
            [self.user_id["qingyun"], self.user_id["casperwang"]],
            "payment",
            [(self.user_id["qingyun"], 100)],
            [(self.user_id["casperwang"], "exact", 100)]
        )
        tid = create_transaction(transaction)
        self.assertEqual(
            -100,
            transactions_collection.find_one({"_id": tid})["balance"][self.user_id["casperwang"]]
        )
        self.assertEqual(
            100,
            transaction_sets_collection.find_one({"_id": self.set_id["friend_test"]})["balance"][self.user_id["qingyun"]]
        )
    
    def test_add_user(self):
        add_user(self.user_id["thomaswang"], self.set_id["group_test"])
        self.assertEqual(
            3,
            len(transaction_sets_collection.find_one({"_id": self.set_id["group_test"]})["user_list"])
        )

if __name__ == '__main__':
    unittest.main()