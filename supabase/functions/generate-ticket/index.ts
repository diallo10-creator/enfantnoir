import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple HTML to PDF conversion using Puppeteer alternative
async function generateTicketPDF(registrationData: any): Promise<Uint8Array> {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ticket {
            background: white;
            color: #333;
            border-radius: 15px;
            padding: 40px;
            max-width: 600px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        .ticket::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .event-title {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .artist {
            font-size: 24px;
            color: #764ba2;
            margin-bottom: 20px;
        }
        .ticket-info {
            background: #f8f9ff;
            padding: 25px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .value {
            color: #333;
        }
        .qr-placeholder {
            width: 120px;
            height: 120px;
            background: #f0f0f0;
            border: 2px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            border-radius: 8px;
            font-size: 12px;
            color: #666;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
        }
        .ticket-id {
            font-family: monospace;
            background: #e8f4f8;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <div class="event-title">LA LÉGENDE URBAINE</div>
            <div class="artist">ENFANT NOIR SD</div>
            <div style="font-size: 18px; color: #888;">CONCERT À ABIDJAN</div>
        </div>
        
        <div class="ticket-info">
            <div class="info-row">
                <span class="label">Nom:</span>
                <span class="value">${registrationData.nom}</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${registrationData.email}</span>
            </div>
            <div class="info-row">
                <span class="label">Téléphone:</span>
                <span class="value">${registrationData.telephone}</span>
            </div>
            <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">25 Janvier 2025</span>
            </div>
            <div class="info-row">
                <span class="label">Heure:</span>
                <span class="value">20:00</span>
            </div>
            <div class="info-row">
                <span class="label">Lieu:</span>
                <span class="value">Palais de la Culture, Abidjan</span>
            </div>
            <div class="info-row">
                <span class="label">N° Ticket:</span>
                <span class="value ticket-id">${registrationData.ticket_id}</span>
            </div>
        </div>
        
        <div class="qr-placeholder">
            Code QR<br/>
            ${registrationData.ticket_id}
        </div>
        
        <div class="footer">
            <p><strong>Conservez ce ticket pour l'entrée</strong></p>
            <p>Date d'inscription: ${new Date(registrationData.date_inscription).toLocaleDateString('fr-FR')}</p>
        </div>
    </div>
</body>
</html>`;

  // For a real implementation, you would use a PDF generation service
  // For now, we'll create a simple text file as a placeholder
  const textContent = `
TICKET DE CONCERT - LA LÉGENDE URBAINE
======================================

Artiste: ENFANT NOIR SD
Nom: ${registrationData.nom}
Email: ${registrationData.email}
Téléphone: ${registrationData.telephone}
Numéro de ticket: ${registrationData.ticket_id}
Date du concert: 25 Janvier 2025 à 20:00
Lieu: Palais de la Culture, Abidjan
Date d'inscription: ${new Date(registrationData.date_inscription).toLocaleDateString('fr-FR')}

Conservez ce ticket pour l'entrée.
`;

  return new TextEncoder().encode(textContent);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registration_id } = await req.json();

    if (!registration_id) {
      return new Response(
        JSON.stringify({ error: 'ID d\'inscription requis' }),
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

    // Get registration data
    const { data: registration, error: fetchError } = await supabase
      .from('inscriptions_concert')
      .select('*')
      .eq('id', registration_id)
      .single();

    if (fetchError || !registration) {
      return new Response(
        JSON.stringify({ error: 'Inscription non trouvée' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate ticket
    const ticketContent = await generateTicketPDF(registration);
    const fileName = `ticket_${registration.ticket_id}.txt`;
    const filePath = `tickets/${registration_id}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('tickets')
      .upload(filePath, ticketContent, {
        contentType: 'text/plain',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération du ticket' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update registration with file path
    const { error: updateError } = await supabase
      .from('inscriptions_concert')
      .update({ ticket_file_path: filePath })
      .eq('id', registration_id);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        ticket_path: filePath,
        message: 'Ticket généré avec succès'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating ticket:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur interne' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});