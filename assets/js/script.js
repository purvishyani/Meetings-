
let userData = JSON.parse(localStorage.getItem("users")) || [];
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const homeForm = document.querySelector("#form-home");
const buttonRegister = document.getElementById("btn-register");
const buttonLogin = document.getElementById("btn-login");
const buttonAddNewEvent = document.getElementById("btn-add-event");
let buttonAdd = document.getElementById("btn-add");
const selectedDate = document.getElementById("event-date");
const startTime = document.getElementById("event-start-time");
const endTime = document.getElementById("event-end-time");
const userInitials = document.getElementById("btn-initials");
const logOut = document.getElementById("btn-logout");
let loggedUser = localStorage.getItem("loggedUser");
const upcomingEvent = document.getElementById("btn-upcoming");
const cancelledEvent = document.getElementById("btn-cancelled");
const ongoingEvent = document.getElementById("btn-ongoing");
const completedEvent = document.getElementById("btn-completed");
const navUpcoming = document.querySelector("#nav-upcoming");
const navOngoing = document.querySelector("#nav-ongoing");
const navCancelled = document.querySelector("#nav-cancelled");
const navCompleted = document.querySelector("#nav-completed");
const eventModal = document.getElementById("newEvent");

let tabIndex = 0;
let flagUserId, selectedEventId;
let currentDate = new Date();
let cancelled = false;
let eventData = JSON.parse(localStorage.getItem("events")) || [];

// Register Page

if (registerForm) {
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");

    firstName.addEventListener("change", () => {
        firstName.classList.remove("is-invalid");
    });
    lastName.addEventListener("change", () => {
        lastName.classList.remove("is-invalid");
    });
    email.addEventListener("change", () => {
        email.classList.remove("is-invalid");
    });
    password.addEventListener("change", () => {
        password.classList.remove("is-invalid");
    });
    confirmPassword.addEventListener("change", () => {
        confirmPassword.classList.remove("is-invalid");
    });

    registerForm.addEventListener("submit", function (event) {

        const id = Math.floor(Math.random() * 100);
        event.preventDefault();

        if (firstName.value && lastName.value && email.value && password.value && confirmPassword.value) {

            if (password.value !== confirmPassword.value) {
                alert("Enter valid password");
            }
            else {
                let existEmail = userData.length && userData.some(data =>
                    data.email === email.value);

                if (!existEmail) {
                    let firstName = document.getElementById("first-name").value;
                    let lastName = document.getElementById("last-name").value;
                    let email = document.getElementById("email").value;
                    let password = document.getElementById("password").value;

                    userData.push({ id, firstName, lastName, email, password });
                    localStorage.setItem("users", JSON.stringify(userData));

                    alert("account created successfully");
                    window.location.href = "login.html";
                }
                else if (existEmail) {
                    alert("This email is already in use");
                }
            }
        }
        else {
            if (!firstName.value) {
                firstName.classList.add("is-invalid");
            }
            if (!lastName.value) {
                lastName.classList.add("is-invalid");
            }
            if (!email.value) {
                email.classList.add("is-invalid");
            }
            if (!password.value) {
                password.classList.add("is-invalid");
            }
            if (!confirmPassword.value) {
                confirmPassword.classList.add("is-invalid");
            }
        }
    });
}

// Login Page


if (loginForm) {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    email.addEventListener("change", () => {
        email.classList.remove("is-invalid");
    });
    password.addEventListener("change", () => {
        password.classList.remove("is-invalid");
    });
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let existData = userData.length && userData.some(data =>
            data.email === email.value && data.password === password.value);

        if (email.value && password.value) {
            if (!existData) {
                alert("Invaid credentials");
            }
            else {
                alert("Login successful");
                let email = document.getElementById("email").value;
                localStorage.setItem("loggedUser", email);
                window.location.href = "home.html";
            }
        }
        else {
            if (!email.value) {
                email.classList.add("is-invalid");
            }
            if (!password.value) {
                password.classList.add("is-invalid");
            }
        }
    });
}

