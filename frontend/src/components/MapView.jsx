
import { useState, useCallback, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMapsLibrary,

  useMap,
} from "@vis.gl/react-google-maps";


function LocationSearch({
  placeholder,
  onPlaceSelect,
  currentLocationText,
}) {
  const places = useMapsLibrary("places");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    console.log(
      "Creating autocomplete:",
      placeholder
    );

    const autocomplete =
      new places.PlaceAutocompleteElement();

    autocomplete.placeholder = placeholder;
    if (currentLocationText) {
  autocomplete.value = currentLocationText;
}

    autocomplete.includedRegionCodes = ["in"];

    autocomplete.style.width = "350px";
    autocomplete.style.height = "50px";
    autocomplete.style.backgroundColor = "white";
    autocomplete.style.border =
      "1px solid #d1d5db";
    autocomplete.style.borderRadius = "10px";
    autocomplete.style.boxShadow =
      "0 3px 10px rgba(0,0,0,0.18)";
    autocomplete.style.colorScheme = "light";

    inputRef.current.appendChild(autocomplete);

    const handleSelect = async (event) => {
      console.log(
        "Place selected:",
        event
      );

      try {
        const placePrediction =
          event.placePrediction;

        if (!placePrediction) return;

        const place =
          placePrediction.toPlace();

        await place.fetchFields({
          fields: [
            "displayName",
            "location",
            "formattedAddress",
          ],
        });

        if (!place.location) return;

        const location = {
          lat: place.location.lat(),
          lng: place.location.lng(),
        };

        onPlaceSelect(location);
      } catch (error) {
        console.error(
          "Place selection error:",
          error
        );
      }
    };

    const handleError = (event) => {
      console.error(
        "Google Places Autocomplete Error:",
        event
      );
    };

    
    autocomplete.addEventListener(
  "gmp-select",
  handleSelect
);

const handleInput = () => {
  if (!autocomplete.value) {
    onPlaceSelect(null);
  }
};

autocomplete.addEventListener(
  "input",
  handleInput
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
    "input",
    handleInput
  );

  autocomplete.removeEventListener(
    "gmp-error",
    handleError
  );

  autocomplete.remove();
};
 }, [places, placeholder, currentLocationText]);

  return (
    <div
      style={{
        width: "350px",
        position: "relative",
        zIndex: 9999,
      }}
    >
      <div ref={inputRef} />
    </div>
  );
}
/* ================================
   DISTANCE BETWEEN TWO POINTS
================================ */

