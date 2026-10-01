// ==========================================================================
// REGISTRATION FORM INTERACTIONS (register.html)
// Reads event parameter from URL, validates form client-side, saves demo registration
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const eventSummaryEl = document.getElementById("eventSummary");
  const statusMessageEl = document.getElementById("statusMessage");

  if (!form) return;

  const eventParam = getQueryParam("event") || getQueryParam("id");
  const eventId = eventParam ? parseInt(eventParam, 10) : null;

  const events = getLocalEvents();
  const currentEvent = eventId ? events.find(ev => ev.id === eventId) : null;

  // Display event context banner safely
  if (eventSummaryEl) {
    eventSummaryEl.innerHTML = "";
    if (currentEvent) {
      eventSummaryEl.appendChild(document.createTextNode("Registering for: "));
      const strong = document.createElement("strong");
      strong.textContent = currentEvent.title;
      eventSummaryEl.appendChild(strong);
      eventSummaryEl.appendChild(document.createTextNode(` (${currentEvent.date} - ${currentEvent.venue})`));
    } else if (eventParam) {
      const em = document.createElement("em");
      em.textContent = `Note: Specified event ID (${eventParam}) was not found. You may still complete general registration.`;
      eventSummaryEl.appendChild(em);
    } else {
      const em = document.createElement("em");
      em.textContent = "General event registration. Select or confirm event details with club organizers.";
      eventSummaryEl.appendChild(em);
    }
  }

  function showMessage(text, isError = false) {
    if (!statusMessageEl) return;
    statusMessageEl.textContent = text;
    statusMessageEl.className = "status-message " + (isError ? "error" : "success");
    statusMessageEl.style.display = "block";
  }

  function validateEmail(email) {
    // Basic RFC 5322 regex check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // 10 digits check (ignoring hyphens, spaces, or plus)
    const cleaned = phone.replace(/[\s\-\+]/g, "");
    return cleaned.length >= 10 && /^\d+$/.test(cleaned);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const collegeInput = document.getElementById("college");
    const yearSelect = document.getElementById("year");
    const phoneInput = document.getElementById("phone");

    const name = fullNameInput ? fullNameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const college = collegeInput ? collegeInput.value.trim() : "";
    const year = yearSelect ? yearSelect.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";

    // Validation
    if (!name) {
      showMessage("Please enter your full name.", true);
      if (fullNameInput) fullNameInput.focus();
      return;
    }

    if (!email || !validateEmail(email)) {
      showMessage("Please enter a valid email address.", true);
      if (emailInput) emailInput.focus();
      return;
    }

    if (!college) {
      showMessage("Please enter your college or institute name.", true);
      if (collegeInput) collegeInput.focus();
      return;
    }

    if (!year) {
      showMessage("Please select your academic year.", true);
      if (yearSelect) yearSelect.focus();
      return;
    }

    if (!phone || !validatePhone(phone)) {
      showMessage("Please enter a valid phone number (at least 10 digits).", true);
      if (phoneInput) phoneInput.focus();
      return;
    }

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    async function handleRegistrationSubmission() {
      const client = typeof getSupabase === "function" ? getSupabase() : null;
      let dbSuccess = false;

      if (client && currentEvent) {
        try {
          const { data, error } = await client
            .from("registrations")
            .insert([
              {
                event_id: currentEvent.id,
                name,
                email,
                college,
                year,
                phone
              }
            ]);

          if (!error) {
            dbSuccess = true;
          } else {
            console.warn("Supabase registration insert error:", error.message);
          }
        } catch (err) {
          console.warn("Supabase network error during registration:", err);
        }
      }

      // Always maintain prototype local fallback
      const registrations = getLocalRegistrations();
      const newRegistration = {
        id: Date.now(),
        event_id: currentEvent ? currentEvent.id : 0,
        name,
        email,
        college,
        year,
        phone,
        created_at: new Date().toISOString().split("T")[0]
      };
      registrations.push(newRegistration);
      saveLocalRegistrations(registrations);

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Complete Registration";
      }

      if (dbSuccess) {
        showMessage(
          `Registration confirmed! Thank you ${name}. Your registration for "${currentEvent.title}" has been saved to the database.`,
          false
        );
      } else {
        showMessage(
          `Registration recorded! Thank you ${name}. Your registration for "${currentEvent ? currentEvent.title : 'Club Event'}" has been locally recorded (offline fallback).`,
          false
        );
      }
    }

    handleRegistrationSubmission();
  });
});
