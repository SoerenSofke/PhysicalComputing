#include <simpleRPC.h>

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);  
  Serial.begin(0);
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
