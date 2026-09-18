import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  useMapsLibrary,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";


import { useNavigate } from "react-router-dom";

/* =========================================================
   CATEGORY DATA
========================================================= */

const categories = [
  {
    value: "Poor Street Lighting",
    icon: "💡",
    color: "#f59e0b",
  },
  {
    value: "Damaged Road",
    icon: "🚧",
    color: "#ef4444",
  },
  {
    value: "Pothole",
    icon: "🕳️",
    color: "#8b5cf6",
  },
  {
    value: "Waterlogging",
    icon: "🌊",
    color: "#06b6d4",
  },
  {
    value: "Accident-Prone Area",
    icon: "🚨",
    color: "#f97316",
  },
  {
    value: "Fallen Tree",
    icon: "🌳",
    color: "#22c55e",
  },
  {
    value: "Unsafe Area",
    icon: "⚠️",
    color: "#ec4899",
  },
  {
    value: "Other Safety Hazard",
    icon: "❓",
    color: "#64748b",
  },
];

/* =========================================================
   LOCATION SEARCH
========================================================= */

function LocationSearch({
  onLocationSelect,
  onCurrentLocation,
}) {
  const places = useMapsLibrary("places");

  const autocompleteRef = useRef(null);
  const listenerRef = useRef(null);

  const [searchReady, setSearchReady] = useState(false);

  useEffect(() => {
    if (!places) return;

    if (!autocompleteRef.current) {
      const element =
        new places.PlaceAutocompleteElement();

      element.placeholder =
        "Search place, street, landmark, college, village...";

      element.style.width = "100%";
      element.style.height = "52px";
      element.style.display = "block";

      autocompleteRef.current = element;

      const container =
        document.getElementById(
          "hazard-location-search"
        );

      if (container) {
        container.innerHTML = "";
        container.appendChild(element);
      }

      listenerRef.current =
        element.addEventListener(
          "gmp-select",
          async (event) => {
            try {
              const place =
                event.placePrediction.toPlace();

              await place.fetchFields({
                fields: [
                  "displayName",
                  "formattedAddress",
                  "location",
                ],
              });

              if (!place.location) {
                return;
              }

              const locationData = {
                name:
                  place.displayName || "",
                address:
                  place.formattedAddress || "",
                latitude:
                  place.location.lat(),
                longitude:
                  place.location.lng(),
              };

              onLocationSelect(
                locationData
              );
            } catch (error) {
              console.error(
                "Location selection error:",
                error
              );
            }
          }
        );

      setSearchReady(true);
    }

    return () => {
      if (
        autocompleteRef.current &&
        listenerRef.current
      ) {
        autocompleteRef.current.removeEventListener(
          "gmp-select",
          listenerRef.current
        );
      }
    };
  }, [places, onLocationSelect]);

  return (
    <div>
      <div
        id="hazard-location-search"
        style={{
          width: "100%",
          minHeight: "52px",
        }}
      />

      {!searchReady && (
        <div
          style={{
            color: "#64748b",
            fontSize: "14px",
            marginTop: "8px",
          }}
        >
          Loading location search...
        </div>
      )}

      <button
        type="button"
        onClick={onCurrentLocation}
        style={{
          marginTop: "12px",
          padding: "10px 16px",
          border: "1px solid #2563eb",
          borderRadius: "9px",
          background: "#eff6ff",
          color: "#2563eb",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        📍 Use My Current Location
      </button>
    </div>
  );
}

/* =========================================================
   MAIN REPORT HAZARD COMPONENT
========================================================= */

function ReportHazardForm() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showLoginMessage, setShowLoginMessage] = useState(false);

useEffect(() => {
  const loggedIn =
    localStorage.getItem("safeRouteLoggedIn") === "true";

  if (!loggedIn) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      "/report-hazard"
    );

    setShowLoginMessage(true);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } else {
    setIsLoggedIn(true);
  }
}, [navigate]);
  const [hazardTitle, setHazardTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [severity, setSeverity] =
    useState("");

  const [riskTime, setRiskTime] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [locationName, setLocationName] =
    useState("");

  const [locationAddress, setLocationAddress] =
    useState("");

  const [locationStatus, setLocationStatus] =
    useState("");

  const [photo, setPhoto] =
    useState(null);

  const [photoPreview, setPhotoPreview] =
    useState("");
    const [mapCenter, setMapCenter] = useState({
  lat: 18.0858,
  lng: 83.4037,
});

const [mapZoom, setMapZoom] = useState(14);

  const [anonymous, setAnonymous] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =========================================================
     LOCATION SELECTED FROM GOOGLE SEARCH
  ========================================================= */
const handleLocationSelect = (location) => {
  setLatitude(location.latitude);
  setLongitude(location.longitude);

  setLocationName(location.name);
  setLocationAddress(location.address);

  setMapCenter({
    lat: location.latitude,
    lng: location.longitude,
  });

  setMapZoom(17);

  setLocationStatus(
    "Place found. Now click the exact hazard location on the map."
  );
};
const handleMapClick = (event) => {
  const clickedLocation = event.detail.latLng;

  if (!clickedLocation) return;

  const lat = clickedLocation.lat;
  const lng = clickedLocation.lng;

  setLatitude(lat);
  setLongitude(lng);

  setLocationName("Selected Hazard Location");

  setLocationAddress(
    "Exact location selected on the map"
  );

  setLocationStatus(
    "✓ Exact hazard location selected."
  );
};
 
  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setLocationStatus(
      "Geolocation is not supported by your browser."
    );
    return;
  }

  setLocationStatus(
    "Getting your current location..."
  );

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Save exact coordinates
      setLatitude(lat);
      setLongitude(lng);

      // Move map to current location
      setMapCenter({
        lat: lat,
        lng: lng,
      });

      setMapZoom(17);

      setLocationName(
        "My Current Location"
      );

      setLocationAddress(
        "Location captured from your device"
      );

      setLocationStatus(
        "✓ Current location captured successfully. You can click another point on the map if needed."
      );
    },
    (error) => {
      console.error(
        "Location error:",
        error
      );

      if (error.code === 1) {
        setLocationStatus(
          "Location permission was denied. Please allow location access in your browser."
        );
      } else if (error.code === 2) {
        setLocationStatus(
          "Unable to determine your current location."
        );
      } else if (error.code === 3) {
        setLocationStatus(
          "Location request timed out. Please try again."
        );
      } else {
        setLocationStatus(
          "Unable to get your location."
        );
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    }
  );
};

  /* =========================================================
     PHOTO SELECTION
  ========================================================= */

  const handlePhotoChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert(
        "Please select an image file."
      );
      return;
    }

    // Limit photo size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Please select an image smaller than 5 MB."
      );
      return;
    }

    setPhoto(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  };

  /* =========================================================
     REMOVE PHOTO
  ========================================================= */

  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview
      );
    }

    setPhoto(null);
    setPhotoPreview("");
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hazardTitle.trim()) {
      alert(
        "Please enter a hazard title."
      );
      return;
    }

    if (!category) {
      alert(
        "Please select a hazard category."
      );
      return;
    }

    if (!severity) {
      alert(
        "Please select the severity level."
      );
      return;
    }

    if (!latitude || !longitude) {
      alert(
        "Please search and select the hazard location."
      );
      return;
    }

    if (!description.trim()) {
      alert(
        "Please provide a description."
      );
      return;
    }

    const hazardData = {
      title: hazardTitle.trim(),

      category,

      severity,

      riskTime,

      description:
        description.trim(),

      location: {
        name: locationName,
        address: locationAddress,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },

      photo: photo
        ? {
            name: photo.name,
            type: photo.type,
            size: photo.size,
          }
        : null,

      anonymous,

      reportedAt:
        new Date().toISOString(),
    };
    if (!isLoggedIn) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #eff6ff, #f8fafc)",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow:
            "0 15px 40px rgba(15, 23, 42, 0.12)",
        }}
      >
        <div style={{ fontSize: "50px", marginBottom: "15px" }}>
          🔐
        </div>

        <h2
          style={{
            margin: "0 0 10px",
            color: "#0f172a",
          }}
        >
          Login Required
        </h2>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.6",
            marginBottom: "25px",
          }}
        >
          Please login to your SafeRoute account before
          reporting a hazard.
        </p>

        <p
          style={{
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Redirecting you to Login...
        </p>
      </div>
    </div>
  );
}
const currentUser = JSON.parse(
  localStorage.getItem("safeRouteUser")
);

