import React, { Component } from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";

import LoginScreen from "./../screens/auth/LoginScreen";
import AddPostScreen from "./../screens/Post/AddPostScreen";
import PostListScreen from "./../screens/Post/PostListScreen";
import PostDetailsScreen from "./../screens/Post/PostDetailsScreen";
import CategoriesListScreen from "./../screens/Post/CategoriesListScreen";
import SubcategoriesListScreen from "../screens/Post/SubcategoriesListScreen";
import RecommenderScreen from "../screens/recommender/RecommenderScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

export const Navigator = new createStackNavigator(
  {
    LoginScreen: {screen: LoginScreen},
    ProfileScreen: {screen: ProfileScreen},
    RecommenderScreen: {screen: RecommenderScreen},
    AddPostScreen: { screen: AddPostScreen },
    PostListScreen: { screen: PostListScreen },
    PostDetailsScreen: { screen: PostDetailsScreen },
    CategoriesListScreen: { screen: CategoriesListScreen },
    SubcategoriesListScreen: { screen: SubcategoriesListScreen }
  },
  {
    initialRouteName: "LoginScreen"
  }
);

const AppContainer = createAppContainer(Navigator);

class StackNavigator extends Component {
  render() {
    return <AppContainer />;
  }
}

export default StackNavigator;
