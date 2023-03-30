export const APP_NAME = process.env.npm_package_name
  .replace("_", " ")
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
  .join(" ");
export const APP_VERSION = process.env.npm_package_version;
export const BOARD_DATA_ROW = "data-board-row";
export const BOARD_DATA_COLUMN = "data-board-column";
export const SHAPE_DATA_BOX_PART_ROW = "data-box-part-row";
export const SHAPE_DATA_BOX_PART_COLUMN = "data-box-part-column";
export const SHAPE_DATA_NEW_ROW = "data-shape-new-row";
export const SHAPE_DATA_NEW_COLUMN = "data-shape-new-column";
export const CSS_CLASS_NAME_ANIMATE = "animate";
export const CSS_CLASS_BOX_HIDDEN = "shape-part-hide";
export const CSS_CLASS_BOX_SHOWING = "shape-part-show";
export const CSS_CLASS_NAME_FREE_BOX = "free-box";
export const CSS_CLASS_SHAPE = "shape";
export const CSS_CLASS_SHAPE_NAME = "shape-name-{NAME}";
export const CSS_CLASS_SHAPE_Y_BY_X = "shape-{X}-by-{Y}";
export const CSS_CLASS_OPACITY_0_1 = "opacity-0-1";
export const SELECTOR_SHAPE_FULL_CLASS_NAME_SHAPE = `${CSS_CLASS_SHAPE} ${CSS_CLASS_SHAPE_NAME} ${CSS_CLASS_SHAPE_Y_BY_X}`;
export const SELECTOR_PREFIX_ROTATE = "rotate-";
export const SELECTOR_BOARD = "board";
export const SELECTOR_SHAPE_WRAPPER = "shapes_wrapper";
export const SELECTOR_HINTS_WRAPPER = "hints_wrapper";
export const NOTIFY_TRIGGERS = process.env.NOTIFY_TRIGGERS === "true";
export const PRINT_EVENTS_TO_CONSOLE = process.env.PRINT_EVENTS_TO_CONSOLE === "true";
export const OCCUPIED_COLUMN_VALUE = 1;
export const NON_OCCUPIED_COLUMN_VALUE = 0;
export const ROTATION_ANGLES = [0, 90, 180, 270, 360];
export const ANIMATE_TOP = 3.1;
export const ANIMATE_LEFT = 3.1;
export const SPACE_FIX = 0.1;
export const ROOT_FONT_SIZE = process.env.ROOT_FONT_SIZE ?? "16px";
export const TIMEOUT_REMOVE_ANIMATE_CSS_CLASS = 100;
export const TIMEOUT_ADD_ANIMATE_CSS_CLASS = 100;
export const TIMEOUT_DETACH_SHAPE_INFO_BOXES = 700;
export const TIMEOUT_AFTER_ROWS_CLEARED = 10;
export const SHAPES_PACKAGE_NAME = process.env.SHAPES_PACKAGE_NAME ?? "package_1";
export const AUTO_MOVE_ENABLE = process.env.AUTO_MOVE_ENABLE === "true";
export const AUTO_MOVE_INTERVAL_SHAPE = Number(process.env.AUTO_MOVE_INTERVAL_SHAPE);
export const REQUIRED_PROPERTIES_FOR_CLONE = { location: "Object", matrix: "Array", actions: "Object" };
export const VALID_ACTIONS = { ROTATE: "rotate", MOVE: "move" };
export const ACTIONS_STEP_VALUE = { [VALID_ACTIONS.ROTATE]: 1, [VALID_ACTIONS.MOVE]: 1 };
export const VALID_DIRECTIONS = { DOWN: "down", LEFT: "left", RIGHT: "right", SPACEBAR: " ", ENTER: "Enter" };
export const KEY_TO_ROTATE = [VALID_DIRECTIONS.SPACEBAR, VALID_DIRECTIONS.SPACEBAR];
export const KEY_TO_DIRECTION = {
  ArrowLeft: VALID_DIRECTIONS.LEFT,
  ArrowRight: VALID_DIRECTIONS.RIGHT,
  ArrowDown: VALID_DIRECTIONS.DOWN,
};

export const EVENTS_NAMES = {
  GAME_BOOTUP: "game:bootUp",
  GAME_BOARD_APPENDED: "game:boardAppended",
  GAME_BOOTED: "game:booted",
  GAME_OVER: "game:over",
  GAME_CLEAR_FULL_ROWS: "game:clearFullRows",
  GAME_NO_ROWS_TO_CLEAR: "game:noRowsToClear",
  GAME_HAS_ROWS_TO_CLEAR: "game:hasRowsToClear",

  ACTION_TEMPORARY_DISABLD: "action:temporaryDisabled",
  ACTION_NOT_FOUND: "action:notFound",

  // Board
  BOARD_BOOTUP: "board:bootUp",
  BOARD_BOOTED: "board:booted",
  BOARD_ELEMENT_READY: "board:elementReady",
  BOARD_APPENDED: "board:appended",
  BOARD_SHAPE_ADDED: "board:shapeAdded",
  BOARD_FULL_ROWS_CLEARED: "board:fullRowsCleared",
  BOARD_MATRIX_UPDATED: "boardMatrix:updated",

  // Shape
  SHAPE_FETCH_NEW: "shape:fetchNew",
  SHAPE_READY_TO_USE: "shape:readyToUse",
  SHAPE_ADDED_TO_BOARD: "shape:addedToBoard",
  SHAPE_BEFORE_ACTION_EXECUTION: "shape:beforeActionExecution",
  SHAPE_AFTER_ACTION_EXECUTION: "shape:afterActionExecution",
  SHAPE_UPDATED_ON_UI: "shape:updatedOnUI",
  SHAPE_REACHED_MAX_LEFT: "shape:reachedMaxLeft",
  SHAPE_REACHED_MAX_RIGHT: "shape:reachedMaxRight",
  SHAPE_REACHED_MAX_BOTTOM: "shape:reachedMaxBottom",
  SHAPE_OVERLEPPING_LEFT: "shape:overlappingLeft",
  SHAPE_OVERLEPPING_RIGHT: "shape:overlappingRight",
  SHAPE_CANNOT_ROTATE_SO_CLOSE_TO_THE_EDGE: "shape:cannotRotateSoCloseToTheEdge",
  SHAPE_DETACH_INTO_BOXES: "shape:detachIntoBoxes",
  SHAPE_DETACHED_INTO_BOXES: "shape:detachedIntoBoxes",
};

export const GAME_SETTINGS = {
  ROWS: process.env.GAME_ROWS ? Number(process.env.GAME_ROWS) : 5,
  COLUMNS: process.env.GAME_COLUMNS ? Number(process.env.GAME_COLUMNS) : 5,
  element: null,
  startWithShape: null,
};
