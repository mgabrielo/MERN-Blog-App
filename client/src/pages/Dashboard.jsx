import DashboardSideBar from "../components/DashboardSideBar";
import DashboardProfile from "../components/DashboardProfile";
import { useTabLocation } from "../hooks/useTabLocation";

export default function Dashboard() {
  const { tab } = useTabLocation();

  return (
    <div className="min-h-screen max-w-6xl flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashboardSideBar />
      </div>
      {/* Profile */}
      {tab == "profile" && <DashboardProfile />}
    </div>
  );
}
