const API_BASE = "http://localhost:8000"; // Cambia esto por la URL de tu API

// Referencias a elementos HTML
const votingsListEl = document.getElementById("votings");
const votingDetailSection = document.getElementById("voting-detail");
const votingsListSection = document.getElementById("votings-list");
const votingInfoEl = document.getElementById("voting-info");
const voteForm = document.getElementById("vote-form");
const optionSelect = document.getElementById("option");
const backBtn = document.getElementById("back-btn");
const questionText = document.getElementById("questionText");
const newQuestionBttn = document.getElementById("newQuestionBttn");
const optionsNewQuestion = document.getElementById("optionsNewQuestion");
const optionsDiv = document.getElementById("optionsDiv");
const addOption = document.getElementById("addOption");
const removeOption = document.getElementById("removeOption");

let currentVotingId = null;

// Función para cargar todas las votaciones y mostrarlas
function fetchVotings() {
    fetch(`${API_BASE}/polls/getpolls`)
        .then((response) => response.json())
        .then((votings) => {
            votingsListEl.innerHTML = "";
            votings.forEach((voting) => {
                const li = document.createElement("li");
                li.textContent = voting.title || "Votación sin título";
                li.onclick = function () {
                    loadVotingDetail(voting._id);
                };
                votingsListEl.appendChild(li);
            });
        })
        .catch((err) => {
            alert("Error al cargar votaciones");
            console.error(err);
        });
}

// Función para cargar detalle de una votación
function loadVotingDetail(id) {
    fetch(`${API_BASE}/votings/${id}`)
        .then((response) => response.json())
        .then((voting) => {
            currentVotingId = id;

            votingsListSection.style.display = "none";
            votingDetailSection.style.display = "block";

            votingInfoEl.innerHTML = `
        <h3>${voting.title || "Votación sin título"}</h3>
        <p>${voting.description || ""}</p>
      `;

            optionSelect.innerHTML = "";
            voting.options.forEach((opt, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = `${opt.name} (${opt.votes} votos)`;
                optionSelect.appendChild(option);
            });
        })
        .catch((err) => {
            alert("Error al cargar detalle de votación");
            console.error(err);
        });
}

// Enviar voto
voteForm.onsubmit = function (e) {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const optionIndex = optionSelect.value;

    fetch(`${API_BASE}/register/${currentVotingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: optionIndex }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al enviar el voto");
            alert("Voto enviado con éxito");
            loadVotingDetail(currentVotingId); // Recarga el detalle para actualizar votos
        })
        .catch((err) => {
            alert(err.message);
            console.error(err);
        });
};

// Botón para volver a la lista
backBtn.onclick = function () {
    votingDetailSection.style.display = "none";
    votingsListSection.style.display = "block";
    currentVotingId = null;
};

//
//
//

const comprobeOptionsValue = (elements) => {
    const values = new Array();

    for (let i = 0; i < elements.length; i++) {
        values.push(elements[i].value);
    }

    const hasNoValue = values.some((value) => value === "");
    if (hasNoValue) {
        newQuestionBttn.setAttribute("disabled", "");
    } else {
        newQuestionBttn.removeAttribute("disabled");
    }

    //
};

const newQuestionFunction = () => {
    if (questionText.value.length < 1) {
        optionsNewQuestion.hidden = true;
    } else {
        optionsNewQuestion.hidden = false;
    }
};

const addQuestionOption = () => {
    const optionInputs = document.getElementsByClassName("optionQuest");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("optionQuest");
    input.placeholder = "Inserta una opción";
    optionsDiv.append(input);
    removeOption.hidden = false;
    comprobeOptionsValue(optionInputs);
};

const removeQuestionOption = () => {
    const optionInputs = document.getElementsByClassName("optionQuest");
    const numOptions = optionInputs.length;
    if (numOptions == 3) {
        removeOption.hidden = true;
    }
    optionInputs[numOptions - 1].remove();
    comprobeOptionsValue(optionInputs);
};

const sendNewQuestion = () => {
    // ACABAR
};

// Event Listeners
questionText.addEventListener("keyup", newQuestionFunction);
addOption.addEventListener("click", addQuestionOption);
removeOption.addEventListener("click", removeQuestionOption);
/* */
optionsDiv.addEventListener("keyup", (event) => {
    const optionInputs = document.getElementsByClassName("optionQuest");
    if (event.target.classList.contains("optionQuest")) {
        comprobeOptionsValue(optionInputs);
    }
});

// Carga inicial
// fetchVotings();
//
