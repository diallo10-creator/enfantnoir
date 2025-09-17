import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const registrationId = url.searchParams.get('registration_id');
    const email = url.searchParams.get('email');

    if (!registrationId || !email) {
      return new Response(
        JSON.stringify({ error: 'ID d\'inscription et email requis' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the registration belongs to the email
    const { data: registration, error: fetchError } = await supabase
      .from('inscriptions_concert')
      .select('*')
      .eq('id', registrationId)
      .eq('email', email)
      .single();

    if (fetchError || !registration) {
      return new Response(
        JSON.stringify({ error: 'Inscription non trouvée ou email incorrect' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!registration.ticket_file_path) {
      return new Response(
        JSON.stringify({ error: 'Ticket non encore généré. Veuillez réessayer dans quelques instants.' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Download the ticket file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('tickets')
      .download(registration.ticket_file_path);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors du téléchargement du ticket' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return the file
    const fileName = `ticket_${registration.ticket_id}.txt`;
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Error downloading ticket:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur interne' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});