console.log("Admin Dashboard Loaded");


const API_URL = "https://cab-web-backend.onrender.com/api";


// Fetch Bookings

async function loadBookings(){

    try{

        const response = await fetch(`${API_URL}/booking`);

        const bookings = await response.json();


        // Counts

        document.getElementById("totalBookings").innerText = bookings.length;


        document.getElementById("confirmedBookings").innerText =
        bookings.filter(
            booking => booking.status === "Confirmed"
        ).length;


        document.getElementById("pendingBookings").innerText =
        bookings.filter(
            booking => booking.status === "Pending"
        ).length;


        document.getElementById("cancelledBookings").innerText =
        bookings.filter(
            booking => booking.status === "Cancelled"
        ).length;



        // Table

        let bookingTable = document.getElementById("bookingTable");

        bookingTable.innerHTML = "";


        bookings.forEach((booking)=>{


            bookingTable.innerHTML += `

            <tr>

                <td>${booking.name}</td>

                <td>${booking.pickup}</td>

                <td>${booking.drop}</td>

                <td>${booking.date}</td>

                <td>${booking.status}</td>

            </tr>

            `;

        });


    }

    catch(error){

        console.log("Booking Error:",error);

    }

}





// Fetch Feedback

async function loadFeedback(){


    try{

        const response = await fetch(`${API_URL}/feedback`);

        const feedbacks = await response.json();


        let feedbackContainer =
        document.getElementById("feedbackContainer");


        feedbackContainer.innerHTML="";


        feedbacks.forEach((feedback)=>{


            feedbackContainer.innerHTML += `

            <div class="feedback-card">

                <h3>${feedback.name}</h3>

                <p>${feedback.rating}</p>

                <p>${feedback.message}</p>

            </div>

            `;


        });


    }


    catch(error){

        console.log("Feedback Error:",error);

    }


}

// Dashboard

function goToDashboard(){

    document.getElementById("dashboard")
    .scrollIntoView({
        behavior:"smooth"
    });

}


// Bookings

function goToBookings(){

    document.getElementById("bookings")
    .scrollIntoView({
        behavior:"smooth"
    });

}


// Feedback

function goToFeedback(){

    document.getElementById("feedback")
    .scrollIntoView({
        behavior:"smooth"
    });

}


// Logout

function logout(){

    window.location.href="../frontend/HTML_files/home.html";

}


loadBookings();

loadFeedback();