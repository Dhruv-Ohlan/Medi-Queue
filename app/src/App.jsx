import { useState } from "react";
import Navbar              from "./components/Navbar";
import HomePage            from "./components/pages/HomePage";
import PatientPortalPage   from "./components/pages/PatientPortalPage";
import AITriagePage        from "./components/pages/AITriagePage";
import DoctorDashboardPage from "./components/pages/DoctorDashboardPage";
import AdminAnalyticsPage  from "./components/pages/AdminAnalyticsPage";
 
const PAGES = {
  landing: HomePage,
  patient: PatientPortalPage,
  triage:  AITriagePage,
  doctor:  DoctorDashboardPage,
  admin:   AdminAnalyticsPage,
};
 
const App = () => {
  const [activePage, setActivePage] = useState("landing");

  // Shared state: patient registration data flows Patient → Triage → Token
  const [patientForm, setPatientForm] = useState({ name: "Rahul Sharma", age: "32", gender: "Male", phone: "9876543210" });
  const [trackingId, setTrackingId] = useState(null);
 
  const PageComponent = PAGES[activePage] || HomePage;
 
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar active={activePage} setActive={setActivePage} />
      <PageComponent
        setActive={setActivePage}
        patientForm={patientForm}
        setPatientForm={setPatientForm}
        trackingId={trackingId}
        setTrackingId={setTrackingId}
      />
    </div>
  );
};
 
export default App;