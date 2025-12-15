*(English version first. Dansk hjælp/tekst findes lige efter den engelske tekst.)*

---

# PID Mester 🎛️

**PID Mester** is a modern web application and Android app made for CTS and BMS technicians. It helps you calculate and simulate PID controller settings based on simple **open-loop step tests**.

The app is built with **React**, **Tailwind CSS**, and **Google Gemini AI**, and is optimized to be compiled as a native Android app using **Capacitor**.

## ✨ Features

* **PID Calculation:** Calculates P, I, and D values (Kp, Ti, Td) based on process gain, time constant, and dead time.
* **Multiple Methods:** Supports Cohen–Coon, Ziegler–Nichols, and Lambda (IMC) tuning.
* **Visual Simulation:** Graphically shows how the control loop is expected to respond (step response) before you enter the values into the system.
* **CTS/BMS Guide:** Built-in help for technicians working in systems where the controller cannot be turned off (Forced control / Override method).
* **AI Expert:** Integrated Google Gemini AI that analyzes your parameters and provides specific stability advice.
* **Mobile-First:** Designed specifically to feel like a native app on a phone.

## 🛠️ Tech Stack

* **Frontend:** React (TypeScript)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **AI:** Google Gemini API (`@google/genai`)
* **Icons:** Lucide React
* **Mobile Build:** Capacitor (Android .apk)

## 🚀 Installation & Getting Started

To run the project locally on your computer:

