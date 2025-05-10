import { Link } from "react-router-dom"
import {
  FaCalendarCheck,
  FaUserMd,
  FaCity,
  FaChartLine,
  FaUserCog,
  FaClipboardList,
  FaHospital,
  FaFileMedical,
  FaHeartbeat,
} from "react-icons/fa"

function Dashboard() {
  const role = localStorage.getItem("role")
  const userId = localStorage.getItem("userId")
  const userName = localStorage.getItem("userName") || role

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-4 border-blue-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {getGreeting()}, <span className="text-blue-600">{userName}</span>
              </h1>
              <p className="text-gray-600">
                Role: <span className="font-medium text-blue-700">{role}</span> | ID:{" "}
                <span className="font-medium">{userId}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                <FaChartLine className="mr-2" />
                <span className="font-medium">Healthcare Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Navigation Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white py-3 px-4">
                <h2 className="font-bold">Quick Navigation</h2>
              </div>
              <div className="p-4 space-y-2">
                <NavLink to="/settings" icon={<FaUserCog />} label="My Profile" />
                <NavLink to="/doctor" icon={<FaUserMd />} label="Doctors" />
                {role === "PATIENT" && (
                  <>
                    <NavLink to="/booking" icon={<FaCalendarCheck />} label="Book Appointment" />
                    <NavLink to="/booking-history" icon={<FaClipboardList />} label="Booking History" />
                  </>
                )}
                {role === "ADMIN" && (
                  <>
                    <NavLink to="/clinics" icon={<FaHospital />} label="Manage Clinics" />
                    <NavLink to="/reports" icon={<FaFileMedical />} label="Reports" />
                  </>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-4">
                <h2 className="font-bold">System Status</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">System</span>
                  <span className="text-green-600 font-medium flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-800 font-medium">Today, 10:30 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="text-gray-800 font-medium">v2.1.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* ADMIN Actions */}
                {role === "ADMIN" && (
                  <>
                    <ActionCard
                      to="/doctor"
                      icon={<FaUserMd size={24} />}
                      title="Manage Doctors"
                      description="Add, edit, or remove doctors from the system"
                      color="bg-gradient-to-br from-green-500 to-green-600"
                    />
                    <ActionCard
                      to="/clinics"
                      icon={<FaCity size={24} />}
                      title="Manage Clinics"
                      description="Manage clinic locations and details"
                      color="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                    <ActionCard
                      to="/reports"
                      icon={<FaChartLine size={24} />}
                      title="View Reports"
                      description="Access system analytics and reports"
                      color="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                  </>
                )}

                {/* PATIENT Actions */}
                {role === "PATIENT" && (
                  <>
                    <ActionCard
                      to="/booking"
                      icon={<FaCalendarCheck size={24} />}
                      title="Book Appointment"
                      description="Schedule a new appointment with a doctor"
                      color="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                    <ActionCard
                      to="/booking-history"
                      icon={<FaClipboardList size={24} />}
                      title="Booking History"
                      description="View your past and upcoming appointments"
                      color="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                    <ActionCard
                      to="/doctor"
                      icon={<FaUserMd size={24} />}
                      title="Find Doctors"
                      description="Browse and search for healthcare providers"
                      color="bg-gradient-to-br from-green-500 to-green-600"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Health Tips Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Health Tips</h2>
                <Link to="/health-tips" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HealthTipCard
                  icon={<FaHeartbeat className="text-red-500" size={20} />}
                  title="Maintain Heart Health"
                  content="Regular exercise, a balanced diet, and stress management can significantly improve heart health."
                />
                <HealthTipCard
                  icon={<FaFileMedical className="text-blue-500" size={20} />}
                  title="Regular Check-ups"
                  content="Schedule regular check-ups even when you feel healthy to catch potential issues early."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
    >
      <span className="mr-3 text-blue-600">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function ActionCard({ to, icon, title, description, color }) {
  return (
    <Link to={to} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className={`${color} p-4 text-white`}>{icon}</div>
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
}

function HealthTipCard({ icon, title, content }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="font-medium ml-2">{title}</h3>
      </div>
      <p className="text-sm text-gray-700">{content}</p>
    </div>
  )
}

export default Dashboard
