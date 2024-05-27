import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { TailSpin } from "react-loading-icons";

import { auth } from "../auth";
import { apiPrefix } from "../config";

import "./edit.css";

function MeetingCreate() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    start_time: '',
    end_time: '',
    type: '',
    user_ids: '',
    // gps: ''
  });
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      host_id: user?.accessToken,
      user_ids: [],
      gps: null,
    };

    console.log({ data });

    const response = await fetch(`${apiPrefix}/create_meeting/`, {
      // mode: 'no-cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const { meeting_id } = await response.json();
      navigate(`/meetings/${meeting_id}`);
    }
  };

  return (
    <div className="meeting-container">
      <Link to={`/`}>
        <button className="button button-red">
          Back to Meetings List
        </button>
      </Link>
      <h1>New Meeting</h1>
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
          <label htmlFor="user_ids">User IDs (comma separated)</label>
          <input
            type="text"
            id="user_ids"
            name="user_ids"
            value={formData.user_ids}
            onChange={handleChange}
          />
        </div>
        {/* <div className="form-group"> */}
          {/* <label htmlFor="gps">GPS</label> */}
          {/* <input */}
          {/*   type="text" */}
          {/*   id="gps" */}
          {/*   name="gps" */}
          {/*   value={formData.gps} */}
          {/*   onChange={handleChange} */}
          {/* /> */}
        {/* </div> */}
        <button type="submit" className="button button-green">Create new meeting</button>
      </form>
    </div>
  );
}

export default MeetingCreate;
