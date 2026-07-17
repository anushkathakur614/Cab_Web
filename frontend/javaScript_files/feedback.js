console.log("Feedback JS Loaded");
// Dark Mode
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}

//logged user
let user = JSON.parse(localStorage.getItem("cabUser"));
console.log(user);

if(user){
    document.getElementById("feedbackName").value = user.name;
}

// Variables
let stars = document.querySelectorAll(".star");
let emojis = document.querySelectorAll(".emoji");
let submitBtn = document.getElementById("submitFeedback");

let selectedRating = 0;
let selectedEmoji = "";

// =====================
// Star Rating
// =====================

stars.forEach(function(star){

    star.addEventListener("click", function(){

        selectedRating = this.dataset.value;

        stars.forEach(function(s){
            s.classList.remove("active");
        });

        for(let i=0; i<selectedRating; i++){
            stars[i].classList.add("active");
        }

    });

});

// =====================
// Emoji Selection
// =====================

emojis.forEach(function(emoji){

    emoji.addEventListener("click", function(){
        console.log("Emoji Clicked")

        selectedEmoji = this.dataset.value;

        emojis.forEach(function(e){
            e.classList.remove("active");
        });

        this.classList.add("active");

    });

});

// =====================
// Submit Feedback
// =====================

submitBtn.addEventListener("click", function(){

    let name =
        document.getElementById("feedbackName").value.trim();

    let message =
        document.getElementById("feedbackMessage").value.trim();

    if(name === "" || message === ""){
        alert("Please fill all fields.");
        return;
    }

    if(selectedRating === 0){
        alert("Please select a star rating.");
        return;
    }

    if(selectedEmoji === ""){
        alert("Please select an emoji.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("cabUser"));

fetch("http://localhost:5000/api/feedback/create", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: name,
        email: user.email,
        rating: selectedRating,
        emoji:selectedEmoji,
        message: message
    })
})
.then(response => response.json())
.then(result => {

    if(result.success){

        document.getElementById("successMsg").innerHTML =
        "✅ Thank you! Your feedback has been submitted.";

    }else{

        alert(result.message);

    }

})
.catch(error => {

    console.error(error);
    alert("Server Error");

});


    // Reset Form
    document.getElementById("feedbackMessage").value = "";

    selectedRating = 0;
    selectedEmoji = "";

    stars.forEach(function(star){
        star.classList.remove("active");
    });

    emojis.forEach(function(emoji){
        emoji.classList.remove("active");
    });

});