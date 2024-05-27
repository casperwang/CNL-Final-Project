import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { TailSpin } from "react-loading-icons";

import "./edit.css";

const meetings = [
  {
    name: "meet1",
    url: "https://example.com",
    start_time: "2024-05-21T13:00",
    end_time: "2024-05-21T15:00",
    type: "onsite",
    host_id: "0xdefaced",
    user_ids: ["0xdeadbeef"],
    id: 1 // TODO make sure where is the meeting id??
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

function MeetingEdit() {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    start_time: '',
    end_time: '',
    type: '',
    host_id: '',
    user_ids: '',
    gps: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch meeting data using meetingId
    // This is a placeholder; replace with actual data fetching logic
    const fetchData = async () => {
      const data = meetings[meetingId - 1];
      setMeeting(data);
      setFormData({
        name: data.name,
        url: data.url,
        start_time: data.start_time,
        end_time: data.end_time,
        type: data.type,
        host_id: data.host_id,
        user_ids: data.user_ids.join(', '),
        gps: data.gps || ''
      });
    };
    fetchData();
  }, [meetingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit updated meeting data
    // This is a placeholder; replace with actual data submission logic
    console.log(formData);
    const response = await fetch(`/api/meetings/${meetingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      navigate(`/meetings/${meetingId}`);
    }
  };

  if (!meeting) {
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
      <Link to={`/meet/${meetingId}`}>
        <button className="button button-green">
          View
        </button>
      </Link>
      <h1>Edit Meeting</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="start_time">Start Time</label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end_time">End Time</label>
          <input
            type="datetime-local"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="onsite">onsite</option>
            <option value="online">online</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="host_id">Host ID</label>
          <input
            type="text"
            id="host_id"
            name="host_id"
            value={formData.host_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="user_ids">User IDs (comma separated)</label>
          <input
            type="text"
            id="user_ids"
            name="user_ids"
            value={formData.user_ids}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gps">GPS</label>
          <input
            type="text"
            id="gps"
            name="gps"
            value={formData.gps}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="button button-green">Save Changes</button>
      </form>
    </div>
  );
}

export default MeetingEdit;
