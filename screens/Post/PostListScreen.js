import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView, Image } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem, Icon } from 'native-base';
import * as firebase from 'firebase';

var data = []

export default class PostListScreen extends React.Component {
   static navigationOptions = ({ navigation }) => {
    return {
     title:  navigation.state.params.before=="Upcoming Event"? "Upcoming Event":navigation.state.params.subcategoryname ,
    headerStyle: {
      backgroundColor: '#ffe3e3',
    },  
    headerBackTitle: " ",
    headerTitleStyle: {
      color: '#444FAD',
  },
  };
};

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      listViewData: data,
      categoryname: "",
      subcategoryname: "",
      before: "",
    }
  }

  async componentDidMount() {
    await this.setState({
      categoryname: this.props.navigation.state.params.categoryname,
      subcategoryname: this.props.navigation.state.params.subcategoryname,
      before: this.props.navigation.state.params.before,
    })
      //console.log(this.state.Events)
      if(this.state.before=="Upcoming Event"){
        this.setState({listViewData: this.props.navigation.state.params.Events,})
      }
      else{
        var that = this
        await firebase.database().ref('/Posts/').on('child_added', function (data) {
          var newData = [...that.state.listViewData]      
          if(data.val().categoryname==that.state.categoryname && data.val().subcategoryname==that.state.subcategoryname) newData.push(data)
          that.setState({ listViewData: newData })  
        })
      }
  }

  render() {
    return (
      <Container >
        <Content style={{marginLeft: 5, marginRight: 5}}>
          <List>
            {
              this.state.listViewData.map( (data,index) => {
                //console.log('data',data)
                return(
                  <ListItem>
                    {this.state.before=="Upcoming Event"?(
                      <Text 
                      onPress={ () => {
                        this.props.navigation.navigate(
                          'PostDetailsScreen',  {
                            'dataKey': data.key, 
                            'categoryname': data.val().categoryname
                          }
                        )}
                      }> 
                        <Text style={{fontSize:17, color: '#ff3879'}}> {"[ "+data.val().eventdate+"] "} </Text> 
                        <Text style={{color: '#444FAD'}}> {data.val().topicname}</Text>
                    </Text>
                    ):(
                      <Text style={{fontSize:17,color: '#ff3879'}}
                      onPress={ () => {this.props.navigation.navigate(
                        'PostDetailsScreen',  {
                          'dataKey': data.key, 
                          'categoryname': data.val().categoryname 
                        }
                      )}
                    }> 
                      {data.val().posttype=="Event"? "[EVENT] ": null}
                        <Text style={{color: '#444FAD'}}> {data.val().topicname}</Text>
                    </Text>
                    )}
                  </ListItem>
                )
              })
            }
          </List>
        </Content>
      </Container>
    );
  }
}
