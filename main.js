const serial = new WebSerial()

const connect = document.getElementById('connect');
const on = document.getElementById('ledOn');
const off = document.getElementById('ledOff');

connect.addEventListener('pointerdown', connectDevice)
on.addEventListener('pointerdown', switchOn)
off.addEventListener('pointerdown', switchOff)

function connectDevice() {
  serial.init()
}

function switchOff() {
  let code = [0x01, 0x00]
  serial.write(code)
}

function switchOn() {
  let code = [0x01, 0xFF]
  serial.write(code)
}