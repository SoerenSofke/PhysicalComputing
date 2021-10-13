const serial = new WebSerial()

const connect = document.getElementById('connect');
const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');

connect.addEventListener('pointerdown', connectDevice)
red.addEventListener('pointerdown', switchLedRed)
green.addEventListener('pointerdown', switchLedGreen)
blue.addEventListener('pointerdown', switchLedBlue)

function connectDevice() {
  serial.init()
}

function switchLedRed() {
  let dataTx = new Uint8Array([0x00, 0xFF, 0x00, 0x00, 0xFF])
  serial.write(dataTx)
}

function switchLedGreen() {
  let dataTx = new Uint8Array([0x00, 0x00, 0xFF, 0x00, 0xFF])
  serial.write(dataTx)
}

function switchLedBlue() {
  let dataTx = new Uint8Array([0x00, 0x00, 0x00, 0xFF, 0xFF])
  serial.write(dataTx)
}