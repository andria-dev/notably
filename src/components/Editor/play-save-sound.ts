/*
 * This file creates a binding so that only one `Audio` is ever created,
 * instead of one `Audio` for each use
 */

const sound = new Audio('/save-sound.webm');
sound.volume = 0.25;

export function play() {
  sound.play();
}
