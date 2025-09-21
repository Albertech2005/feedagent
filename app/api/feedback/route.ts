import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyzeFeedback } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { project_id, content, rating, email } = body

    console.log('Received feedback:', { project_id, content, rating, email })

    // Validate required fields
    if (!project_id || !content) {
      return NextResponse.json(
        { error: 'Project ID and content are required' },
        { status: 400 }
      )
    }

    // Analyze feedback with AI
    console.log('Analyzing feedback with AI...')
    let analysis
    
    try {
      analysis = await analyzeFeedback(content, rating)
      console.log('AI Analysis complete:', analysis)
    } catch (aiError) {
      console.error('AI analysis failed, using defaults:', aiError)
      analysis = {
        sentiment: rating ? (rating - 3) / 2 : 0,
        sentimentLabel: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
        categories: ['general'],
        keywords: [],
        priority: 'medium',
        summary: content.slice(0, 100),
        actionRequired: false
      }
    }

    console.log('Inserting into database...')

    // Insert ONLY the columns from the original table
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          project_id: project_id,
          content: content,
          rating: rating || null,
          email: email || null,
          sentiment: analysis.sentiment  // Only sentiment number, not the label
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Feedback saved successfully:', data)

    // Add the AI analysis to the response (even though not saved in DB)
    const enrichedFeedback = {
      ...data,
      sentiment_label: analysis.sentimentLabel,
      ai_analysis: analysis
    }

    return NextResponse.json({ 
      success: true, 
      feedback: enrichedFeedback,
      analysis: analysis
    })
  } catch (error: any) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit feedback', 
        details: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching feedback for project:', projectId)

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error fetching feedback:', error)
      throw error
    }

    // Add sentiment labels based on sentiment values
    const enrichedData = data?.map((f: any) => ({
      ...f,
      sentiment_label: f.sentiment > 0.3 ? 'positive' : f.sentiment < -0.3 ? 'negative' : 'neutral'
    })) || []

    // Calculate statistics
    const stats = {
      total: enrichedData.length,
      positive: enrichedData.filter((f: any) => f.sentiment_label === 'positive').length,
      negative: enrichedData.filter((f: any) => f.sentiment_label === 'negative').length,
      neutral: enrichedData.filter((f: any) => f.sentiment_label === 'neutral').length,
      needsAction: 0,
      avgSentiment: enrichedData.length > 0 
        ? enrichedData.reduce((sum: number, f: any) => sum + (f.sentiment || 0), 0) / enrichedData.length 
        : 0,
      avgRating: enrichedData.length > 0
        ? enrichedData.filter((f: any) => f.rating).reduce((sum: number, f: any) => sum + f.rating, 0) / enrichedData.filter((f: any) => f.rating).length
        : 0
    }

    return NextResponse.json({ 
      success: true, 
      feedback: enrichedData,
      stats: stats
    })
  } catch (error: any) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch feedback', 
        details: error.message || 'Unknown error' 
      },
      { status: 500 }
    )
  }
}