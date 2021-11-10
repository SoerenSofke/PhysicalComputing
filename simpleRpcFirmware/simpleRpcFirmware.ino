#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <MD_REncoder.h>
#include <Every.h>
#include <Debounce.h>
#include <Servo.h>
#include <Adafruit_TinyUSB.h>


#define NUM_NEOPIXEL 1
#define PIN_GND 2
#define PIN_ENCODER_SWITCH 10
#define PIN_ENCODER_A 1
#define PIN_ENCODER_B 3
#define PIN_SERVO_PWM_A 9
#define PIN_SERVO_PWM_B 8


Adafruit_USBD_WebUSB usb_web;
WEBUSB_URL_DEF(landingPage, 1 /*https*/, "soerensofke.github.io/PhysicalComputing/");


Debounce button = Debounce(PIN_ENCODER_SWITCH);
Adafruit_NeoPixel pixel = Adafruit_NeoPixel(NUM_NEOPIXEL, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
MD_REncoder rotary = MD_REncoder(PIN_ENCODER_A, PIN_ENCODER_B);
Every tPublish(16);
Servo servoA;
Servo servoB;


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
  inputStates["rotary"][2] = button.read() == 1;

  serializeJson(inputStates, usb_web);
  usb_web.write(10);
}


void updateOutputStates() {  
  if (usb_web.available()) {
    StaticJsonDocument<1024> outputStates;
    DeserializationError error = deserializeJson(outputStates, usb_web);

    if (!error) {
      if (outputStates.containsKey("pixel")) {
        uint8_t red   = outputStates["pixel"][0];
        uint8_t green = outputStates["pixel"][1];
        uint8_t blue  = outputStates["pixel"][2];
        uint8_t alpha = outputStates["pixel"][3];
        setColor(red, green, blue, alpha);
      }

      if (outputStates.containsKey("servoA")) {
        uint8_t position = outputStates["servoA"];
        servoA.write(position);
      }

      if (outputStates.containsKey("servoB")) {
        uint8_t position = outputStates["servoB"];
        servoB.write(position);
      }
    }
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

  pixel.begin();
  pixel.setBrightness(255);
  pixel.setPixelColor(NUM_NEOPIXEL - 1, 255, 255, 255);
  pixel.show();

  rotary.begin();
  servoA.attach(PIN_SERVO_PWM_A);
  servoB.attach(PIN_SERVO_PWM_B);

  usb_web.setLandingPage(&landingPage);
  usb_web.setLineStateCallback(line_state_callback);
  usb_web.begin();

  while ( !TinyUSBDevice.mounted() ) delay(1);
}


void loop() {
  updateOutputStates();
  serveRotary();

  if (tPublish()) {
    publishInputStates();
  }
}

void line_state_callback(bool connected)
{
  pixel.setBrightness(255);

  if (connected) {
    pixel.setPixelColor(NUM_NEOPIXEL - 1, 0, 0, 0);
  } else {
    pixel.setPixelColor(NUM_NEOPIXEL - 1, 255, 255, 255);
  }
  pixel.show();
}
