import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, slideCount = 5 } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Generating presentation:', { prompt, slideCount });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call Gemini API to generate presentation structure
    const systemPrompt = `You are a professional presentation creator. Generate a structured presentation based on the user's request.
Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "Presentation Title",
  "description": "Brief description",
  "slides": [
    {
      "title": "Slide Title",
      "content": {
        "heading": "Main heading",
        "bullets": ["Point 1", "Point 2"],
        "notes": "Speaker notes"
      },
      "layout": "title-content"
    }
  ]
}

Create ${slideCount} slides. Make content professional and well-structured.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser request: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('No content generated from Gemini');
    }

    // Parse the JSON response
    let presentationData;
    try {
      // Remove markdown code blocks if present
      const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      presentationData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      throw new Error('Failed to parse AI response');
    }

    // Create presentation in database
    const { data: presentation, error: presentationError } = await supabase
      .from('presentations')
      .insert({
        title: presentationData.title,
        description: presentationData.description,
      })
      .select()
      .single();

    if (presentationError) {
      console.error('Database error creating presentation:', presentationError);
      throw presentationError;
    }

    console.log('Presentation created:', presentation.id);

    // Create slides
    const slidesData = presentationData.slides.map((slide: any, index: number) => ({
      presentation_id: presentation.id,
      slide_number: index + 1,
      title: slide.title,
      content: slide.content,
      layout: slide.layout || 'title-content',
    }));

    const { data: slides, error: slidesError } = await supabase
      .from('slides')
      .insert(slidesData)
      .select();

    if (slidesError) {
      console.error('Database error creating slides:', slidesError);
      throw slidesError;
    }

    console.log(`Created ${slides.length} slides`);

    return new Response(
      JSON.stringify({
        presentationId: presentation.id,
        title: presentation.title,
        slideCount: slides.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-slides function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
