/**
 * AURORA — Configuración de conexión a Supabase
 *
 * Los dos valores están en el panel de Supabase:
 *   Project Settings  →  API
 *      - Project URL          →  SUPABASE_URL
 *      - Project API keys → anon / public  →  SUPABASE_ANON_KEY
 *
 * La clave "anon" es pública a propósito: cualquiera que mire el código de la
 * página la va a ver. Lo que protege los datos son las reglas de la base (RLS),
 * no esta clave.
 *
 * NUNCA pongas acá la clave "service_role".
 */

const SUPABASE_URL = "https://mdyczweuwhpfyioavngm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1x2LOakgxRB0TFcmIxfJJQ_MZV--9Zy";

// Dominio interno con el que se arman los mails de login a partir del usuario.
// El chofer escribe "jperez" y por debajo se usa "jperez@aurora.local".
const DOMINIO_LOGIN = "aurora.local";