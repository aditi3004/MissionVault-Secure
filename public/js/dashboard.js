const tabButtons = document.querySelectorAll(".tab-btn");
const tabSections = document.querySelectorAll(".tab-section");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");

    tabSections.forEach((section) => {
      section.classList.add("hidden");
      if (section.getAttribute("data-tab") === target) {
        section.classList.remove("hidden");

        if (target === "view") {
          fetchPersonnelRecords();
        }
      }
    });
  });
});

async function fetchPersonnelRecords() {
  try {
    const res = await fetch("/api/records");
    const data = await res.json();

    const tbody = document.getElementById("personnel-body");
    tbody.innerHTML = "";

    data.forEach((person) => {
      const row = `
        <tr>
          <td class="p-2 border bg-gray-800 text-[#2d3625] placeholder-[#A2AD94]">${
            person.id
          }</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] placeholder-[#A2AD94]">${
            person.first_name
          } ${person.last_name}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] placeholder-[#A2AD94]">${
            person.rank || "N/A"
          }</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] placeholder-[#A2AD94]">${
            person.email || "N/A"
          }</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error fetching records:", err);
  }
}

// Add Record
document
  .getElementById("add-record-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const newRecord = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      rank: document.getElementById("rank").value,
      email: document.getElementById("email").value,
      // Add other fields as needed
    };

    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
      const data = await res.json();
      alert(`Record Added! ID: ${data.id}`);
    } catch (err) {
      console.error("Error adding record:", err);
    }
  });

// Update Record
document
  .getElementById("update-record-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedRecord = {
      name: document.getElementById("update_name").value,
      email: document.getElementById("update_email").value,
    };

    try {
      const res = await fetch(
        `/api/records/${document.getElementById("update_id").value}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRecord),
        }
      );
      const data = await res.json();
      alert("Record Updated!");
    } catch (err) {
      console.error("Error updating record:", err);
    }
  });

// Delete Record
document
  .getElementById("delete-record-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const recordId = document.getElementById("delete_id").value;

    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert("Record Deleted!");
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  });
