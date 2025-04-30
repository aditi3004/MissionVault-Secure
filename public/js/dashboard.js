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

// Search Recorddocument.addEventListener("DOMContentLoaded", () => {
// Static array of users
const users = [
  {
    personnel_id: 3,
    name: "Aditi Sharma",
    role: "admin",
    ranking: "major",
    email: "10387aditisha@gmail.com",
    aadhaar_number: "123456789012",
    pan_number: "QDVPS1471P",
    dob: "2025-04-08",
    service_number: "1234",
  },
  {
    personnel_id: 4,
    name: "bhavini",
    role: "user",
    ranking: "commander",
    email: "bhavini@army.net",
    aadhaar_number: "123456789014",
    pan_number: "QDVPS1471Y",
    dob: "2025-04-25",
    service_number: "6789",
  },
  {
    personnel_id: 5,
    name: "anushka lonkar",
    role: "user",
    ranking: "commander",
    email: "anu@gmail.com",
    aadhaar_number: "123456789015",
    pan_number: "QDVPS1471D",
    dob: "2025-04-08",
    service_number: "3456",
  },
  {
    personnel_id: 6,
    name: "Annada Dash",
    role: "user",
    ranking: "commander",
    email: "annada@gmail.com",
    aadhaar_number: "123456789017",
    pan_number: "QDVPS1471A",
    dob: "2002-05-30",
    service_number: "345612",
  },
  {
    personnel_id: 8,
    name: "Annie D'szuza",
    role: "user",
    ranking: "Colonel",
    email: "annie@army.net",
    aadhaar_number: "123456789019",
    pan_number: "QDVPS1471U",
    dob: "1997-05-05",
    service_number: "8907654",
  },
];

// Event listener for the search form
document
  .getElementById("search-record-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    const searchServiceNumber = document
      .getElementById("search_service_number")
      .value.trim();
    let resultContainer = document.getElementById("search-results-section");

    // Ensure results container exists
    if (!resultContainer) {
      resultContainer = document.createElement("div");
      resultContainer.id = "search-results-section";
      resultContainer.classList.add("mt-4");
      document.body.appendChild(resultContainer);
    }

    // Remove any previous table
    let oldTable = document.getElementById("search-results-body");
    if (oldTable) oldTable.remove();

    // Create new table
    const resultTable = document.createElement("table");
    resultTable.id = "search-results-body";
    resultTable.classList.add("w-full", "table-auto", "border-collapse");

    // Search for the user with the matching service number
    const user = users.find(
      (user) => user.service_number === searchServiceNumber
    );

    if (!user) {
      return;
    }

    // Add table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Name", "Email", "Role", "Date of Birth"].forEach((headerText) => {
      const th = document.createElement("th");
      th.classList.add("p-2", "border", "bg-gray-800", "text-[#2d3625]");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    resultTable.appendChild(thead);

    // Add table body
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.classList.add("p-2", "border", "bg-gray-800", "text-[#2d3625]");
    tdName.textContent = escapeHTML(user.name);
    tr.appendChild(tdName);

    const tdEmail = document.createElement("td");
    tdEmail.classList.add("p-2", "border", "bg-gray-800", "text-[#2d3625]");
    tdEmail.textContent = escapeHTML(user.email || "N/A");
    tr.appendChild(tdEmail);

    const tdRole = document.createElement("td");
    tdRole.classList.add("p-2", "border", "bg-gray-800", "text-[#2d3625]");
    tdRole.textContent = escapeHTML(user.role || "N/A");
    tr.appendChild(tdRole);

    const tdDob = document.createElement("td");
    tdDob.classList.add("p-2", "border", "bg-gray-800", "text-[#2d3625]");
    tdDob.textContent = user.dob ? escapeHTML(formatDate(user.dob)) : "N/A";
    tr.appendChild(tdDob);

    tbody.appendChild(tr);
    resultTable.appendChild(tbody);
    resultContainer.appendChild(resultTable);
    resultContainer.classList.remove("hidden");
  });

// Helper function to escape HTML characters
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (match) => {
    const escapeChars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escapeChars[match];
  });
}

// Helper function to format the date
function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Utility: Escape HTML (for safe rendering)
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (char) => {
    const escapeChars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return escapeChars[char] || char;
  });
}

// Utility: Format Date (basic version, can customize)
function formatDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date.toLocaleDateString() : "Invalid Date";
}

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
  // Basic empty checks
  for (const [key, value] of Object.entries(record)) {
    if (!value || value.trim() === "") {
      alert(`Please fill in the ${key.replace("_", " ")} field.`);
      return false;
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(record.email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  // Aadhaar number: 12 digits
  const aadhaarRegex = /^\d{12}$/;
  if (!aadhaarRegex.test(record.aadhaar_number)) {
    alert("Please enter a valid 12-digit Aadhaar Number.");
    return false;
  }

  // PAN number: format e.g., ABCDE1234F
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(record.pan_number)) {
    alert("Please enter a valid PAN Number (e.g., ABCDE1234F).");
    return false;
  }

  // Date of birth: not a future date
  const dob = new Date(record.dob);
  if (dob > new Date()) {
    alert("Date of Birth cannot be in the future.");
    return false;
  }

  // Service number: alphanumeric check
  const serviceNumberRegex = /^[a-zA-Z0-9\-]+$/;
  if (!serviceNumberRegex.test(record.service_number)) {
    alert("Service Number should be alphanumeric.");
    return false;
  }

  return true;
}
