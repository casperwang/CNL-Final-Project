import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { TailSpin } from "react-loading-icons";
import { QRCodeSVG } from "qrcode.react";

import UserStatus from "./view-user-status";

import "./view.css";
import "./view-user-status.css";

const meetings = [
  {
    name: "meet1",
    url: "https://example.com",
    start_time: "2024-05-21T13:00",
    end_time: "2024-05-21T15:00",
    type: "onsite",
    host_id: "0xdefaced",
    user_ids: ["0xdeadbeef"],
    id: 1
  },
  {
    name: "meet2",
    url: "https://google.com",
    start_time: "2024-05-21T13:00",
    end_time: "2024-05-21T15:00",
    type: "online",
    host_id: "0xdefaced",
    user_ids: ["0xdeadbeef"],
    id: 2
  }
];

const userStatuses = [
  [
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
  ],
  []
];

function MeetingDetails() {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      // const res = await fetch("some-url");
      // res.json();
      // console.log(res);
      setMeeting(meetings[meetingId - 1]);
    };
    fetchMeeting();
  }, [meetingId]);

  useEffect(() => {
    const fetchUserStatus = async () => {
      setUserStatus(userStatuses[meetingId - 1]);
    };
    fetchUserStatus();
  }, [meetingId, meeting]);

  if (!meeting) { // loading
    return (
      <center>
        <div style={{ marginTop: 50 }}>
          <TailSpin stroke="black" />
        </div>
      </center>
    );
  }

  return (
    <div className="meeting-details">
      <Link to={`/`}>
        <button className="back-button">
          Back to Meetings List
        </button>
      </Link>
      <Link to={`/meet/${meetingId}/edit`}>
        <button className="edit-button">
          Edit
        </button>
      </Link>
      <h1>{meeting.name}</h1>
      <center>
        <QRCodeSVG value="https://example.com" />
      </center>
      <table>
        <tbody>
          <tr>
            <th>Type</th>
            <td>{meeting.type}</td>
          </tr>
          <tr>
            <th>URL</th>
            <td>{meeting.url}</td>
          </tr>
          <tr>
            <th>Start time</th>
            <td>{meeting.start_time}</td>
          </tr>
          <tr>
            <th>End time</th>
            <td>{meeting.end_time}</td>
          </tr>
          <tr>
            <th>Host ID</th>
            <td>{meeting.host_id}</td>
          </tr>
          <tr>
            <th>User IDs</th>
            <td>{meeting.user_ids.join(', ')}</td>
          </tr>
          <tr>
            <th>GPS</th>
            <td>{meeting.gps}</td>
          </tr>
        </tbody>
      </table>

      <UserStatus userStatus={userStatus} />
    </div>
  );
}

export default MeetingDetails;
