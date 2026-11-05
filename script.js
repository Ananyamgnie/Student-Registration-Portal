
const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const studentList = document.getElementById("studentList");
const totalStudents = document.getElementById("totalStudents");
const emptyMessage = document.getElementById("emptyMessage");

// Get saved students from browser storage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Display students
function displayStudents() {
    studentList.innerHTML = "";

    totalStudents.textContent = students.length;

    if (students.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    students.forEach(function(student, index) {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            student.name,
            student.usn,
            student.email,
            student.mobile,
            student.department,
            student.semester,
            student.gender
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteStudent(index);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        studentList.appendChild(row);
    });
}

// Register student
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        usn: document.getElementById("usn").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        department: document.getElementById("department").value,
        semester: document.getElementById("semester").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value
    };

    if (!student.gender) {
        showMessage("Please select your gender.", "red");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
        showMessage("Please enter a valid email address.", "red");
        return;
    }

    if (!/^[0-9]{10}$/.test(student.mobile)) {
        showMessage("Mobile number must contain exactly 10 digits.", "red");
        return;
    }

    // Prevent duplicate USN
    const duplicate = students.some(function(item) {
        return item.usn.toLowerCase() === student.usn.toLowerCase();
    });

    if (duplicate) {
        showMessage("This USN is already registered!", "red");
        return;
    }

    // Save student
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    // Display success message
    showMessage("🎉 Registration Successful! Welcome, " + student.name + "!", "green");

    // Update registered student table
    displayStudents();

    // Clear form
    form.reset();

    // Scroll to success message
    message.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Delete student
function deleteStudent(index) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (confirmDelete) {
        students.splice(index, 1);

        localStorage.setItem("students", JSON.stringify(students));

        displayStudents();
        showMessage("Student record deleted successfully.", "green");
    }
}

// Show message
function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

// Clear old message when form is reset
form.addEventListener("reset", function() {
    message.textContent = "";
});

// Show saved records when website opens
displayStudents();
