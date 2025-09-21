import OpenAI from 'openai'

// Initialize OpenAI with error handling
let openai: OpenAI | null = null

try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
} catch (error) {
  console.error('Failed to initialize OpenAI:', error)
}

export interface FeedbackAnalysis {
  sentiment: number
  sentimentLabel: string
  categories: string[]
  keywords: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  summary: string
  actionRequired: boolean
}

export async function analyzeFeedback(content: string, rating?: number | null): Promise<FeedbackAnalysis> {
  // If OpenAI is not initialized, return defaults
  if (!openai) {
    console.error('OpenAI not initialized')
    return {
      sentiment: rating ? (rating - 3) / 2 : 0,
      sentimentLabel: 'neutral',
      categories: ['general'],
      keywords: [],
      priority: 'medium',
      summary: content.slice(0, 100),
      actionRequired: false
    }
  }

  try {
    const prompt = `Analyze this customer feedback and return a JSON object with:
    - sentiment: number between -1 (very negative) and 1 (very positive)
    - sentimentLabel: "positive", "neutral", or "negative"
    - categories: array from ["bug", "feature-request", "praise", "complaint", "question", "suggestion", "other"]
    - keywords: array of 3-5 key topics mentioned
    - priority: "low", "medium", "high", or "critical" based on urgency
    - summary: one sentence summary (max 100 chars)
    - actionRequired: boolean, true if needs immediate attention

    Feedback: "${content}"
    ${rating ? `Rating: ${rating}/5` : ''}`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a feedback analysis expert. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500
    })

    const result = response.choices[0].message.content
    if (!result) throw new Error('No response from OpenAI')
    
    const analysis = JSON.parse(result)
    return analysis
  } catch (error) {
    console.error('AI analysis failed:', error)
    // Return defaults based on rating
    let sentimentValue = 0
    let sentimentLabel = 'neutral'
    
    if (rating !== null && rating !== undefined) {
      sentimentValue = (rating - 3) / 2
      if (rating >= 4) {
        sentimentLabel = 'positive'
      } else if (rating <= 2) {
        sentimentLabel = 'negative'
      }
    }
    
    return {
      sentiment: sentimentValue,
      sentimentLabel: sentimentLabel,
      categories: ['general'],
      keywords: [],
      priority: 'medium',
      summary: content.slice(0, 100),
      actionRequired: false
    }
  }
}

export async function generateWeeklyInsights(feedbacks: any[]): Promise<any> {
  if (feedbacks.length === 0) return null
  
  if (!openai) {
    console.error('OpenAI not initialized for insights')
    return null
  }

  try {
    // Prepare feedback summary for analysis
    const feedbackSummary = feedbacks
      .slice(0, 30) // Limit to recent 30 for cost efficiency
      .map((f, i) => `${i + 1}. Rating: ${f.rating || 'N/A'}/5, Sentiment: ${f.sentiment_label || 'N/A'}, Content: "${f.content}"`)
      .join('\n')

    const prompt = `Analyze this week's customer feedback and provide insights:

${feedbackSummary}

Return a JSON object with:
1. topThemes: Array of 3 most common themes with description and count
2. sentimentTrend: "improving", "stable", or "declining" with explanation
3. criticalIssues: Array of urgent issues that need attention
4. recommendations: Array of 3 specific, actionable recommendations
5. positiveHighlights: What customers love most
6. summary: Executive summary in 2-3 sentences`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a customer feedback analyst. Provide actionable insights from feedback data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1000
    })

    const result = response.choices[0].message.content
    if (!result) return null
    
    return JSON.parse(result)
  } catch (error) {
    console.error('Weekly insights generation failed:', error)
    return null
  }
}

export async function generateProjectInsights(feedbacks: any[], userQuestion?: string): Promise<any> {
  if (!openai) {
    console.error('OpenAI not initialized')
    return {
      summary: "AI insights unavailable",
      recommendations: [],
      hasData: false
    }
  }

  try {
    // Prepare feedback summary
    const feedbackSummary = feedbacks.map((f, i) => {
      const sentiment = f.sentiment > 0.3 ? 'positive' : f.sentiment < -0.3 ? 'negative' : 'neutral'
      return `${i + 1}. Rating: ${f.rating || 'N/A'}/5, Sentiment: ${sentiment}, Feedback: "${f.content}"`
    }).join('\n')

    // Calculate basic stats
    const avgRating = feedbacks.filter(f => f.rating).reduce((sum, f) => sum + f.rating, 0) / feedbacks.filter(f => f.rating).length || 0
    const avgSentiment = feedbacks.reduce((sum, f) => sum + (f.sentiment || 0), 0) / feedbacks.length
    const positiveCount = feedbacks.filter(f => f.sentiment > 0.3).length
    const negativeCount = feedbacks.filter(f => f.sentiment < -0.3).length

    const prompt = `You are a product advisor analyzing customer feedback. 

Here's the feedback data:
Total feedback: ${feedbacks.length}
Average rating: ${avgRating.toFixed(1)}/5
Positive feedback: ${positiveCount}
Negative feedback: ${negativeCount}
Overall sentiment: ${avgSentiment > 0.3 ? 'Positive' : avgSentiment < -0.3 ? 'Negative' : 'Mixed'}

All feedback:
${feedbackSummary}

${userQuestion ? `The project owner asks: "${userQuestion}"` : 'Provide general improvement recommendations.'}

Analyze this feedback and return a JSON object with:
1. "summary": A 2-3 sentence executive summary of the overall feedback
2. "strengths": Array of 3 things users love (with evidence from feedback)
3. "improvements": Array of top 5 specific, actionable improvements based on the feedback
4. "priorities": Array of 3 urgent issues to fix first (if any)
5. "opportunities": Array of 3 growth opportunities based on positive feedback
6. "userQuestionAnswer": Direct answer to the user's question if they asked one
7. "nextSteps": Array of 3 immediate next steps the creator should take
8. "sentiment_analysis": Object with detailed sentiment breakdown

Make recommendations specific and actionable. Reference actual feedback when possible.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert product advisor. Provide actionable insights based on customer feedback. Be specific and reference actual feedback.'
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
    if (!result) throw new Error('No response from AI')

    return JSON.parse(result)
  } catch (error) {
    console.error('Failed to generate insights:', error)
    return {
      summary: "Unable to generate AI insights at this time.",
      recommendations: ["Collect more feedback", "Review feedback manually"],
      hasData: true,
      error: true
    }
  }
}