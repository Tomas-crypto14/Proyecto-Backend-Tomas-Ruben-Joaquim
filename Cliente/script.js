const API_BASE = "http://localhost:8000";

// Referencias a elementos HTML importantes
const votingsListEl = document.getElementById("votings");
const votingDetailSection = document.getElementById("voting-detail");
const votingsListSection = document.getElementById("votings-list");
const votingInfoEl = document.getElementById("voting-info");
const voteForm = document.getElementById("vote-form");
const optionSelect = document.getElementById("option");
const backBtn = document.getElementById("back-btn");
const votesChartCanvas = document.getElementById("votesChart");

let currentVotingId = null; // guardamos id de votación seleccionada
let votesChart = null; // variable para el gráfico de barras

// Función para cargar y mostrar la lista de votaciones
function fetchVotings() {
    fetch(`${API_BASE}/polls/getpolls`) // pedimos las votaciones a la API
        .then((res) => res.json())
        .then((votings) => {
            votingsListEl.innerHTML = "";

            votings.forEach((voting) => {
                const li = document.createElement("li");
                li.textContent = voting.title || "Votación sin título";
                li.onclick = () => loadVotingDetail(voting._id);
                votingsListEl.appendChild(li);
            });
        })
        .catch(() => alert("Error al cargar votaciones"));
}

// Función para mostrar el detalle de una votación
function loadVotingDetail(id) {
    fetch(`${API_BASE}/polls/getpolls`) // pedimos todas las votaciones
        .then((res) => res.json())
        .then((polls) => {
            const voting = polls.find((p) => p._id === id); // buscamos la votación por id

            if (!voting) {
                alert("Votación no encontrada");
                return;
            }

            currentVotingId = voting._id; // guardamos id actual

            // Ocultamos lista de votaciones y mostramos detalle
            votingsListSection.style.display = "none";
            votingDetailSection.style.display = "block";

            // Creamos el contenido HTML para mostrar opciones y votos
            let optionsHTML = "";
            let selectHTML = "";
            let labels = [];
            let votes = [];

            voting.options.forEach((opt, i) => {
                const name = opt.name || opt.text || `Opción ${i + 1}`; // nombre opción
                const voteCount = opt.votes || 0; // votos de la opción
                optionsHTML += `<li>${name}: ${voteCount} votos</li>`;
                selectHTML += `<option value="${i}">${name}</option>`;
                labels.push(name);
                votes.push(voteCount);
            });

            // Mostramos la pregunta y las opciones con sus votos
            votingInfoEl.innerHTML = `<h3>${
                voting.title || voting.question || "Votación"
            }</h3><ul>${optionsHTML}</ul>`;

            optionSelect.innerHTML = selectHTML;

            renderChart(labels, votes);
        })
        .catch(() => alert("Error cargando detalle de la votación"));
}

// Evento al enviar formulario de voto
voteForm.onsubmit = (e) => {
    e.preventDefault();

    if (!currentVotingId) {
        alert("No hay votación seleccionada");
        return;
    }

    const optionIndex = parseInt(optionSelect.value);

    fetch(`${API_BASE}/votes/${currentVotingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex }),
    })
        .then(async (res) => {
            // Si la respuesta no es ok, leemos el JSON para obtener el error
            if (!res.ok) {
                const errorData = await res.json();
                // Aquí chequeamos el error específico devuelto por backend
                if (res.status === 403 && errorData.error === "Ya has votado") {
                    throw new Error("Ya has votado en esta votación.");
                } else {
                    throw new Error(errorData.error || "Error enviando voto");
                }
            }
            return res.json();
        })
        .then((data) => {
            alert(data.message || "Voto registrado");
            loadVotingDetail(currentVotingId);
            //Tomas se dio cuenta de que la funcion no llamaba a ningun parametro
        })
        .catch((e) => {
            alert(e.message);
        });
};

// Botón para volver a la lista de votaciones
backBtn.onclick = () => {
    votingDetailSection.style.display = "none";
    votingsListSection.style.display = "block";
    currentVotingId = null;

    // Si existe gráfico, lo borramos para limpiar
    if (votesChart) {
        votesChart.destroy();
        votesChart = null;
    }
};

// Función para crear el gráfico de barras con Chart.js
function renderChart(labels, votes) {
    if (votesChart) votesChart.destroy(); // si hay gráfico anterior, eliminarlo

    votesChart = new Chart(votesChartCanvas, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Votos",
                    data: votes,
                    backgroundColor: "rgba(54, 162, 235, 0.7)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: { y: { beginAtZero: true, precision: 0 } },
        },
    });
}

fetchVotings();
