import { Database } from "@/types/supabase";
import { SupabaseClient, createClient } from "@supabase/supabase-js";


let __client: SupabaseClient<Database>
let __accessToken: string

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


export const supabaseClient = async (getToken: (options?: any) => Promise<string | null>) => {
    const supabaseAccessToken = await getToken({ template: 'supabase' })

    if (!supabaseAccessToken) {
        throw new Error('No access token found')
    }

    if (!__client || __accessToken !== supabaseAccessToken) {
        __client = createClient<Database>(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
            }
        )
        __accessToken = supabaseAccessToken
    }
    
    return __client;
};