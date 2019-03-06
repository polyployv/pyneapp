import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView , Image} from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, List, ListItem,
          Card, CardItem, Textarea, Body, Right} from 'native-base';
import * as firebase from 'firebase';
import moment from 'moment';

var data = []

export default class PostDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'PostDetails',
  };
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      postdata: "",
      listViewData: data,
      event: "",
      newComment: "",
      commentdate: new Date(),
      commenttime: moment().format('hh:mm a'),
      like: false
    }
  }
  async componentDidMount() {
    await this.setState({keyData: this.props.navigation.state.params.dataKey})
    const ref = firebase.database().ref('Posts/'+this.state.keyData);
    ref.once('value', snapshot => {
      this.setState({'postdata': snapshot.val()})
    });
    var that = this
    firebase.database().ref('Posts/'+this.state.keyData+'/comments').on('child_added', function (data) {
      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData })
    })
  }
  renderForm(){
    if(this.state.postdata.posttype == "Event") {this.state.event = "[EVENT] "}
    else {this.state.event=""}
  }
  addRow(data, date, time) {
    var key = firebase.database().ref('Posts/'+this.state.keyData+'/comments').push().key
    firebase.database().ref('Posts/'+this.state.keyData+'/comments').child(key).set({ commenttext: data, commentdate: date, commenttime: time })
  }
  render() {
    return (
      <Container>
        <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10,}}>
          <CardItem style={{backgroundColor: '#444FAD', borderRadius: 10}}>
            <Content>
              {this.renderForm()}
              <Item style={{alignSelf:'center', borderColor:'transparent'}}>
                <Text style={{fontSize: 20, color: '#FF3879', fontWeight: 'bold', }} >{this.state.event}</Text>
                <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>{this.state.postdata.topicname}</Text>
              </Item>
              { this.state.postdata.posttype == "Event"?(
              <CardItem style={{backgroundColor: 'white', borderRadius: 10, marginTop: 10}}>
                <Content>
                  <Text style={{color: '#FF3879'}}>
                    <Icon style={{color: '#FF3879', fontSize: 20}}
                          name="alarm" />
                    {"  "+this.state.postdata.eventdate}
                  </Text>
                  <Text style={{color: '#FF3879'}}>
                    <Icon style={{color: '#FF3879', fontSize: 20}}
                          name="navigate" />
                    {"  "+this.state.postdata.eventlocation}
                  </Text>
                </Content>
              </CardItem>
              ):null}
              <Text style={{fontSize: 16, color: 'white', marginTop: 10}}>{this.state.postdata.text}</Text>            
              
              <Item style={{marginTop: 15, borderColor: 'transparent', alignSelf: 'flex-end'}}>
                <Text style={{fontSize: 18, color: '#ffE3E3', fontWeight: 'bold'}}>Nong Aye</Text>
                {this.s}
                <Image style={{width: 25, height:25, marginLeft: 15
                }}
                  source={require('../../assets/images/heartIcon.png')}                 
                />
                <Text style={{fontSize: 16, color: '#FF3879', }}> 16</Text>
                <Image style={{width: 30, height:30, marginLeft: 10}}
                  source={require('../../assets/images/eyeIcon.png')}
                  like={this.state.like}
                  onPress={() => this.setState({ like: !this.state.like })}
                />
                <Text style={{fontSize: 16, color: '#FF3879', }}> 106</Text>
            </Item>            
            </Content>  
          </CardItem>         
        </Card>
            
              <Form style={{paddingLeft: 10, paddingRight: 10}}>
                <Textarea rowSpan={2} bordered 
                  onChangeText={(newComment) => this.setState({ newComment })}
                  placeholder="Comment..."
                  placeholderTextColor='#aabbcc'
                />
                <Button style={{backgroundColor: '#FF3879', marginTop: 3, marginBottom:3,alignSelf: 'flex-end' }}
                  onPress={() => this.addRow(this.state.newComment, this.state.commentdate.toString().substr(4, 12), this.state.commenttime)}>
                  <Text style={{ color: 'white', fontSize: 14 }}>   Send   </Text>
                </Button>
              </Form>     
              
            <List 
                    enableEmptySections
                    dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                    renderRow={data =>
                    <ListItem avatar style={{paddingLeft: 5, paddingRight: 10, }}>
                        {/* <Left>
                            <Thumbnail source={{ uri: 'Image URL' }} />
                        </Left> */}
                        <Body>
                            <Text style={{fontWeight: 'bold', fontSize: 16, color: '#444FAD'}}>Username</Text>
                            <Text note style={{marginLeft: 10, color: '#444FAD'}}>{data.val().commenttext}</Text>
                        </Body>
                        <Right >
                            <Text note style={{color:'#aabbcc', fontSize: 12}}>{data.val().commentdate}</Text>
                            <Text note style={{color:'#aabbcc', fontSize: 12}}>{data.val().commenttime}</Text>
                        </Right>
                    </ListItem>
                    }
                    renderRightHiddenRow={data =>
                        <Button full  ><Icon name="information-circle" /></Button>
                    }
                    rightOpenValue={-75}
                />
                
      </Container>      
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    paddingRight: 10,
    paddingLeft: 10,
    
  },
});


