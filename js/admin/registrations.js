// ==========================================================================
// ADMIN REGISTRATIONS INTERACTIONS (admin/registrations.html)
// Real-time student search, filtering by event, and table rendering
// ==========================================================================

document.addEventListener("DOMContentLoaded", async () => {
  // Enforce admin guard
  if (typeof enforceAdminGuard === "function") {
    const authorized = await enforceAdminGuard();
    if (!authorized) return;
  }

  const regSearchInput = document.getElementById("regSearchInput");
  const regEventFilter = document.getElementById("regEventFilter");
  const tableBody = document.getElementById("registrationsTableBody");

  if (!tableBody) return;

  let allEvents = [];
  let allRegistrations = [];

  async function loadData() {
    const client = typeof getSupabase === "function" ? getSupabase() : null;

    if (client) {
      try {
        // Fetch events for mapping and filter dropdown
        const { data: eventsData, error: evErr } = await client
          .from("events")
          .select("id, title")
          .order("date", { ascending: true });

        if (!evErr && eventsData) {
          allEvents = eventsData;
        }

        // Fetch registrations
        const { data: regData, error: regErr } = await client
          .from("registrations")
          .select("*")
          .order("created_at", { ascending: false });

        if (!regErr && regData) {
          allRegistrations = regData;
          populateEventDropdown();
          filterRegistrations();
          return;
        } else if (regErr) {
          console.warn("Supabase registrations fetch warning, falling back to local dataset:", regErr.message);
        }
      } catch (err) {
        console.warn("Network error during registrations fetch:", err);
      }
    }

    // Local fallback
    allEvents = getLocalEvents();
    allRegistrations = getLocalRegistrations();
    populateEventDropdown();
    filterRegistrations();
  }

  function populateEventDropdown() {
    if (!regEventFilter) return;
    regEventFilter.innerHTML = '<option value="">All Events</option>';
    allEvents.forEach(ev => {
      const opt = document.createElement("option");
      opt.value = ev.id;
      opt.textContent = ev.title;
      regEventFilter.appendChild(opt);
    });
  }

  function getEventTitle(eventId) {
    const found = allEvents.find(ev => ev.id === eventId);
    return found ? found.title : (eventId === 0 ? "General Event" : `Event #${eventId}`);
  }

  function renderRegistrations(filteredList) {
    tableBody.innerHTML = "";

    if (!filteredList || filteredList.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 7;
      td.style.textAlign = "center";
      td.style.padding = "var(--space-6)";
      td.textContent = "No registrations match your search or filter.";
      tr.appendChild(td);
      tableBody.appendChild(tr);
      return;
    }

    filteredList.forEach(reg => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = reg.name;

      const tdEmail = document.createElement("td");
      tdEmail.textContent = reg.email;

      const tdCollege = document.createElement("td");
      tdCollege.textContent = reg.college;

      const tdYear = document.createElement("td");
      tdYear.textContent = reg.year;

      const tdPhone = document.createElement("td");
      tdPhone.textContent = reg.phone;

      const tdEvent = document.createElement("td");
      tdEvent.textContent = getEventTitle(reg.event_id);

      const tdDate = document.createElement("td");
      tdDate.textContent = reg.created_at ? reg.created_at.split("T")[0] : "N/A";

      tr.appendChild(tdName);
      tr.appendChild(tdEmail);
      tr.appendChild(tdCollege);
      tr.appendChild(tdYear);
      tr.appendChild(tdPhone);
      tr.appendChild(tdEvent);
      tr.appendChild(tdDate);

      tableBody.appendChild(tr);
    });
  }

  function filterRegistrations() {
    const query = (regSearchInput ? regSearchInput.value : "").trim().toLowerCase();
    const selectedEventId = (regEventFilter ? regEventFilter.value : "").trim();

    const matches = allRegistrations.filter(reg => {
      const matchEvent = !selectedEventId || String(reg.event_id) === selectedEventId;
      const matchQuery = !query ||
        (reg.name && reg.name.toLowerCase().includes(query)) ||
        (reg.email && reg.email.toLowerCase().includes(query)) ||
        (reg.college && reg.college.toLowerCase().includes(query));

      return matchEvent && matchQuery;
    });

    renderRegistrations(matches);
  }

  if (regSearchInput) {
    regSearchInput.addEventListener("input", filterRegistrations);
  }

  if (regEventFilter) {
    regEventFilter.addEventListener("change", filterRegistrations);
  }

  // Initial load
  loadData();
});
