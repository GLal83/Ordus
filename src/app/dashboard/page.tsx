// src/app/dashboard/page.tsx
import { getAuth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getAuth()
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {session?.user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks Overview */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
          {/* Task list component */}
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Cases</h2>
          {/* Cases list component */}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          {/* Calendar component */}
        </div>
      </div>
    </div>
  )
}