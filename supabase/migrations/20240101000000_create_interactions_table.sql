-- Create interactions table for tracking visitor engagement with properties
CREATE TABLE IF NOT EXISTS public.interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id UUID NOT NULL,
    property_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_interactions_visitor_id ON public.interactions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_interactions_property_id ON public.interactions(property_id);
CREATE INDEX IF NOT EXISTS idx_interactions_event_type ON public.interactions(event_type);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON public.interactions(created_at DESC);

-- Create composite index for engagement score calculations
CREATE INDEX IF NOT EXISTS idx_interactions_visitor_property ON public.interactions(visitor_id, property_id);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON public.interactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read access (for analytics/dashboard viewing)
CREATE POLICY "Allow public read access" ON public.interactions
    FOR SELECT
    USING (true);

-- RLS Policy: Allow authenticated inserts (for API endpoints)
CREATE POLICY "Allow authenticated inserts" ON public.interactions
    FOR INSERT
    WITH CHECK (true);

-- RLS Policy: Prevent public updates/deletes (data integrity)
CREATE POLICY "Prevent public updates" ON public.interactions
    FOR UPDATE
    USING (false);

CREATE POLICY "Prevent public deletes" ON public.interactions
    FOR DELETE
    USING (false);

-- Add comments for documentation
COMMENT ON TABLE public.interactions IS 'Tracks visitor engagement events with properties for gamification scoring';
COMMENT ON COLUMN public.interactions.visitor_id IS 'UUID identifying the visitor (can be anonymous or authenticated)';
COMMENT ON COLUMN public.interactions.property_id IS 'UUID of the property being interacted with';
COMMENT ON COLUMN public.interactions.event_type IS 'Type of interaction (e.g., check_in, view, favorite, share)';
COMMENT ON COLUMN public.interactions.points IS 'Points awarded for this interaction';
COMMENT ON COLUMN public.interactions.metadata IS 'Additional event data stored as JSON';
