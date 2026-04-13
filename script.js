
"use strict";

/* =========================
   DATA
========================= */

let users = JSON.parse(localStorage.getItem("users")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

/* =========================
   TOKEN GENERATOR (NEW FEATURE)
========================= */

function generateToken(username) {
    let time = Date.now(); // timestamp
    let random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

    return `TKT-${username}-${time}-${random}`;
}

/* =========================
   HELPERS (TEST FRIENDLY)
========================= */

function findUser(username, password, role) {
    return users.find(u =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );
}

function createTicketObject(title, desc, priority, user) {
    return {
        id: Date.now(),
        token: generateToken(user.username),   // NEW TOKEN ID
        title,
        desc,
        priority,
        status: "Open",
        createdBy: user.username,
        createdAt: new Date().toLocaleString()
    };
}

function advanceStatus(ticket) {
    if (ticket.status === "Open") ticket.status = "In Progress";
    else if (ticket.status === "In Progress") ticket.status = "Resolved";
    return ticket;
}

/* =========================
   AUTH
========================= */

function signup() {
    let role = document.getElementById("role")?.value;
    let username = document.getElementById("username")?.value;
    let password = document.getElementById("password")?.value;

    if (!username || !password) {
        alert("Enter details");
        return;
    }

    let exists = users.some(u => u.username === username && u.role === role);
    if (exists) {
        alert("User already exists");
        return;
    }

    users.push({ role, username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful");
}

/* ------------------------- */

function login() {
    let role = document.getElementById("role")?.value;
    let username = document.getElementById("username")?.value;
    let password = document.getElementById("password")?.value;

    let user = findUser(username, password, role);

    if (!user) {
        alert("Invalid credentials");
        return;
    }

    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (role === "client") window.location.href = "client.html";
    else window.location.href = "agent.html";
}

/* =========================
   LOGOUT
========================= */

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

/* =========================
   TICKETS
========================= */

function createTicket() {
    if (!currentUser) return alert("Login required");

    let title = document.getElementById("title")?.value;
    let desc = document.getElementById("desc")?.value;
    let priority = document.getElementById("priority")?.value || "Low";

    if (!title || !desc) {
        alert("Fill all fields");
        return;
    }

    let ticket = createTicketObject(title, desc, priority, currentUser);

    tickets.push(ticket);
    saveTickets();
}

/* ------------------------- */

function updateStatus(id) {
    let ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    advanceStatus(ticket);
    saveTickets();
}

/* ------------------------- */

function deleteTicket(id) {
    tickets = tickets.filter(t => t.id !== id);
    saveTickets();
}

/* =========================
   STORAGE
========================= */

function saveTickets() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
    displayTickets();
}

function getFilteredTickets() {
    let filter = document.getElementById("filterStatus")?.value || "all";
    let search = document.getElementById("searchBox")?.value?.toLowerCase() || "";

    return tickets.filter(t => {

        let matchStatus = filter === "all" || t.status === filter;

        let matchSearch =
            (t.title || "").toLowerCase().includes(search) ||
            (t.createdBy || "").toLowerCase().includes(search) ||
            (t.token || "").toLowerCase().includes(search);

        return matchStatus && matchSearch;
    });
}


/* =========================
   STATS
========================= */

function updateStats() {
    if (!currentUser || currentUser.role !== "agent") return;

    document.getElementById("openCount").innerText =
        tickets.filter(t => t.status === "Open").length;

    document.getElementById("progressCount").innerText =
        tickets.filter(t => t.status === "In Progress").length;

    document.getElementById("resolvedCount").innerText =
        tickets.filter(t => t.status === "Resolved").length;
}

/* =========================
   DISPLAY
========================= */

function displayTickets() {
    let list = document.getElementById("ticketList");
    if (!list || !currentUser) return;

    list.innerHTML = "";

    let data = currentUser.role === "agent"
        ? getFilteredTickets()
        : tickets.filter(t => t.createdBy === currentUser.username);

    data.forEach(t => {

        list.innerHTML += `
            <div class="ticket">

                <b>${t.title}</b><br>

                Token ID: <code>${t.token}</code><br>

                ${t.desc}<br><br>

                Priority: ${t.priority}<br>
                Created By: ${t.createdBy}<br>
                Time: ${t.createdAt}<br><br>

                Status:
                <span class="status ${t.status.replace(" ","")}">
                    ${t.status}
                </span><br><br>

                ${currentUser.role === "agent" ? `
                    <button onclick="updateStatus(${t.id})">Next Status</button>
                    <button onclick="deleteTicket(${t.id})">Delete</button>
                ` : ""}
            </div>
        `;
    });

    updateStats();
}

/* =========================
   AUTO REFRESH
========================= */

setInterval(displayTickets, 5000);

/* =========================
   INIT
========================= */

displayTickets();

/* =========================
   EXPORTS FOR TESTING
========================= */

if (typeof module !== "undefined") {
    module.exports = {
        findUser,
        createTicketObject,
        advanceStatus,
        generateToken
    };
}