-- Create presentations table
CREATE TABLE public.presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Presentation',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create slides table
CREATE TABLE public.slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  presentation_id UUID NOT NULL REFERENCES public.presentations(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  layout TEXT DEFAULT 'title-content',
  background_color TEXT DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(presentation_id, slide_number)
);

-- Enable Row Level Security
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no authentication required)
CREATE POLICY "Anyone can view presentations"
  ON public.presentations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create presentations"
  ON public.presentations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update presentations"
  ON public.presentations FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete presentations"
  ON public.presentations FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view slides"
  ON public.slides FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create slides"
  ON public.slides FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update slides"
  ON public.slides FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete slides"
  ON public.slides FOR DELETE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON public.presentations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_slides_updated_at
  BEFORE UPDATE ON public.slides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_slides_presentation_id ON public.slides(presentation_id);
CREATE INDEX idx_slides_slide_number ON public.slides(presentation_id, slide_number);