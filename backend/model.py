from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from typing import List

from bson.binary import UuidRepresentation
from bson.binary import Binary, UUID_SUBTYPE
import uuid

import time
import firebase_admin
from firebase_admin import credentials, auth

from utils import *

cred = credentials.Certificate("./cnl-final-chrome-extensions-firebase-adminsdk-x7shf-98e44d5ee6.json")
firebase_admin.initialize_app(cred)

def get_client():
    uri = "mongodb://localhost:27017"
    return MongoClient(uri, server_api=ServerApi('1'), uuidRepresentation='standard')

def get_db(client=None):
    if client is None:
        client = get_client()
    return client["CNL"]

def get_prefix() -> str:
    return "CNL.casperwang.dev"

def to_uid(user_id):
    decoded_token = auth.verify_id_token(user_id)
    uid = decoded_token['uid']
    return uid

class QRCode:
    def __init__(self, _id, meeting_id, start_time, end_time, user_id=None, used=False):
        self._id = _id
        self.meeting_id = meeting_id
        self.start_time = start_time
        self.end_time = end_time
        self.user_id = user_id
        self.used = False
        self.url = get_prefix() + "/" + _id
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            _id=data['_id'],
            meeting_id=data['meeting_id'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            user_id=data.get('user_id'),
            used=data['used']
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
    
#didn't test
def create_onsite_qrcode(meeting_id: str, start_time: int, end_time: int) -> str:
    qrcode_id = create_qrcode(QRCode(
        _id=str(uuid.uuid4()),
        meeting_id=meeting_id,
        start_time=start_time,
        end_time=end_time
    ))
    return qrcode_id

#didn't test
def create_online_qrcodes(meeting_id: str, start_time: int, end_time: int, user_id: str) -> List[int]:
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
    def __init__(self, _id, name, url, start_time, end_time, meeting_type, host_id, user_ids=None, gps=None, qrcodes=None, signs=None):
        self._id = _id
        self.name = name
        self.url = url
        self.start_time = start_time
        self.end_time = end_time
        self.meeting_type = meeting_type
        self.host_id = host_id # change to to_uid(host_id) finally
        self.user_ids = user_ids if user_ids else list()
        self.gps = gps
        self.qrcodes = qrcodes if qrcodes else list()
        self.signs = signs if signs else list()
        if self.meeting_type == "onsite":
            self.qrcodes.append(create_onsite_qrcode(_id, start_time, end_time))
        """
        elif self.type == "online":
            for user_id in self.user_ids:
                self.qrcodes.extend(create_online_qrcodes(user_id))
        """
    @classmethod
    def from_dict(cls, data):
        return cls(
            _id=data['_id'],
            name=data['name'],
            url=data['url'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            meeting_type=data['meeting_type'],
            user_ids=data['user_ids'],
            host_id=data['host_id'],
            gps=data['gps'],
            qrcodes=data['qrcodes'],
            signs=data['signs']
        )

def create_meeting(meeting: Meeting) -> str:
    db = get_db()
    meetings = db['meetings']
    meetings.insert_one(meeting.__dict__)
    return meeting._id

def get_meeting(id: str = None, url: str = None, qrcode_id: str = None) -> Meeting:
    db = get_db()
    meetings = db['meetings']
    try:
        if id:
            meeting = Meeting.from_dict(meetings.find_one({"_id": id}))
        elif url:
            meeting = Meeting.from_dict(meetings.find_one({"url": url}))
        elif qrcode_id:
            meeting = Meeting.from_dict(meetings.find_one({"qrcodes":{"$in":[qrcode_id]}}))

        return meeting

    except:
        return None

def get_meetings(host_id: str):
    db = get_db()
    meetings = db["meetings"]
    res = meetings.find({"host_id": host_id})
    return [Meeting.from_dict(m) for m in res]

# didn't test
def add_user(meeting_id: str, user_id: str):
    meeting = get_meeting(id=meeting_id)
    uid = to_uid(user_id)
    if uid not in meeting.user_ids:
        meeting.user_ids.append(uid)
        if meeting.meeting_type == "online":
            new_qrcodes = create_online_qrcodes(meeting._id, meeting.start_time, meeting.end_time, uid)
            meeting.qrcodes.extend(new_qrcodes)
        db = get_db()
        meetings = db['meetings']
        meetings.update_one(
            {"_id": meeting._id},
            {"$set": {"user_ids": meeting.user_ids, "qrcodes": meeting.qrcodes}}
        )

class Sign:
    def __init__(self, qrcode_id, meeting_id, user_id):
        self.qrcode_id = qrcode_id
        self.meeting_id = meeting_id
        self.user_id = user_id
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            qrcode_id=data['qrcode_id'],
            meeting_id=data['meeting_id'],
            user_id=data.get('user_id'),
        )

def get_signs(user_id: str):
    db = get_db()
    signs = db['signs']
    user_signs = signs.find({"user_id": user_id})
    return [Sign.from_dict(sign) for sign in user_signs]

def create_sign(qrcode_id: str, meeting_id: str, user_id: str) -> bool:
    db = get_db()
    signs = db['signs']
    qrcodes = db['qrcodes']

    checker = signs.find_one({"qrcode_id": qrcode_id, "meeting_id": meeting_id, "user_id": to_uid(user_id)})
    if checker != None:
        return False

    target_qrcode = get_qrcode(qrcode_id)
    cur_time = (time.time())
    if cur_time < target_qrcode.start_time or target_qrcode.end_time < cur_time:
        return False

    sign = Sign(qrcode_id, meeting_id, to_uid(user_id))
    signs.insert_one(sign.__dict__)
    qrcodes.update_one(
            {"_id": qrcode_id},
            {"$set": {"used": True}}
    )
    return True

def get_status(meeting_id: str):
    meeting = get_meeting(id=meeting_id)
    res = []
    if not meeting:
        return res
    for user_id in meeting.user_ids:
        user_qrcodes = get_qrcodes(user_id) if meeting.meeting_type == "online" else [get_qrcode(meeting.qrcodes[0])]
        user_signs = get_signs(user_id)
        user_signs_id = [sign.qrcode_id for sign in user_signs]
        temp = []
        for qrcode in user_qrcodes:
            if qrcode._id in user_signs_id:
                temp.append(True)
            else:
                temp.append(False)
        res.append(temp)
    return res
    
def verify_gps(meeting_id, gps_data) -> bool:
    meeting = get_meeting(id=meeting_id)
    return cal_dis_gps(meeting.gps, gps_data) <= 50
