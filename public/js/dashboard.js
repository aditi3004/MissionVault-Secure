const tabButtons = document.querySelectorAll(".tab-btn");
const tabSections = document.querySelectorAll(".tab-section");

// Tab Switching
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

// Fetch all personnel records
async function fetchPersonnelRecords() {
  try {
    const res = await fetch("/api/records");
    if (!res.ok) {
      throw new Error(`Failed to fetch records: ${res.statusText}`);
    }
    const data = await res.json();

    const tbody = document.getElementById("personnel-body");
    tbody.innerHTML = "";

    data.forEach((person) => {
      const row = `
        <tr>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            person.name
          )}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            person.role
          )}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            person.ranking
          )}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            person.email
          )}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            person.aadhaar_number
          )}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            person.pan_number
          )}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            formatDate(person.dob)
          )}</td>
          <td class="p-2 border bg-gray-800 text-[#2d3625] min-w-[150px]">${escapeHTML(
            person.service_number
          )}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error fetching records:", err);
    alert("Failed to fetch personnel records. Please try again later.");
  }
}

// Add Record
document
  .getElementById("add-record-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const newRecord = {
      name: document.getElementById("name").value,
      role: document.getElementById("role").value,
      ranking: document.getElementById("ranking").value,
      email: document.getElementById("email").value,
      aadhaar_number: document.getElementById("aadhaar_number").value,
      pan_number: document.getElementById("pan_number").value,
      dob: document.getElementById("dob").value,
      service_number: document.getElementById("service_number").value,
    };

    if (!validateInput(newRecord)) {
      return; // Stop submission if validation fails
    }

    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Record Added! ID: ${data.id}`);
        fetchPersonnelRecords();
      } else {
        alert("Error adding record");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });

function formatDate(dateStr) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validateInput(record) {
  if (!record.name || record.name.length > 255) {
    alert("Invalid name");
    return false;
  }
  if (!record.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
    alert("Invalid email");
    return false;
  }
  if (!/^\d{12}$/.test(record.aadhaar_number)) {
    alert("Invalid Aadhaar number");
    return false;
  }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(record.pan_number)) {
    alert("Invalid PAN number");
    return false;
  }
  if (!record.dob || isNaN(new Date(record.dob).getTime())) {
    alert("Invalid date of birth");
    return false;
  }
  return true;
}