1. **Clone the project:**

   ```bash
   git clone https://github.com/dit-brugernavn/pid-mester.git
   cd pid-mester
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up API Key (Optional for AI):**
   Create a file named `.env` in the project root and add your Google Gemini API key:

   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

   *(Without this key, PID calculation still works, but AI guidance will be disabled.)*

4. **Start the development server:**

   ```bash
   npm start
   ```

## 📱 Build for Android

This project is prepared for **Capacitor**, which makes it possible to turn it into a real Android app.

**Prerequisites:**

* You must have [Android Studio](https://developer.android.com/studio) installed.

**Steps:**

1. **Install Capacitor (if not already installed):**

   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Initialize Capacitor (first time only):**

   ```bash
   npx cap init "PID Mester" com.pidmester.app
   ```

3. **Build the React project:**

   ```bash
   npm run build
   ```

4. **Add the Android platform:**

   ```bash
   npx cap add android
   ```

5. **Open in Android Studio:**

   ```bash
   npx cap open android
   ```

   When Android Studio opens, wait for “Gradle Sync” to finish. Then you can connect your phone via USB and press the **Play** button (▶) to install the app directly on your device, or choose `Build > Build Bundle(s) / APK(s) > Build APK` to generate a shareable APK.

## 📐 How to use the app (Step Test)

The app requires 3 inputs to calculate the PID values. You obtain these from a step test on the system:

1. **Set the system to MANUAL / FORCED:** Lock the valve/damper at e.g. 40%.
2. **Wait for stability:** The temperature/pressure must be steady.
3. **Make a step:** Quickly change the output to e.g. 50% (a 10% step).
4. **Measure the result:**

   * **Kp (Gain):** How much did PV change divided by the output change? *(Example: Temp increases 5°C with a 10% valve step → Kp = 0.5)*
   * **Dead time (θ):** Time from the output change until the curve *starts* moving.
   * **Time constant (τ):** Time it took the curve to reach 63% of its new final value (minus dead time).

Enter these three values in the app and press **“Calculate PID”**.

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

# PID Mester 🎛️ (Dansk)

**PID Mester** er en moderne web-applikation og Android-app designet til CTS- og BMS-teknikere. Den hjælper med at beregne og simulere PID-regulatorindstillinger baseret på simple "Open Loop" step-forsøg.

Appen er bygget med **React**, **Tailwind CSS** og **Google Gemini AI**, og er optimeret til at blive kompileret som en native Android app via **Capacitor**.

## ✨ Funktioner

* **Beregning af PID:** Finder P, I og D værdier (Kp, Ti, Td) baseret på procesforstærkning, tidskonstant og dødtid.
* **Flere Metoder:** Understøtter Cohen-Coon, Ziegler-Nichols og Lambda (IMC) tuning.
* **Visuel Simulering:** Viser grafisk, hvordan reguleringen forventes at reagere (Step Response) før du indtaster tallene i anlægget.
* **CTS/BMS Guide:** Indbygget hjælp til teknikere, der arbejder på systemer, hvor regulatoren ikke kan slukkes (Tvangsstyring/Override metoden).
* **AI Ekspert:** Integreret Google Gemini AI, der analyserer dine parametre og giver specifikke råd til stabilitet.
* **Mobil-First:** Designet specifikt til at føles som en native app på telefonen.

## 🛠️ Teknologistak

* **Frontend:** React (TypeScript)
* **Styling:** Tailwind CSS
* **Grafer:** Recharts
* **AI:** Google Gemini API (`@google/genai`)
* **Ikoner:** Lucide React
* **Mobil Build:** Capacitor (for Android .apk)

## 🚀 Installation & Opstart

For at køre projektet lokalt på din computer:

1. **Klon projektet:**

   ```bash
   git clone https://github.com/dit-brugernavn/pid-mester.git
   cd pid-mester
   ```

2. **Installer afhængigheder:**

   ```bash
   npm install
   ```

3. **Opsæt API Nøgle (Valgfrit for AI):**
   Opret en fil kaldet `.env` i roden af projektet og indsæt din Google Gemini API nøgle:

   ```env
   API_KEY=din_google_gemini_api_key_her
   ```

   *(Uden denne nøgle virker PID-beregningen stadig, men AI-rådgivningen vil være deaktiveret).*

4. **Start udviklingsserver:**

   ```bash
   npm start
   ```

## 📱 Byg til Android

Dette projekt er forberedt til **Capacitor**, som gør det muligt at lave det om til en rigtig Android app.

**Forudsætninger:**

* Du skal have [Android Studio](https://developer.android.com/studio) installeret.

**Trin:**

1. **Installer Capacitor (hvis ikke allerede installeret):**

   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Initialiser Capacitor (kun første gang):**

   ```bash
   npx cap init "PID Mester" com.pidmester.app
   ```

3. **Byg React-projektet:**

   ```bash
   npm run build
   ```

4. **Tilføj Android platformen:**

   ```bash
   npx cap add android
   ```

5. **Åbn i Android Studio:**

   ```bash
   npx cap open android
   ```

   Når Android Studio åbner, skal du vente på "Gradle Sync" er færdig. Derefter kan du tilslutte din telefon via USB og trykke på **Play**-knappen (▶) for at installere appen direkte på din enhed, eller vælge `Build > Build Bundle(s) / APK(s) > Build APK` for at få en fil, du kan dele.

## 📐 Sådan bruges appen (Step-forsøg)

Appen kræver 3 input for at beregne PID-tallene. Disse findes ved et "Step-forsøg" på anlægget:

1. **Sæt anlægget i MANUEL / TVANG:** Lås ventilen/spjældet på f.eks. 40%.
2. **Vent på stabilitet:** Temperaturen/trykket skal være helt rolig.
3. **Lav et step:** Ændr outputtet hurtigt til f.eks. 50% (et step på 10%).
4. **Mål resultatet:**

   * **Kp (Gain):** Hvor meget ændrede PV sig divideret med ændringen i Output? *(Eks: Temp steg 5 grader ved 10% ventilåbning -> Kp = 0.5)*
   * **Dødtid (θ):** Tiden fra du ændrede outputtet, til kurven *begyndte* at flytte sig.
   * **Tidskonstant (τ):** Tiden det tog for kurven at nå 63% af sin nye slutværdi (minus dødtiden).

Indtast disse tre tal i appen, og tryk **"Beregn PID"**.

## 📄 Licens

Dette projekt er licenseret under MIT License - se LICENSE filen for detaljer.
