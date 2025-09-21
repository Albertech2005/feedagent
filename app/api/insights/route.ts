import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, question } = body

    console.log('=== AI INSIGHTS API ===')
    console.log('Project ID:', projectId)
    console.log('User question:', question || 'General recommendations')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Fetch all feedback for this project
    console.log('Fetching feedback from database...')
    const { data: feedbacks, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    if (!feedbacks || feedbacks.length === 0) {
      console.log('No feedback found')
      return NextResponse.json({
        success: true,
        insights: {
          summary: "No feedback collected yet. Share your feedback link to start gathering insights!",
          strengths: [],
          improvements: [],
          priorities: [],
          opportunities: [],
          nextSteps: ["Share your feedback link with users", "Collect at least 5-10 responses", "Come back for AI insights"],
          userQuestionAnswer: "I need feedback data to answer your question. Please collect some feedback first!",
          hasData: false
        }
      })
    }

    console.log(`Found ${feedbacks.length} feedback entries`)
    console.log('Preparing data for AI analysis...')

    // Prepare feedback for analysis
    const feedbackSummary = feedbacks.map((f, i) => {
      const sentiment = f.sentiment > 0.3 ? 'positive' : f.sentiment < -0.3 ? 'negative' : 'neutral'
      return `${i + 1}. Rating: ${f.rating || 'N/A'}/5, Sentiment: ${sentiment}, Feedback: "${f.content}"`
    }).join('\n')

    // Calculate statistics
    const ratings = feedbacks.filter(f => f.rating)
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, f) => sum + f.rating, 0) / ratings.length 
      : 0
    const avgSentiment = feedbacks.reduce((sum, f) => sum + (f.sentiment || 0), 0) / feedbacks.length
    const positiveCount = feedbacks.filter(f => f.sentiment > 0.3).length
    const negativeCount = feedbacks.filter(f => f.sentiment < -0.3).length
    const neutralCount = feedbacks.length - positiveCount - negativeCount

    const prompt = `You are a product advisor analyzing customer feedback for actionable insights.

FEEDBACK STATISTICS:
- Total responses: ${feedbacks.length}
- Average rating: ${avgRating.toFixed(1)}/5
- Sentiment breakdown: ${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral
- Overall sentiment score: ${(avgSentiment * 100).toFixed(0)}%

ALL FEEDBACK ENTRIES:
${feedbackSummary}

${question ? `USER'S SPECIFIC QUESTION: "${question}"` : 'Task: Provide general improvement recommendations based on the feedback.'}

Analyze all feedback carefully and provide a JSON response with these exact fields:
{
  "summary": "2-3 sentence executive summary of overall feedback trends and key insights",
  "strengths": ["List 3 specific things users appreciate most, quote actual feedback when possible"],
  "improvements": ["List 5 specific, actionable improvements based on user complaints and suggestions"],
  "priorities": ["List 3 most urgent issues that need immediate attention, if any"],
  "opportunities": ["List 3 growth opportunities based on positive feedback patterns"],
  "userQuestionAnswer": "${question ? 'Detailed, specific answer to the user question based on the feedback data' : 'null'}",
  "nextSteps": ["List 3 specific actions the project owner should take this week"]
}

Be specific, reference actual feedback, and make all recommendations actionable. If users mentioned specific issues, include them.`

    console.log('Calling OpenAI API...')
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert product advisor. Analyze the feedback data and provide specific, actionable insights. Always return valid JSON. Be detailed and reference specific feedback when making recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000
      })

      const result = response.choices[0].message.content
      if (!result) {
        throw new Error('No response from OpenAI')
      }

      const insights = JSON.parse(result)
      console.log('Successfully generated AI insights')

      return NextResponse.json({
        success: true,
        insights: insights,
        feedbackCount: feedbacks.length
      })
    } catch (openAIError: any) {
      console.error('OpenAI API error:', openAIError.message)
      
      // If OpenAI fails, provide basic insights based on data
      console.log('Falling back to basic insights...')
      
      return NextResponse.json({
        success: true,
        insights: {
          summary: `You have ${feedbacks.length} feedback entries with an average rating of ${avgRating.toFixed(1)}/5. ${positiveCount} users are satisfied (${((positiveCount/feedbacks.length)*100).toFixed(0)}%), while ${negativeCount} users reported issues (${((negativeCount/feedbacks.length)*100).toFixed(0)}%).`,
          strengths: [
            positiveCount > 0 ? "Some users are satisfied with the product" : "Feedback collection is working",
            "Users are engaged enough to provide feedback",
            avgRating > 3 ? `Average rating of ${avgRating.toFixed(1)}/5 shows decent satisfaction` : "Room for improvement identified"
          ],
          improvements: [
            "Review all negative feedback below for specific issues",
            "Address the most common complaints first",
            "Improve based on user suggestions",
            negativeCount > 0 ? `Fix issues reported by ${negativeCount} unsatisfied users` : "Continue collecting more feedback",
            "Consider reaching out to users who left negative feedback"
          ],
          priorities: negativeCount > 0 ? [
            "Read through all negative feedback immediately",
            "Identify the most common complaint",
            "Create an action plan to address top issues"
          ] : [
            "Collect more feedback for better insights",
            "Maintain current satisfaction levels",
            "Plan for future improvements"
          ],
          opportunities: [
            "Build on what users love about your product",
            "Turn satisfied users into advocates",
            "Expand successful features"
          ],
          nextSteps: [
            "Review all feedback entries below",
            negativeCount > 0 ? "Contact unsatisfied users for more details" : "Share feedback link with more users",
            "Implement quick fixes first"
          ],
          userQuestionAnswer: question ? `Based on ${feedbacks.length} feedback entries: ${avgRating > 3 ? 'Users are generally satisfied' : 'There are significant issues to address'}. Please review the feedback manually for specific insights about: "${question}"` : null,
          hasData: true,
          isManual: true
        },
        feedbackCount: feedbacks.length
      })
    }
  } catch (error: any) {
    console.error('Error in insights API:', error.message)
    return NextResponse.json(
      { 
        error: 'Failed to generate insights', 
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}