// HOME PAGE
if (homeForm) {
    homeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (flagUserId === "btn-add") {
            saveEvent();
        }
        else if (flagUserId === "btn-edit") {
            displayEditData(selectedEventId);
        }

    });
}

// Dynamic DropDown Users List

if (buttonAddNewEvent) {
    buttonAddNewEvent.addEventListener("click", addNewUser);
}

function addNewUser() {
    homeForm.reset();
    selectedDate.classList.remove("is-invalid");
    startTime.classList.remove("is-invalid");
    endTime.classList.remove("is-invalid");
    document.getElementById("event-name").classList.remove("is-invalid");
    document.getElementById("selectUser").classList.remove("is-invalid");

    document.querySelector("#modal-title").textContent = "Add New Event";
    document.querySelector(".modal-footer").innerHTML = `<button id="btn-add" type="submit" class="btn btn-dark btn-register form-group">Add</button>`;
    flagUserId = "btn-add";
    displayUsers();
}

function displayUsers() {
    let length = 0;
    const selectUsers = document.getElementById("dropdown-select-user");
    selectUsers.innerHTML = "";
    selectUsers.addEventListener("click", (event) => {
        event.stopPropagation();
    });
    if (userData) {
        userData.forEach(users => {

            length++;

            let firstName = users.firstName;
            let lastName = users.lastName;
            let fullName = firstName + " " + lastName;
            if (loggedUser !== users.email) {
                selectUsers.innerHTML +=
                    `<div class="items">
                        <input type="checkbox" value="${fullName}" class="dropdown-item" name="participants" id="full-name${length}">
                        <label for="full-name${length}">${fullName}</label>
                     </div>`
            }
            else if(userData.length === 1){
                selectUsers.innerHTML = 
                `<div class="items">   
                    <label >No Participants to show</label>
                 </div>`
            }


        });
    }

}
if (logOut) {
    logOut.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        logOut.href = "login.html";
    });
}

// Add New Event

eventName = document.getElementById("event-name");
let eventDate, eventStartTime, eventEndTime, eventId, participants;
let selectedUsers = [];

eventId = Math.floor(Math.random() * 100);
if (eventName) {
    eventName.addEventListener("change", () => {
        document.getElementById("event-name").classList.remove("is-invalid");
    });
}

if (selectedDate) {
    selectedDate.addEventListener("change", () => {
        eventDate = selectedDate.value;
        selectedDate.classList.remove("is-invalid");
    });
}
if (startTime) {
    startTime.addEventListener("change", () => {
        eventStartTime = startTime.value;
        startTime.classList.remove("is-invalid");
    });
}
if (endTime) {
    endTime.addEventListener("change", () => {
        if (endTime.value <= startTime.value) {
            alert("End time must be greater");
            endTime.value = "";
        }
        else {
            eventEndTime = endTime.value;
            endTime.classList.remove("is-invalid");
        }
    });
}
const users = document.getElementById('selectUser');
if (users) {
    users.addEventListener("change", () => {
        users.classList.remove("is-invalid");
    });
}

const myModal = new bootstrap.Modal(eventModal);

