#include <simpleRPC.h>
#include <Adafruit_NeoPixel.h>

Adafruit_NeoPixel pixel = Adafruit_NeoPixel(NUM_NEOPIXEL, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);


void setColor(uint8_t red, uint8_t green, uint8_t blue, uint8_t alpha) {
  pixel.setPixelColor(NUM_NEOPIXEL - 1, red, green, blue);
  pixel.setBrightness(alpha);
  pixel.show();
}


void setup() {
  pixel.begin();
  Serial.begin(9600);
}


void loop() {
  interface(
    Serial,
    setColor, "setColor: Set pixel color. @red: Saturation, 0..255. @green: Saturation, 0..255. @blue: Saturation, 0..255. @alpha: Opacity, 0..255");
}