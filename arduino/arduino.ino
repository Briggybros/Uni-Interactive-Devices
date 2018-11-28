/*

*/
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

#define TFT_CS 10
#define TFT_DC 9
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);

#define FRAME_X 210
#define FRAME_Y 180
#define FRAME_W 100
#define FRAME_H 50

SoftwareSerial mySerial(3, 2); // RX, TX

String inputString = "";
DynamicJsonBuffer jsonBuffer(200);

void clearScreen() {
  tft.fillScreen(ILI9341_BLACK);
}

void drawText(String text) {
  tft.setCursor(0 , tft.height() / 2);
  tft.setTextColor(ILI9341_GREEN);
  tft.setTextSize(3);
  tft.println(text);
}

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);
  tft.begin();
  
  Serial.println("Hello world");
  
  clearScreen();
  // origin = left,top landscape (USB left upper)
  tft.setRotation(1);
  drawText("Henlo Lizer");
}

void loop() {
  if (mySerial.available()) {
    inputString = mySerial.readString(); //read the input
    Serial.println(inputString);
    JsonObject& root = jsonBuffer.parseObject(inputString);

    if (!root.success()) {
      Serial.println("Parsing failed :(");
    } else {
      const String name = root["name"];
      clearScreen();
      drawText(name);
    }
  }
}
