export default function GameEvents() {
  let observers = [];
  return {
    trigger(eventName, eventParams) {
      let prefix = eventName.split(":")[0];
      observers.forEach((observer) => observer.call(observer, prefix, eventName, eventParams));
    },
    observer(callback, name) {
      if (typeof callback !== "function") {
        return;
      }

      observers.push(callback);
    },
  };
}
