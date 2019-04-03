import React from 'react';
import RecommenderScreen from "../screens/recommender/RecommenderScreen";
import CategoriesListScreen from "../screens/Post/CategoriesListScreen";


import { createMaterialTopTabNavigator } from 'react-navigation';
import {Icon} from 'native-base'
export default TabNavigator = createMaterialTopTabNavigator( 
  {
    RecommenderScreen: {
      screen: RecommenderScreen,
      navigationOptions: {
        tabBarLabel: 'Recommender',
      },
    },
    CategoriesListScreen: {
      screen: CategoriesListScreen,
      navigationOptions: {
        tabBarLabel: 'Post',
      }
    },
  },
  {
    navigationOptions: {
      header: null
    },
    tabBarPosition: 'top',
    initialRouteName: 'CategoriesListScreen',
    animationEnabled: true,
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle:{
        fontSize: 20,
        fontWeight: 'bold'
      },
      style: {
        height: 100,
        backgroundColor: '#ffe3e3'
      },
      allowFontScaling: false
      
    }
  }
);