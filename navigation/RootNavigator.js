import React from 'react';
import { createDrawerNavigator, createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/auth/LoginScreen';
import LoadingScreen from '../screens/auth/LoadingScreen';
import TabNavigator from './TabNavigator.js';
import AddPostScreen from "./../screens/Post/AddPostScreen";
import PostListScreen from "./../screens/Post/PostListScreen";
import PostDetailsScreen from "./../screens/Post/PostDetailsScreen";
import SubcategoriesListScreen from "../screens/Post/SubcategoriesListScreen";
import CategoriesListScreen from "../screens/Post/CategoriesListScreen";
import FriendScreen from "../screens/drawer/FriendScreen";
import ProfileScreen from "../screens/drawer/ProfileScreen";
import SettingScreen from "../screens/drawer/SettingScreen";
import CategoriesControl from "../screens/admin/CategoriesControl";
import PostDetailsControl from "../screens/admin/PostDetailsControl";
import PostListControl from "../screens/admin/PostListControl";
import ReportList from "../screens/admin/ReportList";
import SubcategoriesControl from "../screens/admin/SubcategoriesControl";
import { Drawer } from 'native-base';

// const LoginNavigator = createStackNavigator(
//   {LoginScreen: {screen: LoginScreen},}
// )

const Home = createStackNavigator(
  {
    Main: {
      screen: TabNavigator,
    }, 
    AddPostScreen: { screen: AddPostScreen },
    PostListScreen: { screen: PostListScreen },
    PostDetailsScreen: { screen: PostDetailsScreen },
    SubcategoriesListScreen: { screen: SubcategoriesListScreen },
    CategoriesListScreen: {screen: CategoriesListScreen},
  }
);
const AdminNavigator = createStackNavigator(
  {
    CategoriesControl: {screen: CategoriesControl},
    PostDetailsControl: {screen: PostDetailsControl},
    PostListControl: {screen: PostListControl},
    ReportList: {screen: ReportList},
    SubcategoriesControl: {screen: SubcategoriesControl}
  }
)
const DrawerNavigator = createDrawerNavigator( 
  { Home: {
      screen: Home,
    },
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        headerStyle: {
          backgroundColor: "#ffe3e3"
        }
      },
    },
    FriendScreen: {
      screen: FriendScreen,
      navigationOptions: {
        tabBarLabel: 'Friends',
      }
    },
    SettingScreen: {
      screen: SettingScreen,
      navigationOptions: {
        tabBarLabel: 'Setting',
      }
    },
   
  },
  {
    navigationOptions: {
      header: null
    },
    
    initialRouteName: 'Home',

  }
);
// const AppContainer = createAppContainer(DrawerNavigator);

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    LoadingScreen: {screen: LoadingScreen},
    LoginScreen: { screen: LoginScreen},
    DrawerNavigator: DrawerNavigator,
    AdminNavigator: AdminNavigator,
  },
  {
    initialRouteName:'LoadingScreen'
  }
));

class RootNavigator extends React.Component {
  render() {
    return <AppContainer/>;
  }
}
export default RootNavigator;