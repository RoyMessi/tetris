export function getWelcomeContainerTemplate() {
  return '<div id="welcome" class="p-2"></div>';
}

export function getFirstScreenTemplate() {
  let rtn = `<h1>Welcome to ${APP_SETTINGS.APP_NAME}!</h1>`;
  rtn += `<p></p>`;
  rtn += `<button class='btn' data-next-step>Got it</button>`;
  return rtn;
}