function saveEvent() {

    participants = document.getElementsByName('participants');
    eventName = document.getElementById("event-name").value;

    for (var i = 0; i < participants.length; i++) {
        if (participants[i].checked === true) {
            selectedUsers[i] = participants[i].value;
        }
    }
    if (eventName && eventDate && eventStartTime && eventEndTime && selectedUsers.length > 0) {

        eventData.push({ eventId, eventName, eventDate, eventStartTime, eventEndTime, selectedUsers, cancelled });
        localStorage.setItem("events", JSON.stringify(eventData));
        displayEvents();

        alert("Event created successfully");
        fetchEvents(tabIndex);
        homeForm.reset();
        myModal.hide();
    }
    else {
        validations();
    }

}
function validations() {
    if (!eventName) {
        document.getElementById("event-name").classList.add("is-invalid");
    }

    if (!selectedDate.value) {
        selectedDate.classList.add("is-invalid");
    }

    if (!startTime.value) {
        startTime.classList.add("is-invalid");
    }

    if (!endTime.value) {
        endTime.classList.add("is-invalid");
    }

    if (!selectedUsers.length) {
        document.getElementById("selectUser").classList.add("is-invalid");
    }
}
function fetchLoggedUser() {
    userData.forEach(findUserEmail => {
        if (loggedUser === findUserEmail.email) {
            let firstName = findUserEmail.firstName;
            let lastName = findUserEmail.lastName;
            let initials = firstName.charAt(0) + lastName.charAt(0);
            userInitials.innerHTML = initials.toUpperCase();
        }
    });
}

function displayEvents() {

    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    if (currentDate) { currentDate = `${year}-${month}-${day}`; }
    if (selectedDate) { selectedDate.min = `${year}-${month}-${day}` }
    if (!loggedUser) {
        window.location.href = "login.html";
    }
    else {
        fetchLoggedUser();
        fetchEvents(tabIndex);
    }

}

