let editingEmployeeId = null;

const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const message = document.getElementById("message");

addEmployeeBtn.addEventListener("click", function () {

    const employee = {
        name: document.getElementById("empName").value.trim(),
        email: document.getElementById("empEmail").value.trim(),
        department: document.getElementById("department").value.trim(),
        salary: parseFloat(document.getElementById("salary").value)
    };

    // Validation
    if (!employee.name) {
        showError("Employee Name is required");
        return;
    }

    if (!employee.email) {
        showError("Email is required");
        return;
    }

    if (!employee.department) {
        showError("Department is required");
        return;
    }

    if (!employee.salary) {
        showError("Salary is required");
        return;
    }

    // UPDATE EMPLOYEE
    if (editingEmployeeId !== null) {

        fetch(`http://localhost:8080/employees/${editingEmployeeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.json())
        .then(() => {

            showSuccess("Employee Updated Successfully");

            resetForm();
            loadEmployees();

        })
        .catch(error => {
            console.error(error);
            showError("Error Updating Employee");
        });

    }

    // ADD EMPLOYEE
    else {

        fetch("http://localhost:8080/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.json())
        .then(() => {

            showSuccess("Employee Added Successfully");

            resetForm();
            loadEmployees();

        })
        .catch(error => {
            console.error(error);
            showError("Error Saving Employee");
        });

    }

});

function loadEmployees() {

    fetch("http://localhost:8080/employees")
    .then(response => response.json())
    .then(data => {

        const tableBody =
            document.getElementById("employeeTableBody");

        tableBody.innerHTML = "";

        data.forEach(emp => {

            tableBody.innerHTML += `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td>${emp.salary}</td>
                    <td>

                        <button
                            class="edit"
                            onclick="editEmployee(
                                ${emp.id},
                                '${emp.name}',
                                '${emp.email}',
                                '${emp.department}',
                                ${emp.salary}
                            )">
                            Edit
                        </button>

                        <button
                            class="delete"
                            onclick="deleteEmployee(${emp.id})">
                            Delete
                        </button>

                    </td>
                </tr>
            `;
        });

    })
    .catch(error => console.error(error));
}

function editEmployee(id, name, email, department, salary) {

    editingEmployeeId = id;

    document.getElementById("empName").value = name;
    document.getElementById("empEmail").value = email;
    document.getElementById("department").value = department;
    document.getElementById("salary").value = salary;

    addEmployeeBtn.innerText = "Update Employee";
}

function deleteEmployee(id) {

    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    fetch(`http://localhost:8080/employees/${id}`, {
        method: "DELETE"
    })
    .then(() => {

        showSuccess("Employee Deleted Successfully");

        loadEmployees();

    })
    .catch(error => {
        console.error(error);
        showError("Error Deleting Employee");
    });
}

function resetForm() {

    editingEmployeeId = null;

    document.getElementById("empName").value = "";
    document.getElementById("empEmail").value = "";
    document.getElementById("department").value = "";
    document.getElementById("salary").value = "";

    addEmployeeBtn.innerText = "Add Employee";
}

function showSuccess(text) {

    message.innerHTML = "✅ " + text;
    message.style.color = "#155724";
    message.style.backgroundColor = "#d4edda";
    message.style.border = "1px solid #c3e6cb";
    message.style.padding = "10px";
    message.style.borderRadius = "5px";

    setTimeout(() => {
        message.innerHTML = "";
        message.style.backgroundColor = "";
        message.style.border = "";
    }, 3000);
}

function showError(text) {

    message.innerHTML = "❌ " + text;
    message.style.color = "#721c24";
    message.style.backgroundColor = "#f8d7da";
    message.style.border = "1px solid #f5c6cb";
    message.style.padding = "10px";
    message.style.borderRadius = "5px";
}

loadEmployees();