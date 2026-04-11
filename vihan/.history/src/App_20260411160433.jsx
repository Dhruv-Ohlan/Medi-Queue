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
 
  const PageComponent = PAGES[activePage] || HomePage;
 
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar active={activePage} setActive={setActivePage} />
      <PageComponent setActive={setActivePage} />
    </div>
  );
};
 
export default App;