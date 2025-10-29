import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received data:', body) // Debug log
    
    // Handle both field name formats
    const owner_email = body.ownerEmail || body.owner_email
    const name = body.name
    const description = body.description
    
    // Check if we have the email
    if (!owner_email) {
      console.error('No owner email provided!')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`
    
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name: name,
          slug: slug,
          description: description,
          owner_email: owner_email // Make sure this matches your database column
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      project: data,
      ...data 
    })
    
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
