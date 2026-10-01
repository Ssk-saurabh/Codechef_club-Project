// ==========================================================================
// EVENTS CATALOG INTERACTIONS (events.html)
// Real-time search, category filtering, combined results, and empty states
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const eventsContainer = document.getElementById("eventsContainer");

  if (!eventsContainer) return;

  let events = [];

  async function loadEvents() {
    const client = typeof getSupabase === "function" ? getSupabase() : null;

    if (client) {
      try {
        const { data, error } = await client
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (!error && data && data.length > 0) {
          events = data;
          filterAndSearch();
          return;
        } else if (error) {
          console.warn("Supabase load error, falling back to local dataset:", error.message);
        }
      } catch (err) {
        console.warn("Network error contacting Supabase, using fallback:", err);
      }
    }

    // Local fallback
    events = getLocalEvents();
    filterAndSearch();
  }

  function renderEvents(filteredList) {
    eventsContainer.innerHTML = "";

    if (!filteredList || filteredList.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";
      emptyDiv.setAttribute("role", "status");

      const emptyTitle = document.createElement("p");
      emptyTitle.className = "empty-title";
      emptyTitle.textContent = "No events found.";

      const emptySubtitle = document.createElement("p");
      emptySubtitle.textContent = "Try adjusting your search terms or category filter.";

      emptyDiv.appendChild(emptyTitle);
      emptyDiv.appendChild(emptySubtitle);
      eventsContainer.appendChild(emptyDiv);
      return;
    }

    filteredList.forEach(event => {
      const card = document.createElement("article");
      card.className = "event-card";

      const title = document.createElement("h3");
      title.textContent = event.title;

      const category = document.createElement("p");
      const catStrong = document.createElement("strong");
      catStrong.textContent = "Category: ";
      category.appendChild(catStrong);
      category.appendChild(document.createTextNode(event.category));

      const dateP = document.createElement("p");
      const dateStrong = document.createElement("strong");
      dateStrong.textContent = "Date: ";
      dateP.appendChild(dateStrong);
      dateP.appendChild(document.createTextNode(event.date));

      const timeP = document.createElement("p");
      const timeStrong = document.createElement("strong");
      timeStrong.textContent = "Time: ";
      timeP.appendChild(timeStrong);
      timeP.appendChild(document.createTextNode(event.time || event.start_time || ""));

      const venueP = document.createElement("p");
      const venueStrong = document.createElement("strong");
      venueStrong.textContent = "Venue: ";
      venueP.appendChild(venueStrong);
      venueP.appendChild(document.createTextNode(event.venue));

      const descP = document.createElement("p");
      descP.textContent = event.description;

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "card-actions";

      const detailsLink = document.createElement("a");
      detailsLink.href = `event.html?id=${encodeURIComponent(event.id)}`;
      detailsLink.textContent = "View Details";

      const registerLink = document.createElement("a");
      registerLink.href = `register.html?event=${encodeURIComponent(event.id)}`;
      registerLink.textContent = "Register";
      registerLink.className = "button secondary";

      actionsDiv.appendChild(detailsLink);
      actionsDiv.appendChild(registerLink);

      card.appendChild(title);
      card.appendChild(category);
      card.appendChild(dateP);
      card.appendChild(timeP);
      card.appendChild(venueP);
      card.appendChild(descP);
      card.appendChild(actionsDiv);

      eventsContainer.appendChild(card);
    });
  }

  function filterAndSearch() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const selectedCategory = (categoryFilter ? categoryFilter.value : "").trim();

    const matches = events.filter(ev => {
      const matchCat = !selectedCategory || ev.category === selectedCategory;
      const matchQuery = !query ||
        (ev.title && ev.title.toLowerCase().includes(query)) ||
        (ev.category && ev.category.toLowerCase().includes(query)) ||
        (ev.venue && ev.venue.toLowerCase().includes(query)) ||
        (ev.description && ev.description.toLowerCase().includes(query));

      return matchCat && matchQuery;
    });

    renderEvents(matches);
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterAndSearch);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterAndSearch);
  }

  // Load events (from Supabase first, with local fallback)
  loadEvents();
});
