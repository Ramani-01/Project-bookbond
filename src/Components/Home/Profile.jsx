import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/profile', { withCredentials: true })
      .then((res) => {
        setUser({ name: res.data.user.name, email: res.data.user.email });
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          window.location.href = "/HomeLanding";
        } else {
          alert("Failed to load profile");
          console.error(err.response?.data || err.message);
        }
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios.put('http://localhost:3001/profile', user, { withCredentials: true })
      .then((res) => {
        alert('Profile updated!');
        setUser(res.data.user);
        setEditing(false);
      })
      .catch((err) => {
        alert('Failed to update profile');
        console.error(err.response?.data || err.message);
      });
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="profile-wrapper">
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>

      <div className="profile-form-group">
        <label className="profile-label">Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!editing}
          className="profile-input"
        />
      </div>

      <div className="profile-form-group">
        <label className="profile-label">Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!editing}
          className="profile-input"
        />
      </div>

      {!editing ? (
        <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
      ) : (
        <div className="profile-button-group">
          <button className="profile-save-btn" onClick={handleUpdate}>Save</button>
          <button className="profile-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Profile;
