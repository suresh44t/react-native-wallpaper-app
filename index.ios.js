/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import RandManager from './rand_manager';

const NUM_WALLPAPERS = 5;
var {width, height} = Dimensions.get('window');


class SplashWalls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.fetchWallsJSON();
  }

  fetchWallsJSON() {
    console.log("Walls will be fetched");

    const url = "https://unsplash.it/list";
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => { 
        var randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
        var walls = [];

        randomIds.forEach(randomId => {
          walls.push(jsonData[randomId]);
        });

        this.setState({
          isLoading: false,
          wallsJSON: [].concat(walls),
        });  

      })
      .catch( err => console.log("Fetch error: " + err) );
  }

  renderLoadingMessage() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          color={'#fff'}
          size={'small'}
          style={{margin: 15}}
        />

        <Text style={{color: '#fff'}}>
          Loading Data
        </Text>
      </View>
    )
  }

  renderResults() {
    var { wallsJSON, isLoading } = this.state;

    if ( !isLoading ) {
      return (
        <Swiper>
          {wallsJSON.map((wallpaper, index) => {
            return (
              <View key={index}>
                <Image 
                  source={{ uri: `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}` }}
                  indicator={ProgressBar}
                  style={styles.wallpaperImage}
                  indicatorProps={{
                  }}
                >   
                  <Text style={styles.label}>Photo by</Text>
                  <Text style={styles.label_author}>{wallpaper.author}</Text>
                </Image>  
              </View>
            )
          })}
        </Swiper>
      )
    }
  }

  render() {
    var { isLoading } = this.state;
    if (isLoading) {
      return this.renderLoadingMessage();
    } else {  
      return this.renderResults();
    }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  wallpaperImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000',
  },

  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width/2,
  },

  label_author: {
    position: 'absolute',
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    fontWeight: 'bold',
    width: width/2,
  }
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
