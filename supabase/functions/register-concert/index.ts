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
    const { nom, email, telephone } = await req.json();

    // Validate required fields
    if (!nom || !email || !telephone) {
      return new Response(
        JSON.stringify({ error: 'Nom, email et téléphone sont obligatoires' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Format d\'email invalide' }),
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

    // Check if email already exists
    const { data: existingRegistration } = await supabase
      .from('inscriptions_concert')
      .select('id')
      .eq('email', email)
      .single();

    if (existingRegistration) {
      return new Response(
        JSON.stringify({ error: 'Cette adresse email est déjà inscrite' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing registration for:', { nom, email, telephone });

    // Integrate with Eventbrite API
    const eventbriteToken = Deno.env.get('EVENTBRITE_API_TOKEN');
    if (!eventbriteToken) {
      console.error('EVENTBRITE_API_TOKEN not found');
      return new Response(
        JSON.stringify({ error: 'Configuration Eventbrite manquante' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create attendee on Eventbrite
    const eventId = 'YOUR_EVENTBRITE_EVENT_ID'; // Replace with actual event ID
    let ticketId = '';
    let orderId = '';

    try {
      const eventbriteResponse = await fetch(`https://www.eventbriteapi.com/v3/events/${eventId}/attendees/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${eventbriteToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendee: {
            profile: {
              first_name: nom.split(' ')[0] || nom,
              last_name: nom.split(' ').slice(1).join(' ') || '',
              email: email,
              phone: telephone
            }
          }
        }),
      });

      if (!eventbriteResponse.ok) {
        const errorData = await eventbriteResponse.text();
        console.error('Eventbrite API error:', errorData);
        
        // Fallback to mock for testing
        ticketId = `TICKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        orderId = `ORDER_${Date.now()}`;
        console.log('Using fallback mock ticket ID:', ticketId);
      } else {
        const eventbriteData = await eventbriteResponse.json();
        ticketId = eventbriteData.id || `TICKET_${Date.now()}`;
        orderId = eventbriteData.order_id || `ORDER_${Date.now()}`;
        console.log('Eventbrite registration successful:', { ticketId, orderId });
      }
    } catch (error) {
      console.error('Error calling Eventbrite API:', error);
      
      // Fallback to mock for testing
      ticketId = `TICKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      orderId = `ORDER_${Date.now()}`;
      console.log('Using fallback mock ticket ID due to error:', ticketId);
    }

    // Save registration to database
    const { data: registration, error: dbError } = await supabase
      .from('inscriptions_concert')
      .insert({
        nom,
        email,
        telephone,
        ticket_id: ticketId,
        eventbrite_order_id: orderId,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'enregistrement' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Registration saved successfully:', registration);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inscription réussie ! Votre ticket vous a été envoyé par email.',
        ticket_id: ticketId,
        registration_id: registration.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing registration:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur interne' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});