import React from 'react';
import { StyleSheet, Text, ListView, View, FlatList, Image} from 'react-native';
import {
  Container, Content, CheckBox, Body, Left, Right, Header, Title, Form,
  Input, Item, Icon,Button, ListItem, Textarea, Card, CardItem, Picker, DatePicker, List
} from 'native-base';
import * as firebase from 'firebase';
import { createStackNavigator, createAppContainer } from 'react-navigation';

export default class CategoriesListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: null ,   
            headerStyle: {
                backgroundColor: '#ffe3e3',
            },    
            headerLeft: (
                <Text style={{ marginLeft: 10}} onPress={() => alert('This is a button!')}>
                <Image style={{height: 30, width: 30,}}
                source={require('../../assets/images/peopleIcon.png')}
                />
                </Text>
                
            )  
        };
    };
    constructor(props) {
        super(props);
    
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    
        this.state = {
          listViewData: [],
          categorykey: ""
        }
    }
    
    componentDidMount() {
        var that = this
        firebase.database().ref('/Categories/').on('child_added', function (data) {
            var newData = [...that.state.listViewData]
            newData.push(data)
            that.setState({ listViewData: newData })  
        })
    }
      
    render() {
        return (
            <Container>
                <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:20}}>
                <Item rounded style={{width: 350}}>
                    <Icon name="ios-search" />
                    <Input placeholder="Search" />
                </Item>
                <Button rounded 
                    style={{backgroundColor: '#FF3879', marginTop: 5, marginLeft: 5 }}
                    onPress={ () => {this.props.navigation.navigate('AddPostScreen')}}>
                    <Icon name='add' />
                </Button>
                </Item>
                <Content style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>      
                    <FlatList
                        data={ this.state.listViewData }
                        renderItem={ ({item}) =>
                        <View style={styles.GridViewContainer}>
                            <Text style={styles.GridViewTextLayout} 
                                onPress={ () => {this.props.navigation.navigate('SubcategoriesListScreen', {'categorykey': item.key, 'categoryname': item.val().categoryname} )}}> 
                                {item.val().categoryname}
                            </Text>
                        </View> }
                        numColumns={2}
                    />
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    GridViewContainer: {
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
     height: 50,
     margin: 5,
     backgroundColor: '#444FAD',
     borderRadius: 50
  },
  GridViewTextLayout: {
     fontSize: 18,
     justifyContent: 'center',
     color: '#fff',
     padding: 10,
   }
   
  });