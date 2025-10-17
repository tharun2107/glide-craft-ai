-- Enable authentication and link presentations to users
ALTER TABLE public.presentations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update presentations RLS policies to be user-specific
DROP POLICY IF EXISTS "Anyone can view presentations" ON public.presentations;
DROP POLICY IF EXISTS "Anyone can create presentations" ON public.presentations;
DROP POLICY IF EXISTS "Anyone can update presentations" ON public.presentations;
DROP POLICY IF EXISTS "Anyone can delete presentations" ON public.presentations;

CREATE POLICY "Users can view their own presentations"
  ON public.presentations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own presentations"
  ON public.presentations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presentations"
  ON public.presentations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presentations"
  ON public.presentations FOR DELETE
  USING (auth.uid() = user_id);

-- Update slides RLS to check presentation ownership
DROP POLICY IF EXISTS "Anyone can view slides" ON public.slides;
DROP POLICY IF EXISTS "Anyone can create slides" ON public.slides;
DROP POLICY IF EXISTS "Anyone can update slides" ON public.slides;
DROP POLICY IF EXISTS "Anyone can delete slides" ON public.slides;

CREATE POLICY "Users can view slides of their presentations"
  ON public.slides FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.presentations
      WHERE presentations.id = slides.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create slides for their presentations"
  ON public.slides FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.presentations
      WHERE presentations.id = slides.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update slides of their presentations"
  ON public.slides FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.presentations
      WHERE presentations.id = slides.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete slides of their presentations"
  ON public.slides FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.presentations
      WHERE presentations.id = slides.presentation_id
      AND presentations.user_id = auth.uid()
    )
  );

-- Create templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  theme_config JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone"
  ON public.templates FOR SELECT
  USING (true);

-- Insert default templates with professional themes
INSERT INTO public.templates (name, description, theme_config) VALUES
(
  'Modern Professional',
  'Clean and minimalist design perfect for business presentations',
  '{
    "primaryColor": "hsl(262 83% 58%)",
    "secondaryColor": "hsl(220 14% 96%)",
    "accentColor": "hsl(195 100% 50%)",
    "backgroundColor": "#ffffff",
    "textColor": "#1a1a1a",
    "fontFamily": "Inter, sans-serif",
    "headingFont": "Inter, sans-serif",
    "titleLayout": "center",
    "animations": {
      "slideTransition": "fade",
      "elementEntrance": "slide-up"
    }
  }'
),
(
  'Dark Elegance',
  'Sophisticated dark theme for impactful presentations',
  '{
    "primaryColor": "hsl(280 100% 70%)",
    "secondaryColor": "hsl(224 16% 16%)",
    "accentColor": "hsl(320 100% 65%)",
    "backgroundColor": "#0f0f1a",
    "textColor": "#ffffff",
    "fontFamily": "Inter, sans-serif",
    "headingFont": "Playfair Display, serif",
    "titleLayout": "left",
    "animations": {
      "slideTransition": "slide-left",
      "elementEntrance": "fade-in"
    }
  }'
),
(
  'Creative Gradient',
  'Vibrant gradients and bold colors for creative presentations',
  '{
    "primaryColor": "hsl(320 100% 65%)",
    "secondaryColor": "hsl(262 83% 58%)",
    "accentColor": "hsl(195 100% 50%)",
    "backgroundColor": "#ffffff",
    "textColor": "#1a1a1a",
    "fontFamily": "Poppins, sans-serif",
    "headingFont": "Poppins, sans-serif",
    "titleLayout": "center",
    "animations": {
      "slideTransition": "zoom",
      "elementEntrance": "bounce"
    }
  }'
),
(
  'Corporate Blue',
  'Trust-building blue palette for corporate environments',
  '{
    "primaryColor": "hsl(210 100% 50%)",
    "secondaryColor": "hsl(210 20% 95%)",
    "accentColor": "hsl(195 100% 50%)",
    "backgroundColor": "#ffffff",
    "textColor": "#2c3e50",
    "fontFamily": "Roboto, sans-serif",
    "headingFont": "Roboto, sans-serif",
    "titleLayout": "left",
    "animations": {
      "slideTransition": "slide-right",
      "elementEntrance": "slide-up"
    }
  }'
),
(
  'Minimalist White',
  'Ultra-clean white space design for maximum focus',
  '{
    "primaryColor": "hsl(0 0% 10%)",
    "secondaryColor": "hsl(0 0% 95%)",
    "accentColor": "hsl(262 83% 58%)",
    "backgroundColor": "#ffffff",
    "textColor": "#1a1a1a",
    "fontFamily": "Inter, sans-serif",
    "headingFont": "Inter, sans-serif",
    "titleLayout": "center",
    "animations": {
      "slideTransition": "fade",
      "elementEntrance": "fade-in"
    }
  }'
),
(
  'Sunset Warm',
  'Warm, inviting colors for engaging storytelling',
  '{
    "primaryColor": "hsl(25 95% 53%)",
    "secondaryColor": "hsl(340 82% 52%)",
    "accentColor": "hsl(45 100% 51%)",
    "backgroundColor": "#fff8f0",
    "textColor": "#2c1810",
    "fontFamily": "Lato, sans-serif",
    "headingFont": "Merriweather, serif",
    "titleLayout": "left",
    "animations": {
      "slideTransition": "slide-up",
      "elementEntrance": "scale-in"
    }
  }'
);

-- Add template_id to presentations
ALTER TABLE public.presentations
ADD COLUMN template_id UUID REFERENCES public.templates(id);

-- Add animation and styling fields to slides
ALTER TABLE public.slides
ADD COLUMN animations JSONB DEFAULT '{}',
ADD COLUMN custom_styles JSONB DEFAULT '{}';

-- Update profiles trigger for timestamp
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();