import { auth } from '@/auth'
import { getReport } from '@/lib/reports'
import { redirect, notFound } from 'next/navigation'
import ReportViewer from './ReportViewer'

interface ReportPageProps {
  params: Promise<{ id: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const session = await auth()
  const { id } = await params
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  const report = await getReport(id, session.user?.id || '')
  
  if (!report) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportViewer report={report} />
      </div>
    </div>
  )
}