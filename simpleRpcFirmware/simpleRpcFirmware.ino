#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <RotaryEncoder.h>


#define NUM_NEOPIXEL 1
#define PIN_GND 2
#define PIN_ENCODER_SWITCH 10
#define PIN_ENCODER_A 1
#define PIN_ENCODER_B 3


Adafruit_NeoPixel pixel = Adafruit_NeoPixel(NUM_NEOPIXEL, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
RotaryEncoder encoder(PIN_ENCODER_A, PIN_ENCODER_B, RotaryEncoder::LatchMode::FOUR0);


void setColor(uint8_t red, uint8_t green, uint8_t blue, uint8_t alpha) {
  pixel.setPixelColor(NUM_NEOPIXEL - 1, red, green, blue);
  pixel.setBrightness(alpha);
  pixel.show();
}

void publishInputStates() {
  StaticJsonDocument<1024> inputStates;

  static int lastDirection = 0;
  const int currentDirection = (int)encoder.getDirection();
  if (currentDirection != 0) lastDirection = currentDirection;

  switch (lastDirection) {
    case -1:
      inputStates["rotary"][1] = "ccw";
      break;
    case 1:
      inputStates["rotary"][1] = "cw";
      break;
  }

  inputStates["rotary"][0] = encoder.getPosition();
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


bool isPeriodPassed(const long period_ms) {
  static unsigned long previousMillis = 0;
  const unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= period_ms) {
    previousMillis = currentMillis;
    return true;
  } else {
    return false;
  }
}


void checkPosition() {
  encoder.tick();
}


void setup() {
  pinMode(PIN_GND, OUTPUT);
  digitalWrite(PIN_GND, LOW);

  pinMode(PIN_ENCODER_SWITCH, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_A), checkPosition, CHANGE);
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_B), checkPosition, CHANGE);


  Serial.begin(9600);
  Serial.setTimeout(1000);
  pixel.begin();
}


void loop() {
  updateOutputStates();
  if (isPeriodPassed(16)) publishInputStates();
}
