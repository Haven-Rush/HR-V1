export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      interactions: {
        Row: {
          id: string
          visitor_id: string
          property_id: string
          event_type: string
          points: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          visitor_id: string
          property_id: string
          event_type: string
          points?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          visitor_id?: string
          property_id?: string
          event_type?: string
          points?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Interaction = Database['public']['Tables']['interactions']['Row']
export type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
export type InteractionUpdate = Database['public']['Tables']['interactions']['Update']

// Event types for type safety
export type EventType = 
  | 'check_in' 
  | 'view' 
  | 'favorite' 
  | 'share' 
  | 'inquiry' 
  | 'tour_request'
  | 'document_download'

// Engagement score calculation result
export interface EngagementScore {
  visitor_id: string
  property_id: string
  total_points: number
  interaction_count: number
  engagement_level: 'low' | 'medium' | 'high' | 'very_high'
  last_interaction: string
}
