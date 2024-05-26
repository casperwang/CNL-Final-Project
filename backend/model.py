from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from typing import List

from bson.binary import UuidRepresentation
from bson.binary import Binary, UUID_SUBTYPE
import uuid

from utils import random_time_points

def get_client():
    uri = "mongodb://localhost:27017"
    return MongoClient(uri, server_api=ServerApi('1'), uuidRepresentation='standard')

def get_db(client=None):
    if client is None:
        client = get_client()
    return client["CNL"]

def get_prefix() -> str:
    return "CNL.casperwang.dev"

class QRCode:
    def __init__(self, _id, meeting_id, start_time, end_time, user_id=None):
        self._id = _id
        self.meeting_id = meeting_id
        self.start_time = start_time
        self.end_time = end_time
        self.user_id = user_id
        self.url = get_prefix() + "/" + _id
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            _id=data['_id'],
            meeting_id=data['meeting_id'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            user_id=data.get('user_id')
        )

def create_qrcode(qrcode: QRCode) -> str:
    db = get_db()
    qrcodes = db['qrcodes']
    qrcodes.insert_one(qrcode.__dict__)
    return qrcode._id

def get_qrcode(qrcode_id: str) -> QRCode:
    db = get_db()
    qrcodes = db['qrcodes']
    qrcode = qrcodes.find_one({"_id": qrcode_id})
    if not qrcode:
        raise ValueError("QRCode not found")
    return QRCode.from_dict(qrcode)

def get_qrcodes(user_id: str) -> List[QRCode]:
    db = get_db()
    qrcodes = db['qrcodes']
    user_qrcodes = qrcodes.find({"user_id": user_id})
    if not user_qrcodes:
        raise ValueError("QRCode not found")
    return [QRCode.from_dict(qrcode) for qrcode in user_qrcodes]
    
def create_onsite_qrcode(meeting_id: str, start_time: str, end_time: str) -> str:
    qrcode_id = create_qrcode(QRCode(
        _id=str(uuid.uuid4()),
        meeting_id=meeting_id,
        start_time=start_time,
        end_time=end_time
    ))
    return qrcode_id

def create_online_qrcodes(meeting_id: str, start_time: str, end_time: str, user_id: str) -> List[int]:
    qrcodes = list()
    time_points = random_time_points(start_time, end_time, 5)
    for time_point in time_points:
        qrcode_id = create_qrcode(QRCode(
            _id=str(uuid.uuid4()),
            meeting_id=meeting_id,
            start_time=time_point,
            end_time=end_time,
            user_id=user_id
        ))
        qrcodes.append(qrcode_id)
    return qrcodes

class Meeting:
    def __init__(self, _id, name, url, start_time, end_time, meeting_type, host_id, user_ids=list(), gps=None):
        self._id = _id
        self.name = name
        self.url = url
        self.start_time = start_time
        self.end_time = end_time
        self.type = meeting_type
        self.host_id = host_id
        self.user_ids = user_ids
        self.gps = gps
        self.qrcodes = list()
        self.signs = list()
        if self.type == "onsite":
            self.qrcodes.append(create_onsite_qrcode())
        elif self.type == "online":
            for user_id in self.user_ids:
                self.qrcodes.extend(create_online_qrcodes(user_id))

def create_meeting(meeting: Meeting) -> str:
    db = get_db()
    meetings = db['meetings']
    meetings.insert_one(meeting.__dict__)
    return meeting._id

def get_meeting(id: str = None, url: str = None) -> Meeting:
    db = get_db()
    meetings = db['meetings']
    if id:
        meeting = meetings.find_one({"_id": id})
    elif url:
        meeting = meetings.find_one({"url": url})
    return meeting

def add_user(meeting: Meeting, user_id: str):
    if user_id not in meeting.user_ids:
        meeting.user_ids.append(user_id)
        if meeting.type == "online":
            new_qrcodes = create_online_qrcodes(meeting._id, meeting.start_time, meeting.end_time, user_id)
            meeting.qrcodes.extend(new_qrcodes)
        db = get_db()
        meetings = db['meetings']
        meetings.update_one(
            {"_id": meeting._id},
            {"$set": {"user_ids": meeting.user_ids, "qrcodes": meeting.qrcodes}}
        )