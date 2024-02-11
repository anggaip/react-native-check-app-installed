# React Native Check App Installed Getting Started Guide

Here's how to get started quickly with the React Native Check App Installed.

## 1. Installation
Using yarn:
```
yarn add react-native-check-app-installed
```

Using npm:

```
npm i --save react-native-check-app-installed
```

## 2. Link native dependencies
 React Native version 0.60 and later autolinking will take care of the link
 and for version 0.59 and below you need to run this code:
```
react-native link react-native-check-app-installed
```

## 3. Usage
Check out the example app in the [example](https://github.com/anggaip/react-native-check-app-installed/tree/master/example) folder.

```javascript
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';

// To check by app name:
AppInstalledChecker
    .isAppInstalled('whatsapp')
    .then((isInstalled) => {
        // isInstalled is true if the app is installed or false if not
    });

// To check using URL (works on iOS and Android):
AppInstalledChecker
    .checkURLScheme('whatsapp') // omit the :// suffix
    .then((isInstalled) => {
        // isInstalled is true if the app is installed or false if not
    })

// To check using package name (Android only):
AppInstalledChecker
    .isAppInstalledAndroid('com.whatsapp') 
    .then((isInstalled) => {
        // isInstalled is true if the app is installed or false if not
    });
```
You can retrieve the list of supported app names by calling `AppInstalledChecker.getAppList()` or check in [app-list.ts](https://github.com/redpandatronicsuk/react-native-check-app-install/blob/master/app-list.ts). If your app is not in the list, you will have to find out the URL scheme or package name and use either `isAppInstalledIOS(url)` or `isAppInstalledAndroid(pacakge-name)`.

Android package names can be found on the [Google PlayStore](https://play.google.com/store/search). For example, the URL for the Twitter app is *https://play.google.com/store/apps/details?id=com.twitter.android* the package name is the value of the id query parameter, i.e. **com.twitter.android**.
