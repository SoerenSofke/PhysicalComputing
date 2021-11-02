// Reference: https://mediumconst/@gerybbg/webusb-by-example-b4358e6a133c

const connectButton = document.getElementById("connectBtn");
const disconnectButton = document.getElementById("disconnectBtn");

let device = { opened: false };
let interfaceNumber;
let endpointOut;
let endpointIn;
let messageStream;
let keyValueRx = "";
let objectRx = "";

function onDisconnect() {
  connectButton.style.display = "initial";
  disconnectButton.style.display = "none";
}

function onConnect() {
  connectButton.style.display = "none";
  disconnectButton.style.display = "initial";
}

disconnectButton.onclick = async () => {
  await device.controlTransferOut({
    requestType: "class",
    recipient: "interface",
    request: 0x22,
    value: 0x00,
    index: interfaceNumber,
  });

  await device.close();
  onDisconnect();
};

connectButton.onclick = async () => {
  device = await navigator.usb.requestDevice({
    filters: [{ vendorId: 0x239a }],
  });

  await device.open();

  const interfaces = device.configuration.interfaces;
  interfaces.forEach((element) => {
    element.alternates.forEach((elementalt) => {
      if (elementalt.interfaceClass == 0xff) {
        interfaceNumber = element.interfaceNumber;
        elementalt.endpoints.forEach((elementendpoint) => {
          if (elementendpoint.direction == "out") {
            endpointOut = elementendpoint.endpointNumber;
          }
          if (elementendpoint.direction == "in") {
            endpointIn = elementendpoint.endpointNumber;
          }
        });
      }
    });
  });

  await device.claimInterface(interfaceNumber);
  await device.selectAlternateInterface(interfaceNumber, 0);

  await device.controlTransferOut({
    requestType: "class",
    recipient: "interface",
    request: 0x22,
    value: 0x01,
    index: interfaceNumber,
  });

  onConnect();
  read();
};

const read = async () => {
  const result = await device.transferIn(endpointIn, 64);

  const decoder = new TextDecoder();
  keyValueRx = keyValueRx + decoder.decode(result.data);

  [first, ...last] = keyValueRx.split("\n");

  try {
    objectRx = JSON.parse(first);
    keyValueRx = last.join("\n");
  } catch (err) {}

  read();
};

const write = async (objectTx) => {
  if (device.opened) {
    dataTx = JSON.stringify(objectTx);
    const dataTxEncoded = new TextEncoder().encode(dataTx);
    await device.transferOut(endpointOut, dataTxEncoded);
  }
};

function setup() {
  createCanvas(400, 400);
  textSize(30);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  fill("white");
}

function draw() {
  background(237, 34, 93, 60);

  translate(width / 2, height / 2);
  textSize(90);
  text("p5*", 0, 0);

  rotate(rotary()*6);
  textSize(30);
  text("Physical Computing . . .", 0, 90);  

  brightness = map(mouseX, 0, 255, 0, 255, true);
  write({ pixel: [255, 0, 0, brightness] });
}

function rotary() {
  position = 0;
  try {   
    position = objectRx.rotary[0]
  } catch (err) {}

  return position
}
