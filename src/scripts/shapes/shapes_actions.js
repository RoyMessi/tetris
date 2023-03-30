const { ACTIONS_STEP_VALUE, ROTATION_ANGLES, VALID_DIRECTIONS } = APP_SETTINGS;

export function shapeActions() {
  function getStructureInSpace() {
    let twoDimensional = [];
    const matrixRows = this.structure.length;
    const matrixColumns = this.structure[0].length;
    const startRow = this.location.y;
    const startColumn = this.location.x;

    for (let row = 0, rowValue = startRow; row < matrixRows; row++, rowValue++) {
      for (let column = 0, columnValue = startColumn; column < matrixColumns; column++, columnValue++) {
        if (!twoDimensional[row]) {
          twoDimensional[row] = [];
        }
        twoDimensional[row][column] = { newRow: rowValue, newColumn: columnValue, value: this.structure[row][column] };
      }
    }
    return twoDimensional;
  }

  function getRect() {
    const totalRows = this.structure.length;
    const totalColumns = this.structure[0].length;
    return {
      top: this.location.y,
      left: this.location.x,
      bottom: this.location.y + totalRows - 1,
      right: this.location.x + totalColumns - 1,
      totalRows,
      totalColumns,
    };
  }

  return {
    init() {
      this.structureInSpace = getStructureInSpace.call(this);
      this.rect = getRect.call(this);
      return this;
    },
    loopOverStructureInSpace(callback) {
      const rows = this.structureInSpace.length;
      const columns = this.structureInSpace[0].length;
      let stop = false;

      for (let row = 0; row < rows; row++) {
        if (stop) {
          break;
        }
        for (let column = 0; column < columns; column++) {
          if (stop) {
            break;
          }
          const structureInSpace = this.structureInSpace[row][column];
          stop = callback.call(callback, {
            structure: {
              row,
              column,
            },
            value: this.structure[row][column],
            structureInSpace: {
              row: structureInSpace.newRow,
              column: structureInSpace.newColumn,
            },
          });
        }
      }
    },
    move(direction, steps) {
      steps = steps ?? ACTIONS_STEP_VALUE[VALID_ACTIONS.MOVE];

      if (direction === VALID_DIRECTIONS.DOWN) {
        this.location.y += steps;
      } else if (direction === VALID_DIRECTIONS.RIGHT) {
        this.location.x += steps;
      } else if (direction === VALID_DIRECTIONS.LEFT) {
        this.location.x -= steps;
      }

      this.structureInSpace = getStructureInSpace.call(this);
      this.rect = getRect.call(this);
      return this;
    },
    rotate() {
      if (!this.rotationEnable) {
        return this;
      }
      const rows = this.structure.length - 1;
      const columns = this.structure[0].length - 1;

      let structure = [];
      for (let row = 0; row <= rows; row++) {
        const pos = rows - row;
        for (let column = 0; column <= columns; column++) {
          if (!structure[column]) {
            structure[column] = [];
          }
          structure[column][pos] = this.structure[row][column];
        }
      }

      ++this.currentAngleIndex;
      if (this.currentAngleIndex > ROTATION_ANGLES.length - 1) {
        this.currentAngleIndex = 1;
      }

      this.structure = structure;
      this.structureInSpace = getStructureInSpace.call(this);
      this.rect = getRect.call(this);
      return this;
    },
  };
}
