
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

/* =========================================================
   DEFAULT MAP LOCATION
   ========================================================= */

const DEFAULT_POSITION = {
  lat: 18.0858,
  lng: 83.4037,
};

/* =========================================================
   CATEGORY ICON
   ========================================================= */

function getCategoryIcon(category) {
  switch (category) {
    case "Poor Street Lighting":
      return "💡";

    case "Damaged Road":
      return "🚧";

    case "Pothole":
      return "🕳️";

    case "Waterlogging":
      return "🌊";

    case "Accident-Prone Area":
      return "🚨";

    case "Fallen Tree":
      return "🌳";

    case "Unsafe Area":
      return "⚠️";

    case "Other Safety Hazard":
      return "🔴";

    default:
      return "⚠️";
  }
}

/* =========================================================
   SEVERITY COLOR
   ========================================================= */

function getSeverityColor(severity) {
  switch (severity) {
    case "High":
      return "#dc2626";

    case "Medium":
      return "#f59e0b";

    case "Low":
      return "#16a34a";

    default:
      return "#6b7280";
  }
}

/* =========================================================
   GOOGLE LOCATION SEARCH
   ========================================================= */

function LocationSearch({ onPlaceSelect }) {
  const places = useMapsLibrary("places");

  const containerRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!places) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    if (autocompleteRef.current) {
      return;
    }

    const autocomplete =
      new places.PlaceAutocompleteElement();

    autocomplete.placeholder =
      "Search for a location...";

    autocomplete.includedRegionCodes = ["in"];

    autocomplete.style.width = "100%";

    autocompleteRef.current = autocomplete;

    containerRef.current.appendChild(
      autocomplete
    );

    const handleSelect = async ({
      placePrediction,
    }) => {
      try {
        if (!placePrediction) {
          return;
        }

        const place =
          placePrediction.toPlace();

        await place.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "location",
            "viewport",
          ],
        });

        if (!place.location) {
          console.error(
            "Google place has no location."
          );

          return;
        }

        const result = {
          name:
            place.displayName ||
            "Selected Location",

          address:
            place.formattedAddress || "",

          lat: place.location.lat(),

          lng: place.location.lng(),

          viewport:
            place.viewport || null,
        };

        console.log(
          "Selected Google location:",
          result
        );

        onPlaceSelect(result);
      } catch (error) {
        console.error(
          "Google Places error:",
          error
        );
      }
    };

    const handleError = (event) => {
      console.error(
        "Google autocomplete error:",
        event
      );
    };

    autocomplete.addEventListener(
      "gmp-select",
      handleSelect
    );

    autocomplete.addEventListener(
      "gmp-error",
      handleError
    );

    return () => {
      autocomplete.removeEventListener(
        "gmp-select",
        handleSelect
      );

      autocomplete.removeEventListener(
        "gmp-error",
        handleError
      );

      if (
        containerRef.current &&
        autocomplete.parentNode ===
          containerRef.current
      ) {
        containerRef.current.removeChild(
          autocomplete
        );
      }

      autocompleteRef.current = null;
    };
  }, [places, onPlaceSelect]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        minHeight: "52px",
        position: "relative",
        zIndex: 1000,
      }}
    />
  );
}

/* =========================================================
   MAP CAMERA CONTROLLER
   ========================================================= */

function MapCameraController({
  selectedPlace,
  selectedLocation,
  resetCounter,
}) {
  const map = useMap();

  /* ---------------------------------------------------------
     Move to selected Google place
  --------------------------------------------------------- */

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!selectedPlace) {
      return;
    }

    const position = {
      lat: selectedPlace.lat,
      lng: selectedPlace.lng,
    };

    if (selectedPlace.viewport) {
      map.fitBounds(
        selectedPlace.viewport
      );

      window.setTimeout(() => {
        const currentZoom =
          map.getZoom();

        if (
          currentZoom !== undefined &&
          currentZoom > 17
        ) {
          map.setZoom(17);
        }
      }, 400);
    } else {
      map.panTo(position);
      map.setZoom(16);
    }
  }, [map, selectedPlace]);

  /* ---------------------------------------------------------
     Move to selected unsafe location
  --------------------------------------------------------- */

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!selectedLocation) {
      return;
    }

    map.panTo({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });

    map.setZoom(16);
  }, [map, selectedLocation]);

  /* ---------------------------------------------------------
     Reset map
  --------------------------------------------------------- */

  useEffect(() => {
    if (!map) {
      return;
    }

    if (resetCounter === 0) {
      return;
    }

    map.panTo(DEFAULT_POSITION);
    map.setZoom(11);
  }, [map, resetCounter]);

  return null;
}

/* =========================================================
   MAP CONTROLS
   ========================================================= */

