import React from 'react';
import RecommenderScreen from "../screens/recommender/RecommenderScreen";
import CategoriesListScreen from "../screens/Post/CategoriesListScreen";
import FriendPost from "../screens/newfeed/FriendPost";
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
export default TabNavigator = createMaterialTopTabNavigator( 
  {
    RecommenderScreen: {
      screen: RecommenderScreen,
      navigationOptions: {
        tabBarLabel: <Icon name="users" size={30} color="#444fad" style={{top: 20}}/>
        
      },
    },
    CategoriesListScreen: {
      screen: CategoriesListScreen,
      navigationOptions: {
        tabBarLabel: 
        <Image style={{ width: 40, height: 50, top: 20}}
              source={require("../assets/images/pynePost.png")}
              
                    />
      }
    },
    FriendPost: {
      screen: FriendPost,
      navigationOptions: {
        tabBarLabel: <AntIcon name="notification" size={30} color="#444fad" style={{top: 20}}/>
      }
    }
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
      tabStyle: {
        height: 102,
      },
      style: {
        backgroundColor: '#ffe3e3'
      },
      allowFontScaling: false
      
    }
  }
);
