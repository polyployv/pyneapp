import React from 'react';
import { StyleSheet, Text, ListView, View, FlatList, Image,} from 'react-native';
import {
  Container, Content, CheckBox, Body, Left, Right, Header, Title, Form, 
  Input, Item, Icon,Button, ListItem, Textarea, Card, CardItem, Picker, DatePicker, List, Badge
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
                <Text style={{ marginLeft: 10}} /*onPress={() => navigation.navigate('RecommenderScreen')}*/>
                <Image style={{height: 30, width: 30,}}
                source={require('../../assets/images/peopleIcon.png')}
                />
                </Text>
            ),
            headerRight: (
                <Text style={{ marginRight: 10}} onPress={() => navigation.navigate('likedListScreen')}>
                <Image style={{height: 20, width: 20,}}
                    source={require('../../assets/images/menuIcon.png')}
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
          categorykey: "",
          Events: [],
          eventdate: ''
        }
    }
    
    componentDidMount = async() => {
        await firebase.database().ref('Posts').on('child_added', (data) => {
            //console.log(data)
            var newEvent = [...this.state.Events]
            var now = new Date().toString().substr(4, 12)
            var date = data.val().eventdate
            if(data.val().posttype === "Event" && (new Date(date))-(new Date(now)) > 0 ){
                newEvent.push(data)
                newEvent = newEvent.sort( (a, b) => {                
                    return( ( new Date(a.val().eventdate) )- 
                    ( new Date(b.val().eventdate) )   )
                })
                this.setState({ Events: newEvent })    
            }       
        }) 
        var that = this
        await firebase.database().ref('/Categories/').on('child_added', function (data) {
            var newData = [...that.state.listViewData]
            newData.push(data)
            that.setState({ listViewData: newData })  
        })
        await firebase.database().ref('/Categoreis/').off()
        //await firebase.database().ref('/Posts/').off()       
        
      }
      
    render() {
        return (
            <Container>
               <Card style={{ marginTop: 10, marginLeft: 5, marginRight: 5}}>
                    <CardItem>
                        <Content>   
                            <Item style={{borderColor: "transparent"}}>
                                <Text style={{color: '#FF3879', fontSize: 18}}>Upcoming event</Text>
                                <Right>
                                    <Text style={{color: '#c0c0c0', fontSize: 14,}}
                                        onPress={ () => {
                                            this.props.navigation.navigate(
                                                'PostListScreen',  
                                                {
                                                    'categoryname': "",
                                                    'subcategoryname': "",
                                                    'before': "Upcoming Event", 
                                                    'Events': this.state.Events
                                                }
                                            )}
                                        }>
                                        see all>
                                    </Text>
                                </Right>
                            </Item>
                        
                            {     
                                this.state.Events.map( (Data,index) => {
                                if(index < 3){
                                return(
                                    <ListItem key={index}
                                        style={{borderColor:'transparent'}}>
                                        <Badge style={{backgroundColor: '#FF3879'}}>
                                        <Text style={{color: 'white'}}>{index+1}</Text>
                                        </Badge>
                                        <Text style={{marginLeft: 5,}}
                                            onPress={ () => {
                                                this.props.navigation.navigate(
                                                    'PostDetailsScreen',  
                                                    {
                                                        'dataKey': Data.key,
                                                        'categoryname': Data.val().categoryname
                                                    }
                                                )}
                                            }> 
                                            <Text style={{color: '#ff3879'}}> 
                                                {"[ "+Data.val().eventdate+"] "} 
                                            </Text> 
                                            <Text style={{color: '#444FAD'}}> 
                                                {Data.val().topicname} 
                                            </Text>                            
                                        </Text>
                                    </ListItem>
                                )}})
                            }
                        </Content>
                    </CardItem>
                </Card>
                <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10}}>
                <Item rounded style={{width: "80%"}}>
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
                                onPress={ () => {
                                    this.props.navigation.navigate(
                                        'SubcategoriesListScreen', {
                                            'categorykey': item.key, 
                                            'categoryname': item.val().categoryname
                                        } 
                                    )
                                }}> 
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