const existingReports = JSON.parse(
  localStorage.getItem("safeRouteReports") || "[]"
);

const newReport = {
  id: Date.now(),
  userId: currentUser?.email || "unknown",
  userName: currentUser?.name || "Unknown User",
  ...hazardData,
  status: "Pending",
};

localStorage.setItem(
  "safeRouteReports",
  JSON.stringify([
    ...existingReports,
    newReport,
  ])
);

    console.log(
      "HAZARD REPORT:",
      hazardData
    );
    try {
  setIsSubmitting(true);

  const token = localStorage.getItem("safeRouteToken");

  if (!token) {
    alert("Please login before submitting a hazard report.");
    return;
  }
const formData = new FormData();

formData.append("title", hazardTitle.trim());
formData.append("category", category);
formData.append("severity", severity);
formData.append("riskTime", riskTime);
formData.append("description", description.trim());

formData.append(
  "location",
  JSON.stringify({
    address: locationAddress,
    latitude: Number(latitude),
    longitude: Number(longitude),
  })
);

formData.append("anonymous", String(anonymous));

if (photo) {
  formData.append("photo", photo);
}

const response = await fetch(
  "https://saferoutemap-backend-2aql.onrender.com/api/reports",
  {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  }
);

  const data = await response.json();

  if (!response.ok) {
    alert(
      data.message ||
        "Failed to submit hazard report."
    );
    return;
  }

  console.log(
    "Backend response:",
    data
  );

  alert(
    `Hazard report submitted successfully!\nReport ID: ${data.report.reportId}`
  );

  // Clear form
  setHazardTitle("");
  setCategory("");
  setSeverity("");
  setRiskTime("");
  setDescription("");
  setLatitude("");
  setLongitude("");
  setLocationName("");
  setLocationAddress("");
  setLocationStatus("");
  removePhoto();
  setAnonymous(false);


  } catch (error) {
  console.error(
    "Hazard report submission error:",
    error
  );

  alert(
    "Report submission failed:\n" +
      (error.message || "Unknown error")
  );
}

 finally {
  setIsSubmitting(false);
}
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      style={{
        minHeight:
          "calc(100vh - 70px)",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        padding: "45px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow:
            "0 12px 40px rgba(15, 23, 42, 0.12)",
          overflow: "hidden",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            padding: "28px 32px",
            background:
              "linear-gradient(135deg, #0f172a, #172554)",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background:
                  "rgba(245, 158, 11, 0.16)",
                border:
                  "1px solid rgba(245, 158, 11, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "27px",
              }}
            >
              ⚠️
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: "750",
                }}
              >
                Report Unsafe Location
              </h1>

              <p
                style={{
                  margin:
                    "5px 0 0",
                  color: "#cbd5e1",
                  fontSize: "14px",
                }}
              >
                Help keep your community
                safe by reporting hazards.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "32px",
          }}
        >
          {/* =================================================
              HAZARD TITLE
          ================================================= */}

          <label
            style={labelStyle}
          >
            HAZARD TITLE{" "}
            <span style={requiredStyle}>
              *
            </span>
          </label>

          <input
            type="text"
            value={hazardTitle}
            onChange={(e) =>
              setHazardTitle(
                e.target.value
              )
            }
            placeholder="e.g., Large pothole near college entrance"
            style={inputStyle}
          />

          {/* =================================================
              CATEGORY
          ================================================= */}

          <label
            style={{
              ...labelStyle,
              marginTop: "25px",
            }}
          >
            CATEGORY{" "}
            <span style={requiredStyle}>
              *
            </span>
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            {categories.map(
              (item) => {
                const selected =
                  category ===
                  item.value;

                return (
                  <button
                    key={
                      item.value
                    }
                    type="button"
                    onClick={() =>
                      setCategory(
                        item.value
                      )
                    }
                    style={{
                      minHeight:
                        "85px",
                      borderRadius:
                        "12px",
                      border: selected
                        ? `2px solid ${item.color}`
                        : "1px solid #dbe3ef",
                      background:
                        selected
                          ? `${item.color}12`
                          : "#f8fafc",
                      cursor:
                        "pointer",
                      padding:
                        "12px 8px",
                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "23px",
                        marginBottom:
                          "7px",
                      }}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "13px",
                        fontWeight:
                          "650",
                        color:
                          selected
                            ? item.color
                            : "#475569",
                      }}
                    >
                      {item.value}
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {/* =================================================
              LOCATION
          ================================================= */}

          <div
            style={{
              marginTop: "28px",
              padding: "22px",
              border:
                "1px solid #dbe3ef",
              borderRadius: "16px",
              background: "#f8fafc",
            }}
          >
            <label
              style={{
                ...labelStyle,
                marginTop: 0,
              }}
            >
              📍 SEARCH HAZARD LOCATION{" "}
              <span
                style={requiredStyle}
              >
                *
              </span>
            </label>

            <p
              style={{
                margin:
                  "0 0 12px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Search for the place where
              the hazard exists. It does
              not have to be your current
              location.
            </p>

            <LocationSearch
              onLocationSelect={
                handleLocationSelect
              }
              onCurrentLocation={
                getCurrentLocation
              }
            />
            <div
  style={{
    marginTop: "16px",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid #cbd5e1",
  }}
>
  <div
    style={{
      padding: "12px 14px",
      background: "#eff6ff",
      color: "#1e40af",
      fontSize: "13px",
      fontWeight: "600",
    }}
  >
    📍 Search for a landmark or place above, then click the
    exact location of the hazard on the map.
  </div>

  <Map
  defaultCenter={mapCenter}
  defaultZoom={mapZoom}
  style={{
    width: "100%",
    height: "400px",
  }}
  gestureHandling="greedy"
  zoomControl={true}
  fullscreenControl={true}
  streetViewControl={false}
  mapTypeControl={false}
  onClick={handleMapClick}
>
    {latitude && longitude && (
      <Marker
        position={{
          lat: Number(latitude),
          lng: Number(longitude),
        }}
      />
    )}
  </Map>
</div>

            {/* SELECTED LOCATION */}

            {latitude &&
              longitude && (
                <div
                  style={{
                    marginTop:
                      "15px",
                    padding:
                      "15px",
                    background:
                      "#ecfdf5",
                    border:
                      "1px solid #a7f3d0",
                    borderRadius:
                      "11px",
                  }}
                >
                  <div
                    style={{
                      fontWeight:
                        "700",
                      color:
                        "#047857",
                      marginBottom:
                        "5px",
                    }}
                  >
                    ✓ Location
                    Selected
                  </div>

                  {locationName && (
                    <div
                      style={{
                        fontWeight:
                          "600",
                        color:
                          "#1f2937",
                      }}
                    >
                      {locationName}
                    </div>
                  )}

                  {locationAddress && (
                    <div
                      style={{
                        color:
                          "#64748b",
                        fontSize:
                          "13px",
                        marginTop:
                          "3px",
                      }}
                    >
                      {
                        locationAddress
                      }
                    </div>
                  )}

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "20px",
                      marginTop:
                        "10px",
                      fontSize:
                        "13px",
                      color:
                        "#475569",
                    }}
                  >
                    <span>
                      <strong>
                        Lat:
                      </strong>{" "}
                      {Number(
                        latitude
                      ).toFixed(
                        6
                      )}
                    </span>

                    <span>
                      <strong>
                        Lng:
                      </strong>{" "}
                      {Number(
                        longitude
                      ).toFixed(
                        6
                      )}
                    </span>
                  </div>
                </div>
              )}

            {locationStatus && (
              <div
                style={{
                  marginTop:
                    "10px",
                  color:
                    locationStatus.includes(
                      "successfully"
                    )
                      ? "#059669"
                      : "#64748b",
                  fontSize:
                    "13px",
                  fontWeight:
                    "600",
                }}
              >
                {locationStatus}
              </div>
            )}
          </div>

          {/* =================================================
              SEVERITY + RISK TIME
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "18px",
              marginTop: "25px",
            }}
          >
            <div>
              <label
                style={labelStyle}
              >
                SEVERITY LEVEL{" "}
                <span
                  style={requiredStyle}
                >
                  *
                </span>
              </label>

              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select severity
                </option>
                <option value="Low">
                  🟢 Low Risk
                </option>
                <option value="Medium">
                  🟡 Medium Risk
                </option>
                <option value="High">
                  🔴 High Risk
                </option>
              </select>
            </div>

            <div>
              <label
                style={labelStyle}
              >
                PEAK RISK TIME
              </label>

              <select
                value={riskTime}
                onChange={(e) =>
                  setRiskTime(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select time
                </option>
                <option value="All Day">
                  All Day
                </option>
                <option value="Morning">
                  Morning
                </option>
                <option value="Afternoon">
                  Afternoon
                </option>
                <option value="Evening">
                  Evening
                </option>
                <option value="Night">
                  Night
                </option>
              </select>
            </div>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <label
            style={{
              ...labelStyle,
              marginTop: "25px",
            }}
          >
            DETAILED DESCRIPTION{" "}
            <span
              style={requiredStyle}
            >
              *
            </span>
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Describe the hazard, its condition, and why it may be unsafe..."
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "120px",
              fontFamily:
                "inherit",
            }}
          />

          {/* =================================================
              PHOTO
          ================================================= */}

          <label
            style={{
              ...labelStyle,
              marginTop: "25px",
            }}
          >
            📷 OPTIONAL HAZARD PHOTO
          </label>

          {!photoPreview ? (
            <label
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                minHeight:
                  "130px",
                border:
                  "2px dashed #cbd5e1",
                borderRadius:
                  "14px",
                background:
                  "#f8fafc",
                cursor:
                  "pointer",
                textAlign:
                  "center",
                padding: "20px",
                boxSizing:
                  "border-box",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize:
                      "32px",
                    marginBottom:
                      "8px",
                  }}
                >
                  📷
                </div>

                <div
                  style={{
                    fontWeight:
                      "700",
                    color:
                      "#334155",
                  }}
                >
                  Choose an image
                </div>

                <div
                  style={{
                    marginTop:
                      "4px",
                    fontSize:
                      "12px",
                    color:
                      "#94a3b8",
                  }}
                >
                  JPG, PNG or WEBP •
                  Maximum 5 MB
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handlePhotoChange
                }
                style={{
                  display:
                    "none",
                }}
              />
            </label>
          ) : (
            <div
              style={{
                border:
                  "1px solid #dbe3ef",
                borderRadius:
                  "14px",
                padding:
                  "12px",
                background:
                  "#f8fafc",
              }}
            >
              <img
                src={photoPreview}
                alt="Hazard preview"
                style={{
                  width: "100%",
                  maxHeight:
                    "300px",
                  objectFit:
                    "contain",
                  borderRadius:
                    "10px",
                  display:
                    "block",
                  background:
                    "#e2e8f0",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginTop:
                    "10px",
                }}
              >
                <span
                  style={{
                    fontSize:
                      "13px",
                    color:
                      "#64748b",
                    overflow:
                      "hidden",
                    textOverflow:
                      "ellipsis",
                  }}
                >
                  {photo?.name}
                </span>

                <button
                  type="button"
                  onClick={
                    removePhoto
                  }
                  style={{
                    border:
                      "none",
                    background:
                      "#fee2e2",
                    color:
                      "#dc2626",
                    padding:
                      "7px 12px",
                    borderRadius:
                      "7px",
                    fontWeight:
                      "600",
                    cursor:
                      "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              ANONYMOUS
          ================================================= */}

          <label
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              marginTop:
                "22px",
              padding:
                "16px",
              border:
                "1px solid #e2e8f0",
              borderRadius:
                "11px",
              background:
                "#f8fafc",
              cursor:
                "pointer",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight:
                    "650",
                  color:
                    "#334155",
                }}
              >
                Post this report
                anonymously
              </div>

              <div
                style={{
                  fontSize:
                    "12px",
                  color:
                    "#94a3b8",
                  marginTop:
                    "3px",
                }}
              >
                Your identity will
                not be displayed with
                the report.
              </div>
            </div>

            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) =>
                setAnonymous(
                  e.target.checked
                )
              }
              style={{
                width: "19px",
                height: "19px",
                cursor:
                  "pointer",
              }}
            />
          </label>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "flex-end",
              gap: "12px",
              marginTop:
                "28px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              style={{
                padding:
                  "13px 22px",
                border:
                  "1px solid #cbd5e1",
                borderRadius:
                  "10px",
                background:
                  "white",
                color:
                  "#475569",
                fontWeight:
                  "650",
                cursor:
                  "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              style={{
                padding:
                  "13px 25px",
                border: "none",
                borderRadius:
                  "10px",
                background:
                  isSubmitting
                    ? "#94a3b8"
                    : "#dc2626",
                color:
                  "white",
                fontWeight:
                  "750",
                fontSize:
                  "15px",
                cursor:
                  isSubmitting
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  "0 5px 15px rgba(220,38,38,0.20)",
              }}
            >
              {isSubmitting
                ? "Submitting..."
                : "🚨 Submit Hazard Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   API PROVIDER
========================================================= */

function ReportHazard() {
  return (
    <APIProvider
      apiKey={
        import.meta.env
          .VITE_GOOGLE_MAPS_API_KEY
      }
    >
      <ReportHazardForm />
    </APIProvider>
  );
}

/* =========================================================
   SHARED STYLES
========================================================= */

const labelStyle = {
  display: "block",
  marginBottom: "9px",
  color: "#334155",
  fontSize: "13px",
  fontWeight: "750",
  letterSpacing: "0.3px",
};

const requiredStyle = {
  color: "#dc2626",
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#1e293b",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

export default ReportHazard;