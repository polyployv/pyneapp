import React from 'react';
import { createStackNavigator,createAppContainer } from 'react-navigation';
import TabNavigator from './TabNavigator.js';
import ChatScreen from "../screens/chat/ChatScreen";
import AddPostScreen from "./../screens/Post/AddPostScreen";
import PostListScreen from "./../screens/Post/PostListScreen";
import PostDetailsScreen from "./../screens/Post/PostDetailsScreen";
import SubcategoriesListScreen from "../screens/Post/SubcategoriesListScreen";
import likedListScreen from "../screens/Post/likedListScreen";
import CategoriesListScreen from "../screens/Post/CategoriesListScreen";
import FriendScreen from "../screens/drawer/FriendScreen";
import ProfileScreen from "../screens/drawer/ProfileScreen";

const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: TabNavigator,
    }, 
    AddPostScreen: { screen: AddPostScreen },
    PostListScreen: { screen: PostListScreen },
    PostDetailsScreen: { screen: PostDetailsScreen },
    SubcategoriesListScreen: { screen: SubcategoriesListScreen },
    likedListScreen: {screen: likedListScreen},
    CategoriesListScreen: {screen: CategoriesListScreen},
    ChatScreen:{screen: ChatScreen},
  }
);
// const DrawerNavigator = createDrawerNavigator( 
//   {
//     ProfileScreen: {
//       screen: ProfileScreen,
//       navigationOptions: {
//         tabBarIcon: 'Profile'
//       },
//     },
//     FriendScreen: {
//       screen: FriendScreen,
//       navigationOptions: {
//         tabBarLabel: 'Friends',
//       }
//     },
//     RootStackNavigator: {
//       screen: RootStackNavigator,
//     }
//   }
// );

const AppContainer = createAppContainer(RootStackNavigator);

export default class RootNavigator extends React.Component {
  render() {
    return <AppContainer/>;
  }
}



