// Get elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountElement = document.getElementById("attendeeCount");
const celebrationMessageElement = document.getElementById("celebrationMessage");

//track attendance
let count = 0;
const maxCount = 50;
// This is an array that will hold objects for each attendee
// Each object will have properties like: { name: "John", team: "water", teamName: "Team Water Wise" }
let attendees = [];
// This is an object (similar to a dictionary) that tracks how many people are in each team
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

// Load data from localStorage on page load
// localStorage is the browser's way of saving data permanently on the user's computer
function loadFromLocalStorage() {
  // Get the attendance count from localStorage as text
  const savedCount = localStorage.getItem("attendanceCount");
  // Get the attendees list from localStorage as text
  const savedAttendees = localStorage.getItem("attendees");
  // Get the team counts from localStorage as text
  const savedTeamCounts = localStorage.getItem("teamCounts");

  // If we previously saved a count, convert it from text to a number and update the display
  if (savedCount) {
    count = parseInt(savedCount);
    attendeeCountElement.textContent = count;
  }

  // If we previously saved attendees, convert from JSON text back into a usable array
  // JSON.parse() is like opening a wrapped present - it turns text into a real object/array
  // Example: JSON.parse('{"name":"John","team":"water"}') becomes an object we can use
  if (savedAttendees) {
    attendees = JSON.parse(savedAttendees);
  }

  // If we previously saved team counts, convert from JSON text back into our teamCounts object
  if (savedTeamCounts) {
    teamCounts = JSON.parse(savedTeamCounts);
    // Update the visible team count numbers on the page
    document.getElementById("waterCount").textContent = teamCounts.water;
    document.getElementById("zeroCount").textContent = teamCounts.zero;
    document.getElementById("powerCount").textContent = teamCounts.power;
  }

  // Refresh the display with loaded data
  displayAttendeeList();
  updateProgressBar();
}

// Save data to localStorage
// This function saves our data so it persists even if the user closes the browser
function saveToLocalStorage() {
  // Save the count as a simple text number
  localStorage.setItem("attendanceCount", count);

  // Save the attendees array by converting it to JSON text
  // JSON.stringify() is like wrapping a present - it turns an object/array into text
  // This is required because localStorage can only store text, not objects
  // Example: {name:"John", team:"water"} becomes '{"name":"John","team":"water"}'
  localStorage.setItem("attendees", JSON.stringify(attendees));

  // Save the teamCounts object by converting it to JSON text
  // JSON stands for JavaScript Object Notation - it's a way to format data as text
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
}

// Display attendee list organized by team
// This function separates attendees into 3 columns based on which team they joined
function displayAttendeeList() {
  // Clear all columns first so we don't duplicate names
  document.getElementById("waterAttendees").innerHTML = "";
  document.getElementById("zeroAttendees").innerHTML = "";
  document.getElementById("powerAttendees").innerHTML = "";

  // Create arrays to hold attendees for each team
  const waterAttendees = [];
  const zeroAttendees = [];
  const powerAttendees = [];

  // Loop through all attendees and sort them by team
  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    // Create a new element for each attendee
    const attendeeItem = document.createElement("div");
    attendeeItem.className = "attendee-item";
    attendeeItem.textContent = attendee.name;

    // Check which team this attendee belongs to and add them to the right array
    if (attendee.team === "water") {
      waterAttendees.push(attendeeItem);
    } else if (attendee.team === "zero") {
      zeroAttendees.push(attendeeItem);
    } else if (attendee.team === "power") {
      powerAttendees.push(attendeeItem);
    }
  }

  // Add all water team attendees to the water column
  for (let i = 0; i < waterAttendees.length; i++) {
    document.getElementById("waterAttendees").appendChild(waterAttendees[i]);
  }

  // Add all zero team attendees to the zero column
  for (let i = 0; i < zeroAttendees.length; i++) {
    document.getElementById("zeroAttendees").appendChild(zeroAttendees[i]);
  }

  // Add all power team attendees to the power column
  for (let i = 0; i < powerAttendees.length; i++) {
    document.getElementById("powerAttendees").appendChild(powerAttendees[i]);
  }
}

