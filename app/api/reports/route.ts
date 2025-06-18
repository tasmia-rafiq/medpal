import { auth } from '@/auth'
import { saveReport, getUserReports } from '@/lib/reports'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reports = await getUserReports(session.user?.id || '')
    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, extractedText, category, tags } = body

    if (!title || !extractedText) {
      return NextResponse.json({ error: 'Title and extracted text are required' }, { status: 400 })
    }

    const reportId = await saveReport({
      userId: session.user?.id || '',
      title,
      extractedText,
      category: category || 'General',
      tags: tags || [],
    })

    return NextResponse.json({ id: reportId }, { status: 201 })
  } catch (error) {
    console.error('Error saving report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}