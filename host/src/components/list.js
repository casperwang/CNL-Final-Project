import { Link } from "react-router-dom";
import "./list.css";

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

function MeetingList() {
  // TODO: fetch meetings
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
                  <button className="button button-green">View</button>
                </Link>
                <Link to={`/meet/${meet.id}/edit`}>
                  <button className="button button-blue">Edit</button>
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
