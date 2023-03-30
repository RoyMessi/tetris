const { EVENTS_NAMES } = APP_SETTINGS;

const DICTIONARY = {
  [EVENTS_NAMES.SHAPE_CANNOT_ROTATE_SO_CLOSE_TO_THE_EDGE]: {
    text: "You cannot rotate the shape in this location",
  },
  [EVENTS_NAMES.ACTION_TEMPORARY_DISABLD]: {
    text: "Not accepting new inputs right now",
  },
  [EVENTS_NAMES.ACTION_NOT_FOUND]: {
    text: "Action not found",
  },
  default: {
    text: "Try to move in the other direction ({EVENT_NAME})",
    params: { EVENT_NAME: null },
  },
};

export default function getDictionaryPhrase(phraseKey, params) {
  if (!DICTIONARY[phraseKey]) {
    phraseKey = "default";
  }

  let phrase = { ...{}, ...DICTIONARY[phraseKey] };
  if (phrase.params) {
    Object.keys(phrase.params).forEach((param) => {
      if (typeof params[param] !== "undefined") {
        phrase.text = phrase.text.replace(`{${param}}`, params[param]);
      }
    });
  }
  return phrase.text;
}
