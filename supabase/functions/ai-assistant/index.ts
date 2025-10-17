import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, content, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'improve':
        systemPrompt = 'You are a presentation expert. Improve the given content to be more clear, engaging, and professional. Keep it concise.';
        userPrompt = `Improve this presentation content:\n\n${content}`;
        break;
      
      case 'expand':
        systemPrompt = 'You are a presentation expert. Expand on the given content with more details, examples, and insights. Make it comprehensive but still clear.';
        userPrompt = `Expand on this presentation content:\n\n${content}\n\nContext: ${context || 'General presentation'}`;
        break;
      
      case 'summarize':
        systemPrompt = 'You are a presentation expert. Summarize the given content into key bullet points. Be concise and impactful.';
        userPrompt = `Summarize this into key points:\n\n${content}`;
        break;
      
      case 'suggest':
        systemPrompt = 'You are a presentation expert. Suggest improvements, additional points, or alternative approaches for the given content.';
        userPrompt = `Provide suggestions for this content:\n\n${content}\n\nContext: ${context || 'General presentation'}`;
        break;
      
      default:
        throw new Error('Invalid action');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway returned ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error('No response from AI');
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});