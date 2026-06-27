function loadReports() {
    fetch("http://localhost:8080/reports")
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalEmployees").innerText = data.totalEmployees;
            document.getElementById("presentToday").innerText = data.presentToday;
            document.getElementById("absentToday").innerText = data.absentToday;
        })
        .catch(err => console.error("Error loading reports:", err));
}

loadReports();
