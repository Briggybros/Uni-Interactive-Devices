/*

*/
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

SoftwareSerial mySerial(3, 2); // RX, TX

String inputString = "";
DynamicJsonBuffer jsonBuffer(200);

void setup() {
 Serial.begin(9600);
 mySerial.begin(9600);

 Serial.println("Hello world");
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
      Serial.println(name);
    }
  }
}
