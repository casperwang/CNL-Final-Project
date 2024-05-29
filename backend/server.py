from fastapi import FastAPI, HTTPException
from datetime import datetime

from pydantic import BaseModel
from typing import List, Dict, Tuple, Optional
import uuid

from model import *

app = FastAPI()

class GpsData(BaseModel):
    longitude: float
    latitude: float

class MeetingData(BaseModel):
    name: str
    url: str
    start_time: str
    end_time: str
    type: str
    host_id: str
    user_ids: List[str]
    gps: Optional[GpsData]

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
        user_ids=meeting.user_ids,
        gps=meeting.gps
    ))
    return {"meeting_id": meeting_id}

@app.get("/get_meetings/")
def api_get_meetings(host_id: str):
    meetings = get_meetings(host_id=host_id)
    meeting_list = list()
    for meeting in meetings:
        meeting_list.append({
            "name": meeting.name,
            "url": meeting.url,
            "start_time": meeting.start_time,
            "end_time": meeting.end_time,
            "type": meeting.type,
            "host_id": meeting.host_id,
            "user_ids": meeting.user_ids,
            "gps": meeting.gps
        })
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
    if user_id in meeting.user_ids:
        raise HTTPException(status_code=409, detail="User already registered")
    add_user(meeting._id, user_id)
    return {"message": "User added successfully"}

@app.get("/get_online_qrcode/")
def api_get_online_qrcode(user_id: str, meeting_url: str):
    meeting = get_meeting(url=meeting_url)
    if user_id not in meeting.user_ids:
        raise HTTPException(status_code=404, detail="User not found in the meeting")

    qrcodes = get_qrcodes(user_id)
    closest_qrcode = None
    min_time_diff = float('inf')

    current_time = datetime.now()
    for qrcode in qrcodes:
        if qrcode.start_time <= current_time <= qrcode.end_time and not qrcode.used:
            time_diff = (current_time - qrcode.start_time).total_seconds()
            if time_diff < min_time_diff:
                min_time_diff = time_diff
                closest_qrcode = qrcode

    if closest_qrcode:
        return {
            "status": "success",
            "content": closest_qrcode.url
        }
    else:
        return {
            "status": "failure",
            "content": "No suitable QR code found"
        }

@app.post("/onsite_sign/")
def api_onsite_sign(user_id: str, qrcode_id: str, gps: GpsData):
    qrcode = get_qrcode(id=qrcode_id)
    if verify_gps(qrcode.meeting_id, {"longitude": gps.longitude, "latitude": gps.latitude}):
        create_sign(qrcode_id, qrcode.meeting_id, user_id)

@app.post("/online_sign/")
def api_online_sign(qrcode_id: str):
    qrcode = get_qrcode(id=qrcode_id)
    create_sign(qrcode_id, qrcode.meeting_id, qrcode.user_id)
