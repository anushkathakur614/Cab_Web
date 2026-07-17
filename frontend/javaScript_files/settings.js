

let darkToggle =
    document.getElementById("darkModeToggle");

// saved theme load karo
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
    darkToggle.checked = true;
}

// toggle
darkToggle.addEventListener("change", function(){

    if(this.checked){
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme","dark");
    }
    else{
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme","light");
    }

});