function fetchEvents(tabIndex) {
    let eventName, eventDate, startTime, endTime;
    let participants = [];
    let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let navId, condition;
    if (tabIndex === "0") { navId = "nav-upcoming"; }
    if (tabIndex === "1") { navId = "nav-ongoing"; }
    if (tabIndex === "2") { navId = "nav-cancelled"; }
    if (tabIndex === "3") { navId = "nav-completed"; }

    document.getElementById(`${navId}`).innerHTML = "";
    eventData.forEach(event => {
        eventName = event.eventName;
        eventDate = new Date(`${event.eventDate}`);

        startTime = event.eventStartTime;
        endTime = event.eventEndTime;
        participants = event.selectedUsers.filter(elements => {
            return elements !== null;
        });
        let date = new Date();
        let initials = [];
        let currentTime = `${date.getHours()}:${date.getMinutes()}`;

        if (tabIndex === "0") {

            condition = false;
            if (event.eventDate === currentDate && event.cancelled === false) {

                if (startTime > currentTime) {
                    condition = true;
                }
            }
            else if (event.eventDate > currentDate & event.cancelled === false) {
                condition = true;
            }
        }
        if (tabIndex === "1") { condition = currentDate === event.eventDate && currentTime >= startTime && currentTime <= endTime && event.cancelled === false ? true : false; }
        if (tabIndex === "2") {
            if (event.cancelled === true) {

                for (var i = 0; i < participants.length; i++) {
                    if (participants[i] !== null) {
                        initials[i] = participants[i].split(" ")[0].substr(0, 1) + participants[i].split(" ")[1].substr(0, 1);
                    }
                }
                let participantsData = '';
                if (initials[0] === undefined) {
                    participantsData = '';
                }
                else {
                    for (var i = 0; i < initials.length; i++) {
                        participantsData += `<span class="user-name">${initials[i].toUpperCase()}</span>`
                    }
                }
                document.getElementById(`${navId}`).innerHTML +=
                    `<div class="inner-tab-content mt-2">
                    <div class="row align-items-center">
                    <div class="col-1">
                        <div class="show-date">
                            <span class="display-day">${day[eventDate.getDay()]}</span>
                            <span class="display-date">${event.eventDate.substr(8, 10)}</span>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="show-time">
                            <span>${startTime} - ${endTime}</span>
                            <span>Location</span>
                        </div>
                    </div>
                    <div class="col-7">
                        <div class="show-meeting">
                            <span>${eventName}</span>
                            <div class="d-flex" id="add-participants"> 
                            ${participantsData}
                            </div>
                        </div>
                    </div>
                    
                    </div>
                </div>`
            }
        }
        if (tabIndex === "3") {
            if (event.cancelled === false) {
                if (currentDate > event.eventDate || (currentDate === event.eventDate && currentTime > endTime)) {

                    for (var i = 0; i < participants.length; i++) {
                        if (participants[i] !== null) {
                            initials[i] = participants[i].split(" ")[0].substr(0, 1) + participants[i].split(" ")[1].substr(0, 1);
                        }
                    }
                    let participantsData = '';
                    if (initials[0] === undefined) {
                        participantsData = '';
                    }
                    else {
                        for (var i = 0; i < initials.length; i++) {
                            participantsData += `<span class="user-name">${initials[i].toUpperCase()}</span>`
                        }
                    }
                    document.getElementById(`${navId}`).innerHTML +=
                        `<div class="inner-tab-content mt-2">
                        <div class="row align-items-center">
                        <div class="col-1">
                            <div class="show-date">
                                <span class="display-day">${day[eventDate.getDay()]}</span>
                                <span class="display-date">${event.eventDate.substr(8, 10)}</span>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="show-time">
                                <span>${startTime} - ${endTime}</span>
                                <span>Location</span>
                            </div>
                        </div>
                        <div class="col-7" id="show-meeting-details">
                            <div class="show-meeting">
                                <span>${eventName}</span>
                                <div class="d-flex" id="add-participants"> 
                                ${participantsData}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>`
                }
            }
            condition = false;
        }

        if (condition) {

            for (var i = 0; i < participants.length; i++) {
                if (participants[i] !== null) {
                    initials[i] = participants[i].split(" ")[0].substr(0, 1) + participants[i].split(" ")[1].substr(0, 1);
                }
            }
            let participantsData = '';
            if (initials[0] === undefined) {
                participantsData = '';
            }
            else {
                for (var i = 0; i < initials.length; i++) {
                    participantsData += `<span class="user-name">${initials[i].toUpperCase()}</span>`
                }
            }
            document.getElementById(`${navId}`).innerHTML +=
                `<div class="inner-tab-content mt-2">
                <div class="row align-items-center">
                <div class="col-1">
                    <div class="show-date">
                        <span class="display-day">${day[eventDate.getDay()]}</span>
                        <span class="display-date">${event.eventDate.substr(8, 10)}</span>
                    </div>
                </div>
                <div class="col-2">
                    <div class="show-time">
                        <span>${startTime} - ${endTime}</span>
                        <span>Location</span>
                    </div>
                </div>
                <div class="col-7">
                    <div class="show-meeting">
                        <span>${eventName}</span>
                        <div class="d-flex" id="add-participants"> 
                        ${participantsData}
                        </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="btn-edit ">
                        <button class="btn btn-light" id="editButton" data-bs-toggle="dropdown"
                            aria-expanded="false">Edit
                            &nbsp<i id="edit-icon" onclick="editToggleIcon(this)" class="fa-solid fa-angle-down fa-sm"></i></button>
                        <div class="dropdown-menu" aria-labelledby="editButton">
                            <a class="dropdown-item" href="#" data-bs-toggle="modal"
                            data-bs-target="#newEvent" onclick="editEvent(${event.eventId})">Reschedule Booking</a>
                            <a class="dropdown-item" href="#" id="btn-cancel" onclick="displayEditData(${event.eventId})">Cancel Event</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>`
        }
    });
}

function editToggleIcon(event) {

    event.classList.toggle("fa-angle-up");
}

