#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <MD_REncoder.h>
#include <ZeroTC45.h>

#define NUM_NEOPIXEL 1
#define PIN_GND 2
#define PIN_ENCODER_SWITCH 10
#define PIN_ENCODER_A 1
#define PIN_ENCODER_B 3


Adafruit_NeoPixel pixel = Adafruit_NeoPixel(NUM_NEOPIXEL, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
MD_REncoder rotary = MD_REncoder(PIN_ENCODER_A, PIN_ENCODER_B);
static ZeroTC45 timer;

long rotaryPosition = 0;
String rotaryDirection = "none";

void setColor(uint8_t red, uint8_t green, uint8_t blue, uint8_t alpha) {
  pixel.setPixelColor(NUM_NEOPIXEL - 1, red, green, blue);
  pixel.setBrightness(alpha);
  pixel.show();
}

void publishInputStates() {
  StaticJsonDocument<1024> inputStates;

  inputStates["rotary"][0] = rotaryPosition;
  inputStates["rotary"][1] = rotaryDirection;
  inputStates["rotary"][2] = !digitalRead(PIN_ENCODER_SWITCH);

  serializeJson(inputStates, Serial);
  Serial.println();
}


void discardControlCharacters() {
  while (isControl(Serial.peek())) {
    Serial.read();
  }
}


void updateOutputStates() {
  if (Serial.available()) {

    StaticJsonDocument<1024> outputStates;
    DeserializationError error = deserializeJson(outputStates, Serial);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
    } else {
      uint8_t red         = outputStates["pixel"][0];
      uint8_t green       = outputStates["pixel"][1];
      uint8_t blue        = outputStates["pixel"][2];
      uint8_t alpha       = outputStates["pixel"][3];

      setColor(red, green, blue, alpha);
    }

    discardControlCharacters();
  }
}


void serveRotary() {
  const uint8_t direction = rotary.read();
  switch (direction) {
    case DIR_NONE:
      break;
    case DIR_CW:
      rotaryPosition++;
      rotaryDirection = "cw";
      break;
    case DIR_CCW:
      rotaryPosition--;
      rotaryDirection = "ccw";
      break;
  }
}


void setup() {
  pinMode(PIN_GND, OUTPUT);
  digitalWrite(PIN_GND, LOW);

  pinMode(PIN_ENCODER_SWITCH, INPUT_PULLUP);


  Serial.begin(9600);
  Serial.setTimeout(1000);
  pixel.begin();
  rotary.begin();
  timer.begin(ZeroTC45::MILLISECONDS);
    
  timer.setTc5Callback(publishInputStates);
  timer.startTc5(16);
}


void loop() {
  updateOutputStates();
  serveRotary();  
}
