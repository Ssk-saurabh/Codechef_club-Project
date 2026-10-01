// ==========================================================================
// ADMIN EVENTS CRUD INTERACTIONS (admin/events.html)
// Local prototype management for Adding, Editing, and Deleting events
// ==========================================================================

document.addEventListener("DOMContentLoaded", async () => {
  // Enforce admin guard
  if (typeof enforceAdminGuard === "function") {
    const authorized = await enforceAdminGuard();
    if (!authorized) return;
  }

  const eventForm = document.getElementById("eventForm");
  const formTitle = document.getElementById("formTitle");
  const eventIdInput = document.getElementById("eventId");
  const titleInput = document.getElementById("eventTitle");
  const categorySelect = document.getElementById("eventCategory");
  const dateInput = document.getElementById("eventDate");
  const timeInput = document.getElementById("eventStartTime");
  const venueInput = document.getElementById("eventVenue");
  const descInput = document.getElementById("eventDescription");
  const imageInput = document.getElementById("eventImageUrl");
  const tableBody = document.getElementById("eventsTableBody");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const saveBtn = document.getElementById("saveEventBtn");

  if (!tableBody) return;

  let currentEventsList = [];

  async function fetchEvents() {
    const client = typeof getSupabase === "function" ? getSupabase() : null;

    if (client) {
      try {
        const { data, error } = await client
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (!error && data) {
          currentEventsList = data;
          renderTableRows(currentEventsList);
          return;
        } else if (error) {
          console.warn("Supabase fetch warning, falling back to local dataset:", error.message);
        }
      } catch (err) {
        console.warn("Network error during events fetch:", err);
      }
    }

    currentEventsList = getLocalEvents();
    renderTableRows(currentEventsList);
  }

  function renderTableRows(events) {
    tableBody.innerHTML = "";

    if (events.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.style.textAlign = "center";
      td.style.padding = "var(--space-6)";
      td.textContent = "No events registered yet. Use the form above to add an event.";
      tr.appendChild(td);
      tableBody.appendChild(tr);
      return;
    }

    events.forEach(ev => {
      const tr = document.createElement("tr");

      const tdTitle = document.createElement("td");
      tdTitle.textContent = ev.title;

      const tdCat = document.createElement("td");
      tdCat.textContent = ev.category;

      const tdDate = document.createElement("td");
      tdDate.textContent = ev.date;

      const tdVenue = document.createElement("td");
      tdVenue.textContent = ev.venue;

      const tdActions = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn-edit";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => populateFormForEdit(ev));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn-delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => handleDeleteEvent(ev.id));

      tdActions.appendChild(editBtn);
      tdActions.appendChild(deleteBtn);

      tr.appendChild(tdTitle);
      tr.appendChild(tdCat);
      tr.appendChild(tdDate);
      tr.appendChild(tdVenue);
      tr.appendChild(tdActions);

      tableBody.appendChild(tr);
    });
  }

  function populateFormForEdit(ev) {
    if (eventIdInput) eventIdInput.value = ev.id;
    if (titleInput) titleInput.value = ev.title;
    if (categorySelect) categorySelect.value = ev.category;
    if (dateInput) dateInput.value = ev.date;
    if (timeInput) {
      const rawTime = ev.time || ev.start_time || "";
      timeInput.value = rawTime.includes(":") ? rawTime.slice(0, 5) : rawTime;
    }
    if (venueInput) venueInput.value = ev.venue;
    if (descInput) descInput.value = ev.description;
    if (imageInput) imageInput.value = ev.image_url || "";

    if (formTitle) formTitle.textContent = `Edit Event (ID: ${ev.id})`;
    if (titleInput) titleInput.focus();
  }

  function resetEventForm() {
    if (eventForm) eventForm.reset();
    if (eventIdInput) eventIdInput.value = "";
    if (formTitle) formTitle.textContent = "Add New Event";
  }

  async function handleDeleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event? This action will remove it permanently.")) {
      return;
    }

    const client = typeof getSupabase === "function" ? getSupabase() : null;
    let deletedInDb = false;

    if (client) {
      try {
        const { error } = await client
          .from("events")
          .delete()
          .eq("id", id);

        if (!error) {
          deletedInDb = true;
        } else {
          alert(`Database deletion failed: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error("Network error during event deletion:", err);
      }
    }

    // Update local fallback as well
    const localEvents = getLocalEvents().filter(ev => ev.id !== id);
    saveLocalEvents(localEvents);

    if (eventIdInput && parseInt(eventIdInput.value, 10) === id) {
      resetEventForm();
    }

    fetchEvents();
  }

  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = titleInput ? titleInput.value.trim() : "";
      const category = categorySelect ? categorySelect.value.trim() : "";
      const date = dateInput ? dateInput.value.trim() : "";
      const time = timeInput ? timeInput.value.trim() : "";
      const venue = venueInput ? venueInput.value.trim() : "";
      const description = descInput ? descInput.value.trim() : "";
      const image_url = imageInput ? imageInput.value.trim() : "";

      if (!title || !category || !date || !time || !venue || !description) {
        alert("Please fill in all required event fields.");
        return;
      }

      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
      }

      const client = typeof getSupabase === "function" ? getSupabase() : null;
      const existingId = eventIdInput && eventIdInput.value ? parseInt(eventIdInput.value, 10) : null;
      let dbOperationSuccess = false;

      if (client) {
        try {
          if (existingId) {
            // Update
            const { error: updateErr } = await client
              .from("events")
              .update({
                title,
                category,
                date,
                start_time: time,
                venue,
                description,
                image_url,
                updated_at: new Date().toISOString()
              })
              .eq("id", existingId);

            if (!updateErr) {
              dbOperationSuccess = true;
            } else {
              alert(`Update failed: ${updateErr.message}`);
            }
          } else {
            // Insert
            const { error: insertErr } = await client
              .from("events")
              .insert([
                {
                  title,
                  category,
                  date,
                  start_time: time,
                  venue,
                  description,
                  image_url
                }
              ]);

            if (!insertErr) {
              dbOperationSuccess = true;
            } else {
              alert(`Creation failed: ${insertErr.message}`);
            }
          }
        } catch (err) {
          console.error("Network error during event save:", err);
          alert("Network error: Could not contact Supabase.");
        }
      }

      // Also maintain local fallback consistency
      const localEvents = getLocalEvents();
      if (existingId) {
        const index = localEvents.findIndex(ev => ev.id === existingId);
        if (index !== -1) {
          localEvents[index] = { ...localEvents[index], title, category, date, time, venue, description, image_url };
          saveLocalEvents(localEvents);
        }
      } else {
        localEvents.push({ id: Date.now(), title, category, date, time, venue, description, image_url });
        saveLocalEvents(localEvents);
      }

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Event";
      }

      resetEventForm();
      fetchEvents();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      resetEventForm();
    });
  }

  // Initial load
  fetchEvents();
});
