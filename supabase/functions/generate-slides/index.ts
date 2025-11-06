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
    const { prompt, slideCount = 5, templateId, withImages = false } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      console.error('Auth error:', userError);
      throw new Error(`Authentication failed: ${userError.message}`);
    }
    if (!user) {
      console.error('No user found in token');
      throw new Error('No authenticated user found');
    }

    console.log('Generating presentation:', { prompt, slideCount, userId: user.id });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Call Gemini API to generate presentation structure
    const imageLayoutInstruction = withImages 
      ? ` Each slide should have an image placeholder on the right side. Include imagePrompt in content for AI image generation.`
      : '';
    
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
        "bullets": ["Detailed point 1 with comprehensive explanation", "Detailed point 2 with supporting information", "Point 3 with specific examples", "Point 4 with actionable insights", "Point 5 with relevant context", "Point 6 with additional details (if needed)", "Point 7 with concluding thoughts (if needed)"],
        "imagePrompt": "Description for AI image generation (only if withImages is true)",
        "notes": "Comprehensive speaker notes with detailed explanations"
      },
      "layout": "${withImages ? 'image-right' : 'title-content'}"
    }
  ]
}

IMPORTANT: Create ${slideCount} slides with rich, detailed content. Each slide MUST have 5-7 comprehensive bullet points that are informative and well-structured. Make the content professional, detailed, and suitable for PowerPoint presentations. Each bullet point should be a complete sentence or detailed phrase with meaningful information.${imageLayoutInstruction}`;

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

    // Generate images if withImages is true
    if (withImages && presentationData.slides) {
      console.log('Generating images for slides...');
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      for (const slide of presentationData.slides) {
        if (slide.content?.imagePrompt) {
          try {
            const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash-image-preview',
                messages: [
                  {
                    role: 'user',
                    content: slide.content.imagePrompt
                  }
                ],
                modalities: ['image', 'text']
              })
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
              
              if (imageUrl) {
                slide.content.images = [{ url: imageUrl, alt: slide.content.imagePrompt }];
                console.log(`Image generated for slide: ${slide.title}`);
              }
            } else {
              console.error(`Failed to generate image for slide ${slide.title}`);
            }
          } catch (error) {
            console.error(`Error generating image for slide ${slide.title}:`, error);
          }
        }
      }
    }

    // Create presentation in database
    const { data: presentation, error: presentationError } = await supabaseClient
      .from('presentations')
      .insert({
        title: presentationData.title,
        description: presentationData.description,
        user_id: user.id,
        template_id: templateId || null
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

    const { data: slides, error: slidesError } = await supabaseClient
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
    const status = /auth|authoriz/i.test(errorMessage) ? 401 : 500;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
