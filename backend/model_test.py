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
            start_time=1716392965,
            end_time=1816392965,
            user_id="terry489490",
            used=False,
        ))
        
        create_qrcode(QRCode(
            _id="test_2",
            meeting_id="meeting_1",
            start_time=1716392975,
            end_time=1816392965,
            user_id="terry489490",
            used=False,
        ))
        
        create_qrcode(QRCode(
            _id="test_3",
            meeting_id="meeting_1",
            start_time=1716393065,
            end_time=1716393965,
            user_id="terry489490",
            used=False,
        ))

        create_qrcode(QRCode(
            _id="test_4",
            meeting_id="meeting_1",
            start_time=1716393965,
            end_time=1816392965,
            user_id="casperwang",
            used=False,
        ))
        
        create_qrcode(QRCode(
            _id="test_7",
            meeting_id="meeting_1",
            start_time=0,
            end_time=0,
            user_id="casperwang",
            used=False,
        ))

        create_qrcode(QRCode(
            _id="test_8",
            meeting_id="meeting_1",
            start_time=0,
            end_time=0,
            user_id="casperwang",
            used=False,
        ))

        create_qrcode(QRCode(
            _id="test_5",
            meeting_id="meeting_2",
            start_time=30,
            end_time=40,
            user_id="catstar",
            used=False,
        ))
        
        create_qrcode(QRCode(
            _id="test_6",
            meeting_id="meeting_2",
            start_time=70,
            end_time=80,
            user_id="catstar",
            used=False,
        ))

        create_meeting(Meeting(
            _id="meeting_1",
            name="CNL",
            url="https://meeting1",
            start_time=0,
            end_time=200,
            meeting_type="online",
            host_id="thomastrain",
            user_ids=["terry489490", "casperwang"],
            gps=None,
            qrcodes=["test_1", "test_2", "test_3", "test_4"],
            signs=None,
        ))
        
        create_meeting(Meeting(
            _id="meeting_2",
            name="ADA",
            url="https://meeting2",
            start_time=0,
            end_time=200,
            meeting_type="onsite",
            host_id="thomastrain",
            user_ids=["catstar"],
            gps={"latitude": 25.0194049, "longtitude": 121.5415396},
            qrcodes=["test_5", "test_6"],
            signs=None,
        ))

        create_sign(
            "test_1",
            "meeting_1",
            "terry489490",
        )

        create_sign(
            "test_3",
            "meeting_1",
            "terry489490",
        )

    def tearDown(self):
        self.patcher.stop()
    
    def test_get_qrcode(self):
        print("test_get_qrcode")
        qrcode = get_qrcode('test_1')
        print(qrcode.__dict__)
        print("===========================")

    def test_get_qrcodes(self):
        print("test_get_qrcodes")
        qrcodes = get_qrcodes("terry489490")
        qrcodes_id = [qrcode._id for qrcode in qrcodes]
        print("terry489490: ", qrcodes_id)
        
        qrcodes = get_qrcodes("catstar")
        qrcodes_id = [qrcode._id for qrcode in qrcodes]
        print("catstar: ", qrcodes_id)
        print("===========================")

    def test_get_meeting(self):
        print("test_get_meeting")
        meeting = get_meeting(id="meeting_2")
        print("id=meeting_2: ", meeting.__dict__)
        meeting = get_meeting(url="https://meeting1")
        print("url=https://meeting1: ", meeting.__dict__)
        print("===========================")
        
    
    def test_get_meetings(self):
        print("test_get_meetings")
        meetings = get_meetings("thomastrain")
        temp = [a.__dict__ for a in meetings]
        print("thomastrain's meetings: ", temp)
        print("===========================")

    def test_get_signs(self):
        print("test_get_signs")
        signs = get_signs("terry489490")
        temp = [s.__dict__ for s in signs]
        print("terry489490's signs: ", temp)
        print("===========================")

    def test_get_status(self):
        print("test_get_status")
        print(get_status("meeting_1"))
        print("===========================")

if __name__ == '__main__':
    unittest.main()
