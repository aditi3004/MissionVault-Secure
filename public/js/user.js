document.addEventListener("DOMContentLoaded", () => {
  // Populate user info
  fetch("/api/user/profile")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    })
    .then((data) => {
      document.getElementById("username").textContent = data.username;
      document.getElementById("role").textContent = data.role;
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("username").textContent = "Error loading";
      document.getElementById("role").textContent = "Error loading";
    });

  // Handle password update
  const passwordForm = document.getElementById("passwordForm");
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentPassword = passwordForm.currentPassword.value;
    const newPassword = passwordForm.newPassword.value;

    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await res.json();
      alert(result.message || "Password updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update password.");
    }
  });

  // Toggle payment history
  const toggleBtn = document.getElementById("togglePaymentsBtn");
  const paymentSection = document.getElementById("paymentHistory");
  const paymentBody = document.getElementById("paymentTableBody");

  toggleBtn.addEventListener("click", async () => {
    if (!paymentSection.classList.contains("hidden")) {
      paymentSection.classList.add("hidden");
      toggleBtn.textContent = "Show";
      return;
    }

    try {
      const res = await fetch("/api/user/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");

      const payments = await res.json();
      paymentBody.innerHTML = "";

      if (payments.length === 0) {
        paymentBody.innerHTML =
          '<tr><td colspan="3" class="text-center py-2 text-gray-500">No payment records found</td></tr>';
      } else {
        payments.forEach((p) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="px-4 py-2 border">${new Date(
              p.date
            ).toLocaleDateString()}</td>
            <td class="px-4 py-2 border">₹${p.amount}</td>
            <td class="px-4 py-2 border">${p.purpose}</td>
          `;
          paymentBody.appendChild(row);
        });
      }

      paymentSection.classList.remove("hidden");
      toggleBtn.textContent = "Hide";
    } catch (err) {
      console.error(err);
      alert("Unable to load payment history.");
    }
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch("/logout")
      .then(() => (window.location.href = "/login.html"))
      .catch((err) => console.error("Logout failed", err));
  });

  // Toggle Dark Mode
  const toggleDark = document.getElementById("toggleDarkMode");
  toggleDark.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });
});
