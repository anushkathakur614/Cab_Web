if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}

let user =
    JSON.parse(localStorage.getItem("cabUser"));

if(user){

    document.getElementById("profileName").innerText =
        user.fullname;

    document.getElementById("profileEmail").innerText =
        user.email;

    document.getElementById("profilePhone").innerText =
        user.phone;
}
else{
    window.location.href="login.html";
}

/* Total Booking Count */

let bookings =
    JSON.parse(localStorage.getItem("bookingHistory")) || [];

document.getElementById("totalBookings")
    .innerText = bookings.length;


/* Edit Profile */

document
.getElementById("editBtn")
.addEventListener("click",function(){

    let newName =
        prompt("Enter new name:");

    let newPhone =
        prompt("Enter new phone:");

    if(newName)
        user.fullname = newName;

    if(newPhone)
        user.phone = newPhone;

    localStorage.setItem(
        "cabUser",
        JSON.stringify(user)
    );

    location.reload();
});


/* Change Password */

document
.getElementById("changePassBtn")
.addEventListener("click",function(){

    let oldPass =
        prompt("Enter old password:");

    if(oldPass!==user.password){
        alert("Wrong password");
        return;
    }

    let newPass =
        prompt("Enter new password:");

    user.password = newPass;

    localStorage.setItem(
        "cabUser",
        JSON.stringify(user)
    );

    alert(
        "Password changed successfully"
    );
});