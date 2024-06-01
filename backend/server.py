from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
#from datetime import datetime
from time import time

from pydantic import BaseModel
from typing import List, Dict, Tuple, Optional
import uuid

import firebase_admin
from firebase_admin import credentials, auth

from model import *

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class GpsData(BaseModel):
    longitude: float
    latitude: float

class MeetingData(BaseModel):
    name: str
    url: str
    start_time: int
    end_time: int
    type: str
    host_id: str
    gps: Tuple[float, float]

@app.post("/create_meeting/")
def api_create_meeting(meeting: MeetingData):
    meeting_id = create_meeting(Meeting(
        _id=str(uuid.uuid4()),
        name=meeting.name,
        url=meeting.url,
        start_time=meeting.start_time,
        end_time=meeting.end_time,
        meeting_type=meeting.type,
        host_id=meeting.host_id,
        gps={"longitude": meeting.gps[0], "latitude": meeting.gps[1]}
    ))
    return {"meeting_id": meeting_id}

@app.get("/get_meeting/")
def api_get_meeting(id: str = None, url: str = None):
    meeting = None
    if id:
        meeting = get_meeting(id=id)
    elif url:
        meeting = get_meeting(url=url)
    return meeting

@app.get("/get_meeting_url/")
def api_get_meeting_url(qrcode_id: str) -> str:
    meeting = get_meeting(qrcode_id=qrcode_id)
    return meeting.url


@app.get("/get_meetings/")
def api_get_meetings(host_id: str):
    meetings = get_meetings(host_id=host_id)
    meeting_list = list()
    for meeting in meetings:
        meeting_list.append(meeting.__dict__)

    return meeting_list

@app.get("/get_onsite_qrcode/")
def api_get_onsite_qrcode(meeting_id: str):
    meeting = get_meeting(id=meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.meeting_type != "onsite":
        raise HTTPException(status_code=404, detail="Meeting type should be 'onsite'")
    qrcode = get_qrcode(meeting.qrcodes[0])
    return qrcode.url

@app.get("/get_user_status/")
def api_get_user_status(meeting_id: str):
    return get_status(meeting_id)

@app.post("/join_meeting/")
def api_join_meeting(user_id: str, meeting_url: str):
    meeting = get_meeting(url=meeting_url)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if to_uid(user_id) in meeting.user_ids:
        raise HTTPException(status_code=409, detail="User already registered")
    add_user(meeting._id, user_id)
    return {"message": "User added successfully"}

@app.get("/get_online_qrcode/")
def api_get_online_qrcode(user_id: str, meeting_url: str):
    meeting = get_meeting(url=meeting_url)
    if to_uid(user_id) not in meeting.user_ids:
        raise HTTPException(status_code=404, detail="User not found in the meeting")

    qrcodes = get_qrcodes(to_uid(user_id))
    closest_qrcode = None
    min_time_diff = float('inf')

    #current_time = datetime.now()
    current_time = int(time())
    remain_qrcodes = 0
    for qrcode in qrcodes:
        if current_time <= qrcode.end_time:
            remain_qrcdoes += 1
        if qrcode.start_time <= current_time <= qrcode.end_time and not qrcode.used:
            time_diff = current_time - qrcode.start_time
            if time_diff < min_time_diff:
                min_time_diff = time_diff
                closest_qrcode = qrcode

    if closest_qrcode:
        return {
            "status": "success",
            "content": closest_qrcode.url
        }
    elif remain_qrcodes > 0:
        return {
            "status": "failure",
            "content": "No suitable QR code found"
        }
    else:
        return {
            "status": "done",
            "content": "No qrcodes remain"
        }

@app.post("/onsite_sign/")
def api_onsite_sign(user_id: str, qrcode_id: str, gps: GpsData):
    qrcode = get_qrcode(qrcode_id)
    print("user_id", user_id)
    print("qrcode_id", qrcode_id)
    print("gps", gps)
    if verify_gps(qrcode.meeting_id, {"longitude": gps.longitude, "latitude": gps.latitude}):
        print("gps verified")
        if create_sign(qrcode_id, qrcode.meeting_id, user_id):
            return
    raise HTTPException(status_code=404, detail="Onsite Sign Fail")

@app.post("/online_sign/")
def api_online_sign(qrcode_id: str):
    qrcode = get_qrcode(qrcode_id)
    if create_sign(qrcode_id, qrcode.meeting_id, qrcode.user_id):
        return
    raise HTTPException(status_code=404, detail="Online Sign Fail")

