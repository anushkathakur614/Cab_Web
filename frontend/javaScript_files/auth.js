console.log("Auth JS Connected");


if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}
let registerForm=document.getElementById("registerForm")
if(registerForm){
    registerForm.addEventListener("submit",async function(e){
    e.preventDefault();

    let fullname=document.getElementById("fullname").value;
    let email=document.getElementById("email").value;
    let phone=document.getElementById("phone").value;
    let password=document.getElementById("password").value;
    let confirmPassword=document.getElementById("confirmPassword").value;
    if(password!==confirmPassword){
        alert("Password do not match!");
        return;
    }
    try {

    const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: fullname,
            email: email,
            password: password
        })
    });

    const result = await response.json();

    if(result.success){
        alert("Registration Successful!");
        window.location.href = "login.html";
    }
    else{
        alert(result.message);
    }

}
catch(error){
    console.error(error);
    alert("Server Error");
}
       
});}
// LOGIN
let loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit",async function(e){
        e.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        
        console.log("Entered Email:", email);
        console.log("Entered Password:", password);
        
        try {

          const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
             })
          });

          const result = await response.json();

          if(result.success){

          alert("Login Successful!");

          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("cabUser", JSON.stringify(result.user));

          window.location.href = "home.html";
         }
         else{
        alert(result.message);
         }

    }
    catch(error){
        console.error(error);
        alert("Server Error");
    }

        
    });

}

/* logout button*/
let authBtn = document.getElementById("authBtn");

if(authBtn){

    if(localStorage.getItem("loggedIn") === "true"){
        authBtn.innerHTML = "Logout";
    }

    authBtn.addEventListener("click", function(){

        if(localStorage.getItem("loggedIn") === "true"){
            localStorage.removeItem("loggedIn");
            alert("Logged Out");
            location.reload();
        }
        else{
            window.location.href = "login.html";
        }

    });
}