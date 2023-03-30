import "./style.css";
import AbstractShape from "../../shapes/abstract_shape.js";
export const AVAILABLE_SHAPES = [Shape1, Shape2, Shape3, Shape4];

function Shape1() {
  AbstractShape.call(this);
  this.cssClassName = "color-abg1";
  this.structure = [
    [1, 0],
    [1, 1],
  ];
}

function Shape2() {
  AbstractShape.call(this);
  this.cssClassName = "color-abg2";
  this.structure = [
    [1, 1],
    [1, 0],
  ];
}

function Shape3() {
  AbstractShape.call(this);
  this.cssClassName = "color-abg3";
  this.structure = [
    [1, 1],
    [0, 1],
  ];
}

function Shape4() {
  AbstractShape.call(this);
  this.cssClassName = "color-abg4";
  this.structure = [
    [0, 1],
    [1, 1],
  ];
}
