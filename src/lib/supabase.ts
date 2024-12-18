import { Database } from "@/types/chat.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabase = cookies().then((cookieStore) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch (e) {
            console.error(e);
          }
        },
      },
    },
  );
});

export default supabase;
