const { EVENTS_NAMES, OCCUPIED_COLUMN_VALUE, VALID_ACTIONS, VALID_DIRECTIONS } = APP_SETTINGS;
import { shapeActions } from "./shapes/shapes_actions.js";

export default function ShapeDelegator(shapePackage, boardMatrix) {
  const ShapeAdapter = {
    getRandom() {
      const randIndex = Math.floor(Math.random() * shapePackage.AVAILABLE_SHAPES.length);
      return this.getShape(shapePackage.AVAILABLE_SHAPES[randIndex]);
    },
    getShape(shapeFunction) {
      const shape = new shapeFunction();
      shape.name = shape.constructor.name;
      shape.actions = shapeActions.call(shape);
      shape.actions.init.call(shape);
      return shape;
    },
  };

  const PRECHECK_ACTIONS = {
    [VALID_ACTIONS.MOVE](shape, action) {
      const direction = action.params[0];
      if (direction === VALID_DIRECTIONS.LEFT) {
        if (boardMatrix.isMaxLeft(shape.rect.left)) {
          ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_REACHED_MAX_LEFT);
          return false;
        } else if (_isOverlappingAnotherShapeSide(direction)) {
          ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_OVERLEPPING_LEFT, { shape: currentShape });
          return false;
        }
      } else if (direction === VALID_DIRECTIONS.RIGHT) {
        if (boardMatrix.isMaxRight(shape.rect.right)) {
          ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_REACHED_MAX_RIGHT);
          return false;
        } else if (_isOverlappingAnotherShapeSide(direction)) {
          ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_OVERLEPPING_RIGHT, { shape: currentShape });
          return false;
        }
      } else if (
        direction === VALID_DIRECTIONS.DOWN &&
        (boardMatrix.isMaxBottom(shape.rect.bottom) || _isOverlappingAnotherShapeDown())
      ) {
        ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_REACHED_MAX_BOTTOM, { shape: currentShape });
        return false;
      }
      return true;
    },
    [VALID_ACTIONS.ROTATE](shape) {
      if (boardMatrix.isMaxBottom(shape.rect.bottom - 1)) {
        ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_CANNOT_ROTATE_SO_CLOSE_TO_THE_EDGE);
        return false;
      }
      if (boardMatrix.isMaxRight(shape.rect.right) && shape.rect.totalRows > shape.rect.totalColumns) {
        ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_CANNOT_ROTATE_SO_CLOSE_TO_THE_EDGE);
        return false;
      }

      return true;
    },
  };

  let isFirstCall = true;
  let currentShape;
  let lastAction;

  function _isOverlappingAnotherShapeSide(direction) {
    let column;
    if (direction === VALID_DIRECTIONS.RIGHT) {
      column = currentShape.rect.right;
    } else {
      column = currentShape.rect.left;
    }

    let top = boardMatrix.isColumnHasDefaultValue(currentShape.rect.top, column);
    let bottom = boardMatrix.isColumnHasDefaultValue(currentShape.rect.bottom, column);
    return !top || !bottom;
  }

  function _isOverlappingAnotherShapeDown() {
    let bool = true;
    currentShape.actions.loopOverStructureInSpace.call(currentShape, (data) => {
      let structure = data.structureInSpace;
      if (boardMatrix.isColumnHasOccupiedValue(structure.row, structure.column)) {
        bool = false;
        return true;
      }
    });
    return !bool;
  }

  function _isOverlappingAnotherShape() {
    const left = _isOverlappingAnotherShapeSide(VALID_DIRECTIONS.LEFT);
    const right = _isOverlappingAnotherShapeSide(VALID_DIRECTIONS.RIGHT);
    const down = _isOverlappingAnotherShapeDown();
    return left || right || down;
  }

  function _isReachedMaxBottom() {
    let isReachedMaxBottom = false;
    currentShape.actions.loopOverStructureInSpace.call(currentShape, (data) => {
      if (
        !isReachedMaxBottom &&
        data.value === OCCUPIED_COLUMN_VALUE &&
        (boardMatrix.isMaxBottom(data.structureInSpace.row) ||
          boardMatrix.isColumnHasOccupiedValue(data.structureInSpace.row + 1, data.structureInSpace.column))
      ) {
        isReachedMaxBottom = true;
        return true;
      }
    });

    if (isReachedMaxBottom) {
      currentShape.actions.loopOverStructureInSpace.call(currentShape, (data) => {
        if (data.value === OCCUPIED_COLUMN_VALUE) {
          boardMatrix.updateValue(data.structureInSpace.row, data.structureInSpace.column, data.value);
        }
      });

      boardMatrix.setRowsToRemove();

      ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_REACHED_MAX_BOTTOM, { shape: currentShape });
      ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.BOARD_MATRIX_UPDATED, {
        boardMatrix: boardMatrix.getMatrix(),
      });
    }

    return isReachedMaxBottom;
  }

  return {
    getShape(shape) {
      ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_FETCH_NEW);

      if (isFirstCall && shape) {
        isFirstCall = false;
        currentShape = ShapeAdapter.getShape(shape);
      } else {
        currentShape = ShapeAdapter.getRandom();
      }

      ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_READY_TO_USE, {
        shape: currentShape,
      });

      return currentShape;
    },
    isOverlappingAnotherShape: _isOverlappingAnotherShape,
    isReachedMaxBottom() {
      if (lastAction?.name === VALID_ACTIONS.MOVE && lastAction?.params[0] === VALID_DIRECTIONS.DOWN) {
        return _isReachedMaxBottom();
      }
      return false;
    },
    isActionAllowed(action) {
      if (typeof PRECHECK_ACTIONS[action.name] !== "function") {
        ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.ACTION_NOT_FOUND);
        return false;
      }

      const actionResponse = PRECHECK_ACTIONS[action.name].call(PRECHECK_ACTIONS[action.name], currentShape, action);
      if (!actionResponse) {
        return false;
      }

      return true;
    },
    executeAction(action) {
      lastAction = action;
      ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_BEFORE_ACTION_EXECUTION, {
        actionName: action.name,
        shape: currentShape,
      });

      currentShape.actions[action.name].apply(currentShape, action.params);

      ShapeDelegator.prototype.events.trigger(EVENTS_NAMES.SHAPE_AFTER_ACTION_EXECUTION, {
        actionName: action.name,
        shape: currentShape,
      });
    },
  };
}
