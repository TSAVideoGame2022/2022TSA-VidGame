var listener = new window.keypress.Listener();

listener.register_combo({
  "keys": "a",
  "on_keydown": () => {
    pressedKeys.push(KEY.A);
    pressedKeys = [... new Set(pressedKeys)];
  },
  "on_keyup": () => {
    player.setupSprite('idleL');
    pressedKeys.indexOf(KEY.A) > -1 ? pressedKeys.splice(pressedKeys.indexOf(KEY.A), 1) : null;
  },
});

listener.register_combo({
  "keys": "d",
  "on_keydown": () => {
    pressedKeys.push(KEY.D);
    pressedKeys = [... new Set(pressedKeys)];
  },
  "on_keyup": () => {
    player.setupSprite('idleR');
    pressedKeys.indexOf(KEY.D) > -1 ? pressedKeys.splice(pressedKeys.indexOf(KEY.D), 1) : null;
  },
});

listener.register_combo({
  "keys": "space",
  "on_keydown": () => {
    pressedKeys.push(KEY.SPACE);
    pressedKeys = [... new Set(pressedKeys)];
  },
  "on_keyup": () => {
    pressedKeys.indexOf(KEY.SPACE) > -1 ? pressedKeys.splice(pressedKeys.indexOf(KEY.SPACE), 1) : null;
  },
});