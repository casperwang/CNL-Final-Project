from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.binary import UuidRepresentation

from bson.binary import Binary, UUID_SUBTYPE
import uuid

def get_client():
    uri = "mongodb://localhost:27017"
    return MongoClient(uri, server_api=ServerApi('1'), uuidRepresentation='standard')

def get_db(client=None):
    if client is None:
        client = get_client()
    return client["CNL"]

class QRCode:
    def __init__(self, meeting_id, time, user_id=None):
        self.meeting_id = meeting_id
        self.time = time
        self.user_id = user_id
        self.url = str

def create_qrcode(qrcode: QRCode) -> str:
    db = get_db()
    qrcodes = db['qrcodes']
    qrcode_id = str(uuid.uuid4())
    qrcode_dict = qrcode.__dict__
    qrcode_dict["_id"] = qrcode_id
    qrcodes.insert_one(qrcode_dict)
    return qrcode_id

def get_qrcode(qrcode_id: str) -> QRCode:
    pass

class Meeting:
    def __init__(self, name, url, time, meeting_type, host_id, user_ids=list(), gps=None):
        self.name = name
        self.url = url
        self.time = time
        self.type = meeting_type
        self.host_id = host_id
        self.user_ids = user_ids
        self.gps = gps
        self.qrcodes = list()
        self.signs = list()
        if meeting_type == "online":
            self.create_gps_qrcode()
        elif meeting_type == "onsite":
            self.create_scheduled_qrcodes()
    
    def create_gps_qrcode(self):
        pass

    def create_scheduled_qrcodes(self):
        pass

def create_meeting(meeting: Meeting) -> str:
    db = get_db()
    meetings = db['meetings']
    meeting_id = str(uuid.uuid4())
    meeting_dict = meeting.__dict__
    meeting_dict["_id"] = meeting_id
    meetings.insert_one(meeting_dict)
    return meeting_id

def get_meeting(
        id: str=None,
        url: str=None
    ) -> Meeting:
    pass