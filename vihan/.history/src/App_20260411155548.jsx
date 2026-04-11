import { useState } from "react";
import Navbar               from "./Navbar";
import HomePage             from "./pages/HomePage";
import PatientPortalPage    from "./pages/PatientPortalPage";
import AITriagePage         from "./pages/AITriagePage";
import DoctorDashboardPage  from "./pages/DoctorDashboardPage";
import AdminAnalyticsPage   from "./pages/AdminAnalyticsPage";
 
const PAGES = {
  landing: HomePage,
  patient: PatientPortalPage,
  triage:  AITriagePage,
  doctor:  DoctorDashboardPage,
  admin:   AdminAnalyticsPage,
};
 
const App = () => {
  const [activePage, setActivePage] = useState("landing");
 
  const PageComponent = PAGES[activePage] || HomePage;
 
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar active={activePage} setActive={setActivePage} />
      <PageComponent setActive={setActivePage} />
    </div>
  );
};
 
export default App;
 