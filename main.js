const connectButton = document.getElementById('connectButton');
const redButton = document.getElementById('redButton');
const greenButton = document.getElementById('greenButton');
const blueButton = document.getElementById('blueButton');
const rotaryButton = document.getElementById('rotaryButton');
const rotaryText = document.getElementById('rotaryText');

connectButton.addEventListener('pointerdown', connectDevice)
redButton.addEventListener('pointerdown', switchLedRed)
greenButton.addEventListener('pointerdown', switchLedGreen)
blueButton.addEventListener('pointerdown', switchLedBlue)
rotaryButton.addEventListener('pointerdown', fetchRotaryValue)

let port;
let dataSteam = "";

function connectDevice() {
  if (port) {
    port.disconnect()
    connectButton.value = 'Connect'
    redButton.disabled = true
    greenButton.disabled = true
    blueButton.disabled = true
    rotaryButton.disabled = true
    rotaryText.value = ""
    port = null;
  } else {
    serial.requestPort().then(selectedPort => {
      port = selectedPort;
      connect();
    }).catch(error => {
      console.log(error)
    });
  }
}

function connect() {
  port.connect().then(() => {   
    connectButton.value = 'Disconnect'
    redButton.disabled = false
    greenButton.disabled = false
    blueButton.disabled = false
    rotaryButton.disabled = false

    port.onReceive = data => {
      let textDecoder = new TextDecoder();
      dataSteam = dataSteam + textDecoder.decode(data)

      const [first, ...rest] = dataSteam.split('\n')
      try {
        jsObj = JSON.parse(first)
        dataSteam = rest.join('\n')
      } 
      catch (e) {
      }
      finally {}
    };

    port.onReceiveError = error => {
      console.error(error);
    };
  });
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


function fetchRotaryValue() {  
  rotaryText.value = JSON.stringify(jsObj)

}


function color(red, green, blue, alpha = 255) {
  const keyValues = JSON.stringify({ pixel: [red, green, blue, alpha] })
  port.send(new TextEncoder().encode(keyValues));
}
