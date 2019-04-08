import React from "react";
import { StyleSheet, Text, ListView, FlatList, View, Alert } from "react-native";
import { Container, Content, Input, Item, Button, Icon, ListItem, List, Fab, Right, Body, Card, CardItem } from "native-base";
import * as firebase from "firebase";
 

export default class CategoriesControl extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
    title: null,
    headerStyle: {
      backgroundColor: "#ffe3e3"
    },
    headerLeft: (
      <Icon name="md-mail" 
        style={{marginLeft: 15, color: '#444FAD'}}
        onPress={() => navigation.navigate('ReportList')} />
    ),
    headerRight: (
      <Icon name="md-log-out"
        style={{marginRight: 15, color: '#444FAD'}}
        onPress={() => {
          firebase.auth().signOut().then(function() {
            navigation.navigate('LoginScreen')
            console.log("logout!!!!!!!")
          }).catch(function(error) {
            alert("Error")
          });
        }} />
      
    
    ),
    }
  };
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      listViewData: [],
      newCategory: "",
      categoryname: "",
      newcategoryname: "",
      numberOfcategory: "",
      clicked: false,
      Isedit: false,
    };
  }
  async componentDidMount() {    
    var that = this
    firebase.database().ref('/Categories/').on('child_added', function (data) {
        var newData = [...that.state.listViewData]
        newData.push(data)
        that.setState({ listViewData: newData,
      })     
    })
  }
  componentWillUnmount = async () => {
    await firebase
      .database()
      .ref("/Categories/")
      .off();
  };
  addCategory(catname){
    var key 
    firebase.database().ref('/Categories/').once('value', function(snapshot) { 
        key = snapshot.numChildren()
    });
    firebase.database().ref("/Categories").child(key+1).set({categoryname: catname});
    alert("Add "+catname+" successfully")
    
  }
  editCategory = async(catname) => {
    await firebase.database().ref('Posts/').on("child_added", (snapshot) => {
      if(snapshot.val().categoryname === this.state.categoryname){
        firebase.database().ref('Posts/'+snapshot.key).update({
          "categoryname": catname
        });
      }
    });
    await firebase.database().ref('/Categories/' + this.state.categorykey).update({
      "categoryname": catname
    });
    alert("Edit successfully")
    await this.setState({categoryname: catname})
    await this.reflesh()
  }
  async deleteData(catname,key){
    firebase.database().ref('Posts/').on("child_added", (snapshot) => {
      if(snapshot.val().categoryname === catname){
        firebase.database().ref('Posts/'+snapshot.key).remove();
      }
    })
    firebase.database().ref('Categories/'+key).remove();
    await this.reflesh();
    alert("Delete successfully");
  }
  async reflesh(){
    await this.setState({ listViewData: []})
    var that = this
    firebase.database().ref('/Categories/').on('child_added', function (data) {
      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData,})     
    })
  }
  _alert(catname,key,text){
    Alert.alert(
      key===""?(
        text==='add'?(
          "Add the category "+catname
        ):("Edit "+this.state.categoryname+" to "+catname)
      ):("Delete "+ catname),
      'Are you sure you want to '+
        (key===""?(
          text==='add'?(
            "add the category "+catname+" ?"
          ):("edit "+this.state.categoryname+" to "+catname)+" ?"
        )
        :("delete "+catname+" ?")),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => {
          if(text==="edit") {this.editCategory(catname)}
          else if(text==="add") {this.addCategory(catname)}
          else if(text==="delete"){this.deleteData(catname,key)}
        }
        } 
      ],
      {cancelable: false},
    );
  }
  
  render() {
    return (
      <Container>
        <Content >  
          {this.state.clicked? (
            <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10, paddingLeft:20, paddingRight: 20}}>
            <Item  style={{width: 300}}>
              <Input placeholder="Category name"
                onChangeText={newCategory => this.setState({ newCategory })} 
                value={this.state.newCategory}/>
            </Item>
            <Button 
              style={{backgroundColor: '#444FAD', marginTop: 5, marginLeft: 5,width: 50  }}
              onPress={ () => {
                if(this.state.newCategory==""){
                  alert("Categoryname is empty")
                }
                else{
                  this._alert(this.state.newCategory,"",'add')
                  this.setState({ newCategory: "" });
                  this.setState({ clicked: !this.state.clicked });
                }
              }}>
              <Text style={{marginLeft: 10, color: 'white'}}>Add</Text>
            </Button>
        </Item>
        ):null}
        {this.state.Isedit? (
          <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10, paddingLeft:20, paddingRight: 20}}>
          <Item style={{width: 300}}>
            <Input placeholder={this.state.categoryname}
              onChangeText={newcategoryname => this.setState({ newcategoryname })} 
              value={this.state.newcategoryname}/>
          </Item>
          <Button warning 
            style={{ marginTop: 5, marginLeft: 5 , width: 50}}
            onPress={ () => {
              if(this.state.newcategoryname==""){
                alert("Categoryname is empty")
              }
            else{
                this._alert(this.state.newcategoryname,"","edit")
                this.setState({ 
                  newcategoryname: "",
                  Isedit: false 
                });
            }}}>
            <Text style={{marginLeft: 10, color: 'white'}}> Edit</Text>
          </Button>
        </Item>
        ):null}
        <Card style={{maxHeight: '90%' }}>
            <CardItem style={{borderRadius: 10 }}>
                <Content>
                    <List>
                    {this.state.listViewData.map( (data,index) => {
                        //console.log('data',data)
                        return(
                            <ListItem key={index}>
                                <Body>
                                    <Text style={{fontSize:16, color: '#444FAD'}}
                                      onPress={ () => {
                                      this.props.navigation.navigate('SubcategoriesControl', 
                                      {'categorykey': data.key, 'categoryname': data.val().categoryname} 
                                      )}}>
                                      {data.val().categoryname}
                                    </Text>
                                </Body>
                                <Right>
                                    <Item style={{borderColor: "transparent"}}> 
                                        <Button  warning 
                                            onPress={() => 
                                              this.setState({ 
                                                Isedit: !this.state.Isedit,
                                                categorykey: data.key,
                                                categoryname: data.val().categoryname
                                              })  
                                          }>
                                            <Icon name='md-create' style={{fontSize: 14}} />
                                        </Button>
                                        <Button  danger  
                                            style={{marginLeft: 5}}
                                            onPress={() => {
                                              this._alert(data.val().categoryname,data.key,"delete")
                                              }}>
                                            <Icon name='md-trash' style={{fontSize: 14}} />
                                        </Button>
                                    </Item>
                                </Right>
                            </ListItem>
                        )}) 
                    }
                    </List>
                </Content>
            </CardItem>
        </Card>
        </Content>  
        <View >
          <Fab
            active={this.state.active}
            containerStyle={{ }}
            style={{ backgroundColor: '#444FAD' }}
            position="bottomRight"
            onPress={() => this.setState({ 
              clicked: !this.state.clicked , 
              newCategory: ""
              })}>
            <Icon name="md-add" />
          </Fab>
        </View>
    </Container>
    )}
}