function editEvent(eventId) {

    document.querySelector("#modal-title").textContent = "Reschedule Event";

    document.querySelector(".modal-footer").innerHTML = `<button id="btn-edit" type="submit" class="btn btn-dark btn-register">Reschedule Event</button>`;
    flagUserId = "btn-edit";
    selectedEventId = eventId;
    selectedDate.classList.remove("is-invalid");
    startTime.classList.remove("is-invalid");
    endTime.classList.remove("is-invalid");
    document.getElementById("event-name").classList.remove("is-invalid");
    document.getElementById("selectUser").classList.remove("is-invalid");

    document.getElementById("dropdown-select-user").innerHTML = "";
    let participants = document.getElementsByName('participants');

    for (let i = 0; i < eventData.length; i++) {

        if (eventData[i].eventId === eventId) {

            document.getElementById("event-name").value = eventData[i].eventName;
            document.getElementById("event-date").value = eventData[i].eventDate;
            document.getElementById("event-start-time").value = eventData[i].eventStartTime;
            document.getElementById("event-end-time").value = eventData[i].eventEndTime;
            displayUsers();
            for (let j = 0; j < eventData[i].selectedUsers.length; j++) {
                if (eventData[i].selectedUsers[j] === participants[j].value) {
                    participants[j].checked = true;
                }
            }
        }
    }
}
function displayEditData(selectedId) {

    participants = document.getElementsByName('participants');
    eventName = document.getElementById("event-name").value;
    eventDate = selectedDate.value;
    eventStartTime = startTime.value;
    eventEndTime = endTime.value;
    for (let i = 0; i < eventData.length; i++) {
        if (eventData[i].eventId === selectedId) {
            for (var j = 0; j < participants.length; j++) {
                if (participants[j].checked === true) {
                    selectedUsers[j] = participants[j].value;
                }
            }
            if (event.target.id === "btn-cancel") {
                if (confirm("Are you sure you want to cancel this event?")) {
                    eventData[i].cancelled = true;
                    localStorage.setItem("events", JSON.stringify(eventData));
                    alert("Event is cancelled");
                }
            }
 
            else if (flagUserId === "btn-edit") {

                eventData[i].cancelled = false;
                eventData[i].eventName = eventName;
                eventData[i].eventDate = eventDate;
                eventData[i].eventStartTime = eventStartTime;
                eventData[i].eventEndTime = eventEndTime;
                eventData[i].selectedUsers = selectedUsers;

                if (eventName && eventDate && eventStartTime && eventEndTime && selectedUsers.length > 0) {
                    localStorage.setItem("events", JSON.stringify(eventData));
                    alert("Event edited successfully");
                    homeForm.reset();
                    myModal.hide();
                }
                else {
                    validations();
                }

            }
        }
    }
    fetchEvents(tabIndex);
}
// TABS
if (navUpcoming) {
    if (navUpcoming.classList.contains("active")) {
        tabIndex = navUpcoming.getAttribute("tabindex");
        fetchEvents(tabIndex);
    }
}
if (navOngoing) {
    if (navOngoing.classList.contains("active")) {
        tabIndex = navOngoing.getAttribute("tabindex");
        fetchEvents(tabIndex);
    }
}

if (navCancelled) {
    if (navCancelled.classList.contains("active")) {
        tabIndex = navCancelled.getAttribute("tabindex");
        fetchEvents(tabIndex);
    }
}
if (navCompleted) {
    if (navCompleted.classList.contains("active")) {
        tabIndex = navCompleted.getAttribute("tabindex");
        fetchEvents(tabIndex);
    }
}

if (upcomingEvent) {
    upcomingEvent.addEventListener('click', () => {
        tabIndex = document.querySelector("#nav-upcoming").getAttribute("tabindex");
        fetchEvents(tabIndex);
    });

}
if (ongoingEvent) {
    ongoingEvent.addEventListener('click', () => {
        tabIndex = document.querySelector("#nav-ongoing").getAttribute("tabindex");
        fetchEvents(tabIndex);
    });
}

if (cancelledEvent) {
    cancelledEvent.addEventListener("click", () => {
        tabIndex = document.querySelector("#nav-cancelled").getAttribute("tabindex");
        fetchEvents(tabIndex);
    });
}

if (completedEvent) {
    completedEvent.addEventListener("click", () => {
        tabIndex = document.querySelector("#nav-completed").getAttribute("tabindex");
        fetchEvents(tabIndex);
    });

}


