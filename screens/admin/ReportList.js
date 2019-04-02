import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView, Image, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem, Icon, Body, Right, } from 'native-base';
import * as firebase from 'firebase';


export default class ReportList extends React.Component {
   static navigationOptions = ({ navigation }) => {
    return {
     title:  "Report List",
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
      listViewData: [],
    }
  }

  async componentDidMount() {
    var that = this
    await firebase.database().ref('/Posts/').on('child_added', function (data) {
        var newData = [...that.state.listViewData]      
        if(data.val().report!==0){
            newData.push(data)
            newData = newData.sort( (a, b) => {                
                return( ( a.val().report ) - 
                ( b.val().report  )  ) 
            })
        } 
        newData = newData.reverse()
        that.setState({ listViewData: newData })  
    })
    //await firebase.database().ref('/Posts/').off();
  }
  configpost(key){
    Alert.alert(
      'Config this Report',
      'Are you sure to delete this post ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', 
            onPress: () => {
              Alert.alert(
                'Delete',
                'Are you sure to delete this post',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => {firebase.database().ref("Posts/" + key).remove();}
                  }
                ]
              ) 
            }
        },
        {
          text: 'Ignore',
          onPress: () => {
            Alert.alert(
              'Ignor',
              'Are you sure to ignor this post',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Ignor',
                  onPress: () => {
                    firebase.database().ref("Posts/" + key).update({
                      "report": 0
                    });
                  }
                }
              ]
            ) 
          }
          
        }
      ],
      {cancelable: false},
    );
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
                        <Body>
                        <Text style={{fontSize:17,color: '#ff3879'}}
                            onPress={ () => {this.props.navigation.navigate(
                            'PostDetailsControl',  {
                                'dataKey': data.key, 
                                'categoryname': data.val().categoryname 
                                }
                            )}
                        }> 
                            <Text style={{color: '#444FAD'}}> {data.val().topicname}</Text>
                        </Text>
                        </Body>
                        <Right>
                            <Item style={{ borderColor: "transparent" }}>
                            <Button  danger  
                                style={{marginLeft: 5}}
                                onPress={() => {
                                    this.configpost(data.key)
                                }}>
                                <Icon name='md-build' style={{fontSize: 14}} />
                            </Button>
                        </Item>
                        </Right>
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
