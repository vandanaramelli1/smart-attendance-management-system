let allStudents = [];

async function addStudent() {
  const rollNo = document.getElementById("rollNo").value.trim();
  const name = document.getElementById("studentName").value.trim();

  if (!rollNo || !name) {
    alert("Please enter both roll number and student name");
    return;
  }

  await fetch("/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ rollNo, name })
  });

  document.getElementById("rollNo").value = "";
  document.getElementById("studentName").value = "";

  loadStudents();
}

async function loadStudents() {
  const response = await fetch("/api/students");
  allStudents = await response.json();

  displayStudents(allStudents);
  updateStats();
}

function displayStudents(students) {
  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  students.forEach(student => {
    const row = `
      <tr>
        <td>${student.rollNo}</td>
        <td>${student.name}</td>
        <td>
          <button onclick="markAttendance(${student.id}, 'Present')">Present</button>
          <button class="absent" onclick="markAttendance(${student.id}, 'Absent')">Absent</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

function searchStudents() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchText) ||
    student.rollNo.toLowerCase().includes(searchText)
  );

  displayStudents(filteredStudents);
}

async function markAttendance(studentId, status) {
  await fetch("/api/attendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ studentId, status })
  });

  loadAttendance();
}

async function loadAttendance() {
  const response = await fetch("/api/attendance");
  const records = await response.json();

  const list = document.getElementById("attendanceList");
  list.innerHTML = "";

  records.forEach(record => {
    const student = allStudents.find(s => s.id === record.studentId);
    const studentName = student ? student.name : "Unknown Student";

    const item = document.createElement("li");
    item.textContent = `${studentName} marked as ${record.status} on ${record.date}`;
    list.appendChild(item);
  });

  updateStats();
}

async function updateStats() {
  const studentsResponse = await fetch("/api/students");
  const students = await studentsResponse.json();

  const attendanceResponse = await fetch("/api/attendance");
  const records = await attendanceResponse.json();

  const present = records.filter(record => record.status === "Present").length;
  const absent = records.filter(record => record.status === "Absent").length;

  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("presentCount").textContent = present;
  document.getElementById("absentCount").textContent = absent;
}

loadStudents();
loadAttendance();