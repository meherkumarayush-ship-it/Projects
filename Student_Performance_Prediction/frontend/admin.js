const API = "http://127.0.0.1:5000";

async function loadAdminData() {
  const res = await fetch(`${API}/admin/data`);
  const result = await res.json();

  document.getElementById("countText").innerText =
    `📊 Total Students Submitted: ${result.count}`;

  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  result.data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.Gender}</td>
      <td>${row.StudyTimeWeekly}</td>
      <td>${row.AttendanceRatio.toFixed(2)}</td>
      <td>${row.Tutoring}</td>
      <td>${row.ParentalSupport}</td>
      <td>${row.Prediction === 1 ? "PASS" : "FAIL"}</td>
    `;
    tbody.appendChild(tr);
  });
}

function downloadCSV() {
  window.location.href = `${API}/admin/download`;
}

async function logout() {
  await fetch("http://127.0.0.1:5000/admin/logout");
  window.location.href = "admin-login.html";
}

loadAdminData();
