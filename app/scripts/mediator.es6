let events = {};

export function sub(eventName, fn) {
  events[eventName] = events[eventName] || [];
  events[eventName].push(fn);
}

export function unsub(eventName, fn) {
  if (events[eventName]) {
    for (let i = 0; i < events[eventName].length; i++) {
      if (events[eventName][i] === fn) {
        events[eventName].splice(i, 1);
        break;
      }
    }
  }
}

export function emit(eventName, data) {
  if (events[eventName]) {
    events[eventName].forEach((fn) => {
      fn(data);
    });
  }
}
