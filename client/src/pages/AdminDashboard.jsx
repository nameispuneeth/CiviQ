import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dummy issues for now
const dummyIssues = [
  {
    _id: '1',
    title: 'Pothole near school',
    description: 'Large pothole making it unsafe for kids.',
    status: 'Pending',
    location: { coordinates: [78.9629, 20.5937] }, // [lng, lat]
  },
  {
    _id: '2',
    title: 'Broken streetlight',
    description: 'Streetlight not working in colony.',
    status: 'In Progress',
    location: { coordinates: [77.5946, 12.9716] },
  },
];

export default function AdminDashboard() {
  const [issues, setIssues] = useState(dummyIssues);

  // Local state update only
  const changeStatus = (id, status) => {
    setIssues(prev =>
      prev.map(issue => issue._id === id ? { ...issue, status } : issue)
    );
  };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      {/* Issues List */}
      <div style={{ width: '40%', maxHeight: '80vh', overflow: 'auto' }}>
        <h3>Issues</h3>
        {issues.map(issue => (
          <div
            key={issue._id}
            style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8 }}
          >
            <strong>{issue.title}</strong>
            <p>{issue.description}</p>
            <div>Status: {issue.status}</div>
            <button onClick={() => changeStatus(issue._id, 'In Progress')}>
              Start
            </button>
            <button onClick={() => changeStatus(issue._id, 'Resolved')}>
              Resolve
            </button>
          </div>
        ))}
      </div>

      {/* Map View */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '80vh' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {issues.map(issue => (
            <Marker
              key={issue._id}
              position={[
                issue.location.coordinates[1], // lat
                issue.location.coordinates[0], // lng
              ]}
            >
              <Popup>
                <div>
                  <strong>{issue.title}</strong>
                  <p>{issue.description}</p>
                  <div>Status: {issue.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