function MapControls() {
  const map = useMap();

  if (!map) {
    return null;
  }

  const buttonStyle = {
    width: "42px",
    height: "42px",
    border: "none",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const zoomIn = () => {
    const zoom =
      map.getZoom() || 11;

    map.setZoom(
      Math.min(zoom + 1, 20)
    );
  };

  const zoomOut = () => {
    const zoom =
      map.getZoom() || 11;

    map.setZoom(
      Math.max(zoom - 1, 2)
    );
  };

  const moveUp = () => {
    map.panBy(0, -150);
  };

  const moveDown = () => {
    map.panBy(0, 150);
  };

  const moveLeft = () => {
    map.panBy(-150, 0);
  };

  const moveRight = () => {
    map.panBy(150, 0);
  };

  const reset = () => {
    map.panTo(DEFAULT_POSITION);
    map.setZoom(11);
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "15px",
        top: "15px",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        gap: "7px",
      }}
    >
      <button
        type="button"
        onClick={zoomIn}
        style={buttonStyle}
        title="Zoom in"
      >
        +
      </button>

      <button
        type="button"
        onClick={zoomOut}
        style={buttonStyle}
        title="Zoom out"
      >
        −
      </button>

      <div
        style={{
          height: "5px",
        }}
      />

      <button
        type="button"
        onClick={moveUp}
        style={buttonStyle}
        title="Move up"
      >
        ↑
      </button>

      <button
        type="button"
        onClick={moveDown}
        style={buttonStyle}
        title="Move down"
      >
        ↓
      </button>

      <button
        type="button"
        onClick={moveLeft}
        style={buttonStyle}
        title="Move left"
      >
        ←
      </button>

      <button
        type="button"
        onClick={moveRight}
        style={buttonStyle}
        title="Move right"
      >
        →
      </button>

      <div
        style={{
          height: "5px",
        }}
      />

      <button
        type="button"
        onClick={reset}
        style={buttonStyle}
        title="Reset map"
      >
        ⌖
      </button>
    </div>
  );
}

/* =========================================================
   MAP LEGEND
   ========================================================= */

function MapLegend() {
  return (
    <div
      style={{
        position: "absolute",
        left: "15px",
        bottom: "15px",
        zIndex: 10,
        background: "#ffffff",
        padding: "12px",
        borderRadius: "10px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.25)",
        minWidth: "145px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: "700",
          marginBottom: "8px",
        }}
      >
        Severity
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "5px",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#dc2626",
          }}
        />

        High
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "5px",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#f59e0b",
          }}
        />

        Medium
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#16a34a",
          }}
        />

        Low
      </div>
    </div>
  );
}

/* =========================================================
   MAIN CONTENT
   ========================================================= */

