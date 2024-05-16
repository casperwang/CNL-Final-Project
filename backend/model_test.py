import mongomock
import unittest
from unittest.mock import patch

from model import *

class TestModel(unittest.TestCase):
    def setUp(self):
        self.patcher = patch('model.get_client', return_value=mongomock.MongoClient())
        self.mock_client = self.patcher.start()
        self.db = self.mock_client()["CNL"]
        global meeting_collection

    def tearDown(self):
        self.patcher.stop()

if __name__ == '__main__':
    unittest.main()