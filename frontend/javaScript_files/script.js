console.log("javaScript connected")
const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE1YjhkNDk1ZjU4YzQ3MDViOWFjYmEyOTliYjg4OWJhIiwiaCI6Im11cm11cjY0In0=";
let routeLayer;
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}

let journeyDate=document.getElementById("journey-date");
if(journeyDate){
    let today=new Date().toISOString().split("T")[0];
    journeyDate.min = today
}

let editBookingId= localStorage.getItem("editBookingId");

if (editBookingId) {

    fetch(`https://cab-web-backend.onrender.com/api/booking/${editBookingId}`)
        .then(response => response.json())
        .then(result => {

            let booking = result.booking;

            document.getElementById("name").value = booking.name;
            document.getElementById("phone").value = booking.phone;
            document.getElementById("pick").value = booking.pickup;
            document.getElementById("drop").value = booking.drop;
            document.getElementById("journey-date").value = booking.date;
            document.getElementById("vehicle").value = booking.vehicle;

        })
        .catch(error => console.error(error));

}
let bookingForm=document.getElementById("bookingForm");
if(bookingForm){
    bookingForm.addEventListener("submit",async function(e){
    e.preventDefault();

    let editBookingId = localStorage.getItem("editBookingId");

    let name=document.getElementById("name").value;
    let phone=document.getElementById("phone").value;
    let pickup=document.getElementById("pick").value;
    let drop=document.getElementById("drop").value;
    let date=document.getElementById("journey-date").value;
    let vehicle=document.getElementById("vehicle").value;
    let bookings = JSON.parse(localStorage.getItem("bookingHistory")) || [];
    let bookingId;
    if(editBookingId){
        bookingId = editBookingId;
    }
    else{
        bookingId = "BK" + Math.floor(Math.random()*100000);
    }
    let today = new Date().toISOString().split("T")[0];
    if(date<today){
        alert("Please select a future date.")
        return;
    }
    if(phone.length!==10){
        alert("Please enter a valid 10-digit phone number.")
        return;
    }
    if(!/^[0-9]{10}$/.test(phone)){
        alert("Enter a valid phone number.");
        return;
    }
    document.getElementById("successMessage").innerHTML = "✅ Booking request submitted successfully!!!"
   let summaryBox=document.getElementById("summary-box")
   if(summaryBox){
    summaryBox.innerHTML = `
    <h3>Booking Details</h3>
    <p><strong>Booking ID:</strong>${bookingId}</p>
    <p><strong>Name:</strong>${name}</p>
    <p><strong>Phone:</strong>${phone}</p>
    <p><strong>Pickup:</strong>${pickup}</p>
    <p><strong>Drop:</strong>${drop}</p>
    <p><strong>Date:</strong>${date}</p>
    <p><strong>Vehicle:</strong>${vehicle}</p>`;}
    
   
    let booking = {
        bookingId,
        name,
        phone,
        pickup,
        drop, 
        date, 
        vehicle,
        status:"Pending",
        createdAt:new Date().toISOString()
    };
    
   
    try {
    const user = JSON.parse(localStorage.getItem("cabUser"));
    let url = "https://cab-web-backend.onrender.com/api/booking/create";
    let method = "POST";
    if(editBookingId){
    url = `https://cab-web-backend.onrender.com/api/booking/update/${editBookingId}`;
    method="PUT";
    }
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bookingId,
            name,
            email:user.email,
            phone,
            pickup,
            drop,
            date,
            vehicle,
            status: "Pending"
        })
    });

    const result = await response.json();

    if(result.success){
        localStorage.removeItem("editBookingId");
        alert("Booking Saved Successfully!");
    } else {
        alert(result.message);
    }

   }   catch(error){
    console.error(error);
    alert("Server Error");
  }

 });
}

let menuBtn=document.getElementById("menuBtn");
 let dropdownMenu=document.getElementById("dropdownMenu");
 if(menuBtn) {
    menuBtn.addEventListener("click",function(){
        if(dropdownMenu.style.display==="block"){
            dropdownMenu.style.display="none";
        }
        else{
            dropdownMenu.style.display="block";
        }
    });
 }
let loginLink = document.getElementById("loginLink");
let logoutLink = document.getElementById("logoutLink");
let myBookingLink = document.getElementById("myBookingLink");
let profileLink = document.getElementById("profileLink");
let userProfile = document.getElementById("userProfile");
let user = JSON.parse(localStorage.getItem("cabUser"));

if(localStorage.getItem("loggedIn") === "true"){

    // User logged in hai
   if(loginLink) loginLink.style.display = "none";
   if(logoutLink) logoutLink.style.display = "block";
   if(profileLink) profileLink.style.display = "block";
   if(myBookingLink) myBookingLink.style.display = "block";
    if(userProfile && user){
        userProfile.innerHTML = "👤 Welcome, "+user.fullname;
        userProfile.style.display = "block";
    }

}
else{

    // User logged out hai
   if(loginLink) loginLink.style.display = "block";
   if(logoutLink) logoutLink.style.display = "none";
   if(profileLink) profileLink.style.display = "none";
   if(myBookingLink) myBookingLink.style.display = "none";
   if(userProfile) userProfile.style.display = "none";
}
if(logoutLink){
    logoutLink.addEventListener("click",function(){
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("cabUser")
        alert("Logged Out Successfully");
        window.location.href="home.html";
    });
}
// =========================
// OpenStreetMap
// =========================

let map = L.map("map").setView([28.6139, 77.2090], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap Contributors"
}).addTo(map);

let pickupMarker;
let dropMarker;

document.getElementById("searchCabBtn").addEventListener("click", async function(){

    let pickup =
        document.getElementById("pickup").value;

    let drop =
        document.getElementById("drop").value;

    if(pickup === "" || drop === ""){
        alert("Please enter Pickup and Drop Location.");
        return;
    }

    let pickupLocation =
        await getCoordinates(pickup);

    let dropLocation =
        await getCoordinates(drop);

    if(!pickupLocation || !dropLocation){
        alert("Location not found!");
        return;
    }

    if(pickupMarker){
        map.removeLayer(pickupMarker);
    }

    if(dropMarker){
        map.removeLayer(dropMarker);
    }

    pickupMarker = L.marker([
        pickupLocation.lat,
        pickupLocation.lon
    ]).addTo(map);

    dropMarker = L.marker([
        dropLocation.lat,
        dropLocation.lon
    ]).addTo(map);

    map.fitBounds([
        [pickupLocation.lat, pickupLocation.lon],
        [dropLocation.lat, dropLocation.lon]
    ]);
    let route = await getRoute(
    pickupLocation,
    dropLocation
    );

    if(routeLayer){
      map.removeLayer(routeLayer);
    }

    routeLayer = L.geoJSON(route).addTo(map);

    map.fitBounds(routeLayer.getBounds());

    let distance = route.features[0].properties.summary.distance / 1000;

    let duration = route.features[0].properties.summary.duration / 60;

    document.getElementById("distance").innerHTML = distance.toFixed(2) + " km";

    document.getElementById("duration").innerHTML = duration.toFixed(0) + " mins";

});
async function getCoordinates(place){

    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

    let response = await fetch(url);

    let data = await response.json();

    if(data.length === 0){
        return null;
    }

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
    };

}
async function getRoute(start, end){

    let response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
            method: "POST",
            headers: {
                "Authorization": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                coordinates: [
                    [start.lon, start.lat],
                    [end.lon, end.lat]
                ]
            })
        }
    );

    let data = await response.json();

    return data;
}


