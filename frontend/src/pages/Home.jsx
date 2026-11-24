import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import ChatWindow from "../components/ChatWindow";
import { getDocStatus } from "../api/authApi";

function Home() {
  const [activePDF, setActivePDF] = useState(
    localStorage.getItem("activePDF") || null
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const syncStatus = async () => {
      try {
        const res = await getDocStatus();
        if (res.data?.has_pdf && res.data?.active_pdf) {
          setActivePDF(res.data.active_pdf);
          localStorage.setItem("activePDF", res.data.active_pdf);
        } else {
          setActivePDF(null);
          localStorage.removeItem("activePDF");
        }
      } catch (err) {
        console.log("Status sync error:", err);
      }
    };

    syncStatus();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container">
        <UploadBox
          activePDF={activePDF}
          setActivePDF={setActivePDF}
        />

        <ChatWindow
          activePDF={activePDF}
          setActivePDF={setActivePDF}
        />
      </div>
    </div>
  );
}

export default Home;
