// USERS + SESSION
let users = JSON.parse(localStorage.getItem("users")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// SIGNUP
function signup() {
    let role = document.getElementById("role").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Enter details");
        return;
    }

    users.push({ role, username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");
}

// LOGIN
function login() {
    let role = document.getElementById("role").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let user = users.find(u =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
        alert("Invalid credentials");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (role === "client") window.location.href = "client.html";
    else window.location.href = "agent.html";
}

// CREATE TICKET (CLIENT)
function createTicket() {
    let title = document.getElementById("title").value;
    let desc = document.getElementById("desc").value;

    let ticket = {
        id: Date.now(),
        title,
        desc,
        status: "Open",
        createdBy: currentUser.username
    };

    tickets.push(ticket);
    saveAndDisplay();
}

// UPDATE STATUS (AGENT)
function updateStatus(id) {
    let t = tickets.find(x => x.id === id);

    if (t.status === "Open") t.status = "In Progress";
    else if (t.status === "In Progress") t.status = "Resolved";

    saveAndDisplay();
}

// SAVE
function saveAndDisplay() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
    displayTickets();
}

// DISPLAY
function displayTickets() {
    let list = document.getElementById("ticketList");
    if (!list) return;

    list.innerHTML = "";

    tickets.forEach(t => {

        // CLIENT → only own tickets
        if (currentUser.role === "client" && t.createdBy !== currentUser.username) return;

        list.innerHTML += `
            <div class="ticket">
                <b>${t.title}</b><br>
                ${t.desc}<br>
                Created By: ${t.createdBy}<br>
                Status: <span class="status ${t.status.replace(" ","")}">${t.status}</span><br><br>

                ${currentUser.role === "agent" ? `<button onclick="updateStatus(${t.id})">Next Status</button>` : ""}
            </div>
        `;
    });
}

displayTickets();