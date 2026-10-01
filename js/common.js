// ==========================================================================
// COLLEGE CLUB - COMMON UTILITIES & TEMPORARY PROTOTYPE DATA
// Phase 4: Vanilla JavaScript Interactions (No Supabase, No Frameworks)
// ==========================================================================

// Initial static demo data for events
const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Annual Hackathon 2026",
    category: "Hackathon",
    date: "2026-10-25",
    time: "10:00 AM",
    venue: "Main Auditorium",
    description: "Join us for 24 hours of coding, innovation, and fun with top industry mentors and prizes. Participants will collaborate in teams to build innovative solutions for real-world problems.",
    image_url: ""
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    category: "Workshop",
    date: "2026-11-05",
    time: "02:00 PM",
    venue: "Computer Lab 3",
    description: "Learn modern web development basics with HTML, CSS, and JavaScript. Ideal for beginners wanting to build responsive web apps.",
    image_url: ""
  },
  {
    id: 3,
    title: "Competitive Programming Contest",
    category: "Contest",
    date: "2026-11-18",
    time: "04:00 PM",
    venue: "Online",
    description: "Test your problem-solving and algorithmic skills against fellow students in a timed contest with dynamic leaderboards.",
    image_url: ""
  },
  {
    id: 4,
    title: "AI & Machine Learning Seminar",
    category: "Seminar",
    date: "2026-12-02",
    time: "11:00 AM",
    venue: "Seminar Hall B",
    description: "An introductory session discussing modern trends in Artificial Intelligence, Deep Learning, and industry applications.",
    image_url: ""
  }
];

// Initial static demo data for registrations
const INITIAL_REGISTRATIONS = [
  {
    id: 1,
    event_id: 1,
    name: "Jane Doe",
    email: "jane@example.edu",
    college: "State Engineering College",
    year: "3rd Year",
    phone: "9876543210",
    created_at: "2026-10-01"
  },
  {
    id: 2,
    event_id: 2,
    name: "Alex Smith",
    email: "alex@example.edu",
    college: "National Institute of Tech",
    year: "2nd Year",
    phone: "9123456780",
    created_at: "2026-10-02"
  },
  {
    id: 3,
    event_id: 1,
    name: "Rahul Kumar",
    email: "rahul@example.edu",
    college: "State Engineering College",
    year: "4th Year",
    phone: "9988776655",
    created_at: "2026-10-03"
  }
];

// --- LocalStorage Prototype Helpers ---
const STORAGE_KEYS = {
  EVENTS: "college_club_events",
  REGISTRATIONS: "college_club_registrations"
};

function getLocalEvents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn("Could not read localStorage:", err);
  }
  return [...INITIAL_EVENTS];
}

function saveLocalEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (err) {
    console.warn("Could not write to localStorage:", err);
  }
}

function getLocalRegistrations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn("Could not read localStorage:", err);
  }
  return [...INITIAL_REGISTRATIONS];
}

function saveLocalRegistrations(registrations) {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  } catch (err) {
    console.warn("Could not write to localStorage:", err);
  }
}

// URL helper to get query parameters safely
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Safe escape / text helper
function safeText(str) {
  return str == null ? "" : String(str);
}

// Global handler for admin logout button if present
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const client = typeof getSupabase === "function" ? getSupabase() : null;
      if (client) {
        try {
          await client.auth.signOut();
        } catch (err) {
          console.warn("Sign out error:", err);
        }
      }
      window.location.replace("login.html");
    });
  }
});

