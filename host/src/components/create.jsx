import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { toast } from "react-toastify";

import { auth } from "../auth";
import { apiPrefix } from "../config";

import "./edit.css";

function MeetingCreate() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    start_time: '',
    end_time: '',
    type: 'onsite',
    // user_ids: '',
    gps: ''
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

    const unixTimeStamp = (t) => {
      return Math.floor(new Date(t).getTime() / 1000);
    };

    try {
      // TODO gps
      const [longitude, latitude] = formData.gps.split(' ');
      const data = {
        ...formData,
        start_time: unixTimeStamp(formData.start_time),
        end_time: unixTimeStamp(formData.end_time),
        host_id: user?.accessToken,
        user_ids: [],
        // gps: null,
        gps: [ longitude, latitude ],
      };
      // console.log({ data });

      const response = await fetch(`${apiPrefix}/create_meeting/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.log(await response.text());
        throw new Error('Network response was not ok');
      }
      toast.success("request sent");
      const { meeting_id } = await response.json();
      navigate(`/meet/${meeting_id}`);
    } catch (error) {
      toast.error("request failed");
      console.error("Error fetching meetings:", error);
    }
  };

  const getGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            gps: `${longitude} ${latitude}`
          });
        },
        (error) => {
          // throw error;
          console.log(error);
          alert("Error when getting GPS location.");
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser.");
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
        {/* <div className="form-group"> */}
        {/*   <label htmlFor="user_ids">User IDs (comma separated)</label> */}
        {/*   <input */}
        {/*     type="text" */}
        {/*     id="user_ids" */}
        {/*     name="user_ids" */}
        {/*     value={formData.user_ids} */}
        {/*     onChange={handleChange} */}
        {/*   /> */}
        {/* </div> */}
        <div className="form-group">
          <label htmlFor="gps">GPS</label>
          <input
            type="text"
            id="gps"
            name="gps"
            value={formData.gps}
            onChange={handleChange}
            required
          />
        </div>
        <button type="button" className="button button-blue" onClick={getGPS}>
          Get GPS Location
        </button>
        <button type="submit" className="button button-green">Create new meeting</button>
      </form>
    </div>
  );
}

export default MeetingCreate;
