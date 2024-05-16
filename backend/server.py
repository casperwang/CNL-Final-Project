from fastapi import FastAPI

from pydantic import BaseModel
from typing import List, Dict, Tuple, Optional

from model import *

app = FastAPI()

class MeetingData(BaseModel):
    name: str
    url: str
    time: Tuple[str, str]
    type: str
    host_id: str
    user_ids: List[str]
    gps: Optional[str]

@app.post("/create_meeting/")
def api_create_meeting(meeting: MeetingData):
    meeting_id = create_meeting(Meeting(
        name=meeting.name,
        url=meeting.url,
        time=meeting.time,
        meeting_type=meeting.type,
        host_id=meeting.host_id,
        user_ids=meeting.user_ids,
        gps=meeting.gps
    ))
    return {
        "meeting_id": meeting_id
    }

@app.get("/get_onsite_qrcode/")
def api_get_onsite_qrcode(meeting_id: str):
    meeting = get_meeting(id=meeting_id)
    assert(meeting.type == "onsite")
    qrcode = get_qrcode(meeting.qrcodes[-1])
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
    pass

@app.get("/get_online_qrcode/")
def api_get_online_qrcode(meeting_url: str):
    pass

@app.post("/onsite_sign/")
def api_onsite_sign():
    pass

@app.post("/online_sign/")
def api_online_sign():
    pass