/*

*/
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <SD.h>

#define TFT_DC 9
#define TFT_CS 10
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);

#define SD_CS 4

#define ID "BETA" //Change per duino
#define BAUDRATE 9600 //^^

int bg_colr = 254;
int bg_colg = 130;
int bg_colb = 140;
int txt_colr = 255;
int txt_colg = 240;
int txt_colb = 168;

char *fname = "1";
char *fname2 = "1";

String inputString = "";
DynamicJsonBuffer jsonBuffer(100);

// These read 16- and 32-bit types from the SD card file.
// BMP data is stored little-endian, Arduino is little-endian too.
// May need to reverse subscript order if porting elsewhere.

uint16_t read16(File &f) {
  uint16_t result;
  ((uint8_t *)&result)[0] = f.read(); // LSB
  ((uint8_t *)&result)[1] = f.read(); // MSB
  return result;
}

uint32_t read32(File &f) {
  uint32_t result;
  ((uint8_t *)&result)[0] = f.read(); // LSB
  ((uint8_t *)&result)[1] = f.read();
  ((uint8_t *)&result)[2] = f.read();
  ((uint8_t *)&result)[3] = f.read(); // MSB
  return result;
}

//void printDirectory(File dir, int numTabs) {
//  while (true) {
//
//    File entry =  dir.openNextFile();
//    if (! entry) {
//      // no more files
//      break;
//    }
//    for (uint8_t i = 0; i < numTabs; i++) {
//      Serial.print('\t');
//    }
//    Serial.print(entry.name());
//    if (entry.isDirectory()) {
//      Serial.println("/");
//      printDirectory(entry, numTabs + 1);
//    } else {
//      // files have sizes, directories do not
//      Serial.print("\t\t");
//      Serial.println(entry.size(), DEC);
//    }
//    entry.close();
//  }
//}

void clearScreen() {
  bool sd = false;
  while(!sd){
    tft.begin();
    yield();
    if (!SD.begin(SD_CS)) {
    } else {
      sd = true;
    }
  }
  
  tft.setRotation(3);
//  printDirectory(SD.open('/'),1);
  tft.fillScreen(tft.color565(bg_colr,bg_colg,bg_colb));
  //bg 1 - 3
  char holding[20];
  strcpy(holding, "bg/bg");
  strcat(holding,fname);
  strcat(holding,".bmp");
  char *filename = holding;
  char holding2[20];
  strcpy(holding2, "be/");
  strcat(holding2,fname2);
  strcat(holding2,".bmp");
  //emojis 0 - 195, css, su, cogs, johns
  char *file2 = holding2;
  bmpDraw(filename, (tft.height() / 2) + (-1 * 120), (tft.width()  / 2) + (-1 * 160));
  bmpDraw(file2, (tft.height()/2) + (-1 * 50), (tft.width() / 2)+ (-1 * 130)); 
}

void textToCol(const char* text, int &a, int &b, int &c){
  //int col[3];
  if (strcmp(text,"PINK") == 0){
     a = 254;
     b = 130;
     c = 140;
  }else{
    if (strcmp(text,"GREEN") == 0){
      a = 193;
      b = 255;
      c = 223;
    }else{
      if(strcmp(text,"BLUE") == 0){
         a = 214;
         b = 228;
         c = 255;
      }else{
        if(strcmp(text,"YELLOW") == 0){
          a = 255;
          b = 251;
          c = 219;
        }else{
          a = 255;
          b = 255;
          c = 255;
        }
      }
    }
  }
  //return col;

}

void drawText(const char *text, int y, int fontsize, bool hack = false) {
  int x = (tft.width() / 2) - strlen(text)*3* fontsize;
  tft.setCursor(x , y);
  if (hack){
    tft.setTextColor(tft.color565(0,255,0));
  }else{
    tft.setTextColor(tft.color565(txt_colr,txt_colg,txt_colb));  
  }
  
  tft.setTextSize(fontsize);
  //tft.println(text);
  while(*text){
    tft.write(*text++);
  }
}


// This function opens a Windows Bitmap (BMP) file and
// displays it at the given coordinates.  It's sped up
// by reading many pixels worth of data at a time
// (rather than pixel by pixel).  Increasing the buffer
// size takes more of the Arduino's precious RAM but
// makes loading a little faster.  20 pixels seems a
// good balance.

#define BUFFPIXEL 20

