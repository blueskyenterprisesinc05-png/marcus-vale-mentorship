import { createClient } from '@supabase/supabase-js'

// Validate environment variables server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseServiceKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
}

// Create a server-side Supabase client using the Service Role Key.
// This client bypasses RLS and must ONLY be used inside server-only code (actions, routes).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Optional public client if ever needed, but we recommend handling all inserts/queries
// through Server Actions using the admin/service role client or verified session client.
export const supabasePublic = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
