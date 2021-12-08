/*
Reference: 
* https://mediumconst/@gerybbg/webusb-by-example-b4358e6a133c
* https://css-tricks.com/the-flavors-of-object-oriented-programming-in-javascript/
*/

function createBoard() {
  let device = { opened: false };
  let interfaceNumber;
  let endpointOut;
  let endpointIn;
  let keyValueRx = "";
  let objectRx = "";
  let knobPosition = 0
  let knobDirection = 0
  let knobIsPressed = 0

  const open = async () => {
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

    read();
  }

  const close = async () => {
    await device.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x00,
      index: interfaceNumber,
    });

    await device.close();
  }

  const read = async () => {
    const result = await device.transferIn(endpointIn, 64);

    const decoder = new TextDecoder();
    keyValueRx = keyValueRx + decoder.decode(result.data);

    [first, ...last] = keyValueRx.split("\n");

    try {
      objectRx = JSON.parse(first);
      keyValueRx = last.join("\n");
    } catch (err) { }

    serveRotary();
    read();
  };

  const write = async (objectTx) => {
    if (device.opened) {
      dataTx = JSON.stringify(objectTx);
      const dataTxEncoded = new TextEncoder().encode(dataTx);
      await device.transferOut(endpointOut, dataTxEncoded);
    }
  };

  const serveRotary = () => {
    knobPosition = 0;
    try {
      knobPosition = objectRx.rotary[0]
      knobDirection = objectRx.rotary[1]
      knobIsPressed = objectRx.rotary[2]
    } catch (err) { }
  }

  const toggleConnect = () => {
    if (device.opened)
      close()
    else
      open()
  }

  const brick = {
    toggleConnect: function () { toggleConnect() },
    connect: function () { open() },
    disconnect: function () { close() },
    get isConnected() { return device.opened },
    get knobPosition() { return knobPosition },
    get knobDirection() { return knobDirection },
    get knobIsPressed() { return knobIsPressed },
    led: function (red = 0, green = 0, blue = 0, brightness = 255) { write({ pixel: [red, green, blue, brightness] }) },
    servoA: function (shaftValue = 0.5) { write({ servoA: map(shaftValue, 0, 1, 0, 180, true) }) },
    servoB: function (shaftValue = 0.5) { write({ servoB: map(shaftValue, 0, 1, 0, 180, true) }) },
  };

  return brick
}