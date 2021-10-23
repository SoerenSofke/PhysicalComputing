const connectButton = document.getElementById('connectButton');
const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');
const rotary = document.getElementById('rotary');

connectButton.addEventListener('pointerdown', connectDevice)
red.addEventListener('pointerdown', switchLedRed)
green.addEventListener('pointerdown', switchLedGreen)
blue.addEventListener('pointerdown', switchLedBlue)
rotary.addEventListener('pointerdown', fetchRotaryValue)

let port;
let dataSteam = "";

function connectDevice() {
  if (port) {
    port.disconnect();
    connectButton.value = 'Connect';
    port = null;
  } else {
    serial.requestPort().then(selectedPort => {
      port = selectedPort;
      connect();
    }).catch(error => {
      console.log(error);
    });
  }
}

function connect() {
  port.connect().then(() => {   
    connectButton.value = 'Disconnect';

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
  console.log(JSON.stringify(jsObj))
}


function color(red, green, blue, alpha = 255) {
  const keyValues = JSON.stringify({ pixel: [red, green, blue, alpha] })
  port.send(new TextEncoder().encode(keyValues));
}
