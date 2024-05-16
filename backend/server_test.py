import unittest
from fastapi.testclient import TestClient
from server import app
import json

class TestServer(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        pass
    
    def tearDown(self):
        pass

if __name__ == '__main__':
    unittest.main()
