/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

import RandManager from './rand_manager';

const NUM_WALLPAPERS = 5;

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
              <Text key={index}>
                {wallpaper.author}
              </Text>
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
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
