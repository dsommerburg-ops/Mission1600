/* =========================================================
   MISSION 1600
   script.js
   TEIL 1
========================================================= */

const CONFIG = {
    startBudget: 1600,
    minuteLoss: 0.01,
    startDate: new Date("2026-07-04T17:00:00"),
    finalCode: "52.966585, 10.531524"
};

const STORAGE = "mission1600";

let game = {
    solved: false,
    final: false
};

/* ------------------ Elemente ------------------ */

const budget = document.getElementById("budget");
const elapsed = document.getElementById("elapsed");
const lostMoney = document.getElementById("lostMoney");
const remaining = document.getElementById("remainingPercent");
const progress = document.getElementById("progress-bar");

const missionArea = document.getElementById("missionArea");

const finalSection = document.getElementById("finalSection");
const finalInput = document.getElementById("finalCode");
const finalButton = document.getElementById("checkFinal");
const finalResult = document.getElementById("finalResult");

/* ------------------ Speicher ------------------ */

function saveGame() {

    localStorage.setItem(STORAGE, JSON.stringify(game));

}

function loadGame() {

    const save = localStorage.getItem(STORAGE);

    if (save) {

        game = JSON.parse(save);

    }

}

/* ------------------ Hilfsfunktion ------------------ */

function normalize(text) {

    return text
        .toUpperCase()
        .replace(/\s+/g, " ")
        .replaceAll("Ä", "AE")
        .replaceAll("Ö", "OE")
        .replaceAll("Ü", "UE")
        .trim();

}

/* ------------------ Countdown ------------------ */

function updateCountdown() {

    const now = new Date();

    let diff = now - CONFIG.startDate;

    if (diff < 0) diff = 0;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    let currentBudget =
        CONFIG.startBudget -
        (minutes * CONFIG.minuteLoss);

    if (currentBudget < 0) currentBudget = 0;

    budget.textContent =
        currentBudget.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " €";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    elapsed.innerHTML =
        `${days} Tage<br>
         ${hours} Stunden<br>
         ${mins} Minuten<br>
         ${secs} Sekunden`;

    const lost =
        CONFIG.startBudget - currentBudget;

    lostMoney.textContent =
        lost.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " €";

    const percent =
        (currentBudget / CONFIG.startBudget) * 100;

    remaining.textContent =
        percent.toFixed(2) + " %";

    progress.style.width =
        percent + "%";

}

/* ------------------ Mission starten ------------------ */

function startMission() {

    missionArea.innerHTML = `

        <textarea
            id="answer"
            placeholder="Beschreibt den Fehler möglichst genau..."></textarea>

        <button id="checkAnswer">

            Antwort überprüfen

        </button>

        <div id="feedback"></div>

    `;

    document
        .getElementById("checkAnswer")
        .addEventListener(
            "click",
            checkMission
        );

}

/* ------------------ Antwort prüfen ------------------ */

function checkMission() {

    const answer = normalize(
        document
            .getElementById("answer")
            .value
    );

    const correct =

        answer.includes("K")

        &&

        (

            answer.includes("M")

            ||

            answer.includes("LOGO")

            ||

            answer.includes("BUCHSTABE")

            ||

            answer.includes("FALSCH")

            ||

            answer.includes("ERSETZT")

        );

    if (correct) {

        game.solved = true;

        saveGame();

        showMissionSolved();

    }

    else {

        document
            .getElementById("feedback")
            .innerHTML = `

                <div class="error">

                    Leider ist diese Antwort noch nicht richtig.

                </div>

            `;

    }

}
/* =========================================================
   Mission erfolgreich
========================================================= */

function showMissionSolved() {

    missionArea.innerHTML = `

        <div class="success">

            <h3>MISSION 01</h3>

            <h2>✅ Erfolgreich</h2>

            <p>

                Ihr habt den Fehler im Wappen erkannt.

            </p>

            <p>

                Der Buchstabe <strong>K</strong>
                ersetzt das <strong>M</strong>.

            </p>

            <p>

                Der veränderte Buchstabe führt euch
                zum ersten Tippgeber.

            </p>

            <div class="phoneCard">

                📞 Kevin

            </div>

            <p>

                Ruft Kevin jetzt an.

            </p>

            <hr style="margin:25px 0;opacity:.25;">

            <p>

                <strong>

                    Lasst diese Seite geöffnet.

                </strong>

            </p>

            <p>

                Das Geschenk verliert weiterhin
                jede Minute an Wert.

            </p>

            <br>

            <button id="unlockFinal">

                🔑 Finalcode eingeben

            </button>

        </div>

    `;

    document
        .getElementById("unlockFinal")
        .addEventListener("click", () => {

            finalSection.classList.remove("hidden");

            finalSection.scrollIntoView({

                behavior: "smooth"

            });

        });

}


/* =========================================================
   Finale prüfen
========================================================= */

function checkFinal() {

    const input = finalInput.value
        .replace(/\s+/g, "");

    const solution = CONFIG.finalCode
        .replace(/\s+/g, "");

    if (input === solution) {

        game.final = true;

        saveGame();

        showFinal();

    }

    else {

        finalResult.innerHTML = `

            <div class="error">

                Diese Koordinaten stimmen leider nicht.

            </div>

        `;

    }

}


/* =========================================================
   Finale anzeigen
========================================================= */

function showFinal() {

    finalResult.innerHTML = `

        <div class="success">

            <h2>

                🎉 MISSION ERFOLGREICH

            </h2>

            <p>

                Ihr habt alle Hinweise gefunden.

            </p>

            <p>

                Ihr habt euer Hochzeitsgeschenk gerettet.

            </p>

            <hr style="margin:25px 0;opacity:.25;">

            <h3>

                📍 Ziel

            </h3>

            <p>

                Christians Gartenhütte

            </p>

            <p>

                <strong>

                    52.966585, 10.531524

                </strong>

            </p>

            <p>

                Dort wartet euer Geschenk auf euch.

            </p>

        </div>

    `;

}


/* =========================================================
   Initialisierung
========================================================= */

loadGame();

updateCountdown();

setInterval(updateCountdown, 1000);

/* Finalbereich immer verstecken */

finalSection.classList.add("hidden");

/* Gespeicherte Mission */

if (game.solved) {

    showMissionSolved();

}

/* Gespeichertes Finale */

if (game.final) {

    finalSection.classList.remove("hidden");

    showFinal();

}

/* Button Mission */

const startButton = document.getElementById("startGame");

if (startButton) {

    startButton.addEventListener(

        "click",

        startMission

    );

}

/* Button Finale */

if (finalButton) {

    finalButton.addEventListener(

        "click",

        checkFinal

    );

}


/* =========================================================
   Reset (für Dominic)
========================================================= */

function resetGame() {

    localStorage.removeItem(STORAGE);

    location.reload();

}