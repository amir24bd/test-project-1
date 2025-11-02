import React, { useEffect, useState } from "react";
import API_BASE, { authHeaders } from "../utils/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.profile) return;
        const res = await fetch(
          `${API_BASE}/profile/${user.profile.id}/`,
          { headers: authHeaders(), signal: controller.signal }
        );
        const data = await res.json();
        if (res.ok) setProfile(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }

    loadProfile();

    // ✅ cleanup
    return () => controller.abort();
  }, []);

  if (!profile) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>{profile.name}</h3>
      <p>Email: {profile.user.email}</p>
      <p>Blood Group: {profile.blood_group}</p>
      {profile.photo_url && (
        <img
          src={profile.photo_url}
          alt={profile.name}
          style={{ width: "120px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
}
