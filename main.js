import "./src/styles/style.css";
const { GAME_SETTINGS, ROOT_FONT_SIZE } = APP_SETTINGS;
import Game from "./src/scripts/game";

const root = document.querySelector(":root");
root.style.fontSize = ROOT_FONT_SIZE;

const localStorageKey = "__SHOW_WELCOME_PAGE__";
const appElement = document.querySelector("#app");

let showWelcomePage = localStorage.getItem(localStorageKey);
showWelcomePage = showWelcomePage === null;

function initGame() {
  const appVersionElem = document.querySelector("#app_version");
  appVersionElem.querySelector("span").innerText = APP_SETTINGS.APP_VERSION;
  appVersionElem.classList.remove('hide');

  const game = new Game({
    ...GAME_SETTINGS,
    ...{
      element: document.querySelector("#app"),
    },
  });

  try {
    game.start();
  } catch (err) {
    console.error("errerrerr", err);
  }
}

(async (showWelcomePage) => {
  if (!showWelcomePage) {
    initGame();
  } else {
    const Welcome = (await import("./src/scripts/welcome/index")).default;
    Welcome(appElement)
      .start()
      .onStartTheGame(() => {
        localStorage.setItem(localStorageKey, false);
        initGame();
      });
  }
})(showWelcomePage);
