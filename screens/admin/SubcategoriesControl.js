import React from "react";
import { StyleSheet, Text, ListView, FlatList, View, Alert } from "react-native";
import { Container, Content, Input, Item, Button, Icon, ListItem, List, Fab, Card, CardItem, Body, Right} from "native-base";
import * as firebase from "firebase";

export default class SubcategoriesControl extends React.Component {
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
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      listViewData: [],
      newSubcategory: "",
      categorykey: "",
      categoryname: "",
      newCategoryname: "",
      subcategoryname: "",
      newsubcategoryname: "",
      subcategorykey: "",
      clicked: false,
      Isedit: false,
    };
  }
  
  async componentDidMount() {
    await this.setState({categorykey: this.props.navigation.state.params.categorykey,
    categoryname: this.props.navigation.state.params.categoryname})
    var that = this
    firebase.database().ref('/Categories/'+this.state.categorykey+'/Subcategories').on('child_added', function (data) {
        var newData = [...that.state.listViewData]
        newData.push(data)
        that.setState({ listViewData: newData })            
    })
  }
  addSubcategory(subcatname){
    var key 
    firebase.database().ref('/Categories/'+this.state.categorykey+'/Subcategories').once('value', function(snapshot) { 
        key = snapshot.numChildren()
    });
    firebase.database().ref('/Categories/'+this.state.categorykey+'/Subcategories').child(key+1).set({subcategoryname: subcatname});
    alert("Add "+subcatname+" successfully")
  }
  editSubcategory = async(subcatname) => {
    await firebase.database().ref('Posts/').on("child_added", (snapshot) => {
      if(snapshot.val().subcategoryname === this.state.subcategoryname){
        firebase.database().ref('Posts/'+snapshot.key).update({
          "subcategoryname": subcatname
        });
      }
    });
    await firebase.database().ref('/Categories/' + this.state.categorykey +'/Subcategories/'+this.state.subcategorykey).update({
      "subcategoryname": subcatname
    });
    
    await this.setState({subcategoryname: subcatname})
    await this.reflesh();
    alert("Edit successfully")
  }
  async deleteData(subcatname, key){
    await firebase.database().ref('/Categories/' + this.state.categorykey +'/Subcategories/'+key).remove();
    await firebase.database().ref('Posts/').on("child_added", (snapshot) => {
      if(snapshot.val().subcategoryname === subcatname){
        firebase.database().ref('Posts/'+snapshot.key).remove();
      }
    })
    await this.reflesh();
    alert("Delete successfully")
  }
  async reflesh(){
    await this.setState({ listViewData: []})
    var that = this
    await firebase.database().ref('/Categories/'+this.state.categorykey+'/Subcategories').on('child_added', function (data) {
      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData,})     
    })
  }
  _alert(subcatname,key,text){
    Alert.alert(
      key===""?(
        text==='add'?(
          "Add the subcategory "+subcatname
        ):("Edit "+this.state.subcategoryname+" to "+subcatname)
      ):("Delete "+ subcatname),
      'Are you sure you want to '+
        (key===""?(
          text==='add'?(
            "add the category "+subcatname+" ?"
          ):("edit "+this.state.subcategoryname+" to "+subcatname)+" ?"
        )
        :("delete "+subcatname+" ?")),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => {
          if(text==="edit") {this.editSubcategory(subcatname)}
          else if(text==="add") {this.addSubcategory(subcatname)}
          else if(text==="delete"){this.deleteData(subcatname,key)}
        }
        } 
      ],
      {cancelable: false},
    );
  }
  render() {
    return (
      <Container>
        <Content>
          {this.state.clicked? (
            <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10, paddingLeft:20, paddingRight: 20}}>
            <Item  style={{width: 300}}>
              <Input placeholder="Subcategory name"
                onChangeText={newSubcategory => this.setState({ newSubcategory })} 
                value={this.state.newSubcategory}/>
            </Item>
            <Button 
              style={{backgroundColor: '#444FAD', marginTop: 5, marginLeft: 5,width: 50  }}
              onPress={ () => {
                if(this.state.newSubcategory==""){
                  alert("Subcategoryname is empty")
                }
                else{
                  this._alert(this.state.newSubcategory,"","add")
                  this.setState({ 
                    clicked: !this.state.clicked,
                    newSubcategory: ""
                  });
                  //alert("Add "+this.state.newSubcategory+" already");
                }
              }}>
              <Text style={{marginLeft: 10, color: 'white'}}>Add</Text>
            </Button>
          </Item>
          ):null}
          {this.state.Isedit? (
            <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10, paddingLeft:20, paddingRight: 20}}>
            <Item style={{width: 300}}>
            <Input placeholder={this.state.subcategoryname}
              onChangeText={newsubcategoryname => this.setState({ newsubcategoryname })} 
              value={this.state.newsubcategoryname}/>
          </Item>
          <Button warning 
            style={{marginTop: 5, marginLeft: 5 , width: 50}}
            onPress={ () => {
              if(this.state.newsubcategoryname==""){
                alert("Subcategoryname is empty")
              }
              else{
                this._alert(this.state.newsubcategoryname,"","edit");
                //alert("Edit Subcategoryname alrealdy")
                this.setState({ 
                  newsubcategoryname: "",
                  Isedit: false 
                });
              }
            }}>
            <Text style={{marginLeft: 10, color: 'white'}}> Edit</Text>
          </Button>
          </Item>
          ): null}
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
                                      this.props.navigation.navigate(
                                          'PostListControl', {
                                              'categoryname': this.state.categoryname, 
                                              'subcategoryname': data.val().subcategoryname,
                                          }
                                      )
                                  }}>{data.val().subcategoryname}</Text>
                                </Body>
                                <Right>
                                    <Item style={{borderColor: "transparent"}}> 
                                        <Button  warning 
                                            onPress={() => 
                                                this.setState({ 
                                                  Isedit: !this.state.Isedit,
                                                  subcategorykey: data.key,
                                                  subcategoryname: data.val().subcategoryname
                                                })  
                                            }>
                                            <Icon name='md-create' style={{fontSize: 14}} />
                                        </Button>
                                        <Button  danger  
                                            style={{marginLeft: 5}}
                                            onPress={() => {
                                                this._alert(data.val().subcategoryname, data.key,"delete")
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
              newSubcategory: ""
              })
              }>
            <Icon name="md-add" />
          </Fab>
        </View>
      </Container>
        )}
}
const styles = StyleSheet.create({
  buttonstyle: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    color: "#444FAD"
  },
  textstyle: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
});