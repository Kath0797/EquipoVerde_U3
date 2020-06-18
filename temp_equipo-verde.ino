#include <OneWire.h>
#include <DallasTemperature.h>

const char* ssid = "GALAXY A7 2017";
const char* password = "123456789";
 
#define DS18B20 D2
 
OneWire oneWireObjeto(DS18B20);
DallasTemperature temperaturaCorporal(&oneWireObjeto);

void setup(){
  Serial.begin(115200);
  temperaturaCorporal.begin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("Dirección IP: ");
  Serial.print(WiFi.localIP());

  temperaturaCorporal.begin();
}

void loop(){
  temperaturaCorporal.requestTemperatures();

  double temp = temperaturaCorporal.getTempCByIndex(0);
  
  if(temp >= 36){
    Serial.println("");
    Serial.print("☀ Temperatura: ");
    Serial.print(temp);
    Serial.println(" °C ☀");
    Serial.println("");
  }
  else{
    Serial.println("");
    Serial.print("☃  Temperatura: ");
    Serial.print(temp);
    Serial.println(" °C  ☃");
    Serial.println("");
  }

  String server = "http://192.168.1.118/api/temperatura-corporal";

  StaticJsonBuffer<300> jsonBuffer;
  JsonObject& JSONencoder = jsonBuffer.createObject();
  JSONencoder["temperatura"] = temp;

  char JSONmessageBuffer[256];
  JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println("JSON:");
  Serial.println(JSONmessageBuffer);
  Serial.println("");
  
  HTTPClient http;
  http.begin(server);
  Serial.println("Ruta API -> " +server);
  http.addHeader("Content-Type", "application/json");

  double httpCode = http.POST(JSONmessageBuffer);
  String payload = http.getString();
  
  Serial.println("");
  Serial.print("Repuesta servidor: ");
  Serial.print("[");
  Serial.print(httpCode);
  Serial.print("]");
  Serial.println("");
  Serial.println("");
  Serial.println("Respuesta MongoDB -> "+payload);

  http.end();
  
  delay(1000); 
}
