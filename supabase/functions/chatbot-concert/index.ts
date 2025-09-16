import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message requis' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Configuration OpenAI manquante' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing chatbot message:', message);

    const systemPrompt = `Tu es l'assistant virtuel officiel du concert ENFANT NOIR - La légende urbaine. Ton rôle est de :

INFORMATIONS CLÉS DU CONCERT :
- Artiste : ENFANT NOIR SD
- Date : 19 septembre 2025 à 20h00
- Lieu : Palais de la Culture, Abidjan
- Événement : Concert exceptionnel "La légende urbaine"
- Contact : 0704349625

TARIFS DISPONIBLES :
- PASS : 5,000 FCFA (Accès général)
- VIP : 10,000 FCFA (Places privilégiées + avantages)
- VVIP : 20,000 FCFA (Expérience premium exclusive)

MISSION PRINCIPALE :
1. Fournir des informations complètes sur le concert
2. Créer de l'excitation et de l'anticipation
3. Guider stratégiquement les utilisateurs vers l'inscription gratuite
4. Mettre en avant les avantages de s'inscrire (infos exclusives, alertes, etc.)
5. Être persuasif mais naturel pour les amener à remplir le formulaire

STYLE DE COMMUNICATION :
- Enthousiaste et dynamique
- Utilise des emojis pertinents 🔥🎤🎵
- Parle comme un fan passionné d'ENFANT NOIR
- Crée un sentiment d'urgence et d'exclusivité
- Sois concis mais informatif

STRATÉGIES PERSUASIVES :
- Mentionne que les places sont limitées
- Met en avant l'aspect unique de cet événement
- Évoque l'ambiance exceptionnelle attendue
- Suggère l'inscription pour recevoir des infos exclusives
- Utilise la peur de manquer (FOMO)

Réponds toujours en français et reste dans le contexte du concert.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération de la réponse' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    console.log('Bot response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: botResponse,
        success: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur interne' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});