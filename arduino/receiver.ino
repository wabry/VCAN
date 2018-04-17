// Open a serial connection and flash LED when input is received

void setup(){
  // Open serial connection.
  Serial.begin(9600);
  pinMode(6, OUTPUT);
  Serial.write('1'); 
}

void loop(){ 
  if(Serial.available() == 0){      // if data present, blink
    Serial.write('0');
  } else if(Serial.available() == 1){      // if data present, blink
    Serial.write('1');
  }
} 

