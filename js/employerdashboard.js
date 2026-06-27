function loadDashboardData() {

    fetch("http://localhost:8080/employees")
        .then(res => res.json())
        .then(data => {

            document.getElementById("totalEmployees").innerText = data.length;

        })
        .catch(err => console.error(err));

    const today = new Date();

    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById("todayDate").innerText =
        today.toLocaleDateString("en-IN", options);

}

loadDashboardData();