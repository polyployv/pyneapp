import React from 'react';
import { StyleSheet, Text, ListView, View } from 'react-native';
import {
  StyleProvider, Container, Content, CheckBox, Body, Left, Right, Header, Title, Form,
  Input, Item, Button, Icon, ListItem, Textarea, Card, CardItem, Picker, DatePicker, List,
  Badge
} from 'native-base';
import * as firebase from 'firebase';

var data = []
export default class SubcategoriesListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.categoryname,
            headerStyle: {
                backgroundColor: '#ffe3e3',
            },  
            headerTitleStyle: {
                color: '#444FAD',
            },
        };
      };
    constructor(props) {
        super(props);
        this.state = {
          listViewData: data,
          categorykey: "",
          categoryname: "",
          Events: []
        }
    }
    async componentDidMount() {
        await this.setState({categorykey: this.props.navigation.state.params.categorykey,
        categoryname: this.props.navigation.state.params.categoryname})
        
        firebase.database().ref('/Categories/'+this.state.categorykey+'/Subcategories').on('child_added', (data) => {
            var newData = [...this.state.listViewData]
            newData.push(data)
            this.setState({ listViewData: newData })            
        })

        firebase.database().ref('Posts').on('child_added', (data) => {
            //console.log(data)
            var newEvent = [...this.state.Events]
            if(data.val().categoryname === this.state.categoryname){
                newEvent.push(data)
                newEvent = newEvent.sort( (a, b) => {                
                return( ( a.val().views + Object.keys( a.val().likes === undefined ? 0 : a.val().likes ).length + Object.keys( a.val().comments === undefined ? 0 : a.val().comments ).length )/3 - 
                ( b.val().views + Object.keys( b.val().likes === undefined ? 0 : b.val().likes ).length+ Object.keys( b.val().comments === undefined ? 0 : b.val().comments ).length )/3 )   
            })
            newEvent = newEvent.reverse()
            this.setState({ Events: newEvent })    
            }       
        })        
    }

    render() {
        return (
            <Container>  
                <Card style={{ marginTop: 10, marginLeft: 5, marginRight: 5}}>
                    <CardItem>
                        <Content>
                            <Text style={{color: '#FF3879', fontSize: 18}}>Trending</Text>
                            {     
                                //Trending
                                this.state.Events.map( (Data,index) => {
                                if(index < 3){
                                return(
                                    <ListItem key={index}
                                        style={{borderColor:'transparent'}}>
                                        <Badge style={{backgroundColor: '#FF3879'}}>
                                        <Text style={{color: 'white'}}>{index+1}</Text>
                                        </Badge>
                                        <Text style={{color: '#ff3879', marginLeft: 5,}}
                                            onPress={ () => {
                                                this.props.navigation.navigate(
                                                    'PostDetailsScreen',  
                                                    {
                                                        'dataKey': Data.key,
                                                        'categoryname': Data.val().categoryname,
                                                    }
                                                )}
                                            }> 
                                            {Data.val().posttype=="Event"? "[EVENT] ": null}
                                            <Text style={{color: '#444FAD'}}> {Data.val().topicname} </Text>                            
                                        </Text>
                                    </ListItem>
                                )}})
                            }
                        </Content>
                    </CardItem>
                </Card>
                <Content style={{marginLeft: 10, marginRight: 10}}>
                    <List>
                        {
                            this.state.listViewData.map( (data,index) => {
                            //console.log('data',data)
                            return(
                                <ListItem key={index}>
                                    <Text
                                        style={{fontSize: 17, color: "#444FAD"}}
                                        onPress={ () => {
                                            this.props.navigation.navigate(
                                                'PostListScreen', {
                                                    'categoryname': this.state.categoryname, 
                                                    'subcategoryname': data.val().subcategoryname,
                                                    'before': 'SubcategoriesList',
                                                    'Events': []
                                                }
                                            )
                                        }}> 
                                        {data.val().subcategoryname}
                                    </Text>
                                </ListItem>
                            )})
                        }
                    </List>
                </Content>
            </Container>
        );
    }
}