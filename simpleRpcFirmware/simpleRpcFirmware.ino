#include <simpleRPC.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <Adafruit_FreeTouch.h>

StaticJsonDocument<256> boardState;
Adafruit_NeoPixel pixel = Adafruit_NeoPixel(NUM_NEOPIXEL, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
Adafruit_FreeTouch touch = Adafruit_FreeTouch(4, OVERSAMPLE_4, RESISTOR_50K, FREQ_MODE_NONE);


void setColor(uint8_t red, uint8_t green, uint8_t blue, uint8_t alpha) {
  pixel.setPixelColor(NUM_NEOPIXEL - 1, red, green, blue);
  pixel.setBrightness(alpha);
  pixel.show();
}


void updateBoardState() {
  boardState["params"][0] = touch.measure() >> 8;
  serializeJson(boardState, Serial);
  Serial.println();
}


void setup() {
  Serial.begin(9600);
  pixel.begin();
  touch.begin();
  
  boardState["jsonrpc"] = "2.0";
  boardState["method"] = "updateBoardState";
}


void loop() {
  interface(
    Serial,
    setColor, "setColor: Set pixel color. @red: Saturation, 0..255. @green: Saturation, 0..255. @blue: Saturation, 0..255. @alpha: Opacity, 0..255"    
  ); 

  updateBoardState();
  delay(10);
}
