import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Project name and email are required' },
        { status: 400 }
      )
    }

    // Find project by name and owner email
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('name', name.trim())
      .eq('owner_email', email.toLowerCase().trim())
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Project not found. Please check your project name and email.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project: data,
      dashboardUrl: `/dashboard/${data.id}`,
      feedbackUrl: `/f/${data.slug}`
    })

  } catch (error) {
    console.error('Error finding project:', error)
    return NextResponse.json(
      { error: 'Failed to find project' },
      { status: 500 }
    )
  }
}