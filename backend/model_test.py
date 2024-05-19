import mongomock
import unittest
from unittest.mock import patch

from model import *

class TestModel(unittest.TestCase):
    def setUp(self):
        self.patcher = patch('model.get_client', return_value=mongomock.MongoClient())
        self.mock_client = self.patcher.start()
        self.db = self.mock_client()["CNL"]
        global qrcode_collection, meeting_collection
        qrcode_collection = self.db['qrcodes']
        meeting_collection = self.db['meetings']

        create_qrcode(QRCode(
            _id="test_1",
            meeting_id="meeting_1",
            start_time="2024-05-18T18:00:00",
            end_time="2024-05-18T20:00:00"
        ))
        create_qrcode(QRCode(
            _id="test_2",
            meeting_id="meeting_2",
            start_time="2024-05-17T18:00:00",
            end_time="2024-05-17T20:00:00",
            user_id="user_1"
        ))
        create_qrcode(QRCode(
            _id="test_3",
            meeting_id="meeting_2",
            start_time="2024-05-17T18:00:00",
            end_time="2024-05-17T20:00:00",
            user_id="user_2"
        ))

    def tearDown(self):
        self.patcher.stop()
    
    def test_get_qrcode(self):
        qrcode = get_qrcode('test_1')
        self.assertEqual(qrcode.start_time, "2024-05-18T18:00:00")

if __name__ == '__main__':
    unittest.main()