void bmpDraw(const char *filename, int16_t x, int16_t y) {

  File     bmpFile;
  int      bmpWidth, bmpHeight;   // W+H in pixels
  uint8_t  bmpDepth;              // Bit depth (currently must be 24)
  uint32_t bmpImageoffset;        // Start of image data in file
  uint32_t rowSize;               // Not always = bmpWidth; may have padding
  uint8_t  sdbuffer[3*BUFFPIXEL]; // pixel buffer (R+G+B per pixel)
  uint8_t  buffidx = sizeof(sdbuffer); // Current position in sdbuffer
  boolean  goodBmp = false;       // Set to true on valid header parse
  boolean  flip    = true;        // BMP is stored bottom-to-top
  int      w, h, row, col, x2, y2, bx1, by1;
  uint8_t  r, g, b;
  uint32_t pos = 0, startTime = millis();

  if((x >= tft.width()) || (y >= tft.height())) return;

  // Open requested file on SD card
  if ((bmpFile = SD.open(filename)) == NULL) {
    return;
  }

  // Parse BMP header
  if(read16(bmpFile) == 0x4D42) { // BMP signature
    (void)read32(bmpFile); // Read & ignore creator bytes
    bmpImageoffset = read32(bmpFile); // Start of image data
    // Read DIB header
    bmpWidth  = read32(bmpFile);
    bmpHeight = read32(bmpFile);
    if(read16(bmpFile) == 1) { // # planes -- must be '1'
      bmpDepth = read16(bmpFile); // bits per pixel
      if((bmpDepth == 24) && (read32(bmpFile) == 0)) { // 0 = uncompressed

        goodBmp = true; // Supported BMP format -- proceed!

        // BMP rows are padded (if needed) to 4-byte boundary
        rowSize = (bmpWidth * 3 + 3) & ~3;

        // If bmpHeight is negative, image is in top-down order.
        // This is not canon but has been observed in the wild.
        if(bmpHeight < 0) {
          bmpHeight = -bmpHeight;
          flip      = false;
        }

        // Crop area to be loaded
        x2 = x + bmpWidth  - 1; // Lower-right corner
        y2 = y + bmpHeight - 1;
        if((x2 >= 0) && (y2 >= 0)) { // On screen?
          w = bmpWidth; // Width/height of section to load/display
          h = bmpHeight;
          bx1 = by1 = 0; // UL coordinate in BMP file
          if(x < 0) { // Clip left
            bx1 = -x;
            x   = 0;
            w   = x2 + 1;
          }
          if(y < 0) { // Clip top
            by1 = -y;
            y   = 0;
            h   = y2 + 1;
          }
          if(x2 >= tft.width())  w = tft.width()  - x; // Clip right
          if(y2 >= tft.height()) h = tft.height() - y; // Clip bottom
  
          // Set TFT address window to clipped image bounds
          tft.startWrite(); // Requires start/end transaction now
          tft.setAddrWindow(x, y, w, h);
  
          for (row=0; row<h; row++) { // For each scanline...
  
            // Seek to start of scan line.  It might seem labor-
            // intensive to be doing this on every line, but this
            // method covers a lot of gritty details like cropping
            // and scanline padding.  Also, the seek only takes
            // place if the file position actually needs to change
            // (avoids a lot of cluster math in SD library).
            if(flip) // Bitmap is stored bottom-to-top order (normal BMP)
              pos = bmpImageoffset + (bmpHeight - 1 - (row + by1)) * rowSize;
            else     // Bitmap is stored top-to-bottom
              pos = bmpImageoffset + (row + by1) * rowSize;
            pos += bx1 * 3; // Factor in starting column (bx1)
            if(bmpFile.position() != pos) { // Need seek?
              tft.endWrite(); // End TFT transaction
              bmpFile.seek(pos);
              buffidx = sizeof(sdbuffer); // Force buffer reload
              tft.startWrite(); // Start new TFT transaction
            }
            for (col=0; col<w; col++) { // For each pixel...
              // Time to read more pixel data?
              if (buffidx >= sizeof(sdbuffer)) { // Indeed
                tft.endWrite(); // End TFT transaction
                bmpFile.read(sdbuffer, sizeof(sdbuffer));
                buffidx = 0; // Set index to beginning
                tft.startWrite(); // Start new TFT transaction
              }
              // Convert pixel from BMP to TFT format, push to display
              b = sdbuffer[buffidx++];
              g = sdbuffer[buffidx++];
              r = sdbuffer[buffidx++];
              //Serial.print(b);
              //Serial.print(g);
              //Serial.print(r);
              //Serial.println();
              if ((b == 254) && (g == 255) && (r == 196)){
                tft.writePixel(tft.color565(bg_colr,bg_colg,bg_colb));
              }else{
                tft.writePixel(tft.color565(r,g,b));
              }
            } // end pixel
          } // end scanline
          tft.endWrite(); // End last TFT transaction
        } // end onscreen
      } // end goodBmp
    }
  }

  bmpFile.close();
}
void setup() {
  Serial.begin(BAUDRATE);

  bool sd = false;
  while(!sd){
    tft.begin();
    yield();
    if (!SD.begin(SD_CS)) {
    } else {
      sd = true;
    }
  }
  tft.setRotation(3);
  tft.fillScreen(tft.color565(0,0,0));
  //clearScreen();
  drawText(ID, tft.height() / 2, 3,true);
  drawText("Badge ID", tft.height() / 2 + 28, 2, true);
}

const char *name;
const char *deets;
const char *txtCol;
const char *bgCol;
const char *emj;
const char *border;

void loop() {
  if (Serial.available()) {
    inputString = Serial.readString(); //read the input
    JsonObject& root = jsonBuffer.parseObject(inputString);

    
    if (root.success()) {
      name = root["name"];
      deets = root["deets"];
      txtCol = root["textColor"];
      bgCol = root["backgroundColor"];
      emj = root["emoji"];
      border = root["border"];
   
      fname = border;
      fname2 = emj;
      textToCol(bgCol,bg_colr, bg_colg, bg_colb);
      textToCol(txtCol,txt_colr, txt_colg, txt_colb);
      clearScreen();
      drawText(name, tft.height() / 2, 3);
      drawText(deets, tft.height() / 2 + 28, 2);
      
      jsonBuffer.clear();
    }
  }
}
