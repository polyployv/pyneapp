import React from 'react';
import { StyleSheet, Text, ListView} from 'react-native';
import {
  Container, Content, CheckBox, Body, Left, Right, Header, Title, Form,
  Input, Item, Icon, ListItem, Button, Textarea, Card, CardItem, Picker, DatePicker, List
} from 'native-base';
import * as firebase from 'firebase';
import { createStackNavigator, createAppContainer } from 'react-navigation';

var data = []
export default class CategoriesListScreen extends React.Component {
    static navigationOptions = {
        title: null ,   
        headerStyle: {
            backgroundColor: '#ffe3e3',
        },    
             
    };
    constructor(props) {
        super(props);
    
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    
        this.state = {
          listViewData: data,
          keyData: ""
        }
    }
    componentDidMount() {
        var that = this
        firebase.database().ref('/Categories/').on('child_added', function (data) {
            var newData = [...that.state.listViewData]
            newData.push(data)
            that.setState({ listViewData: newData })  
            keyData = data.key
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
                </Button></Item>
                <Content style={{marginLeft: 10, marginRight: 10}}>
                    <List
                        enableEmptySections
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={data =>
                            <ListItem>
                                <Text style={{fontSize:17}}
                                    onPress={ () => {this.props.navigation.navigate('SubcategoriesListScreen', {'dataKey': data.key, 'categoryname': data.val().categoryname} )}}> 
                                    {data.val().categoryname}
                                </Text>
                            </ListItem>
                            
                        }
                        renderRightHiddenRow={() =>
                        <Button full >
                            <Icon name="information-circle" />
                        </Button>
                        }
                        rightOpenValue={-75}
                    />
                </Content>
            </Container>
        );
    }
}