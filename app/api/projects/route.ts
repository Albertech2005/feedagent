import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Debug: Log environment variables (remove in production)
console.log('API Route - Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('API Route - Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function GET(request: Request) {
  try {
    // Check if environment variables exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables in API route')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Get user email from request if needed
    // const { searchParams } = new URL(request.url)
    // const email = searchParams.get('email')

    // Fetch projects
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error in API route:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('API Route error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('projects')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API POST error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
