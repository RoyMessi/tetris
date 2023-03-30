export default function AbstractShape() {
  this.name = null;
  this.cssClassName = null;
  this.location = { x: 0, y: 0 };
  this.currentAngleIndex = 0;
  this.structure = [];
  this.structureInSpace = [];
  this.rect = {};
  this.actions = {};
  this.rotationEnable = true;
  this.clone = function () {
    const clone = new this.constructor();
    Object.keys(REQUIRED_PROPERTIES_FOR_CLONE).forEach((prop) => {
      const propType = REQUIRED_PROPERTIES_FOR_CLONE[prop];
      if (propType === "Object") {
        clone[prop] = { ...{}, ...this[prop] };
      } else {
        clone[prop] = [...[], ...this[prop]];
      }
    });
    return clone;
  };
}
