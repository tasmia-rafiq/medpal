import { auth } from '@/auth'
import { getUserReports } from '@/lib/reports'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function Dashboard() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  const reports = await getUserReports(session.user?.id || '')

  return (
    <div className="min-h-screen bg-white-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardClient initialReports={reports} />
      </div>
    </div>
  )
}