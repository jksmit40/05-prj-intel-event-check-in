// Get elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");

//track attendance
let count = 0;
const maxCount = 50;

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting

  // Get input values
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

  // Update message with current count
  attendeeCount.textContent = `${count}`;

  //update check-in progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  //update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;

  // Reset form
  form.reset();
});
