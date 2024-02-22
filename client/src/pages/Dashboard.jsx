import DashboardSideBar from "../components/DashboardSideBar";
import DashboardProfile from "../components/DashboardProfile";
import { useTabLocation } from "../hooks/useTabLocation";
import DashboardPosts from "../components/DashboardPosts";
import DashboardUsers from "../components/DashboardUsers";
import DashboardComments from "../components/DashboardComments";
import DashboardMetrics from "../components/DashboardMetrics";

export default function Dashboard() {
  const { tab } = useTabLocation();

  return (
    <div className="min-h-screen max-w-6xl flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashboardSideBar />
      </div>
      {/* Profile */}
      {tab == "dashboard-metrics" && <DashboardMetrics />}
      {tab == "profile" && <DashboardProfile />}
      {/* Posts */}
      {tab == "posts" && <DashboardPosts />}
      {tab == "users" && <DashboardUsers />}
      {tab == "comments" && <DashboardComments />}
    </div>
  );
}
