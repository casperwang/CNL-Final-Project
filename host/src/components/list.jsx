import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { auth } from "../auth";
import { apiPrefix } from "../config";

import "./list.css";

function MeetingList() {
  const [user, loading, error] = useAuthState(auth);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;
      const host_id = user?.accessToken;
      try {
        const response = await fetch(`${apiPrefix}/get_meetings/?host_id=${host_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMeetings(data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [user]);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime * 1000).toLocaleString();
  };

  if (!meetings) { // loading
    return (
      <center>
        <div style={{ marginTop: 50 }}>
          <TailSpin stroke="black" />
        </div>
      </center>
    );
  }

  if (!user) {
    return <p>Please log in to see the meetings.</p>;
  }

  return (
    <>
      <Link to={`/meet/new`}>
        <button className="button button-green" style={{ marginTop: 20, marginLeft: 10 }}>
          New meeting
        </button>
      </Link>
      <table className="meeting-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meet) => (
            <tr key={meet._id}>
              <td>{meet.name}</td>
              <td>{formatDateTime(meet.start_time)}</td>
              <td>{formatDateTime(meet.end_time)}</td>
              <td>{meet.meeting_type}</td>
              <td>
                <Link to={`/meet/${meet._id}`}>
                  <button className="button button-green">View</button>
                </Link>
                <Link to={`/meet/${meet._id}/edit`}>
                  <button className="button button-blue">Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MeetingList;