// Update progress bar display
// Calculates the percentage and updates the bar width and text
function updateProgressBar() {
  // Calculate what percentage of 50 attendees we have
  const percentage = Math.round((count / maxCount) * 100);
  const progressBar = document.getElementById("progressBar");
  // Set the width of the progress bar to match the percentage
  progressBar.style.width = percentage + "%";

  // Only show the percentage text if there's enough space (15% or more)
  if (percentage >= 15) {
    progressBar.textContent = percentage + "% Full";
  } else {
    progressBar.textContent = "";
  }
}

// Get winning team - figures out which team has the most attendees
function getWinningTeam() {
  // Start by assuming water team is winning
  let winningTeam = "water";
  let maxCount = teamCounts.water;

  // Check if zero team has more people than water team
  if (teamCounts.zero > maxCount) {
    winningTeam = "zero";
    maxCount = teamCounts.zero;
  }

  // Check if power team has more people than the current winning team
  if (teamCounts.power > maxCount) {
    winningTeam = "power";
    maxCount = teamCounts.power;
  }

  // This is an object with team ID as key and full team name as value
  // Objects let us store related key-value pairs, like a real dictionary
  const teamNames = {
    water: "Team Water Wise",
    zero: "Team Net Zero",
    power: "Team Renewables",
  };

  // Return an object with the winning team information
  // The return value is also an object with properties we can access later
  return {
    team: winningTeam,
    name: teamNames[winningTeam],
    count: maxCount,
  };
}

// Display celebration message when max attendance is reached
function showCelebration() {
  // Get the winning team details by calling our getWinningTeam function
  const winner = getWinningTeam();
  // Create the HTML for the celebration message using template literals (backticks)
  // ${winner.name} and ${winner.count} insert the values into the text
  const celebrationHTML = `
    <div class="celebration-content">
      <h2>🎉 Goal Reached! 🎉</h2>
      <p>We've hit 50 attendees!</p>
      <p class="winning-team">🏆 Winning Team: ${winner.name}</p>
      <p class="winning-count">with ${winner.count} attendees</p>
    </div>
  `;
  celebrationMessageElement.innerHTML = celebrationHTML;
  celebrationMessageElement.style.display = "block";
  form.style.display = "none";
}

// Load data when page loads - restore any previously saved data from localStorage
loadFromLocalStorage();

// Handle form submission - this runs when someone clicks the "Check In" button
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the page from reloading

  // Get the values the user entered
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text; // Get the text of the selected option

  console.log(name, team, teamName);

  // increment attendance count each time form is submitted
  count++;
  console.log("Total check-ins:", count);

  if (count > maxCount) {
    greeting.textContent = ""; // Clear greeting message
    attendanceMessage.textContent = "Maximum attendance reached!";
    attendanceMessage.style.color = "red";
    form.reset(); // Reset form if max count is exceeded
    return;
  }

  // Create a new object for this attendee and add it to the attendees array
  // An object groups related data together with key-value pairs
  // {name: "John", team: "water", teamName: "Team Water Wise"} is one attendee object
  attendees.push({
    name: name, // The name the user entered
    team: team, // The team code (water, zero, or power)
    teamName: teamName, // The full team name
  });

  // Increment the count for the selected team
  // teamCounts[team] means we're accessing the value using the team variable as a key
  // If team = "water", then teamCounts[team] is the same as teamCounts.water
  teamCounts[team]++;

  // Update message with current count
  attendeeCountElement.textContent = count;

  // Update progress bar
  updateProgressBar();

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;

  // Display updated attendee list
  displayAttendeeList();

  // Save to localStorage - this keeps the data even if user closes their browser
  saveToLocalStorage();

  // Check if max count is reached (50 attendees)
  if (count === maxCount) {
    showCelebration();
  }

  // Reset the form so the fields are empty for the next attendee
  form.reset();
});
