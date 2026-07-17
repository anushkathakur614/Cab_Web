// Dark Mode
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// Search Box
let searchInput = document.getElementById("searchInput");

// Booking Container
let bookingContainer = document.getElementById("bookingContainer");

async function loadBookings() {

    bookingContainer.innerHTML = "";
    const user = JSON.parse(localStorage.getItem("cabUser"));
    console.log(user);
    console.log(user.email);
    const response = await fetch(`https://cab-web-backend.onrender.com/api/booking/all/${user.email}`);
    
    const result = await response.json();
    console.log(result);
    console.log(result.bookings);

    let bookings = result.bookings;

    if (bookings.length === 0) {

        bookingContainer.innerHTML = `
            <h2 style="text-align:center;">
                No Bookings Found 🚖
            </h2>
        `;
        return;
    }

    // Update Pending -> Confirmed after 24 hours
    let currentTime = Date.now();

    bookings.forEach(function (booking) {

        if (booking.status === "Pending") {

            let bookingTime = new Date(booking.createdAt).getTime();

            let diff = currentTime - bookingTime;

            if (diff >= 24 * 60 * 60 * 1000) {
                booking.status = "Confirmed";
            }
        }

    });

    localStorage.setItem(
        "bookingHistory",
        JSON.stringify(bookings)
    );

    let search = searchInput.value.toLowerCase();

    bookings.forEach(function (booking, index) {

        // Search Filter
        if (
            !booking.bookingId.toLowerCase().includes(search) &&
            !booking.name.toLowerCase().includes(search) &&
            !booking.pickup.toLowerCase().includes(search) &&
            !booking.drop.toLowerCase().includes(search)
        ) {
            return;
        }

        bookingContainer.innerHTML += `
        <div class="booking-card">

            <h3>${booking.bookingId}</h3>

            <p><strong>Name:</strong> ${booking.name}</p>

            <p><strong>Phone:</strong> ${booking.phone}</p>

            <p><strong>Pickup:</strong> ${booking.pickup}</p>

            <p><strong>Drop:</strong> ${booking.drop}</p>

            <p><strong>Date:</strong> ${booking.date}</p>

            <p><strong>Vehicle:</strong> ${booking.vehicle}</p>

            <span class="status ${booking.status.toLowerCase()}">
                ${booking.status}
            </span>

            <div class="booking-buttons">

            ${
                booking.status === "Pending"
                ?
                `
                <button class="edit-btn"
                onclick="editBooking('${booking.bookingId}')">
                    Edit
                </button>

                <button class="cancel-btn"
                onclick="cancelBooking('${booking.bookingId}')">
                    Cancel
                </button>
                `
                :
                ""
            }

            </div>

        </div>
        `;

    });

}

// Cancel Booking
   async function cancelBooking(bookingId) {

    let confirmCancel = confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {

        const response = await fetch(
            `https://cab-web-backend.onrender.com/api/booking/cancel/${bookingId}`,
            {
                method: "PUT"
            }
        );

        const result = await response.json();

        if (result.success) {
            alert("Booking Cancelled Successfully!");
            loadBookings();
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error(error);
        alert("Server Error");
    }

}

// Edit Booking
   function editBooking(bookingId) {

    localStorage.setItem("editBookingId", bookingId);

    window.location.href = "booking_page.html";

}

// Load Bookings on Page Load
loadBookings();

// Live Search
searchInput.addEventListener("keyup", function () {

    loadBookings();

});