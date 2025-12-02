-- Fix PUBLIC_DATA_EXPOSURE: Events table allows all users to read all records
-- Update to only allow users to view their own events OR events where they are attendees

DROP POLICY IF EXISTS "Users can view all events" ON events;
CREATE POLICY "Users can view own events" ON events 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = ANY(attendee_ids));