// ==========================================================================
// SUPABASE CLIENT & AUTH UTILITIES (js/supabase.js)
// Initialized with safe public client credentials only.
// NO service-role keys or database secrets.
// ==========================================================================

const SUPABASE_CONFIG = {
  url: "https://xpoxmnednjnoclbbvxcf.supabase.co",
  anonKey: "sb_publishable_os4_GX0V2pMDHBMzCm4pSw_tL50J-IK"
};

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  if (window.supabase && typeof window.supabase.createClient === "function") {
    try {
      supabaseClient = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
      );
      return supabaseClient;
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }

  console.warn("Supabase library not loaded yet.");
  return null;
}

// Automatically initialize if library is available
const sb = getSupabase();

// Check if currently authenticated user exists in public.admin_users
async function checkAdminSession() {
  const client = getSupabase();
  if (!client) return { authenticated: false, isAdmin: false };

  try {
    const { data: sessionData, error: sessionErr } = await client.auth.getSession();
    if (sessionErr || !sessionData || !sessionData.session) {
      return { authenticated: false, isAdmin: false };
    }

    const user = sessionData.session.user;
    if (!user) return { authenticated: false, isAdmin: false };

    // Query admin_users table for this user_id with explicit authorization token
    let adminQuery = client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id);

    if (sessionData.session?.access_token) {
      adminQuery = adminQuery.setHeader("Authorization", `Bearer ${sessionData.session.access_token}`);
    }

    const { data, error } = await adminQuery.limit(1);

    if (error || !data || data.length === 0) {
      return { authenticated: true, isAdmin: false, user };
    }

    return { authenticated: true, isAdmin: true, user };
  } catch (err) {
    console.error("Error verifying admin session:", err);
    return { authenticated: false, isAdmin: false };
  }
}

// Shared admin route guard: redirects unauthenticated/non-admin users to login
async function enforceAdminGuard() {
  const result = await checkAdminSession();

  if (!result.authenticated) {
    window.location.replace("login.html");
    return false;
  }

  if (!result.isAdmin) {
    const client = getSupabase();
    if (client) await client.auth.signOut();
    alert("Access denied: You are authenticated, but not an authorized club administrator.");
    window.location.replace("login.html");
    return false;
  }

  return true;
}
