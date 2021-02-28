import "./App.css";
import Login from "./Login";
import Settings from "./Settings";
import { useState, useEffect } from "react";
import { fetch } from "./util";

let originOverride;
try {
  window.localStorage.getItem("origin");
} catch {}

function App() {
  const [profile, setProfile] = useState(null);
  const [platform, setPlatform] = useState(null);

  async function fetchProfile() {
    let { json, status } = await fetch("/platform/customer/profile");
    if (status !== 200) {
      return setProfile(null);
    }
    setProfile(json);
  }

  async function fetchPublicPlatform() {
    let { json, status } = await fetch("/platform", {
      query: { origin: originOverride },
      credentials: "omit",
    });
    setPlatform(json);
  }

  useEffect(() => {
    fetchPublicPlatform();
    fetchProfile();
  }, []);

  return (
    <div className="App-container">
      <div className="App-background"></div>
      <div className="App">
        <div className="App-header">
          <h2>{platform ? platform.name : "platform not found..."}</h2>
          {platform && <img src={platform.logo} />}
          {profile && (
            <div>
              <div>{profile?.customer?.email}</div>
              <div>{profile?.customer?.stripeCustomerId}</div>
            </div>
          )}
        </div>
        <div className="App-form">
          {profile ? (
            <Settings variableMetadata={platform.plans[0].variableMetadata} />
          ) : (
            <Login />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
