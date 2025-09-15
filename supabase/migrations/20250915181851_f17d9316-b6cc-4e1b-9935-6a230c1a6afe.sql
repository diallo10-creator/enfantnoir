-- Create table for concert registrations
CREATE TABLE public.inscriptions_concert (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  ticket_id TEXT,
  date_inscription TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  eventbrite_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inscriptions_concert ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an event registration)
CREATE POLICY "Anyone can insert registrations" 
ON public.inscriptions_concert 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all registrations (you can restrict this later)
CREATE POLICY "Public can view registrations" 
ON public.inscriptions_concert 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inscriptions_concert_updated_at
BEFORE UPDATE ON public.inscriptions_concert
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_inscriptions_concert_email ON public.inscriptions_concert(email);
CREATE INDEX idx_inscriptions_concert_date ON public.inscriptions_concert(date_inscription);