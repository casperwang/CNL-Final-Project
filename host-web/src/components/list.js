import React from 'react';
import { Link } from 'react-router-dom';
import './list.css';

function MeetingList() {
  // TODO: fetch meetings
  const meetings = [
    {
      name: "meet1",
      start_time: "2024/05/21 13:00",
      end_time: "2024/05/21 15:00",
      type: "onsite",
      host_id: "0xdefaced",
      user_ids: ["0xdeadbeef"],
      qrcodes: ["QRCODE"],
      id: 1 // Unique ID for the meeting
    },
    {
      name: "meet2",
      start_time: "2024/05/21 13:00",
      end_time: "2024/05/21 15:00",
      type: "online",
      host_id: "0xdefaced",
      user_ids: ["0xdeadbeef"],
      qrcodes: ["QRCODE"],
      id: 2 // Unique ID for the meeting
    }
  ];

  return (
    <table className="meeting-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Type</th>
          {/* <th>Host ID</th> */}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          meetings.map((meet, index) => (
            <tr key={index}>
              <td>{meet.name}</td>
              <td>{meet.start_time}</td>
              <td>{meet.end_time}</td>
              <td>{meet.type}</td>
              {/* <td>{meet.host_id}</td> */}
              <td>
                <Link to={`/meet/${meet.id}`}>
                  <button className="view-button">View</button>
                </Link>
                <Link to={`/meet/${meet.id}/edit`}>
                  <button className="edit-button">Edit</button>
                </Link>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default MeetingList;
