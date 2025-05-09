# IACUBUS

IACUBUS is an mobile app which is based on open source project - ILIAS Pegasus. The app is running on Android or iOS and integrate functions of the ILIAS learning management system. For example viewing courses or personal news.
It's main focus is to make files offline available to read them while offline.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to use the App your ILIAS needs to be configured first. You need 2 Plugins (also Open Source) to make your ILIAS ready for the App:

Follow the instructions here: [https://github.com/DEEP-eAcademy/PegasusHelper](https://github.com/DEEP-eAcademy/PegasusHelper)

The following tools are needed to build and deploy the app.

### Dependencies

This project requires:

-   Node 18.20
-   Java 11
-   Gradle 8.14

#### Xcode:

Install xcode over the apple app store.

#### Android Studio:

Install Android Studio from google.
<https://developer.android.com/studio/index.html>

#### A MapBox (OpenStreetMap) API-Key

Check here:
https://docs.mapbox.com/help/how-mapbox-works/access-tokens/

#### iOS Development

A few additional tools are needed to run the app on an iOS device or emulator.

Install the development cli tools with

```bash
xcode-select --install
```

Install ios-sim which is used to fire up the iOS emulator.

```bash
npm install -g ios-sim
```

Install ios-deploy which is used to deploy apps on a device.

```bash
npm install -g ios-deploy
```

#### Android Development

Install Android Studio from google.
<https://developer.android.com/studio/index.html>

Install the latest Android SDK with the Android Studio Android SDK manager.
Add the root of your Android SDK to the environment variable $ANDROID_HOME.

### Clone the project

Clone the project to your workspace.

```bash
git clone https://github.com/DEEP-eAcademy/IACUBUS.git
cd IACUBUS
```

### Install Dependencies

Change into the cloned project and install all dependencies.
This could take several minutes.

```bash
npm install
```

### Configure your ILIAS Installation

Copy and edit the template of [server.config.json.template](../blob/main/branding/common/config/server.config.json.template) and add the parameters for your ILIAS installation.
Save you configurationfile as `server.config.json` in `branding/common/config`.

Add you Installation id to the `config.json` file in your brand (eg. branding/brands/vanilla/config.json).

### Add you mapbox key to environement

Copy and edit the template of `.env.exmaple` and add your Mapbox key. Add your key and save your environementfile as `.env` in the root directory.

```
MAPBOX_API_KEY="AddYourKeyHere"
PRODUCTION="true"
```

### Install Brand

```bash
npm run setbrand -- --brand="IACUBUS"
```

or

[Choose your brand, following the README.md in the branding folder.](../blob/main/branding/README.md)

### Install Platforms

Install the both platforms.

```bash
npx ionic cordova prepare ios
npx ionic cordova prepare android
```

### Debug Build

The iOS app can be build with the following command.

```bash
npx ionic cordova build ios
```

The Android can be build with the same command.

```bash
npx ionic cordova build android
```

### Run in Simulator/Emulator

The iOS app can be build and run in simulator with the Xcode app.

The Android can be build and run in emulator in Android Studio.

## Run the Tests

### Lint

The linter can be run as shown bellow.

```bash
npm run tslint
```

A lot of old code does not comply with the new code style rules checked by tslint, which
result in a lot of warnings.

### Unit tests

The unit tests can be run with the command shown bellow.

```bash
npm run karma:singlerun
```

If karma should keep running after the tests use the following command.

```bash
npm run karma
```

## Deployment

### iOS

The iOS app can be build with the following command.

```bash
npx ionic cordova build ios --prod --release
```

Open your Xcode Workspace (the YourAppName.xcworkspace in ./platforms/ios) and set **_Certifacates_**, your **_Team ID_**, set the `iOS Deployment Target` to `14.0` (in `CordovaLib->Build Settings`) and Release it to the AppStore.

Check here for information about Certificates: https://developer.apple.com/support/certificates/

And Check the ionic docs: https://ionicframework.com/docs/deployment/app-store

As soon as you have all your profiles create an Archive in `Xcode -> Product -> Archive` and upload it to the Appstore.

### Android

```bash
npx ionic cordova build android --prod --release
```

Change target SDK version in Android Studio settings, right click on `app` and select `Open Module Settings`. Then select `Default Config` tab and edit `Target SDK Version` option to `34`.

Create a key, sign your application and upload it following the ionic guide: https://ionicframework.com/docs/deployment/play-store

### Build With

-   [Cordova](https://cordova.apache.org/) - Is powering the app.
-   [Ionic](https://ionicframework.com/) - To build a responsive UI.
-   [Typescript](https://www.typescriptlang.org/) - Helps maintaining large code bases and catch type issues early.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases on this repository](https://github.com/studer-raimann/ILIAS-Pegasus/releases).

## Authors

The app is based on OpenSource project ILIAS Pegasus by studer + raimann ag, (https://fluxlabs.ch).
Currently the app is maintened by NATO DEEP eAcademy IACUBUS Team.

## License

This project is licensed under the GNU GPLv3 License - see the [LICENSE](LICENSE) file for details.

**_TL;DR_\*** Here's what the license entails:

```markdown
1. Anyone can copy, modify and distribute this software.
2. You have to include the license and copyright notice with each and every distribution.
3. You can use this software privately.
4. You can use this software for commercial purposes.
5. If you dare build your business solely from this code, you risk open-sourcing the whole code base.
6. If you modify it, you have to indicate changes made to the code.
7. Any modifications of this code base MUST be distributed with the same license, GPLv3.
8. This software is provided without warranty.
9. The software author or license can not be held liable for any damages inflicted by the software.
```

## Acknowledgments

We would also like to thank all the authors of the plugins and libraries we used!
Please check the [package.json](package.json) or run the command bellow to see a list of all the plugins and libraries.

```bash
npm la --depth 0
```

## Known errors

Patch _Zip traversal security error_ in file `platforms/android/app/src/main/java/org/apache/cordova/Zip.java:124`:

```java
File f = new File(outputDirectory, compressedName);
String canonicalPath = f.getCanonicalPath();
if (!canonicalPath.startsWith(outputDirectory)) {
    String errorMessage = "Zip traversal security error";
    callbackContext.error(errorMessage);
    Log.e(LOG_TAG, errorMessage);
    return;
}
```