function getDistanceInMeters(point1, point2) {
  const R = 6371000;

  const lat1 = (point1.lat * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;

  const dLat =
    ((point2.lat - point1.lat) * Math.PI) / 180;

  const dLng =
    ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
/* ================================
   HAZARD PENALTIES
================================ */

const hazardPenalties = {
  "Poor Street Lighting": {
    Low: 5,
    Medium: 10,
    High: 15,
  },

  "Damaged Road": {
    Low: 8,
    Medium: 15,
    High: 25,
  },

  "Pothole": {
    Low: 8,
    Medium: 15,
    High: 25,
  },

  "Waterlogging": {
    Low: 10,
    Medium: 20,
    High: 30,
  },

  "Accident-Prone Area": {
    Low: 10,
    Medium: 20,
    High: 30,
  },

  "Fallen Tree": {
    Low: 8,
    Medium: 15,
    High: 25,
  },

  "Unsafe Area": {
    Low: 10,
    Medium: 20,
    High: 30,
  },

  "Other Safety Hazard": {
    Low: 5,
    Medium: 10,
    High: 20,
  },
};
/* ================================
   ROUTE COMPONENT
================================ */

function RouteDisplay({
  userLocation,
  destinationLocation,
  hazards,
  onRouteInfo,
  selectedRoute,
  onSafestRoute,
}) {
  const routesLibrary = useMapsLibrary("routes");
  const map = useMap();

  useEffect(() => {
    if (
      !routesLibrary ||
      !map ||
      !userLocation ||
      !destinationLocation
    ) {
      return;
    }

    let polylines = [];
    let cancelled = false;

    const calculateRoute = async () => {
      try {
        console.log("Calculating routes...");

        const { Route } = routesLibrary;

        const request = {
          origin: userLocation,
          destination: destinationLocation,
          travelMode: "DRIVING",

          computeAlternativeRoutes: true,

          fields: [
            "path",
            "distanceMeters",
            "durationMillis",
            "viewport",
          ],
        };

        const result =
          await Route.computeRoutes(request);

        if (cancelled) return;

        if (
          !result.routes ||
          result.routes.length === 0
        ) {
          console.log("No routes found.");
          return;
        }

        const routes = result.routes;

        console.log(
          "Number of routes found:",
          routes.length
        );

        /* =========================
           DRAW ALL ROUTES
        ========================= */

        routes.forEach((route, index) => {
  let strokeColor = "#6b7280";

  // Route IDs are 1, 2, 3
  const routeId = index + 1;

  // Check whether this route is selected
  const isSelected =
    selectedRoute === routeId;

  // Default appearance
  let strokeWeight = 5;
  let strokeOpacity = 0.6;

  // Blue Route 1
  if (index === 0) {
    strokeColor = "#2563eb";
  }

  // Orange Route 2
  else if (index === 1) {
    strokeColor = "#f59e0b";
  }

  // Green Route 3
  else if (index === 2) {
    strokeColor = "#22c55e";
  }

  // If user selected a route
  if (selectedRoute !== null) {
    if (isSelected) {
      strokeWeight = 9;
      strokeOpacity = 1;
    } else {
      strokeWeight = 4;
      strokeOpacity = 0.25;
    }
  }

  // Initial state: Route 1 highlighted
  else if (index === 0) {
    strokeWeight = 8;
    strokeOpacity = 1;
  }

  const routePolylines =
    route.createPolylines({
      polylineOptions: {
        strokeColor,
        strokeWeight,
        strokeOpacity,
      },
    });

  routePolylines.forEach((polyline) => {
    polyline.setMap(map);

    polylines.push(polyline);
  });
});

        /* =========================
           CREATE ROUTE INFORMATION
        ========================= */

        const routeInfoList = routes.map(
          (route, index) => {
            const distanceKm =
              route.distanceMeters / 1000;

            const durationMinutes =
              route.durationMillis / 60000;

            const hours = Math.floor(
              durationMinutes / 60
            );

            const minutes = Math.round(
              durationMinutes % 60
            );

            const durationText =
              hours > 0
                ? `${hours} hr ${minutes} min`
                : `${minutes} min`;

            
const routePath = route.path;

let hazardCount = 0;
let riskPoints = 0;
let routeHazards = [];

if (routePath && routePath.length > 0) {
  hazards.forEach((hazard) => {
    const nearRoute = routePath.some(
      (point) => {
        const distance =
          getDistanceInMeters(
            {
              lat: point.lat,
              lng: point.lng,
            },
            hazard.position
          );

        return distance <= 300;
      }
    );

    if (nearRoute) {
  hazardCount++;

  const penalty =
    hazardPenalties[hazard.type]?.[
      hazard.severity
    ] ?? 10;

  riskPoints += penalty;

  routeHazards.push({
    type: hazard.type,
    severity: hazard.severity,
  });
}
  });
}

/* =========================
   SAFETY SCORE
========================= */

const safetyScore = Math.max(
  0,
  100 - riskPoints
);
let safetyLevel = "Very Unsafe";

if (safetyScore >= 90) {
  safetyLevel = "Very Safe";
} else if (safetyScore >= 75) {
  safetyLevel = "Safe";
} else if (safetyScore >= 50) {
  safetyLevel = "Moderate";
} else if (safetyScore >= 25) {
  safetyLevel = "Unsafe";
}


return {
  id: index + 1,

  distance: `${distanceKm.toFixed(1)} km`,
  duration: durationText,

  distanceValue: distanceKm,
  durationValue: durationMinutes,

  hazardCount,
  safetyScore,
  safetyLevel,
  hazards: routeHazards,
};
          }
        );
 
  const safestRoute = routeInfoList.reduce(
  (safest, route) => {
    // 1. Higher safety score wins
    if (route.safetyScore > safest.safetyScore) {
      return route;
    }

    // 2. If safety scores are equal,
    // fewer hazards wins
    if (
      route.safetyScore === safest.safetyScore &&
      route.hazardCount < safest.hazardCount
    ) {
      return route;
    }

    // 3. If hazards are also equal,
    // shorter distance wins
    if (
      route.safetyScore === safest.safetyScore &&
      route.hazardCount === safest.hazardCount &&
      route.distanceValue < safest.distanceValue
    ) {
      return route;
    }

    // 4. If distance is also equal,
    // faster route wins
    if (
      route.safetyScore === safest.safetyScore &&
      route.hazardCount === safest.hazardCount &&
      route.distanceValue === safest.distanceValue &&
      route.durationValue < safest.durationValue
    ) {
      return route;
    }

    return safest;
  }
);

if (selectedRoute === null) {
  onSafestRoute(safestRoute.id);
}
const updatedRouteInfoList = routeInfoList.map(
  (route) => ({
    ...route,
    isSafest: route.id === safestRoute.id,
  })
);

console.log(
  "Safest Route:",
  safestRoute
);

        console.log(
          "Route information:",
          routeInfoList
        );

        onRouteInfo(updatedRouteInfoList);

        /* =========================
           FIT MAP TO ROUTE
        ========================= */


if (
  selectedRoute === null &&
  routes[0].viewport
) {
  map.fitBounds(routes[0].viewport);
}
      } catch (error) {
        console.error(
          "Route calculation error:",
          error
        );
      }
    };

    calculateRoute();

    return () => {
      cancelled = true;

      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });
    };
  }, [
    routesLibrary,
    map,
    userLocation,
    destinationLocation,
    hazards,
    onRouteInfo,
    selectedRoute,
  ]);

  return null;
}


