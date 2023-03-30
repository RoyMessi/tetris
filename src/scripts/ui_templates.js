const {
  BOARD_DATA_COLUMN,
  BOARD_DATA_ROW,
  CSS_CLASS_BOX_HIDDEN,
  CSS_CLASS_BOX_SHOWING,
  CSS_CLASS_NAME_ANIMATE,
  CSS_CLASS_NAME_FREE_BOX,
  OCCUPIED_COLUMN_VALUE,
  SELECTOR_PREFIX_ROTATE,
  SELECTOR_SHAPE_FULL_CLASS_NAME_SHAPE,
  SHAPE_DATA_BOX_PART_COLUMN,
  SHAPE_DATA_BOX_PART_ROW,
} = APP_SETTINGS;

export function getGameOverTemplate() {
  return '<div id="game_over_wrapper"><h1>Game Over</h1></div>';
}

export function getBoardTemplate(rows, columns) {
  let template = "";
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      template += `<div ${BOARD_DATA_ROW}="${row}" ${BOARD_DATA_COLUMN}="${column}"></div>`;
    }
  }
  return template;
}

export function getFreeBoxRowSelectorTemplate(row) {
  return `.${CSS_CLASS_NAME_FREE_BOX}[${BOARD_DATA_ROW}="${row}"]`;
}

export function getFreeBoxSelectorTemplate(addCssClass) {
  let cssClassName = `${CSS_CLASS_NAME_FREE_BOX} ${CSS_CLASS_NAME_ANIMATE}`;
  if (addCssClass) {
    cssClassName += ` ${addCssClass}`;
  }
  return cssClassName;
}

export function getCssTranslateTemplate(left, top) {
  return `${left}rem ${top}rem`;
}

export function getCssRotateSelectorTemplate(angle) {
  return `${SELECTOR_PREFIX_ROTATE}${angle}`;
}

export function getShapeClassNameTemplate(settings) {
  return SELECTOR_SHAPE_FULL_CLASS_NAME_SHAPE.replace("{NAME}", settings.name)
    .replace("{X}", settings.x)
    .replace("{Y}", settings.y);
}

export function getColumnsRepeatFunctionTemplate(num) {
  return `repeat(${num}, 1fr)`;
}

export function getShapeBoxTemplate(cssClassName, row, column, value) {
  const forceShapeBoxColor = cssClassName ? ` ${cssClassName}` : "";
  const innerClassName = value === OCCUPIED_COLUMN_VALUE ? CSS_CLASS_BOX_SHOWING : CSS_CLASS_BOX_HIDDEN;
  return `<div class="${innerClassName}${forceShapeBoxColor}" ${BOARD_DATA_ROW}="${row}" ${BOARD_DATA_COLUMN}="${column}" ${SHAPE_DATA_BOX_PART_ROW}="${row}" ${SHAPE_DATA_BOX_PART_COLUMN}="${column}"></div>`;
}
