import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import type { EventType, EngagementScore } from '@/types/database'

// Event type to points mapping for gamification
const EVENT_POINTS: Record<EventType, number> = {
  'view': 1,
  'check_in': 10,
  'favorite': 5,
  'share': 8,
  'inquiry': 15,
  'tour_request': 20,
  'document_download': 3,
}

interface PostEventRequest {
  visitor_id: string
  property_id: string
  event_type: EventType
  metadata?: Record<string, any>
}

/**
 * POST /api/moneyball
 * Records a visitor event and calculates engagement score
 */
export async function POST(request: NextRequest) {
  try {
    const body: PostEventRequest = await request.json()
    
    // Validate required fields
    if (!body.visitor_id || !body.property_id || !body.event_type) {
      return NextResponse.json(
        { error: 'Missing required fields: visitor_id, property_id, event_type' },
        { status: 400 }
      )
    }

    // Validate event_type
    if (!EVENT_POINTS.hasOwnProperty(body.event_type)) {
      return NextResponse.json(
        { 
          error: 'Invalid event_type', 
          valid_types: Object.keys(EVENT_POINTS) 
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const points = EVENT_POINTS[body.event_type]

    // Insert interaction record
    const { data: interaction, error: insertError } = await supabase
      .from('interactions')
      .insert({
        visitor_id: body.visitor_id,
        property_id: body.property_id,
        event_type: body.event_type,
        points,
        metadata: body.metadata || null,
      } as any)
      .select()
      .single() as any

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to record interaction', details: insertError.message },
        { status: 500 }
      )
    }

    // Calculate engagement score for this visitor-property combination
    const { data: interactions, error: queryError } = await supabase
      .from('interactions')
      .select('points, created_at')
      .eq('visitor_id', body.visitor_id)
      .eq('property_id', body.property_id)
      .order('created_at', { ascending: false }) as any

    if (queryError) {
      console.error('Query error:', queryError)
      // Still return success for the insert, but with limited engagement data
      return NextResponse.json({
        success: true,
        interaction,
        engagement_score: {
          visitor_id: body.visitor_id,
          property_id: body.property_id,
          total_points: points,
          interaction_count: 1,
          engagement_level: 'low',
          last_interaction: interaction.created_at,
        },
      })
    }

    // Calculate engagement metrics
    const total_points = interactions?.reduce((sum: number, i: any) => sum + i.points, 0) || 0
    const interaction_count = interactions?.length || 0
    const last_interaction = interactions?.[0]?.created_at || interaction.created_at

    // Determine engagement level based on total points
    let engagement_level: EngagementScore['engagement_level'] = 'low'
    if (total_points >= 100) {
      engagement_level = 'very_high'
    } else if (total_points >= 50) {
      engagement_level = 'high'
    } else if (total_points >= 20) {
      engagement_level = 'medium'
    }

    const engagement_score: EngagementScore = {
      visitor_id: body.visitor_id,
      property_id: body.property_id,
      total_points,
      interaction_count,
      engagement_level,
      last_interaction,
    }

    return NextResponse.json({
      success: true,
      interaction,
      engagement_score,
    }, { status: 201 })

  } catch (error) {
    console.error('Moneyball API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/moneyball?visitor_id={id}&property_id={id}
 * Retrieves engagement score for a visitor-property combination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const visitor_id = searchParams.get('visitor_id')
    const property_id = searchParams.get('property_id')

    if (!visitor_id || !property_id) {
      return NextResponse.json(
        { error: 'Missing required query parameters: visitor_id, property_id' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch all interactions for this visitor-property combination
    const { data: interactions, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('visitor_id', visitor_id)
      .eq('property_id', property_id)
      .order('created_at', { ascending: false }) as any

    if (error) {
      console.error('Query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch interactions', details: error.message },
        { status: 500 }
      )
    }

    if (!interactions || interactions.length === 0) {
      return NextResponse.json({
        engagement_score: {
          visitor_id,
          property_id,
          total_points: 0,
          interaction_count: 0,
          engagement_level: 'low',
          last_interaction: null,
        },
        interactions: [],
      })
    }

    // Calculate engagement metrics
    const total_points = interactions.reduce((sum: number, i: any) => sum + i.points, 0)
    const interaction_count = interactions.length
    const last_interaction = interactions[0].created_at

    // Determine engagement level
    let engagement_level: EngagementScore['engagement_level'] = 'low'
    if (total_points >= 100) {
      engagement_level = 'very_high'
    } else if (total_points >= 50) {
      engagement_level = 'high'
    } else if (total_points >= 20) {
      engagement_level = 'medium'
    }

    const engagement_score: EngagementScore = {
      visitor_id,
      property_id,
      total_points,
      interaction_count,
      engagement_level,
      last_interaction,
    }

    return NextResponse.json({
      engagement_score,
      interactions,
    })

  } catch (error) {
    console.error('Moneyball API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
