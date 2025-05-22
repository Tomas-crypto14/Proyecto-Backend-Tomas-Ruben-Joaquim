// script.js
const API_BASE = "http://localhost:8000";

// Referencias al DOM
const votingsListSection = document.getElementById("votings-list");
const votingsListEl = document.getElementById("votings");
const votingDetailSection = document.getElementById("voting-detail");
const votingInfoEl = document.getElementById("voting-info");
const voteForm = document.getElementById("vote-form");
const optionSelect = document.getElementById("option");
const backBtn = document.getElementById("back-btn");

let pollsCache = [];
let currentPoll = null;

// 1) Carga todas las encuestas
function fetchPolls() {
    fetch(`${API_BASE}/polls/getpolls`)
        .then((res) => {
            if (!res.ok) throw new Error(`Error ${res.status}`);
            return res.json();
        })
        .then((polls) => {
            pollsCache = polls;
            renderPollsList();
        })
        .catch((err) => {
            alert("Error al cargar encuestas");
            console.error(err);
        });
}

// 2) Renderiza la lista de encuestas
function renderPollsList() {
    votingsListEl.innerHTML = "";
    pollsCache.forEach((poll) => {
        const li = document.createElement("li");
        li.textContent = poll.title;
        li.dataset.id = poll._id;
        li.onclick = () => showDetail(poll._id);
        votingsListEl.appendChild(li);
    });
}

// 3) Muestra detalle usando el cache
function showDetail(id) {
    const poll = pollsCache.find((p) => p._id === id);
    if (!poll) return alert("Encuesta no encontrada");

    currentPoll = poll;

    // Esconder lista y mostrar detalle
    votingsListSection.classList.add("hidden");
    votingDetailSection.classList.remove("hidden");

    votingInfoEl.innerHTML = `
  <h3>${poll.title}</h3>
  <ul>
    ${poll.options
        .map((opt) => `<li>${opt.name}: ${opt.votes} votos</li>`)
        .join("")}
  </ul>
`;

    // Opciones
    optionSelect.innerHTML = "";
    poll.options.forEach((opt, idx) => {
        const optEl = document.createElement("option");
        optEl.value = idx;
        optEl.textContent = `${opt.name} (${opt.votes} votos)`;
        optionSelect.appendChild(optEl);
    });
}

// 4) Enviar voto
voteForm.onsubmit = (e) => {
    e.preventDefault();
    if (!currentPoll) return;

    const idx = optionSelect.value;
    fetch(`${API_BASE}/votes/${currentPoll._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: idx }),
    })
        .then((res) => {
            if (!res.ok) throw new Error(`Error ${res.status}`);
            return res.json();
        })
        .then(() => {
            alert("Voto registrado");
            // Incrementamos localmente y refrescamos el detalle
            currentPoll.options[idx].votes++;
            showDetail(currentPoll._id);
        })
        .catch((err) => {
            alert("Error al enviar el voto");
            console.error(err);
        });
};

// 5) Volver a la lista
backBtn.onclick = () => {
    votingDetailSection.classList.add("hidden");
    votingsListSection.classList.remove("hidden");
    currentPoll = null;
};

// 6) Inicializamos
fetchPolls();
