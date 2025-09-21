import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test 1: Check if we can connect
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)

    if (projectError) {
      return NextResponse.json({ 
        error: 'Cannot connect to projects table', 
        details: projectError 
      })
    }

    // Test 2: Check feedback table
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*')
      .limit(1)

    if (feedbackError) {
      return NextResponse.json({ 
        error: 'Cannot connect to feedback table', 
        details: feedbackError 
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection working!',
      projectsTable: projects ? 'Connected' : 'Empty',
      feedbackTable: feedback ? 'Connected' : 'Empty'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Connection failed', 
      details: error 
    })
  }
}