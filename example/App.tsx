import React, {Component} from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
  FlatList,
  Animated
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { AppInstalledChecker } from 'react-native-check-app-installed'
import * as Animatable from 'react-native-animatable'
import ScrollView = Animated.ScrollView

type State = {
  initialised: boolean,
  appListURL: object[],
  appListPKG: object[],
  appList: object[],
  showPkgList: boolean
}
/**
 * NOTES
 * =====
 *
 * Android package names can be found by searching for the app on the PlayStore (https://play.google.com/store/search),
 * then when you look for an app, the package name will be id query parameter in the URL,
 * e.g. for Facebook, the PLayStore URL is: https://play.google.com/store/apps/details?id=com.facebook.katana
 * and from the URL you can see that the package name is `com.facebook.katana`
 */

const colorBrand = {
  "whatsapp": "128c7e",
  "facebook": "3b5998",
  "facebook messenger": "3b5998",
  "skype": "00aff0",
  "wechat": "7bb32e",
  "snapchat": "fffc00",
  "twitter": "1da1f2",
  "youtube": "cd201f",
  "netflix": "e50914",
  "instagram": "405de6",
  "spotify": "2ebd59",
  "slack": "6ecadc",
  "pinterest": "bd081c",
  "uber": "09091a",
  "amazon": "ff9900",
  "soundcloud": "ff8800",
  "google maps": "4285f4",
  "chrome": "ea4335",
  "gmail": "dd4b39",
  "google drive": "34a853",
  "dropbox": "007ee5",
  "google hangouts": "dd4b39",
  "evernote": "2dbe60",
  "vlc": "000",
  "tumblr": "35465c",
  "flickr": "0063dc",
  "linkedin": "3b5998",
  "google": "4285f4"
}

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = {
      initialised: false,
      appListURL: [],
      appListPKG: [],
      appList: [],
      showPkgList: false
    }
  }

  componentDidMount(): void {
    this.check()
    this.checkURLs()
    this.checkPKGs()
  }

  check(): void {
    let appCheckResults: object[] = []
    let checkCounter: number = 0

    AppInstalledChecker.getAppList()
      .forEach((appName: string, index: number): void => {
        let packageName = appName

        if (Platform.OS === 'android') {
          packageName = AppInstalledChecker.convertAppNameToPackageName(appName)
        }

        checkCounter++

        AppInstalledChecker
          .isAppInstalled(packageName)
          .then((isInstalled: boolean) => {
            checkCounter--
            appCheckResults.push({name: appName, isInstalled: isInstalled, index: index})
            if (checkCounter === 0) {
              this.renderList(appCheckResults)
            }
          })
      })
  }

  renderList(appCheckResults: object[]): void {
    this.setState(Object.assign(this.state, {
      initialised: true,
      appList: appCheckResults
    }))
  }

  checkURLs(): void {
    let appCheckResultsURL: object[] = []
    let checkCounterURL: number = 0

    AppInstalledChecker.getAppList()
      .forEach((appName: string, index: number) => {
        checkCounterURL++
        AppInstalledChecker
          .isAppInstalledIOS(appName)
          .then((isInstalled: boolean) => {
            checkCounterURL--
            appCheckResultsURL.push({name: appName, isInstalled: isInstalled, index: index})
            if (checkCounterURL === 0) {
              this.renderListURL(appCheckResultsURL)
            }
          })
          .catch((err: any) => {
            checkCounterURL--
            appCheckResultsURL.push({name: appName, isInstalled: false, index: index})
            if (checkCounterURL === 0) {
              this.renderListURL(appCheckResultsURL)
            }
          })
      })
  }

  renderListURL(appCheckResults: object[]): void {
    this.setState(Object.assign(this.state, {
      initialised: true,
      appListURL: appCheckResults
    }))
  }

  checkPKGs(): void {
    if (Platform.OS === 'ios') {
      return
    }

    let appCheckResultsPKG: object[] = []
    let checkCounterPKG: number = 0

    AppInstalledChecker.getAppList()
      .forEach((appName: string, index: number) => {
        let packageName = appName

        if (Platform.OS === 'android') {
          packageName = AppInstalledChecker.convertAppNameToPackageName(appName)
        }

        checkCounterPKG++

        AppInstalledChecker
          .isAppInstalledAndroid(packageName)
          .then((isInstalled: boolean): void => {
            checkCounterPKG--
            appCheckResultsPKG.push({name: appName, isInstalled: isInstalled, index: index})
            if (checkCounterPKG === 0) {
              this.renderListPKG(appCheckResultsPKG)
            }
          })
      })
  }

  renderListPKG(appCheckResults: object[]): void {
    this.setState(Object.assign(this.state, {
      initialised: true,
      appListPKG: appCheckResults,
      showPkgList: true
    }))
  }

  _appname2icon(app: string) {
    switch (app) {
      case 'facebook':
        return 'facebook-official'
      case 'facebook messenger':
        return 'facebook'
      case 'google maps':
        return 'map-marker'
      case 'gmail':
        return 'envelope-open'
      case 'google drive':
        return 'database'
      case 'google hangouts':
        return 'phone'
      case 'netflix':
      case 'uber':
      case 'evernote':
      case 'vlc':
        return 'circle'
      default:
        return app
    }
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
        <View style={styles.pageContainer}>
          <Text style={styles.pageHeading}>React Native App Install Cheker</Text>
          {this.state.initialised && this.state.showPkgList
            ?
            <View style={styles.listContainer}>
              <Text style={styles.listHeading}>PKG List <Icon name="android" size={40}/>:</Text>
              <Text style={styles.listSubheading}>Using package name, e.g. 'com.twitter.android' to check if the app is installed (Android only):</Text>
              <FlatList
                data={this.state.appListPKG}
                renderItem={({item}) => this._renderRow(item)}
                keyExtractor={item => item.index}
                showsVerticalScrollIndicator={false}
              />
            </View>
            : null}
          {this.state.initialised
            ? <View style={styles.listContainer}>
              <Text style={styles.listHeading}>URL List <Icon name="apple" size={40}/>:</Text>
              <Text style={styles.listSubheading}>Using URL scheme, e.g. 'twitter://' to check if the app is installed (works on iOS and Android):</Text>
              <FlatList
                data={this.state.appListURL}
                renderItem={({item}) => this._renderRow(item)}
                keyExtractor={item => item.index}
                showsVerticalScrollIndicator={false}
              />
            </View>
            : <ActivityIndicator/>}
          {this.state.initialised
            ? <View style={styles.listContainer}>
              <Text style={styles.listHeading}>List <Icon name="android" size={40}/> <Icon name="apple" size={40}/>:</Text>
              <Text style={styles.listSubheading}>Generic function call which will use package name strategy on Android and URL scheme in iOS.</Text>
              <FlatList
                data={this.state.appList}
                renderItem={({item}) => this._renderRow(item)}
                keyExtractor={item => item.index}
                showsVerticalScrollIndicator={false}
              />
            </View>
            : <ActivityIndicator/>}
        </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  _renderRow = (app: {index: number, name: string, isInstalled: boolean}) => {
    return (
      <Animatable.View animation="zoomInUp" style={styles.row} delay={app.index * 25}>
        <Icon size={30} name={this._appname2icon(app.name)} color={'#' + colorBrand[app.name]}/>
        <Text style={[ styles.appName, {color: app.isInstalled ? 'green' : 'red'}]}>
          {app.name}
        </Text>
        <Text>
          {app.isInstalled ? '✔️' : '❌'}
        </Text>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#F5FCFF',
    padding: 5
  },
  listContainer: {
    alignItems: 'center'
  },
  pageHeading: {
    fontSize: 24,
    paddingTop: 15
  },
  listHeading: {
    fontSize: 18,
    marginTop: 10
  },
  listSubheading: {
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    margin: 5,
    flex: 1,
    flexDirection: 'row'
  },
  appName: {
    marginLeft: 10,
    marginRight: 10,
    flexGrow: 1,
    textAlign: 'center'
  }
})

export default App

