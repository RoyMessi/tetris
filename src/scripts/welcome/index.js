import {
  getFirstScreenTemplate,
  getWelcomeContainerTemplate,
} from "./templates";

function getFirstScreen(containerElem, next) {
  containerElem.insertAdjacentHTML("afterbegin", getFirstScreenTemplate());

  return {
    start() {
      containerElem.querySelector("[data-next-step]").addEventListener("click", next, { once: true });
    },
    dispose() {
      containerElem.querySelector("[data-next-step]").removeEventListener("click", next, { once: true });
    },
  };
}

const screens = [getFirstScreen];

export default function Welcome(appElement) {
  let stepContainerElem;
  let currentStep = 1;
  let currentScreen;
  let callbackStartTheGame;

  function next() {
    currentStep++;
    currentScreen.dispose();
    clearStepContainer();
    setupScreen();
  }

  function setupScreen() {
    if (typeof screens[currentStep - 1] === "function") {
      currentScreen = screens[currentStep - 1](stepContainerElem, next);
      currentScreen.start();
    } else {
      dispose();
      callbackStartTheGame();
    }
  }

  function onStartTheGame(callback) {
    callbackStartTheGame = callback;
  }

  function start() {
    document.body.classList.add("welcome-page");
    appElement.insertAdjacentHTML("afterbegin", getWelcomeContainerTemplate());
    stepContainerElem = appElement.firstChild;
    setupScreen();
    return this;
  }

  function clearStepContainer() {
    stepContainerElem.innerHTML = "";
  }

  function dispose() {
    document.body.classList.remove("welcome-page");
    appElement.innerHTML = "";
    return this;
  }

  return { start, dispose, onStartTheGame };
}
