import MapView from "../components/MapView";

function SafeRoute() {
  return (
    <div>
      <h1>Find Safe Route</h1>

      <p>
        Search for a destination and discover a safer route based on reported
        hazards and safety information.
      </p>

      <div style={{ marginTop: "30px" }}>
        <MapView />
      </div>
    </div>
  );
}

export default SafeRoute;