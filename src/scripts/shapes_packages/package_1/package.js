import "./style.css";
import AbstractShape from "../../shapes/abstract_shape.js";
export const AVAILABLE_SHAPES = [Shape1, Shape2, Shape3, Shape4, Shape5, Shape6];

function Shape1() {
  AbstractShape.call(this);
  this.cssClassName = "shape-bg-1";
  this.structure = [
    [0, 1, 1],
    [1, 1, 0],
  ];
}

function Shape2() {
  AbstractShape.call(this);
  this.cssClassName = "shape-bg-2";
  this.structure = [
    [1, 1, 1],
    [0, 1, 0],
  ];
}

function Shape3() {
  AbstractShape.call(this);
  this.cssClassName = "shape-bg-3";
  this.structure = [
    [1, 0],
    [1, 1],
  ];
}

function Shape4() {
  AbstractShape.call(this);
  this.cssClassName = "shape-bg-4";
  this.structure = [[1], [1], [1]];
}

function Shape5() {
  AbstractShape.call(this);
  this.cssClassName = "shape-bg-5";
  this.structure = [
    [1, 1],
    [1, 1],
  ];
}

function Shape6() {
  AbstractShape.call(this);
  this.rotationEnable = false;
  this.cssClassName = "shape-bg-6";
  this.structure = [[1]];
}
