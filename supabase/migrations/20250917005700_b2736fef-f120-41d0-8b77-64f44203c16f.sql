-- Create storage bucket for tickets
INSERT INTO storage.buckets (id, name, public) VALUES ('tickets', 'tickets', false);

-- Create RLS policies for ticket access
CREATE POLICY "Users can view their own tickets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tickets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service can create tickets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tickets');

-- Add ticket_file_path column to inscriptions table
ALTER TABLE public.inscriptions_concert 
ADD COLUMN ticket_file_path TEXT;