function UnsafeLocationContent() {
  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [severityFilter, setSeverityFilter] =
    useState("All");

  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState(null);

  const [
    selectedPlace,
    setSelectedPlace,
  ] = useState(null);

  const [resetCounter, setResetCounter] =
    useState(0);

  /* =======================================================
     VERIFIED REPORTS FROM BACKEND
  ======================================================= */

  const [unsafeLocations, setUnsafeLocations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH VERIFIED REPORTS
  ======================================================= */

  const fetchVerifiedReports = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://saferoutemap-backend-2aql.onrender.com/api/reports/verified"
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to fetch verified reports"
          );
        }

        /*
          Convert backend report format
          into the format used by our map.
        */

        const formattedReports =
          (data.reports || [])
            .filter((report) => {
              return (
                report.location &&
                report.location.latitude !==
                  undefined &&
                report.location.longitude !==
                  undefined
              );
            })
            .map((report) => {
              const category =
                report.category ||
                "Other Safety Hazard";

              return {
                id: report._id,

                reportId:
                  report.reportId,

                title:
                  report.title ||
                  category,

                category,

                location:
                  report.location?.address ||
                  "Reported location",

                address:
                  report.location?.address ||
                  "Location captured",

                severity:
                  report.severity || "Low",

                lat: Number(
                  report.location.latitude
                ),

                lng: Number(
                  report.location.longitude
                ),

                icon:
                  getCategoryIcon(category),

                description:
                  report.description || "",

                createdAt:
                  report.createdAt || null,

                reporter:
                  report.userId?.name ||
                  "SafeRoute User",
              };
            });

        setUnsafeLocations(
          formattedReports
        );
      } catch (error) {
        console.error(
          "Verified reports error:",
          error
        );

        setError(
          error.message ||
            "Unable to load unsafe locations."
        );

        setUnsafeLocations([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchVerifiedReports();
  }, [fetchVerifiedReports]);

  /* =======================================================
     GOOGLE SEARCH SELECT
  ======================================================= */

  const handlePlaceSelect =
    useCallback((place) => {
      setSelectedPlace(place);
      setSelectedLocation(null);
    }, []);

  /* =======================================================
     UNSAFE LOCATION SELECT
  ======================================================= */

  const handleSelectLocation = (
    location
  ) => {
    setSelectedLocation(location);
    setSelectedPlace(null);
  };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredLocations =
    unsafeLocations.filter(
      (item) => {
        const text =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          text === "" ||
          item.title
            .toLowerCase()
            .includes(text) ||
          item.location
            .toLowerCase()
            .includes(text) ||
          item.address
            .toLowerCase()
            .includes(text) ||
          item.category
            .toLowerCase()
            .includes(text);

        const matchesCategory =
          categoryFilter === "All" ||
          item.category ===
            categoryFilter;

        const matchesSeverity =
          severityFilter === "All" ||
          item.severity ===
            severityFilter;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesSeverity
        );
      }
    );

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearFilters = () => {
    setSearch("");

    setCategoryFilter("All");

    setSeverityFilter("All");

    setSelectedLocation(null);

    setSelectedPlace(null);

    setResetCounter(
      (value) => value + 1
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* ===================================================
          HEADER
          =================================================== */}

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Unsafe Locations
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          View verified safety hazards
          reported by SafeRoute users.
        </p>
      </div>

      {/* ===================================================
          SEARCH + FILTERS
          =================================================== */}

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 20px",
          background: "#ffffff",
          padding: "18px",
          borderRadius: "14px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(280px, 1fr) 210px 180px auto",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {/* GOOGLE LOCATION SEARCH */}

          <div
            style={{
              minWidth: 0,
            }}
          >
            <LocationSearch
              onPlaceSelect={
                handlePlaceSelect
              }
            />
          </div>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            style={{
              height: "52px",
              width: "100%",
              padding: "0 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "10px",
              background: "#ffffff",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">
              All Categories
            </option>

            <option value="Poor Street Lighting">
              Poor Street Lighting
            </option>

            <option value="Damaged Road">
              Damaged Road
            </option>

            <option value="Pothole">
              Pothole
            </option>

            <option value="Waterlogging">
              Waterlogging
            </option>

            <option value="Accident-Prone Area">
              Accident-Prone Area
            </option>

            <option value="Fallen Tree">
              Fallen Tree
            </option>

            <option value="Unsafe Area">
              Unsafe Area
            </option>

            <option value="Other Safety Hazard">
              Other Safety Hazard
            </option>
          </select>

          {/* SEVERITY */}

          <select
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(
                event.target.value
              )
            }
            style={{
              height: "52px",
              width: "100%",
              padding: "0 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "10px",
              background: "#ffffff",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">
              All Severity
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>
          </select>

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearFilters}
            style={{
              height: "52px",
              padding: "0 20px",
              border: "none",
              borderRadius: "10px",
              background: "#111827",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto 20px",
            padding: "14px 16px",
            background: "#fff1f2",
            border:
              "1px solid #fecdd3",
            borderRadius: "10px",
            color: "#be123c",
            fontSize: "14px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ===================================================
          MAP + LIST
          =================================================== */}

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) 360px",
          gap: "20px",
        }}
      >
        {/* =================================================
            MAP
            ================================================= */}

        <div
          style={{
            position: "relative",
            height: "600px",
            background: "#ffffff",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <Map
            defaultCenter={
              DEFAULT_POSITION
            }
            defaultZoom={11}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={false}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={true}
            clickableIcons={true}
            mapId="SAFE_ROUTE_MAP"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {/* CAMERA */}

            <MapCameraController
              selectedPlace={
                selectedPlace
              }
              selectedLocation={
                selectedLocation
              }
              resetCounter={
                resetCounter
              }
            />

            {/* CONTROLS */}

            <MapControls />

            {/* VERIFIED HAZARD MARKERS */}

            {filteredLocations.map(
              (location) => (
                <AdvancedMarker
                  key={location.id}
                  position={{
                    lat: location.lat,
                    lng: location.lng,
                  }}
                  onClick={() =>
                    handleSelectLocation(
                      location
                    )
                  }
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background:
                        getSeverityColor(
                          location.severity
                        ),
                      border:
                        "3px solid white",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      fontSize: "21px",
                      cursor: "pointer",
                    }}
                  >
                    {location.icon}
                  </div>
                </AdvancedMarker>
              )
            )}

            {/* =================================================
                SELECTED VERIFIED LOCATION
                ================================================= */}

            {selectedLocation && (
              <InfoWindow
                position={{
                  lat:
                    selectedLocation.lat,
                  lng:
                    selectedLocation.lng,
                }}
                onCloseClick={() =>
                  setSelectedLocation(
                    null
                  )
                }
              >
                <div
                  style={{
                    minWidth: "240px",
                    padding: "4px",
                  }}
                >
                  <h3
                    style={{
                      margin:
                        "0 0 8px",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {selectedLocation.icon}{" "}
                    {selectedLocation.title}
                  </h3>

                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "13px",
                      color: "#4b5563",
                    }}
                  >
                    📍{" "}
                    {selectedLocation.address}
                  </p>

                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "13px",
                      color: "#4b5563",
                    }}
                  >
                    Category:{" "}
                    {selectedLocation.category}
                  </p>

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      fontSize: "13px",
                      fontWeight: "700",
                      color:
                        getSeverityColor(
                          selectedLocation.severity
                        ),
                    }}
                  >
                    Severity:{" "}
                    {selectedLocation.severity}
                  </p>

                  {selectedLocation
                    .description && (
                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "12px",
                        color: "#4b5563",
                        lineHeight: "1.5",
                      }}
                    >
                      {
                        selectedLocation.description
                      }
                    </p>
                  )}

                  {selectedLocation
                    .createdAt && (
                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize: "11px",
                        color: "#6b7280",
                      }}
                    >
                      Reported:{" "}
                      {new Date(
                        selectedLocation.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}

            {/* =================================================
                SELECTED GOOGLE PLACE
                ================================================= */}

            {selectedPlace && (
              <AdvancedMarker
                position={{
                  lat:
                    selectedPlace.lat,
                  lng:
                    selectedPlace.lng,
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    border:
                      "3px solid white",
                    boxShadow:
                      "0 2px 10px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    fontSize: "22px",
                  }}
                >
                  📍
                </div>
              </AdvancedMarker>
            )}
          </Map>

          {/* LEGEND */}

          <MapLegend />
        </div>

        {/* =================================================
            LOCATION LIST
            ================================================= */}

        <div
          style={{
            height: "600px",
            overflowY: "auto",
            background: "#ffffff",
            borderRadius: "14px",
            padding: "18px",
            boxSizing: "border-box",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Verified Locations
            </h2>

            <span
              style={{
                padding: "5px 10px",
                borderRadius: "20px",
                background: "#f3f4f6",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {filteredLocations.length}
            </span>
          </div>

          {/* LOADING */}

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px 15px",
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  fontSize: "35px",
                  marginBottom: "10px",
                }}
              >
                ⏳
              </div>

              <p
                style={{
                  margin: "0 0 5px",
                  fontWeight: "600",
                }}
              >
                Loading verified
                locations...
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Please wait.
              </p>
            </div>
          ) : filteredLocations.length ===
            0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px 15px",
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  marginBottom: "10px",
                }}
              >
                🔍
              </div>

              <p
                style={{
                  margin: "0 0 5px",
                  fontWeight: "600",
                }}
              >
                No verified unsafe
                locations found
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Try changing the
                filters.
              </p>
            </div>
          ) : (
            filteredLocations.map(
              (location) => (
                <div
                  key={location.id}
                  onClick={() =>
                    handleSelectLocation(
                      location
                    )
                  }
                  style={{
                    border:
                      selectedLocation?.id ===
                      location.id
                        ? "2px solid #2563eb"
                        : "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "14px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    background:
                      selectedLocation?.id ===
                      location.id
                        ? "#eff6ff"
                        : "#ffffff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "25px",
                        }}
                      >
                        {location.icon}
                      </div>

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3
                          style={{
                            margin:
                              "0 0 5px",
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "#111827",
                          }}
                        >
                          {location.title}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#6b7280",
                          }}
                        >
                          📍{" "}
                          {location.address}
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        height: "fit-content",
                        padding: "4px 8px",
                        borderRadius: "20px",
                        background:
                          getSeverityColor(
                            location.severity
                          ),
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "700",
                        flexShrink: 0,
                      }}
                    >
                      {location.severity}
                    </span>
                  </div>

                  <p
                    style={{
                      margin:
                        "10px 0 0 35px",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    {location.category}
                  </p>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* =================================================
          RESPONSIVE
          ================================================= */}

      <style>
        {`
          @media (max-width: 1000px) {
            div[style*="minmax(0px, 1fr) 360px"] {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 750px) {
            div[style*="minmax(280px, 1fr) 210px 180px auto"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function UnsafeLocation() {
  const apiKey =
    import.meta.env
      .VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <h2>
          Google Maps API key is missing
        </h2>

        <p>
          Check your project's{" "}
          <strong>.env</strong> file.
        </p>

        <pre
          style={{
            padding: "15px",
            background: "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
        </pre>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <UnsafeLocationContent />
    </APIProvider>
  );
}

export default UnsafeLocation;