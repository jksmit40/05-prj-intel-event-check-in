// Get elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const emailInput = document.getElementById("email");
const checkInTimeInput = document.getElementById("checkInTime");
const messageDiv = document.getElementById("message");


// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    // Get input values
    const name = nameInput.value;
    const team = teamSelect.value;

    console.log(name, team);
});