// ==========================================================================
// ADMIN DASHBOARD INTERACTIONS (admin/dashboard.html)
// Dynamically calculates metric summary cards based on prototype data
// ==========================================================================

document.addEventListener("DOMContentLoaded", async () => {
  // Enforce admin guard
  if (typeof enforceAdminGuard === "function") {
    const authorized = await enforceAdminGuard();
    if (!authorized) return;
  }

  const totalEventsEl = document.getElementById("totalEventsCount");
  const upcomingEventsEl = document.getElementById("upcomingEventsCount");
  const totalRegistrationsEl = document.getElementById("totalRegistrationsCount");

  async function loadDashboardCounts() {
    const client = typeof getSupabase === "function" ? getSupabase() : null;
    let loadedFromSupabase = false;

    if (client) {
      try {
        // Query total events count
        const { count: eventsCount, error: evErr } = await client
          .from("events")
          .select("*", { count: "exact", head: true });

        // Query upcoming events count
        const todayStr = new Date().toISOString().split("T")[0];
        const { count: upcomingCount, error: upErr } = await client
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("date", todayStr);

        // Query total registrations count
        const { count: regCount, error: regErr } = await client
          .from("registrations")
          .select("*", { count: "exact", head: true });

        if (!evErr && !regErr) {
          if (totalEventsEl) totalEventsEl.textContent = eventsCount ?? 0;
          if (upcomingEventsEl) upcomingEventsEl.textContent = upcomingCount ?? 0;
          if (totalRegistrationsEl) totalRegistrationsEl.textContent = regCount ?? 0;
          loadedFromSupabase = true;
          return;
        } else {
          console.warn("Supabase count query warning:", evErr || regErr);
        }
      } catch (err) {
        console.warn("Network error during dashboard count fetch:", err);
      }
    }

    // Local fallback if Supabase query fails
    if (!loadedFromSupabase) {
      const events = getLocalEvents();
      const registrations = getLocalRegistrations();
      const todayStr = new Date().toISOString().split("T")[0];
      const upcomingCount = events.filter(ev => !ev.date || ev.date >= todayStr).length;

      if (totalEventsEl) totalEventsEl.textContent = events.length;
      if (upcomingEventsEl) upcomingEventsEl.textContent = upcomingCount;
      if (totalRegistrationsEl) totalRegistrationsEl.textContent = registrations.length;
    }
  }

  loadDashboardCounts();
});
