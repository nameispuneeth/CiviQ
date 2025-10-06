import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const indiaCapitals = [
  { state: "Andhra Pradesh", capital: "Amaravati", lat: 16.5417, lng: 80.5155 },
  { state: "Arunachal Pradesh", capital: "Itanagar", lat: 27.0844, lng: 93.6053 },
  { state: "Assam", capital: "Dispur", lat: 26.1433, lng: 91.7898 },
  { state: "Bihar", capital: "Patna", lat: 25.5941, lng: 85.1376 },
  { state: "Chhattisgarh", capital: "Raipur", lat: 21.2514, lng: 81.6296 },
  { state: "Goa", capital: "Panaji", lat: 15.4909, lng: 73.8278 },
  { state: "Gujarat", capital: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
  { state: "Haryana", capital: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { state: "Himachal Pradesh", capital: "Shimla", lat: 31.1048, lng: 77.1734 },
  { state: "Jharkhand", capital: "Ranchi", lat: 23.3441, lng: 85.3096 },
  { state: "Karnataka", capital: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { state: "Kerala", capital: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { state: "Madhya Pradesh", capital: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { state: "Maharashtra", capital: "Mumbai", lat: 19.076, lng: 72.8777 },
  { state: "Manipur", capital: "Imphal", lat: 24.817, lng: 93.9368 },
  { state: "Meghalaya", capital: "Shillong", lat: 25.5788, lng: 91.8933 },
  { state: "Mizoram", capital: "Aizawl", lat: 23.7271, lng: 92.7176 },
  { state: "Nagaland", capital: "Kohima", lat: 25.6745, lng: 94.11 },
  { state: "Odisha", capital: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
  { state: "Punjab", capital: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { state: "Rajasthan", capital: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { state: "Sikkim", capital: "Gangtok", lat: 27.3389, lng: 88.6065 },
  { state: "Tamil Nadu", capital: "Chennai", lat: 13.0827, lng: 80.2707 },
  { state: "Telangana", capital: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { state: "Tripura", capital: "Agartala", lat: 23.8315, lng: 91.2868 },
  { state: "Uttar Pradesh", capital: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { state: "Uttarakhand", capital: "Dehradun", lat: 30.3165, lng: 78.0322 },
  { state: "West Bengal", capital: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { state: "Delhi", capital: "New Delhi", lat: 28.6139, lng: 77.209 },
];

const MapIssues = ({ issues, theme }) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-xl border p-6 transition-colors ${
        isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"
      }`}
    >
      <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
        Map View
      </h3>
      <div
        className={`rounded-lg h-[600px] overflow-hidden border shadow-sm transition-colors ${
          isDark ? "border-[#333333]" : "border-gray-200"
        }`}
      >
        <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Capital Markers */}
          {indiaCapitals.map((capital, idx) => (
            <Marker
              key={`capital-${idx}`}
              position={[capital.lat, capital.lng]}
              icon={redIcon}
            >
              <Popup>
                <div>
                  <strong>{capital.capital}</strong>
                  <p>{capital.state}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Issue Markers */}
          {issues.map(
            (issue) =>
              issue.location && (
                <Marker
                  key={issue.id}
                  position={[issue.location.lat, issue.location.lng]}
                  icon={redIcon}
                >
                  <Popup>
                    <div>
                      <strong>{issue.title}</strong>
                      <p>{issue.description}</p>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapIssues;
