# 🌈 Physical Computing 🦄

JavaScript ❤️ Embedded Devices

## Example
### Prerequisite

1. Upload the code below to your favorite Arduino board.
```C
#include <simpleRPC.h>

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);  
  Serial.begin(9600);
}

void setLed(byte brightness) {
  analogWrite(LED_BUILTIN, brightness);
}

int inc(int a) {
  return a + 1;
}

void loop(void) { 
  interface(
    Serial,
    inc, "inc: Increment a value. @a: Value. @return: a + 1.",
    setLed, "set_led: Set LED brightness. @brightness: Brightness.");
}
```
2. Connect this Arduino board to your PC or Smartphone via USB.
3. Enable the experimental web platform features of your web browser in use, e.g.
   * `chrome://flags/#enable-experimental-web-platform-features`
   * `opera://flags/#enable-experimental-web-platform-features`
   * `edge://flags/#enable-experimental-web-platform-features`

3. Click or scan the QR code to open the webpage of this repository in your browser.

[![QR Code](http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=https%3A%2F%2Fsoerensofke.github.io%2FPhysicalComputing%2F&qzone=1&margin=0&size=150x150&ecc=L)](https://soerensofke.github.io/PhysicalComputing/)

4. Connect to your Arduino board by selecting the corresponding COM port.
5. Toggle the build-in LED of your Arduino board.
6. Quit the serial connection by closing the corresponding web browser tab.
