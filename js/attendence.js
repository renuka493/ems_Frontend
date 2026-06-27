// Load employees for marking attendence
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/employees")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("attendenceTableBody");
      tbody.innerHTML = "";
      data.forEach((emp, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td>
            <select id="status-${emp.id}">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error loading employees:", err));

  loadSavedAttendence();
});

// Save or update attendence
document.getElementById("saveAttendenceBtn").addEventListener("click", () => {
  const rows = document.querySelectorAll("#attendenceTableBody tr");
  const attendenceData = [];

  rows.forEach(row => {
    const empId = row.children[1].innerText;
    const empName = row.children[2].innerText;
    const status = document.getElementById(`status-${empId}`).value;
    attendenceData.push({ employeeId: empId, name: empName, status });
  });

  // Fetch existing attendence for today
  fetch("http://localhost:8080/attendence/today")
    .then(res => res.json())
    .then(existing => {
      const updates = attendenceData.map(emp => {
        const found = existing.find(e => e.employeeId == emp.employeeId);
        if (found) {
          // Update existing record
          return fetch(`http://localhost:8080/attendence/${found.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emp)
          });
        } else {
          // Add new record
          return fetch("http://localhost:8080/attendence/today", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([emp])
          });
        }
      });
      return Promise.all(updates);
    })
    .then(() => {
      const msg = document.getElementById("message");
      msg.className = "success";
      msg.innerText = "Attendence updated successfully!";
      loadSavedAttendence();
    })
    .catch(err => {
      console.error("Save error:", err);
      const msg = document.getElementById("message");
      msg.className = "error";
      msg.innerText = "Error saving attendence!";
    });
});

// Load saved attendence
function loadSavedAttendence() {
  fetch("http://localhost:8080/attendence/today")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load attendence");
      return res.json();
    })
    .then(data => {
      const tbody = document.getElementById("savedAttendenceBody");
      tbody.innerHTML = "";
      data.forEach((record, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${record.employeeId}</td>
          <td>${record.name}</td>
          <td>${record.status}</td>
          <td>${record.date}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Load error:", err);
      const msg = document.getElementById("message");
      msg.className = "error";
      msg.innerText = "Error loading attendence!";
    });
}

// Logout functionality
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.clear();
    window.location.href = "/frontend/pages/login.html";
  }
}
