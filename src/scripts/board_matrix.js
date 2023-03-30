export default function BoardMatrix(rows, columns, defaultValue, occupiedValue) {
  let removedRows = new Set();
  let boardMatrix = Array(rows)
    .fill()
    .map(() => Array(columns).fill(defaultValue));

  function _setRowsToRemove() {
    for (let row = rows - 1; row >= 0; row--) {
      let size = boardMatrix[row].reduce((total, x) => (x === occupiedValue ? total + 1 : total), 0);
      if (size === columns) {
        removedRows.add(row);
      }
    }

    _handleHasRowsToRemove();
  }

  function _handleHasRowsToRemove() {
    if (!removedRows.size) {
      return;
    }

    const iterator = removedRows[Symbol.iterator]();
    let cur;
    let repeat = 0;
    while ((cur = iterator.next()).done === false) {
      _deleteRowAndAddNewOne(cur.value + repeat++);
    }
  }

  function _deleteRowAndAddNewOne(row) {
    boardMatrix.splice(row, 1);
    boardMatrix.unshift(Array(columns).fill(defaultValue));
  }

  return {
    getMatrix() {
      return boardMatrix;
    },
    setRowsToRemove: _setRowsToRemove,
    hasRowsToRemove() {
      return removedRows.size;
    },
    getRowsToRemoveAndReset() {
      let arr = Array.from([...[], ...removedRows]);
      removedRows.clear();
      return arr;
    },
    printMatrix() {
      boardMatrix.forEach((row) => console.log("-Matrix-", row));
    },
    isMaxLeft(value) {
      return value <= 0;
    },
    isMaxRight(value) {
      return value >= columns - 1;
    },
    isMaxBottom(value) {
      return value >= rows - 1;
    },
    getColumnValue(row, column) {
      return boardMatrix[row]?.[column];
    },
    isColumnHasDefaultValue(row, column) {
      return boardMatrix[row]?.[column] === defaultValue;
    },
    isColumnHasOccupiedValue(row, column) {
      return boardMatrix[row]?.[column] === occupiedValue;
    },
    updateValue(row, column, value) {
      boardMatrix[row][column] = value;
      return true;
    },
    rowHasAnOccupiedColumn(row) {
      return Math.max(...boardMatrix[row]) === occupiedValue;
    },
  };
}
