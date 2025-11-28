import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ONESIGNAL_APP_ID = "833ba6e7-d68b-4391-bef7-bafe170c3aeb";
const ONESIGNAL_API_KEY = "os_v2_app_qm52nz6wrnbzdpxxxl7bodb25pfasrxa6m2ucwu5i7oquv5l4rju5tfrpsanc3unm2pgq3qmv4nutxlcc2sfm342djfihac7zyayt6a";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { record, type, table } = await req.json();

        let message = "Nouvelle notification";
        let heading = "Sillage Admin";

        if (table === "reservations") {
            heading = "Nouvelle Réservation";
            message = `${record.customer_name} a réservé pour ${record.number_of_guests} personnes le ${record.reservation_date} à ${record.reservation_time}.`;
        } else if (table === "orders") {
            heading = "Nouvelle Commande";
            message = `Commande de ${record.customer_name} pour ${record.total_amount} HTG.`;
        }

        const payload = {
            app_id: ONESIGNAL_APP_ID,
            headings: { en: heading },
            contents: { en: message },
            filters: [
                { field: "tag", key: "role", relation: "=", value: "admin" }
            ]
        };

        const response = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Basic ${ONESIGNAL_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
