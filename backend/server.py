from fastapi import FastAPI, HTTPException

from pydantic import BaseModel
from typing import List, Dict, Tuple, Optional
import uuid

from model import *

app = FastAPI()

class MeetingData(BaseModel):
    name: str
    url: str
    start_time: str
    end_time: str
    type: str
    host_id: str
    user_ids: List[str]
    gps: Optional[str]

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

@app.get("/get_onsite_qrcode/")
def api_get_onsite_qrcode(meeting_id: str):
    meeting = get_meeting(id=meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.type != "onsite":
        raise HTTPException(status_code=404, detail="Meeting type is not 'onsite'")
    qrcode = get_qrcode(meeting.qrcodes[0])
    return qrcode.url

@app.get("/get_user_status/")
def api_get_user_status(meeting_id: str):
    meeting = get_meeting(id=meeting_id)
    if meeting.type == "onsite":
        pass
    elif meeting.type == "online":
        pass

@app.post("/join_meeting/")
def api_join_meeting(user_id: str, meeting_url: str):
    meeting = get_meeting(url=meeting_url)
    if user_id in meeting.user_ids:
        raise HTTPException(status_code=409, detail="User already registered")
    meeting.add_user(user_id)
    return {"message": "User added successfully"}

@app.get("/get_online_qrcode/")
def api_get_online_qrcode(user_id: str, meeting_url: str):
    meeting = get_meeting(url=meeting_url)
    if user_id not in meeting.user_ids:
        raise HTTPException(status_code=404, detail="User not found in the meeting")
    if 
    return {
        "status": "success",
        "content": "QRCode"
    }

@app.post("/onsite_sign/")
def api_onsite_sign():
    pass

@app.post("/online_sign/")
def api_online_sign():
    pass