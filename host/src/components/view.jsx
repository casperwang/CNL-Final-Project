import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { TailSpin } from "react-loading-icons";
import { QRCodeSVG } from "qrcode.react";

import { auth } from "../auth";
import { apiPrefix } from "../config";

import UserStatus from "./view-user-status";

import "./view.css";

function MeetingDetails() {
  const { meetingId } = useParams();

  const [user, loading, error] = useAuthState(auth);
  const [meeting, setMeeting] = useState(null);
  const [QRcodeURL, setQRcodeURL] = useState(null);

  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      if (!user) return;
      const host_id = user?.accessToken;
      try {
        // TODO injection problem?
        const response = await fetch(`${apiPrefix}/get_meeting/?id=${meetingId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const fetchedMeeting = await response.json();
        setMeeting(fetchedMeeting);
        console.log({ fetchedMeeting });
        if (fetchedMeeting.meeting_type === "onsite") {
          const response = await fetch(`${apiPrefix}/get_onsite_qrcode/?meeting_id=${meetingId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const fetchedQRcodeURL = await response.json();
          setQRcodeURL(fetchedQRcodeURL);
          // console.log({ fetchedQRcodeURL });
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeeting();
  }, [user, meetingId]);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime * 1000).toLocaleString();
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        // TODO injection problem?
        const response = await fetch(`${apiPrefix}/get_user_status/?meeting_id=${meetingId}`);
        const userData = await response.json();
        console.log({ userData });
        setUserStatus(userData);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
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
    <div className="meeting-container">
      <Link to={`/`}>
        <button className="button button-red">
          Back to Meetings List
        </button>
      </Link>
      <Link to={`/meet/${meetingId}/edit`}>
        <button className="button button-blue">
          Edit
        </button>
      </Link>
      <h1>{meeting.name}</h1>
      {
        QRcodeURL &&
          <center>
            <Link to={QRcodeURL}>
              <QRCodeSVG value={QRcodeURL} />
            </Link>
          </center>
      }
      <table>
        <tbody>
          <tr>
            <th>Type</th>
            <td>{meeting.meeting_type}</td>
          </tr>
          <tr>
            <th>URL</th>
            <td>{meeting.url}</td>
          </tr>
          <tr>
            <th>Start time</th>
            <td>{formatDateTime(meeting.start_time)}</td>
          </tr>
          <tr>
            <th>End time</th>
            <td>{formatDateTime(meeting.end_time)}</td>
          </tr>
          {/* <tr> */}
          {/*   <th>Host ID</th> */}
          {/*   <td>{meeting.host_id}</td> */}
          {/* </tr> */}
          {/* <tr> */}
          {/*   <th>User IDs</th> */}
          {/*   <td>{meeting.user_ids.join(', ')}</td> */}
          {/* </tr> */}
          <tr>
            <th>GPS</th>
            <td>{`${meeting.gps.longitude} ${meeting.gps.latitude}`}</td>
          </tr>
        </tbody>
      </table>

      {
        userStatus ?  <UserStatus userStatus={userStatus} /> : 'noooo'
      }
    </div>
  );
}

export default MeetingDetails;
