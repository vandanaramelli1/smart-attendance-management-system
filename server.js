const express = require("express");
const app = express();
const PORT = 3000;

let students = [];
let attendanceRecords = [];

app.use(express.json());
app.use(express.static("public"));

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.post("/api/students", (req, res) => {
  const { rollNo, name } = req.body;

  if (!rollNo || !name) {
    return res.status(400).json({ message: "Roll number and name are required" });
  }

  const student = {
    id: Date.now(),
    rollNo,
    name
  };

  students.push(student);
  res.json({ message: "Student added successfully", student });
});

app.post("/api/attendance", (req, res) => {
  const { studentId, status } = req.body;

  const record = {
    id: Date.now(),
    studentId,
    status,
    date: new Date().toLocaleDateString()
  };

  attendanceRecords.push(record);
  res.json({ message: "Attendance marked successfully", record });
});

app.get("/api/attendance", (req, res) => {
  res.json(attendanceRecords);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});