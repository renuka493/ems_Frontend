const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", () => {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if(username === ""){

        showError("Username is required");
        return;
    }

    if(password === ""){

        showError("Password is required");
        return;
    }

    fetch("http://localhost:8080/auth/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            username:username,
            password:password
        })

    })

    .then(response=>{

        if(!response.ok){
            throw new Error("Invalid");
        }

        return response.json();
    })

    .then(data=>{

        message.innerHTML =
            "✅ Login Successful";

        message.style.color = "green";

        setTimeout(()=>{

            window.location.href =
                "employerdashboard.html";

        },1000);

    })

    .catch(error=>{

        showError(
            "Invalid Username or Password"
        );

    });

});

function showError(text){

    message.innerHTML =
        "❌ " + text;

    message.style.color = "#721c24";
    message.style.backgroundColor = "#f8d7da";
    message.style.border = "1px solid #f5c6cb";
    message.style.padding = "10px";
    message.style.borderRadius = "5px";
}

function togglePassword() {

    const passwordField =
        document.getElementById("password");

    if (passwordField.type === "password") {

        passwordField.type = "text";

    } else {

        passwordField.type = "password";
    }
}