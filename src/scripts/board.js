const {
  ANIMATE_LEFT,
  ANIMATE_TOP,
  SPACE_FIX,
  BOARD_DATA_COLUMN,
  CSS_CLASS_NAME_ANIMATE,
  EVENTS_NAMES,
  ROTATION_ANGLES,
  TIMEOUT_ADD_ANIMATE_CSS_CLASS,
  TIMEOUT_DETACH_SHAPE_INFO_BOXES,
  TIMEOUT_REMOVE_ANIMATE_CSS_CLASS,
  VALID_ACTIONS,
  SELECTOR_BOARD,
  SELECTOR_SHAPE_WRAPPER,
  SELECTOR_HINTS_WRAPPER,
  TIMEOUT_AFTER_ROWS_CLEARED,
  CSS_CLASS_OPACITY_0_1,
  NON_OCCUPIED_COLUMN_VALUE,
  BOARD_DATA_ROW,
} = APP_SETTINGS;
import getDictionaryPhrase from "./dictionary";
import {
  getBoardTemplate,
  getColumnsRepeatFunctionTemplate,
  getCssRotateSelectorTemplate,
  getCssTranslateTemplate,
  getFreeBoxRowSelectorTemplate,
  getFreeBoxSelectorTemplate,
  getGameOverTemplate,
  getShapeBoxTemplate,
  getShapeClassNameTemplate,
} from "./ui_templates";

