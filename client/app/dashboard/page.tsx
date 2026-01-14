"use client"

import DashboardContent from "@/components/dashboard/dashboard-content"
import Sidebar from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <DashboardContent user={user} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
