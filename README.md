# Warenkorb-Beispiel

Zwei Services (ohne Datenbank) werden für einen Warenkorb zur Verfügung
gestellt: eines für Versandkosten (`shippingCost`) und eines für
Rabatte (`discount`).

Typisch für eine Microservice-Architektur werden diese beiden Services
in einer Service-Registry angemeldet (`routing`), damit deren URL
frei konfiguriert werden kann, ohne das Programm ändern zu müssen.

Zudem ist der Zugriff auf die Services nur authentisierten Clients
gestattet. Ein Login-Service (`authenticate`) übernimmt diesen Part
und reicht einen Token weiter.


## Aufgaben

Hinweise:
 
* generell lassen wir die Fehler-Behandlungen weg, es sei denn,
  es ist explizit in der Aufgabenstellung gefordert.
* Datenbank ist keine notwendig, obwohl Sie - falls Sie wollen -
  eine Datenbank für die Service-Registry bzw. für die Benutzer_innen
  anlegen können.

### Warenkorb

Der Warenkorb ist eine Liste von Produkten, die aus Name, Menge, Preis pro Stück
und Gewicht pro Stück bestehen.

Beispiel:
```javascript
let warenkorb = [
    { "name": "Schuhe", "Menge": 1, "Preis": 49.90, "Gewicht": 640 },
    { "name": "Rock",   "Menge": 3, "Preis": 29.90, "Gewicht": 1090 },
    { "name": "Mütze",  "Menge": 1, "Preis": 14.90, "Gewicht": 120 },
    { "name": "Strümpfe", "Menge": 2, "Preis": 4.90, "Gewicht": 70 }
];
```

### Basis-Funktionen

* **Versandkosten**:
  * `POST /shippingCost/` ... Berechnet die Versandkosten für den übergebenen Warenkorb.
     Folgende Kosten sollen berechnet werden:
     * Gesamtgewicht <1kg: +1,00€
     * Gesamtgewicht <5kg: +3€
     * Gesamtgewicht >=5kg: +5€
     * zusätzlich je Stück: +0,50€
     * Obiger Warenkorb hat Versandkosten von € 6.50
  * Daten/Parameter:
    * `cart` ... Format wie oben beschrieben
  * Ergebnis:
    * Versandkosten (direkt als Zahl)
    
* **Gesamtsumme inkl. Discount**:
  * `POST /discount/` ... Berechnet die Gesamtsumme und den Discount,
    der sich wie folgt berechnet:
    * das zweite Stück eines Produkts: -10%
    * das dritte und jedes weitere Stück eines Produkts: -15%
  * Daten/Parameter:
    * `cart` ... Format wie oben beschrieben
  * Ergebnis (JSON-Struktur):
    * `total` ... Summe vor Discount (obiger Warenkorb: € 164.30)
    * `discount` ... Berechneter Discount (obiger Warenkorb: € 7.965)
    * `final` ... Summe nachdem Discount abgezogen (obiger Warenkorb € 156.335)

### Authentisieren

Die beiden Services sollen die Berechnung nur noch für authorisierte Nutzer_innen
ermöglichen. Dazu wird ein eigenes Authentisierungsservice erstellt:

* `POST /authenticate/` ... Dient dem Einloggen und retourniert einen Token. Einloggen
  ist erfolgreich, wenn als Passwort "password" angegeben wird (Benutzername egal).
  * Daten/Parameter:
    * `username` ... String
    * `password` ... String
  * Ergebnis (JSON-Struktur):
    * `username` ... Name des/der BenutzerIn
    * `until` ... Zeitstempel zu dem der Token abläuft: `Date.now() + 60000` (= 1 Minute)

* Schreiben Sie zudem eine Funktion welche einen Security-Token auf Gültigkeit prüft.
  Es soll dabei nur überprüft werden, ob der Gültigkeitszeitraum (`until`) noch nicht
  abgelaufen ist.
  Der Einfachheit halber inkludieren Sie diese Funktion in dieselbe Datei und
  exportieren sie aus dem Modul, z.B. so:
  ```javascript
  module.exports = {
      router: router,
      checkAuth: checkAuthentication
  }; 
  ```

* Binden Sie dann die Funktion in den anderen Services ein:
  ```javascript
  const checkAuth = require('./authenticate').checkAuth;
  ``` 
  ... und Sie können die Funktion `checkAuth(token)` verwenden.
  Achtung: in `app.js` nun `require('routes/authenticate').router` verwenden
  
* Bei den Services `POST /shippingCost/` und `POST /discount/` fordern Sie nun
  den zusätzlichen Parameter `token` im Body des Requests, den Sie auswerten. Ist der
  Token noch nicht abgelaufen, dann wie vorher berechnen und antworten, sonst
  einfach HTTP-Statuscode 403 ohne Body mit `response.status(403).end()` retournieren.


### Routing

Nehmen wir nun an, dass unsere beiden Services irgendwo auf Rechnern mit
veränderlicher Adresse liegen. Sie sollen sich deshalb zuerst bei einem
Routing-Service registrieren und Clients in Folge von dem Routing-Service
die korrekte URL des Services abfragen. D.h. unser Routing-Service hat folgende
Endpunkte/Routen:

* `GET /routing/` ... listet alle bekannten Routen auf
* `GET /routing/<serviceName>` ... retourniert die URL für das Service als String
* `POST /routing/` ... legt eine neue Route an;
  Daten/Parameter:
    * `name` ... Name des Services
    * `url` ... URL des Services
    
**Tipps**:

* Sie können entweder eine Datenbank-Tabelle anlegen oder (einfacher)
  die Routen einfach in einem Objekt speichern: das Objekt legen Sie mit
  `let services = {}` an und dann können Sie mit `services[var] = url`
  neue Einträge anlegen bzw. mit `services[var]` auslesen.
* Registrieren Sie Ihre Services gleich zu Beginn des Serverstarts.
  Dazu gibt es die Funktion `init()` in der Datei `init.js` mit einem
  `axios.post()`, bei dem Sie der Einfachheit halber die Antwort ignorieren.

  
### Client

Schreiben Sie einen Client `calculateCart.js`, der für einen vordefinierten
Warenkorb folgende Schritte durchführt:

* Holt sich vom Routing-Service die URL für das Login-Service und loggt sich ein.
* Holt sich vom Routing-Service die URL für das Discount-Service und
  lässt die Gesamtsumme plus Discount für den Warenkorb berechnen.
* Holt sich vom Routing-Service die URL für das Versandkosten-Service und
  lässt die Versandkosten für den Warenkorb berechnen.
  
Beispiel-Ausgabe:
```
Summe: 164.3
Discount: 7.965
Gesamtsumme: 156.335

Versandkosten: 6.5
```
