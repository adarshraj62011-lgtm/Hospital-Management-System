import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../context.jsx";

const profileFields = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "NIC", key: "nic" },
  { label: "Date of Birth", key: "dob" },
  { label: "Gender", key: "gender" },
  { label: "Role", key: "role" },
];

const Profile = () => {
  const { isAuthenticated, user } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const profileData = {
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email || "Not available",
    phone: user.phone || "Not available",
    nic: user.nic || "Not available",
    dob: user.dob || "Not available",
    gender: user.gender || "Not available",
    role: user.role || "Patient",
  };

  return (
    <section className="container profile-page">
      <div className="profile-card">
        <p className="profile-eyebrow">Patient Account</p>
        <h2>{profileData.name || "Welcome"}</h2>
        <p className="profile-copy">
          Your account details appear here after you log in, so you can quickly
          confirm which patient profile is active.
        </p>
        <div className="profile-grid">
          {profileFields.map((field) => (
            <div className="profile-item" key={field.key}>
              <span>{field.label}</span>
              <strong>{profileData[field.key]}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profile;