/* ================================
   MAIN MAP
================================ */

function MapViewContent() {
  const defaultPosition = {
    lat: 17.6868,
    lng: 83.2185,
  };
   const [reportingHazard, setReportingHazard] = useState(false);
   const [hazardLocation, setHazardLocation] = useState(null);
   const [cameraProps, setCameraProps] =
    useState({
      center: defaultPosition,
      zoom: 13,
    });

  const [userLocation, setUserLocation] =
    useState(null);
  const [originLocation, setOriginLocation] =
  useState(null);

  const [
    destinationLocation,
    setDestinationLocation,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [showRouteSearch, setShowRouteSearch] =
    useState(false);

  const [routeStarted, setRouteStarted] =
    useState(false);

  const [showInfo, setShowInfo] =
    useState(false);

  const [routeInfo, setRouteInfo] =
    useState(null);
    const [selectedRoute, setSelectedRoute] =
  useState(null);
  

  const [
    selectedHazard,
    setSelectedHazard,
  ] = useState(null);

  const [hazards, setHazards] = useState([]);
  const [usingCurrentLocation, setUsingCurrentLocation] =
  useState(false);
  
useEffect(() => {
 
  const fetchVerifiedHazards = async () => {
    try {
      const response = await fetch(
        "https://saferoutemap-backend-2aql.onrender.com/api/reports/verified" 
      ); 
 
      const data = await response.json(); 
 
      if (!response.ok) { 
        throw new Error( 
          data.message || "Failed to fetch verified hazards" 
        ); 
      } 
 
      const verifiedHazards = (data.reports || []).map((report) => ({ 
        id: report._id, 
        type: report.category, 
        icon: "⚠️", 
        severity: report.severity, 
        description: report.description, 
        position: { 
          lat: Number(report.location.latitude), 
          lng: Number(report.location.longitude), 
        }, 
      })); 
 
      setHazards(verifiedHazards); 
    } catch (error) { 
      console.error( 
        "Fetch verified hazards error:", 
        error 
      ); 
 
      setHazards([]); 
    } 
  }; 
 
  fetchVerifiedHazards(); 
}, []); 
  
 
  /* ================================ 
     CAMERA 
  ================================= */ 
 
  const handleCameraChange = useCallback( 
    (event) => { 
      setCameraProps({ 
        center: event.detail.center, 
        zoom: event.detail.zoom, 
      }); 
    }, 
    [] 
  ); 
  const handleHazardMapClick = (event) => { 
  if (!reportingHazard) return; 
 
  const latLng = event.detail.latLng; 
 
  if (!latLng) return; 
 
  setHazardLocation({ 
    lat: latLng.lat, 
    lng: latLng.lng, 
  }); 
}; 
 
  /* ================================ 
     MY LOCATION 
  ================================= */ 
const getMyLocation = () => { 
  if (!navigator.geolocation) { 
    alert("Your browser does not support location services."); 
    return; 
  } 
 
  setLoading(true); 
 
  navigator.geolocation.getCurrentPosition( 
    (position) => { 
      const location = { 
        lat: position.coords.latitude, 
        lng: position.coords.longitude, 
      }; 
 
      console.log("📍 Current Location:", location); 
      console.log( 
        "Accuracy:", 
        position.coords.accuracy, 
        "meters" 
      ); 
 
      // Set current location as starting location 
     setUserLocation(location); 
setOriginLocation(location); 
setUsingCurrentLocation(true); 
 
      // Clear previous route information 
      setRouteInfo(null); 
      setSelectedRoute(null); 
      setRouteStarted(false); 
 
      // Move map to current location 
      setCameraProps({ 
        center: location, 
        zoom: 16, 
      }); 
 
      setShowInfo(true); 
      setLoading(false); 
    }, 
 
    (error) => { 
      setLoading(false); 
 
      console.error("❌ Location error:", error); 
      console.error("Error code:", error.code); 
      console.error("Error message:", error.message); 
 
      if (error.code === 1) { 
        alert( 
          "Location permission was denied. Please allow location access for this website." 
        ); 
      } else if (error.code === 2) { 
        alert( 
          "Your location could not be determined. Please turn ON Windows Location Services and try again." 
        ); 
      } else if (error.code === 3) { 
        alert( 
          "Location request timed out. Please try again." 
        ); 
      } else { 
        alert( 
          "Unable to get your current location. Please try again." 
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
  /* ================================ 
     DESTINATION 
  ================================= */ 
const handleOriginSelect = (origin) => { 
  console.log("Selected origin:", origin); 
 
  setOriginLocation(origin); 
  setUsingCurrentLocation(false); 
 
  // Remove old routes 
  setRouteInfo(null); 
  setSelectedRoute(null); 
  setRouteStarted(false); 
}; 
 
const handleClearOrigin = 
  useCallback(() => { 
    setOriginLocation(null); 
 
    setRouteInfo(null); 
    setSelectedRoute(null); 
  }, []); 
 
const handleDestinationSelect = (destination) => { 
  console.log("Selected destination:", destination); 
 
  setDestinationLocation(destination); 
 
  // Remove old routes 
  setRouteInfo(null); 
  setSelectedRoute(null); 
  setRouteStarted(false); 
}; 
 
const handleFindSafeRoute = () => { 
  if (!originLocation) { 
    alert("Please select a starting location."); 
    return; 
  } 
 
  if (!destinationLocation) { 
    alert("Please select a destination."); 
    return; 
  } 
 
  console.log("Finding safe route..."); 
  console.log("Origin:", originLocation); 
  console.log("Destination:", destinationLocation); 
 
  // Clear previous route information 
  setRouteInfo(null); 
  setSelectedRoute(null); 
 
  // Tell RouteDisplay to calculate routes 
  setRouteStarted(true); 
 
  // Close search screen 
  setShowRouteSearch(false); 
 
  // Move map to destination 
  setCameraProps({ 
    center: destinationLocation, 
    zoom: 12, 
  }); 
}; 
 
const handleOpenRouteSearch = () => { 
  setShowRouteSearch(true); 
}; 
 
const handleCloseRouteSearch = () => { 
  setShowRouteSearch(false); 
}; 
 
const handleClearDestination = useCallback(() => { 
  console.log("Clearing destination and routes"); 
 
  setDestinationLocation(null); 
 
  setRouteInfo(null); 
    setSelectedRoute(null); 
 
  setSelectedHazard(null); 
}, []); 
 
  /* ================================ 
     ROUTE INFORMATION 
  ================================= */ 
 
  const handleRouteInfo = useCallback( 
    (info) => { 
      setRouteInfo(info); 
    }, 
    [] 
  ); 
 
  return ( 
    <div 
      style={{ 
        height: "100vh", 
        width: "100%", 
        position: "relative", 
      }} 
    > 
     {/* SEARCH HERE */} 
 
<div 
  style={{ 
    position: "absolute", 
    top: "20px", 
    left: "50%", 
    transform: "translateX(-50%)", 
    zIndex: 100, 
    width: "380px", 
  }} 
> 
  <button 
    onClick={handleOpenRouteSearch} 
    style={{ 
      width: "100%", 
      height: "55px", 
      background: "white", 
      border: "none", 
      borderRadius: "12px", 
      boxShadow: 
        "0 3px 12px rgba(0,0,0,0.25)", 
      cursor: "pointer", 
      display: "flex", 
      alignItems: "center", 
      padding: "0 18px", 
      fontSize: "16px", 
      textAlign: "left", 
    }} 
  > 
    <span 
      style={{ 
        fontSize: "22px", 
        marginRight: "12px", 
      }} 
    > 
      🔍 
    </span> 
 
    <span 
      style={{ 
        color: "#6b7280", 
      }} 
    > 
      Search here 
    </span> 
  </button> 
</div> 
 
{/* ROUTE SEARCH SCREEN */} 
 
{showRouteSearch && ( 
  <div 
    style={{ 
      position: "absolute", 
      inset: 0, 
      zIndex: 5000, 
      background: "#f8fafc", 
      overflowY: "auto", 
    }} 
  > 
    {/* HEADER */} 
 
    <div 
      style={{ 
        height: "70px", 
        background: "white", 
        display: "flex", 
        alignItems: "center", 
        padding: "0 25px", 
        boxShadow: 
          "0 2px 8px rgba(0,0,0,0.12)", 
      }} 
    > 
      <button 
        onClick={handleCloseRouteSearch} 
        style={{ 
          border: "none", 
          background: "transparent", 
          fontSize: "28px", 
          cursor: "pointer", 
          marginRight: "15px", 
        }} 
      > 
        ← 
      </button> 
 
      <strong 
        style={{ 
          fontSize: "20px", 
        }} 
      > 
        Plan Your Route 
      </strong> 
    </div> 
 
    {/* SEARCH AREA */} 
 
    <div 
      style={{ 
        width: "min(850px, 92%)", 
        margin: "35px auto", 
        background: "white", 
        padding: "30px", 
        borderRadius: "16px", 
        boxShadow: 
          "0 4px 15px rgba(0,0,0,0.12)", 
      }} 
    > 
       
 
      <h2 
        style={{ 
          marginTop: 0, 
          marginBottom: "25px", 
        }} 
      > 
        🛣️ Where do you want to go? 
         
      </h2> 
 
     {/* START + DESTINATION */} 
 
<div 
  style={{ 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "25px", 
    marginBottom: "30px", 
  }} 
> 
  {/* STARTING LOCATION */} 
 
  <div style={{ position: "relative" }}> 
    <label 
      style={{ 
        display: "block", 
        fontWeight: "bold", 
        marginBottom: "10px", 
      }} 
    > 
      🟢 Starting location 
    </label> 
 
    <LocationSearch 
  placeholder="Search starting location..." 
  onPlaceSelect={handleOriginSelect} 
  currentLocationText={ 
    usingCurrentLocation 
      ? "📍 My Current Location" 
      : "" 
  } 
/> 
 
    <button 
      onClick={getMyLocation} 
      style={{ 
        marginTop: "12px", 
        border: "none", 
        background: "transparent", 
        color: "#2563eb", 
        cursor: "pointer", 
        fontWeight: "bold", 
        padding: 0, 
      }} 
    > 
      📍 Use my current location 
    </button> 
  </div> 
 
  {/* DESTINATION */} 
 
  <div> 
    <label 
      style={{ 
        display: "block", 
        fontWeight: "bold", 
        marginBottom: "10px", 
      }} 
    > 
      🔴 Destination 
    </label> 
 
    <LocationSearch 
      placeholder="Search destination..." 
      onPlaceSelect={handleDestinationSelect} 
    /> 
  </div> 
</div> 
 
      {/* SELECTED LOCATIONS */} 
 
      <div 
        style={{ 
          marginTop: "20px", 
          padding: "15px", 
          background: "#f8fafc", 
          borderRadius: "10px", 
          fontSize: "14px", 
        }} 
      > 
        <div> 
          <strong>From:</strong>{" "} 
          {originLocation 
            ? "Location selected ✓" 
            : "Not selected"} 
        </div> 
 
        <div 
          style={{ 
            marginTop: "8px", 
          }} 
        > 
          <strong>To:</strong>{" "} 
          {destinationLocation 
            ? "Destination selected ✓" 
            : "Not selected"} 
        </div> 
      </div> 
 
      {/* FIND ROUTE */} 
 
      <button 
        onClick={handleFindSafeRoute} 
        style={{ 
          width: "100%", 
          marginTop: "25px", 
          height: "55px", 
          border: "none", 
          borderRadius: "10px", 
          background: "#2563eb", 
          color: "white", 
          fontSize: "16px", 
          fontWeight: "bold", 
          cursor: "pointer", 
        }} 
      > 
        🛡️ Find Safe Route 
      </button> 
    </div> 
  </div> 
)} 
 
 
 
 
      {routeInfo && ( 
  <div 
    style={{ 
      position: "absolute", 
      top: "160px", 
      right: "25px", 
      zIndex: 900, 
      background: "white", 
      padding: "14px 18px", 
      borderRadius: "10px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)", 
      fontSize: "14px", 
      width: "270px", 
      maxHeight: "calc(100vh - 230px)", 
      overflowY: "auto", 
    }} 
  > 
    <strong> 
      🛣️ Available Routes 
    </strong> 
 
    {routeInfo.map((route, index) => { 
      const isSelected = 
        selectedRoute === route.id; 
 
      return ( 
        <div 
          key={route.id} 
          onClick={() => 
            setSelectedRoute(route.id) 
          } 
          style={{ 
            marginTop: "12px", 
            padding: "10px", 
            borderRadius: "8px", 
            cursor: "pointer", 
 
            background: isSelected 
              ? "#eff6ff" 
              : "transparent", 
 
            border: isSelected 
              ? "2px solid #2563eb" 
              : "1px solid #e5e7eb", 
          }} 
        > 
          <strong> 
            {index === 0 && "🔵 "} 
            {index === 1 && "🟠 "} 
            {index === 2 && "🟢 "} 
 
            Route {route.id} 
 
            {route.isSafest && ( 
              <span 
                style={{ 
                  marginLeft: "8px", 
                  color: "#16a34a", 
                  fontWeight: "bold", 
                }} 
              > 
                🛡️ SAFEST 
              </span> 
            )} 
          </strong> 
 
          <div style={{ marginTop: "4px" }}> 
            📏 {route.distance} 
          </div> 
 
          <div> 
            ⏱️ {route.duration} 
          </div> 
 
          <div> 
            ⚠️ Hazards: {route.hazardCount} 
          </div> 

{route.hazards && route.hazards.length > 0 && (
  <div
    style={{
      marginTop: "6px",
      fontSize: "12px",
      color: "#dc2626",
    }}
  >
    {route.hazards.map((hazard, hazardIndex) => (
      <div key={hazardIndex}>
        ⚠️ {hazard.type} — {hazard.severity}
      </div>
    ))}
  </div>
)}
 
         <div 
  style={{ 
    marginTop: "4px", 
    fontWeight: "bold", 
  }} 
> 
  🛡️ Safety Score: {route.safetyScore}/100 
</div> 
 
<div 
  style={{ 
    marginTop: "4px", 
    fontSize: "13px", 
  }} 
> 
  Safety Level:{" "} 
  <strong> 
    {route.safetyLevel} 
  </strong> 
</div> 
        </div> 
      ); 
    })} 
  </div> 
)} 
 
      {/* GOOGLE MAP */} 
 
      <Map 
      onClick={handleHazardMapClick} 
        center={cameraProps.center} 
        zoom={cameraProps.zoom} 
        onCameraChanged={handleCameraChange} 
        mapId="DEMO_MAP_ID" 
        mapTypeControl={false} 
        streetViewControl={false} 
        fullscreenControl={false} 
        style={{ 
          width: "100%", 
          height: "100%", 
        }} 
      > 
        {reportingHazard && hazardLocation && ( 
  <AdvancedMarker 
    position={hazardLocation} 
  > 
    <div 
      style={{ 
        fontSize: "30px", 
        cursor: "pointer", 
      }} 
    > 
      🚨 
    </div> 
  </AdvancedMarker> 
)} 
        {/* CURRENT LOCATION */} 
 
        {userLocation && ( 
          <> 
            <AdvancedMarker 
              position={userLocation} 
              onClick={() => 
                setShowInfo(true) 
              } 
            /> 
            {originLocation && ( 
  <AdvancedMarker position={originLocation}> 
    <div 
      style={{ 
        fontSize: "30px", 
      }} 
    > 
      🟢 
    </div> 
  </AdvancedMarker> 
)} 
 
            {showInfo && ( 
              <InfoWindow 
                position={userLocation} 
                onCloseClick={() => 
                  setShowInfo(false) 
                } 
              > 
                <div> 
                  <strong> 
                    📍 You are here 
                  </strong> 
 
                  <br /> 
 
                  Your current location 
 
                  <br /> 
                  <br /> 
 
                  Latitude:{" "} 
                  {userLocation.lat.toFixed(4)} 
 
                  <br /> 
 
                  Longitude:{" "} 
                  {userLocation.lng.toFixed(4)} 
                </div> 
              </InfoWindow> 
            )} 
          </> 
        )} 
 
        {/* DESTINATION */} 
 
        {destinationLocation && ( 
          <AdvancedMarker 
            position={destinationLocation} 
          /> 
        )} 
 
        {/* HAZARD MARKERS */} 
 
        {hazards.map((hazard) => ( 
          <AdvancedMarker 
            key={hazard.id} 
            position={hazard.position} 
            onClick={() => 
              setSelectedHazard(hazard) 
            } 
          > 
            <div 
              style={{ 
                fontSize: "28px", 
                cursor: "pointer", 
              }} 
            > 
              {hazard.icon} 
            </div> 
          </AdvancedMarker> 
        ))} 
 
        {/* HAZARD INFORMATION */} 
 
        {selectedHazard && ( 
          <InfoWindow 
            position={ 
              selectedHazard.position 
            } 
            onCloseClick={() => 
              setSelectedHazard(null) 
            } 
          > 
            <div 
              style={{ 
                minWidth: "200px", 
              }} 
            > 
              <strong> 
                {selectedHazard.icon}{" "} 
                {selectedHazard.type} 
              </strong> 
 
              <div 
                style={{ 
                  marginTop: "8px", 
                }} 
              > 
                <strong> 
                  Severity: 
                </strong>{" "} 
                {selectedHazard.severity} 
              </div> 
 
              <div 
                style={{ 
                  marginTop: "6px", 
                }} 
              > 
                {selectedHazard.description} 
              </div> 
            </div> 
          </InfoWindow> 
        )} 
 
        {/* ROUTES */} 
{routeStarted && 
  originLocation && 
  destinationLocation && ( 
    <RouteDisplay 
      userLocation={originLocation} 
      destinationLocation={destinationLocation} 
      hazards={hazards} 
      onRouteInfo={handleRouteInfo} 
      selectedRoute={selectedRoute} 
      onSafestRoute={setSelectedRoute} 
    /> 
  )} 
      </Map> 
 
      {/* MY LOCATION BUTTON */} 
 
      <button 
        //onClick={handleHazardMapClick} 
        onClick={getMyLocation} 
        style={{ 
          position: "absolute", 
          top: "10px", 
          right: "20px", 
          zIndex: 10, 
          padding: "10px 15px", 
          background: "white", 
          border: "none", 
          borderRadius: "8px", 
          cursor: "pointer", 
          boxShadow: 
            "0 2px 8px rgba(0,0,0,0.3)", 
          fontWeight: "bold", 
        }} 
      > 
        {loading 
          ? "Getting location..." 
          : "📍 My Location"} 
      </button> 
    </div> 
  ); 
} 
 
/* ================================ 
   API PROVIDER 
================================ */ 
 
function MapView() { 
  return ( 
    <APIProvider 
      apiKey={ 
        import.meta.env 
          .VITE_GOOGLE_MAPS_API_KEY 
      } 
      libraries={["places", "routes"]} 
    > 
      <MapViewContent /> 
    </APIProvider> 
  ); 
} 
 
export default MapView; 
 