/* =========================================================
   INVITACIÓN WESTERN — RANCHO EL HALCÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    document.querySelectorAll(selector);


  /* =========================================================
     ELEMENTOS PRINCIPALES
     ========================================================= */

  const preloader = $("#preloader");
  const welcome = $("#welcome");
  const enterBtn = $("#enterBtn");
  const music = $("#backgroundMusic");
  const musicToggle = $("#musicToggle");
  const menuToggle = $("#menuToggle");
  const nav = $("#nav");
  const header = $("#header");
  const topBtn = $("#topBtn");


  /* =========================================================
     PRELOADER
     ========================================================= */

  window.addEventListener("load", () => {

    setTimeout(() => {

      preloader.classList.add("hide");

    }, 700);

  });


  /* =========================================================
     WELCOME / MUSIC
     ========================================================= */

  let musicPlaying = false;


  async function playMusic() {

    try {

      await music.play();

      musicPlaying = true;

      musicToggle.classList.add("playing");

      musicToggle.innerHTML =
        '<i class="fa-solid fa-volume-high"></i>';

    } catch (error) {

      musicPlaying = false;

    }

  }


  function pauseMusic() {

    music.pause();

    musicPlaying = false;

    musicToggle.classList.remove("playing");

    musicToggle.innerHTML =
      '<i class="fa-solid fa-volume-xmark"></i>';

  }


  enterBtn.addEventListener("click", () => {

    welcome.classList.add("hidden");

    document.body.classList.remove("no-scroll");

    playMusic();

  });


  musicToggle.addEventListener("click", () => {

    musicPlaying
      ? pauseMusic()
      : playMusic();

  });


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  menuToggle.addEventListener("click", () => {

    nav.classList.toggle("open");

  });


  $$(".nav a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("open");

    });

  });


  /* =========================================================
     HEADER / TOP BUTTON
     ========================================================= */

  function handleScroll() {

    header.classList.toggle(
      "scrolled",
      window.scrollY > 60
    );

    topBtn.classList.toggle(
      "show",
      window.scrollY > 600
    );

  }


  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );


  handleScroll();


  topBtn.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


  /* =========================================================
     COUNTDOWN
     ========================================================= */

  const targetDate =
    new Date(
      "2026-11-21T19:00:00-06:00"
    ).getTime();


  function updateCountdown() {

    const now = Date.now();

    const distance =
      targetDate - now;


    if (distance <= 0) {

      $("#days").textContent = "00";
      $("#hours").textContent = "00";
      $("#minutes").textContent = "00";
      $("#seconds").textContent = "00";

      return;

    }


    const days =
      Math.floor(
        distance / 86400000
      );


    const hours =
      Math.floor(
        (distance % 86400000)
        / 3600000
      );


    const minutes =
      Math.floor(
        (distance % 3600000)
        / 60000
      );


    const seconds =
      Math.floor(
        (distance % 60000)
        / 1000
      );


    $("#days").textContent =
      String(days).padStart(2, "0");

    $("#hours").textContent =
      String(hours).padStart(2, "0");

    $("#minutes").textContent =
      String(minutes).padStart(2, "0");

    $("#seconds").textContent =
      String(seconds).padStart(2, "0");

  }


  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );


  /* =========================================================
     SCROLL REVEALS
     ========================================================= */

  const observer =
    new IntersectionObserver(
      (entries, obs) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            obs.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  $$(".reveal, .reveal-left, .reveal-right")
    .forEach(el => {

      observer.observe(el);

    });


  /* =========================================================
     WHATSAPP
     ========================================================= */

  const whatsappNumber =
    "528445550198";


  const whatsappText =
    encodeURIComponent(
      "Hola, quiero confirmar mi asistencia a la celebración de Jackson McCall en Rancho El Halcón el 21 de noviembre de 2026."
    );


  $("#whatsappBtn").href =
    `https://wa.me/${whatsappNumber}?text=${whatsappText}`;


  /* =========================================================
     WESTERN DUEL GAME
     
     Duelo de reacción:

     - Espera una señal aleatoria.
     - Disparar antes de la señal = falsa salida.
     - Cuando aparece "¡DESENFUNDA!",
       gana quien reacciona primero.
     ========================================================= */


  const gameArea =
    $("#gameArea");


  const startGame =
    $("#startGame");


  const drawButton =
    $("#drawButton");


  const gameMessage =
    $("#gameMessage");


  const playerTime =
    $("#playerTime");


  const rivalTime =
    $("#rivalTime");


  let duelActive = false;

  let duelReady = false;

  let duelStartTime = 0;

  let rivalTimer = null;

  let signalTimer = null;


  /* =========================================================
     LIMPIAR TEMPORIZADORES
     ========================================================= */

  function clearDuelTimers() {

    clearTimeout(signalTimer);

    clearTimeout(rivalTimer);

    signalTimer = null;

    rivalTimer = null;

  }


  /* =========================================================
     PANTALLA INICIAL DEL DUELO
     ========================================================= */

  function showInitialDuelScreen() {

    gameArea.innerHTML = `

      <div class="game-start">

        <i class="fa-solid fa-hat-cowboy-side"></i>

        <h3>
          ¿Eres el más rápido del Oeste?
        </h3>

        <p>
          Espera la señal. Cuando aparezca
          <b>¡DESENFUNDA!</b>, presiona el botón
          lo más rápido posible.
        </p>

        <button
          id="startGame"
          class="btn btn-gold"
          type="button"
        >
          Comenzar duelo
        </button>

      </div>

    `;


    $("#startGame").addEventListener(
      "click",
      startDuel
    );

  }


  /* =========================================================
     INICIAR DUELO
     ========================================================= */

  function startDuel() {

    clearDuelTimers();


    duelActive = true;

    duelReady = false;

    duelStartTime = 0;


    playerTime.textContent = "--";

    rivalTime.textContent = "--";


    drawButton.disabled = false;

    drawButton.classList.remove(
      "ready",
      "result"
    );


    const idleText =
      drawButton.querySelector(
        ".draw-idle"
      );


    if (idleText) {

      idleText.textContent =
        "ESPERA...";

    }


    gameMessage.textContent =
      "No dispares todavía... espera la señal.";


    gameArea.innerHTML = `

      <div class="game-start">

        <i class="fa-solid fa-hourglass-half"></i>

        <h3>
          El duelo ha comenzado
        </h3>

        <p>
          Mano cerca de la funda...
          pero todavía <b>NO dispares</b>.
        </p>

      </div>

    `;


    /*
      Tiempo impredecible:

      Entre 2 y 5 segundos.
    */

    const signalDelay =
      2000 +
      Math.floor(
        Math.random() * 3001
      );


    signalTimer =
      setTimeout(() => {


        if (!duelActive) return;


        duelReady = true;


        duelStartTime =
          performance.now();


        drawButton.classList.add(
          "ready"
        );


        gameArea.innerHTML = `

          <div class="game-start">

            <i class="fa-solid fa-bolt"></i>

            <h3>
              ¡DESENFUNDA!
            </h3>

            <p>
              ¡DISPARA AHORA!
            </p>

          </div>

        `;


        gameMessage.textContent =
          "¡Ahora!";


        /*
          Reacción del rival.

          Entre 260 y 759 ms.
        */

        const rivalReaction =
          260 +
          Math.floor(
            Math.random() * 500
          );


        rivalTimer =
          setTimeout(() => {


            if (
              !duelActive ||
              !duelReady
            ) {
              return;
            }


            rivalTime.textContent =
              `${(
                rivalReaction / 1000
              ).toFixed(3)} s`;


            finishDuel(
              "rival",
              rivalReaction
            );


          }, rivalReaction);


      }, signalDelay);

  }


  /* =========================================================
     FINALIZAR DUELO
     ========================================================= */

  function finishDuel(
    winner,
    reactionTime = null
  ) {


    if (!duelActive) return;


    duelActive = false;

    duelReady = false;


    clearDuelTimers();


    drawButton.classList.remove(
      "ready"
    );

    drawButton.classList.add(
      "result"
    );

    drawButton.disabled = true;


    /* =========================
       GANA EL JUGADOR
       ========================= */

    if (winner === "player") {


      playerTime.textContent =
        `${(
          reactionTime / 1000
        ).toFixed(3)} s`;


      gameMessage.textContent =
        `¡BANG! Ganaste el duelo con ${reactionTime} ms. 🤠`;


      gameArea.innerHTML = `

        <div class="game-start">

          <i class="fa-solid fa-trophy"></i>

          <h3>
            ¡Duelo ganado!
          </h3>

          <p>
            Tu desenfunde fue de
            <b>${reactionTime} ms</b>.
          </p>

        </div>

      `;


    }

    /* =========================
       GANA EL RIVAL
       ========================= */

    else {


      gameMessage.textContent =
        "¡BANG! Tu rival fue más rápido.";


      gameArea.innerHTML = `

        <div class="game-start">

          <i class="fa-solid fa-skull-crossbones"></i>

          <h3>
            Duelo perdido
          </h3>

          <p>
            Tu rival desenfundó antes que tú.
          </p>

        </div>

      `;

    }


    /*
      Después de 700 ms,
      se permite otro duelo.
    */

    setTimeout(() => {


      drawButton.disabled = false;


      drawButton.classList.remove(
        "result"
      );


      const idleText =
        drawButton.querySelector(
          ".draw-idle"
        );


      if (idleText) {

        idleText.textContent =
          "OTRO DUELO";

      }


    }, 700);

  }


  /* =========================================================
     FALSA SALIDA
     ========================================================= */

  function falseStart() {


    if (
      !duelActive ||
      duelReady
    ) {
      return;
    }


    duelActive = false;


    clearDuelTimers();


    drawButton.disabled = true;


    gameMessage.textContent =
      "¡FALSA SALIDA! Disparaste antes de la señal.";


    gameArea.innerHTML = `

      <div class="game-start">

        <i class="fa-solid fa-triangle-exclamation"></i>

        <h3>
          ¡Falsa salida!
        </h3>

        <p>
          En un duelo del Oeste,
          disparar antes de tiempo
          significa perder.
        </p>

      </div>

    `;


    setTimeout(() => {


      drawButton.disabled = false;


      const idleText =
        drawButton.querySelector(
          ".draw-idle"
        );


      if (idleText) {

        idleText.textContent =
          "OTRO DUELO";

      }


    }, 700);

  }


  /* =========================================================
     BOTÓN DE DESENFUNDE
     ========================================================= */

  drawButton.addEventListener(
    "click",
    () => {


      /*
        Si no hay duelo activo,
        iniciar uno.
      */

      if (!duelActive) {

        startDuel();

        return;

      }


      /*
        Si todavía no llega la señal,
        es falsa salida.
      */

      if (!duelReady) {

        falseStart();

        return;

      }


      /*
        Medir reacción del jugador.
      */

      const reactionTime =
        Math.max(
          0,
          Math.round(
            performance.now() -
            duelStartTime
          )
        );


      playerTime.textContent =
        `${(
          reactionTime / 1000
        ).toFixed(3)} s`;


      finishDuel(
        "player",
        reactionTime
      );

    }
  );


  /* =========================================================
     BARRA ESPACIADORA
     
     Space = desenfundar
     ========================================================= */

  document.addEventListener(
    "keydown",
    event => {


      if (
        event.code !== "Space"
      ) {
        return;
      }


      const tag =
        document.activeElement?.tagName;


      /*
        No interferir con formularios.
      */

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT"
      ) {
        return;
      }


      event.preventDefault();


      if (!duelActive) {

        startDuel();

        return;

      }


      drawButton.click();

    }
  );


  /* =========================================================
     BOTÓN INICIAL
     ========================================================= */

  startGame.addEventListener(
    "click",
    startDuel
  );


  /* =========================================================
     LIGHTBOX
     ========================================================= */

  const lightbox =
    $("#lightbox");


  const lightboxImage =
    $("#lightboxImage");


  const lightboxClose =
    $("#lightboxClose");


  $$(".gallery-item").forEach(
    item => {


      item.addEventListener(
        "click",
        () => {


          const image =
            item.dataset.image;


          lightboxImage.src =
            image;


          lightbox.classList.add(
            "open"
          );


          lightbox.setAttribute(
            "aria-hidden",
            "false"
          );


          document.body.classList.add(
            "no-scroll"
          );

        }
      );

    }
  );


  function closeLightbox() {

    lightbox.classList.remove(
      "open"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    lightboxImage.src = "";


    document.body.classList.remove(
      "no-scroll"
    );

  }


  lightboxClose.addEventListener(
    "click",
    closeLightbox
  );


  lightbox.addEventListener(
    "click",
    event => {

      if (
        event.target === lightbox
      ) {

        closeLightbox();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {


      if (
        event.key === "Escape"
      ) {

        closeLightbox();

        nav.classList.remove(
          "open"
        );

      }

    }
  );


  /* =========================================================
     COPY DETERRENCE
     
     No se bloquea F12 ni las herramientas
     de desarrollador.
     ========================================================= */

  document.addEventListener(
    "contextmenu",
    event => {
      event.preventDefault();
    }
  );


  document.addEventListener(
    "dragstart",
    event => {
      event.preventDefault();
    }
  );


  document.addEventListener(
    "selectstart",
    event => {
      event.preventDefault();
    }
  );


  [
    "copy",
    "cut",
    "paste"
  ].forEach(type => {

    document.addEventListener(
      type,
      event => {
        event.preventDefault();
      }
    );

  });


  /*
    Bloqueo de algunos atajos
    de teclado relacionados
    con copiar/guardar/seleccionar.
  */

  document.addEventListener(
    "keydown",
    event => {


      const key =
        event.key.toLowerCase();


      const blocked = [
        "c",
        "x",
        "v",
        "a",
        "s",
        "u",
        "p"
      ];


      if (
        (event.ctrlKey ||
         event.metaKey) &&
        blocked.includes(key)
      ) {

        event.preventDefault();

      }

    }
  );


  /* =========================================================
     EVITAR ARRASTRE DE IMÁGENES
     ========================================================= */

  $$("img").forEach(img => {

    img.setAttribute(
      "draggable",
      "false"
    );

  });

});