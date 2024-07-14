// Initialize sessions from JSON string
function initializeSessions(jsonString) {
    const sessions = JSON.parse(jsonString);
    localStorage.setItem("gymSessions", JSON.stringify(sessions));
}

// Get sessions from local storage
function getSessions() {
    const sessionsJSON = localStorage.getItem("gymSessions");
    return sessionsJSON ? JSON.parse(sessionsJSON) : [];
}

// Update a session in local storage
function updateSession(updatedSession) {
    const sessions = getSessions();
    const index = sessions.findIndex(
        (s) => s.date === updatedSession.date && s.time === updatedSession.time
    );
    if (index !== -1) {
        sessions[index] = updatedSession;
        localStorage.setItem("gymSessions", JSON.stringify(sessions));
    }
}

// Initialize sessions (replace with actual JSON string)
const initialJSON = `
  [
  {
      "date": "2024-07-12",
      "time": "07:00",
      "members": [
            {  "name": "Alice", "status": "Booked"}, 
            {  "name": "Anita", "status": "Booked"}, 
            {  "name": "Ash", "status": "Waitlisted"}, 
            {  "name": "Barry", "status": "Booked"}, 
            {  "name": "Beatrice", "status": "Booked"}, 
            {  "name": "Bob", "status": "Booked"}, 
            {  "name": "Boyd", "status": "Booked"}, 
            {  "name": "Charles", "status": "Booked"}, 
            {  "name": "Ellie", "status": "Booked"}, 
            {  "name": "Emma", "status": "Booked"}, 
            {  "name": "Rebecca", "status": "Booked"}, 
            {  "name": "Steve", "status": "Waitlisted"}, 
            {  "name": "Sue", "status": "Booked"}
     ]
  },
  {
      "date": "2024-07-12",
      "time": "08:00",
      "members": [
            {  "name": "Alice", "status": "Booked"}, 
            {  "name": "Anita", "status": "Booked"}, 
            {  "name": "Ash", "status": "Waitlisted"}, 
            {  "name": "Barry", "status": "Booked"}, 
            {  "name": "Beatrice", "status": "Booked"}, 
            {  "name": "Bob", "status": "Booked"}, 
            {  "name": "Boyd", "status": "Booked"}, 
            {  "name": "Charles", "status": "Booked"}, 
            {  "name": "Ellie", "status": "Booked"}, 
            {  "name": "Emma", "status": "Booked"}, 
            {  "name": "Rebecca", "status": "Booked"}, 
            {  "name": "Steve", "status": "Waitlisted"}, 
            {  "name": "Sue", "status": "Booked"}
     ]
  },
  {
      "date": "2024-07-12",
      "time": "09:00",
      "members": [
            {  "name": "Alice", "status": "Booked"}, 
            {  "name": "Anita", "status": "Booked"}, 
            {  "name": "Ash", "status": "Waitlisted"}, 
            {  "name": "Barry", "status": "Booked"}, 
            {  "name": "Beatrice", "status": "Booked"}, 
            {  "name": "Bob", "status": "Booked"}, 
            {  "name": "Boyd", "status": "Booked"}, 
            {  "name": "Charles", "status": "Booked"}, 
            {  "name": "Ellie", "status": "Booked"}, 
            {  "name": "Emma", "status": "Booked"}, 
            {  "name": "Rebecca", "status": "Booked"}, 
            {  "name": "Steve", "status": "Waitlisted"}, 
            {  "name": "Sue", "status": "Booked"}
     ]
  }
  ]
  `;

initializeSessions(initialJSON);

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    const formatter = new Intl.DateTimeFormat("en-AU", options);
    const formattedDateTime = formatter.format(now);
    document.getElementById("current-datetime").textContent = formattedDateTime;
}

// Update date and time on page load
updateDateTime();

// Refresh the time every minute.
setInterval(updateDateTime, 60000);

function formatSessionTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    let sessionTime = new Date();
    sessionTime.setHours(hours);
    sessionTime.setMinutes(minutes);

    const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    const formatter = new Intl.DateTimeFormat("en-AU", options);
    const formattedSessionTime = formatter.format(sessionTime);
    return formattedSessionTime;
}

// Render sessions
function renderMember(row, session, m) {
    const buttonCell = row.insertCell();
    const statusCell = row.insertCell();
    const member=session.members[ m ];

    if (member !== undefined) {
        const button = document.createElement("button");
        button.textContent = member.name;
        button.className = "button";
        button.onclick = () => changeStatus(session, member);
        buttonCell.appendChild(button);

        statusCell.textContent = member.status;
        statusCell.className = `status ${member.status
            .toLowerCase()
            .replace(" ", "-")}`;
    }
}

function renderSessions() {
    const sessions = getSessions();
    const container = document.getElementById("sessions-container");
    container.innerHTML = "";

    sessions.forEach((session) => {
        const sessionDiv = document.createElement("div");
        sessionDiv.className = "session";

        const header = document.createElement("div");
        header.className = "session-header";

        const formattedSessionTime = formatSessionTime(session.time);
        header.textContent = `${formattedSessionTime} session - To check-in please touch your name`;
        sessionDiv.appendChild(header);

        const table = document.createElement("table");
        const maxTableRows = 8;
        for (let m = 0; m < maxTableRows; m++) {
            const row = table.insertRow();

            renderMember(row, session, m); // out of bounds returns undefined
            renderMember(row, session, m + 8); // out of bounds returns undefined
        };

        sessionDiv.appendChild(table);
        container.appendChild(sessionDiv);
    });
}

// Change member status
function changeStatus(session, member) {
    if (member.status === "Booked") {
        member.status = "Checked in";
        updateSession(session);
        renderSessions();
    }
}

// Initial render
renderSessions();
