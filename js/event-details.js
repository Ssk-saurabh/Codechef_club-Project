// ==========================================================================
// EVENT DETAILS PAGE INTERACTIONS (event.html)
// Reads event ID from URL query string and displays event details
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const eventDetailsArticle = document.querySelector(".event-details");
  if (!eventDetailsArticle) return;

  const idParam = getQueryParam("id");
  const eventId = idParam ? parseInt(idParam, 10) : null;

  async function loadEventDetails() {
    let event = null;
    const client = typeof getSupabase === "function" ? getSupabase() : null;

    if (client && eventId) {
      try {
        const { data, error } = await client
          .from("events")
          .select("*")
          .eq("id", eventId)
          .maybeSingle();

        if (!error && data) {
          event = data;
        } else if (error) {
          console.warn("Supabase fetch error for event details:", error.message);
        }
      } catch (err) {
        console.warn("Network error contacting Supabase:", err);
      }
    }

    // Local fallback if not found from Supabase
    if (!event && eventId) {
      const events = getLocalEvents();
      event = events.find(ev => ev.id === eventId) || null;
    }

    renderEvent(event);
  }

  function renderEvent(event) {
    if (!event) {
      // Graceful "Event Not Found" UI
      eventDetailsArticle.innerHTML = `
        <nav aria-label="Breadcrumb">
          <a href="events.html">&larr; Back to all events</a>
        </nav>
        <div class="empty-state" role="alert">
          <h1 class="empty-title">Event Not Found</h1>
          <p>The event you are looking for does not exist, has been removed, or an invalid ID was provided.</p>
          <p><a href="events.html" class="button">Explore Available Events</a></p>
        </div>
      `;
      return;
    }

    const titleEl = document.getElementById("eventTitle");
    const categoryEl = document.getElementById("eventCategory");
    const dateEl = document.getElementById("eventDate");
    const timeEl = document.getElementById("eventTime");
    const venueEl = document.getElementById("eventVenue");
    const descEl = document.getElementById("eventDescription");
    const registerLink = document.getElementById("registerLink");

    // Populate dynamic details safely using textContent
    if (titleEl) titleEl.textContent = event.title;
    if (categoryEl) categoryEl.textContent = event.category;
    if (dateEl) dateEl.textContent = event.date;
    if (timeEl) timeEl.textContent = event.time || event.start_time || "";
    if (venueEl) venueEl.textContent = event.venue;
    if (descEl) descEl.textContent = event.description;

    if (registerLink) {
      registerLink.href = `register.html?event=${encodeURIComponent(event.id)}`;
    }
  }

  loadEventDetails();
});
