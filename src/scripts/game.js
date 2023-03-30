const {
  KEY_TO_DIRECTION,
  KEY_TO_ROTATE,
  ACTIONS_STEP_VALUE,
  AUTO_MOVE_ENABLE,
  EVENTS_NAMES,
  AUTO_MOVE_INTERVAL_SHAPE,
  NOTIFY_TRIGGERS,
  OCCUPIED_COLUMN_VALUE,
  PRINT_EVENTS_TO_CONSOLE,
  VALID_ACTIONS,
  VALID_DIRECTIONS,
  NON_OCCUPIED_COLUMN_VALUE,
} = APP_SETTINGS;
import Board from "./board";
import BoardMatrix from "./board_matrix";
import GameEvents from "./game_events";
import ShapeDelegator from "./shape_delegator";
import * as shapePackage from "~/shapes_package";

export default function Game(gameSettings) {
  const EVENT_HANDLERS = {
    [EVENTS_NAMES.BOARD_ELEMENT_READY]: _onBoardElementReady,
    [EVENTS_NAMES.BOARD_BOOTED]: _onBoardBootd,
    [EVENTS_NAMES.SHAPE_DETACHED_INTO_BOXES]: _onAfterShapeDetachedIntoBoxes,
    [EVENTS_NAMES.SHAPE_REACHED_MAX_BOTTOM]: _onShapeReachedMaxMovement,
    [EVENTS_NAMES.SHAPE_OVERLEPPING_LEFT]: _onShapeReachedMaxMovement,
    [EVENTS_NAMES.SHAPE_OVERLEPPING_RIGHT]: _onShapeReachedMaxMovement,
    [EVENTS_NAMES.BOARD_FULL_ROWS_CLEARED]: _addNewShape,
    [EVENTS_NAMES.GAME_NO_ROWS_TO_CLEAR]: _addNewShape,
    [EVENTS_NAMES.SHAPE_ADDED_TO_BOARD]: _onShapeAddedToBoard,
    [EVENTS_NAMES.SHAPE_AFTER_ACTION_EXECUTION]: _onAfterShapeActionExecution,
  };

  let timeout;
  let isGameOver = false;
  let acceptUserInput = true;
  let autoMovementInterval = null;
  let observer;
  let gameEvent = new GameEvents();
  let boardMatrix = new BoardMatrix(
    gameSettings.ROWS,
    gameSettings.COLUMNS,
    NON_OCCUPIED_COLUMN_VALUE,
    OCCUPIED_COLUMN_VALUE
  );
  ShapeDelegator.prototype.events = gameEvent;
  let shapeDelegator = new ShapeDelegator(shapePackage, boardMatrix);
  Board.prototype.events = gameEvent;
  let board = new Board(gameSettings);

  function _onBoardBootd() {
    gameEvent.trigger(EVENTS_NAMES.GAME_BOOTED);
    _addNewShape();
  }

  function _onBoardElementReady() {
    gameSettings.element.append(board.getBoardElement());
    gameEvent.trigger(EVENTS_NAMES.GAME_BOARD_APPENDED);
  }

  function _onShapeAddedToBoard() {
    if (shapeDelegator.isOverlappingAnotherShape()) {
      _gameOver();
      return;
    }
    acceptUserInput = true;
  }

  function _onAfterShapeActionExecution(eventParams) {
    board.runShapeAction(eventParams).then(() => {
      if (!shapeDelegator.isReachedMaxBottom()) {
        acceptUserInput = true;
      }
    });
  }

  function _onAfterShapeDetachedIntoBoxes() {
    if (boardMatrix.hasRowsToRemove()) {
      gameEvent.trigger(EVENTS_NAMES.GAME_HAS_ROWS_TO_CLEAR, { removedRows: boardMatrix.getRowsToRemoveAndReset() });
    } else {
      gameEvent.trigger(EVENTS_NAMES.GAME_NO_ROWS_TO_CLEAR);
    }
  }

  function _addNewShape() {
    shapeDelegator.getShape(gameSettings?.startWithShape);
    autoMoveShapeDown();
  }

  function _moveShapeDown() {
    _executeAction({
      name: VALID_ACTIONS.MOVE,
      params: [VALID_DIRECTIONS.DOWN, ACTIONS_STEP_VALUE[VALID_ACTIONS.MOVE]],
    });
  }

  function _clearAutoMove() {
    if (autoMovementInterval) clearInterval(autoMovementInterval);
  }

  function autoMoveShapeDown() {
    if (AUTO_MOVE_ENABLE) {
      autoMovementInterval = setInterval(_moveShapeDown, AUTO_MOVE_INTERVAL_SHAPE);
    }
  }

  function _onShapeReachedMaxMovement({ shape }) {
    gameEvent.trigger(EVENTS_NAMES.SHAPE_DETACH_INTO_BOXES, { shape });
  }

  function _printEventToConsole(eventPrefix, eventName, eventParams) {
    if (!PRINT_EVENTS_TO_CONSOLE) {
      return;
    }
    if (eventParams) {
      console.log("Trigger ::", eventName, eventParams);
    } else {
      console.log("Trigger ::", eventName);
    }
  }

  gameEvent.observer((eventPrefix, eventName, eventParams) => {
    if (isGameOver) {
      return;
    }

    _printEventToConsole(eventPrefix, eventName, eventParams);

    if (typeof EVENT_HANDLERS[eventName] === "function") {
      EVENT_HANDLERS[eventName].call(EVENT_HANDLERS[eventName], eventParams, eventName);
    }

    if (NOTIFY_TRIGGERS) {
      observer?.call(observer, eventName, eventParams);
    }
  });

  function _gameOver() {
    isGameOver = true;
    acceptUserInput = false;
    _clearAutoMove();
    gameEvent.trigger(EVENTS_NAMES.GAME_OVER);
  }

  function _executeAction(action) {
    if (isGameOver) {
      return;
    }

    if (!acceptUserInput) {
      gameEvent.trigger(EVENTS_NAMES.ACTION_TEMPORARY_DISABLD);
      return;
    }

    if (!shapeDelegator.isActionAllowed(action)) {
      return;
    }

    acceptUserInput = false;
    shapeDelegator.executeAction(action);
  }

  function _executeActionByUser(action) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      _executeAction(action);
    }, 100);
  }

  return {
    start() {
      gameEvent.trigger(EVENTS_NAMES.GAME_BOOTUP);
      board.init();

      window.addEventListener("keydown", (e) => {
        if (KEY_TO_ROTATE.includes(e.key)) {
          _executeActionByUser({ name: VALID_ACTIONS.ROTATE });
        } else if (KEY_TO_DIRECTION[e.key]) {
          _executeActionByUser({
            name: VALID_ACTIONS.MOVE,
            params: [KEY_TO_DIRECTION[e.key], ACTIONS_STEP_VALUE[VALID_ACTIONS.MOVE]],
          });
        }
      });

      return this;
    },
    observer(callback) {
      if (typeof callback === "function") {
        observer = callback;
      }
      return this;
    },
  };
}
