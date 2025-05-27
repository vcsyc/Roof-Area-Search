import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

function App() {
  const [map, setMap] = useState(null);
  const [city, setCity] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.7151, lng: 44.8271 },
        zoom: 13,
      });
      setMap(mapInstance);
    });
  }, []);

  const handleSearch = () => {
    if (!map || !city) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: city }, (results, status) => {
      if (status === "OK" && results[0]) {
        map.setCenter(results[0].geometry.location);
        const buildings = [
          {
            lat: results[0].geometry.location.lat() + 0.005,
            lng: results[0].geometry.location.lng() + 0.005,
            area: 320,
          },
          {
            lat: results[0].geometry.location.lat() - 0.004,
            lng: results[0].geometry.location.lng() - 0.004,
            area: 280,
          },
        ];
        const filtered = buildings.filter(
          (b) => b.area >= parseInt(minArea || 0) && b.area <= parseInt(maxArea || Infinity)
        );
        filtered.forEach((b) => {
          new window.google.maps.Marker({
            position: { lat: b.lat, lng: b.lng },
            map,
            title: `Roof Area: ${b.area} m²`,
          });
        });
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Roof Area Locator</h2>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ margin: 4 }}
      />
      <input
        type="number"
        placeholder="Min area"
        value={minArea}
        onChange={(e) => setMinArea(e.target.value)}
        style={{ margin: 4 }}
      />
      <input
        type="number"
        placeholder="Max area"
        value={maxArea}
        onChange={(e) => setMaxArea(e.target.value)}
        style={{ margin: 4 }}
      />
      <button onClick={handleSearch}>Search</button>
      <div id="map" style={{ height: "500px", width: "100%", marginTop: 16 }}></div>
    </div>
  );
}

export default App;