export default function Board(gameSettings) {
  const EVENT_HANDLERS = {
    [EVENTS_NAMES.GAME_BOARD_APPENDED]: _onBoardAppended,
    [EVENTS_NAMES.SHAPE_READY_TO_USE]: _drawShape,
    [EVENTS_NAMES.SHAPE_DETACH_INTO_BOXES]: _detachShapeIntoBoxes,
    [EVENTS_NAMES.GAME_HAS_ROWS_TO_CLEAR]: _onHasRowsToClear,
    [EVENTS_NAMES.SHAPE_REACHED_MAX_LEFT]: _addHint,
    [EVENTS_NAMES.SHAPE_REACHED_MAX_RIGHT]: _addHint,
    [EVENTS_NAMES.SHAPE_CANNOT_ROTATE_SO_CLOSE_TO_THE_EDGE]: _addHint,
    [EVENTS_NAMES.ACTION_TEMPORARY_DISABLD]: _addHint,
    [EVENTS_NAMES.ACTION_NOT_FOUND]: _addHint,
    [EVENTS_NAMES.GAME_OVER]: _onGameOver,
  };
  const SHAPE_ACTIONS = {
    [VALID_ACTIONS.MOVE](shape) {
      return new Promise((resolve) => {
        const cssProps = {
          top: ANIMATE_TOP * shape.rect.top + SPACE_FIX,
          left: ANIMATE_LEFT * shape.rect.left + SPACE_FIX,
        };

        currentShapeElement.style.translate = getCssTranslateTemplate(cssProps.left, cssProps.top);
        resolve();
      });
    },
    [VALID_ACTIONS.ROTATE](shape) {
      return new Promise((resolve) => {
        let prevAngle = ROTATION_ANGLES[shape.currentAngleIndex - 1];
        let newAngle = ROTATION_ANGLES[shape.currentAngleIndex];

        if (!prevAngle) {
          currentShapeElement.classList.add(getCssRotateSelectorTemplate(newAngle));
          resolve();
        } else {
          currentShapeElement.classList.replace(
            getCssRotateSelectorTemplate(prevAngle),
            getCssRotateSelectorTemplate(newAngle)
          );

          if (shape.currentAngleIndex === ROTATION_ANGLES.length - 1) {
            setTimeout(() => {
              currentShapeElement.classList.remove(CSS_CLASS_NAME_ANIMATE, getCssRotateSelectorTemplate(newAngle));
              setTimeout(() => {
                currentShapeElement.classList.add(CSS_CLASS_NAME_ANIMATE);
                resolve();
              }, TIMEOUT_ADD_ANIMATE_CSS_CLASS);
            }, TIMEOUT_REMOVE_ANIMATE_CSS_CLASS);
          } else {
            resolve();
          }
        }
      });
    },
  };
  const boardElement = document.createElement("div");
  const shapesWrapperElement = document.createElement("div");
  const hintsWrapperElement = document.createElement("div");
  let currentShapeElement;

  function _onGameOver() {
    boardElement.classList.add(CSS_CLASS_OPACITY_0_1);
    shapesWrapperElement.classList.add(CSS_CLASS_OPACITY_0_1);
    shapesWrapperElement.insertAdjacentHTML("afterend", getGameOverTemplate());
  }

  function _buildBoard() {
    Board.prototype.events.trigger(EVENTS_NAMES.BOARD_BOOTUP);

    boardElement.id = SELECTOR_BOARD;
    shapesWrapperElement.id = SELECTOR_SHAPE_WRAPPER;
    hintsWrapperElement.id = SELECTOR_HINTS_WRAPPER;

    boardElement.style.gridTemplateColumns = getColumnsRepeatFunctionTemplate(gameSettings.COLUMNS);
    boardElement.innerHTML = getBoardTemplate(gameSettings.ROWS, gameSettings.COLUMNS);

    Board.prototype.events.trigger(EVENTS_NAMES.BOARD_ELEMENT_READY);
  }

  function _onBoardAppended() {
    boardElement.after(shapesWrapperElement);
    shapesWrapperElement.after(hintsWrapperElement);
    Board.prototype.events.trigger(EVENTS_NAMES.BOARD_BOOTED);
  }

  function _drawShape({ shape }) {
    let className = getShapeClassNameTemplate({
      name: shape.name,
      x: shape.rect.totalColumns,
      y: shape.rect.totalRows,
    });

    let template = "";
    shape.actions.loopOverStructureInSpace.call(shape, (data) => {
      template += getShapeBoxTemplate(shape.cssClassName, data.structure.row, data.structure.column, data.value);
    });
    currentShapeElement = document.createElement("div");
    currentShapeElement.className = className + ` ${CSS_CLASS_NAME_ANIMATE}`;
    currentShapeElement.style.translate = getCssTranslateTemplate(SPACE_FIX, SPACE_FIX);
    currentShapeElement.innerHTML = template;
    shapesWrapperElement.append(currentShapeElement);
    Board.prototype.events.trigger(EVENTS_NAMES.SHAPE_ADDED_TO_BOARD);
  }

  async function _runShapeAction({ actionName, shape }) {
    return await SHAPE_ACTIONS[actionName]?.call(SHAPE_ACTIONS[actionName], shape);
  }

  function _detachShapeIntoBoxes({ shape }) {
    setTimeout(() => {
      if (!currentShapeElement) {
        return;
      }

      shape.actions.loopOverStructureInSpace.call(shape, (data) => {
        if (data.value === NON_OCCUPIED_COLUMN_VALUE) {
          return;
        }

        const cssProps = {
          top: ANIMATE_TOP * data.structureInSpace.row + SPACE_FIX,
          left: ANIMATE_LEFT * data.structureInSpace.column + SPACE_FIX,
        };

        const freeBoxElement = document.createElement("div");
        freeBoxElement.className = getFreeBoxSelectorTemplate(shape.cssClassName);
        freeBoxElement.style.translate = getCssTranslateTemplate(cssProps.left, cssProps.top);
        freeBoxElement.setAttribute(BOARD_DATA_ROW, data.structureInSpace.row);
        freeBoxElement.setAttribute(BOARD_DATA_COLUMN, data.structureInSpace.column);
        shapesWrapperElement.appendChild(freeBoxElement);
      });

      currentShapeElement?.remove();
      currentShapeElement = null;

      Board.prototype.events.trigger(EVENTS_NAMES.SHAPE_DETACHED_INTO_BOXES);
    }, TIMEOUT_DETACH_SHAPE_INFO_BOXES);
  }

  function _addHint(_, eventName) {
    hintsWrapperElement.innerText = getDictionaryPhrase(eventName, { EVENT_NAME: eventName });
  }

  function removeHint() {
    hintsWrapperElement.innerText = "";
  }

  function moveRowDown(row, newRow) {
    const childrenElement = document.querySelectorAll(getFreeBoxRowSelectorTemplate(row));
    childrenElement.forEach((childElem) => {
      const boxColumn = Number(childElem.getAttribute(BOARD_DATA_COLUMN));
      const cssProps = {
        top: ANIMATE_TOP * newRow + SPACE_FIX,
        left: ANIMATE_LEFT * boxColumn + SPACE_FIX,
      };
      childElem.setAttribute(BOARD_DATA_ROW, newRow);
      childElem.style.translate = getCssTranslateTemplate(cssProps.left, cssProps.top);
    });
  }

  function fixBoardUIAfterRowsCleared(removedRows) {
    const times = removedRows.length;
    const rowIndex = Math.min(...removedRows) - 1;
    for (let row = rowIndex; row >= 0; row--) {
      moveRowDown(row, row + times);
    }
  }

  function _onHasRowsToClear({ removedRows }) {
    const removedRowsCount = removedRows.length;

    let selectors = "";
    for (let x = 0; x < removedRowsCount; x++) {
      selectors += getFreeBoxRowSelectorTemplate(removedRows[x]) + ",";
    }
    document.querySelectorAll(selectors.slice(0, -1)).forEach((child) => child.remove());

    setTimeout(() => {
      fixBoardUIAfterRowsCleared(removedRows);
      Board.prototype.events.trigger(EVENTS_NAMES.BOARD_FULL_ROWS_CLEARED);
    }, TIMEOUT_AFTER_ROWS_CLEARED);
  }

  return {
    init() {
      Board.prototype.events.observer((_, eventName, eventParams) => {
        removeHint();
        if (typeof EVENT_HANDLERS[eventName] === "function") {
          EVENT_HANDLERS[eventName].call(EVENT_HANDLERS[eventName], eventParams, eventName);
        }
      });
      _buildBoard();
    },
    runShapeAction: _runShapeAction,
    getBoardElement() {
      return boardElement;
    },
  };
}
