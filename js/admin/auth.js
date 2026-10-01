// ==========================================================================
// ADMIN LOGIN PROTOTYPE INTERACTIONS (admin/login.html)
// Basic frontend validation only (No fake auth, No plain text password storing)
// Real Supabase Auth will be wired up in later phases
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (!form) return;

  function showMessage(text, isError = false) {
    if (!loginMessage) return;
    loginMessage.textContent = text;
    loginMessage.className = "status-message " + (isError ? "error" : "success");
    loginMessage.style.display = "block";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("adminEmail");
    const passwordInput = document.getElementById("adminPassword");
    const loginBtn = document.getElementById("loginBtn");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !validateEmail(email)) {
      showMessage("Please enter a valid admin email address.", true);
      if (emailInput) emailInput.focus();
      return;
    }

    if (!password || password.length < 6) {
      showMessage("Password must be at least 6 characters long.", true);
      if (passwordInput) passwordInput.focus();
      return;
    }

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = "Authenticating...";
    }

    const client = typeof getSupabase === "function" ? getSupabase() : null;

    if (!client) {
      showMessage("Supabase client unavailable. Please check internet connection.", true);
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Log In";
      }
      return;
    }

    try {
      const { data: authData, error: authError } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData || !authData.user) {
        showMessage(authError ? authError.message : "Invalid login credentials.", true);
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = "Log In";
        }
        return;
      }

      // Check if user is in public.admin_users
      const { data: adminRows, error: adminErr } = await client
        .from("admin_users")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .limit(1);

      if (adminErr || !adminRows || adminRows.length === 0) {
        // Authenticated user is NOT an authorized admin
        await client.auth.signOut();
        showMessage("Unauthorized: Your account does not have administrator privileges.", true);
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = "Log In";
        }
        return;
      }

      // Admin verification passed
      showMessage("Login successful! Redirecting to admin dashboard...", false);

      setTimeout(() => {
        window.location.replace("dashboard.html");
      }, 500);

    } catch (err) {
      console.error("Login process error:", err);
      showMessage("An error occurred during authentication. Please try again.", true);
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Log In";
      }
    }
  });
});
