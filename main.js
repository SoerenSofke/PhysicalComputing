const serial = new WebSerial()

const connect = document.getElementById('connect');
const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');
const touch = document.getElementById('touch');

connect.addEventListener('pointerdown', connectDevice)
red.addEventListener('pointerdown', switchLedRed)
green.addEventListener('pointerdown', switchLedGreen)
blue.addEventListener('pointerdown', switchLedBlue)
touch.addEventListener('pointerdown', fetchTouchValue)

function connectDevice() {
  serial.init()
}

function switchLedRed() {
  color(255, 0, 0)
}

function switchLedGreen() {
  color(0, 255, 0)
}

function switchLedBlue() {
  color(0, 0, 255)
}

function fetchTouchValue() {
  var jsObj = JSON.parse(serial.value);
  console.log(jsObj)
}

function color(red, green, blue, alpha = 255) {
  const functionIndex = 0
  const dataTx = new Uint8Array([functionIndex, red, green, blue, alpha])
  serial.write(dataTx)
}



