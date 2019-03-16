import React from "react";
import { StyleSheet, Text, ListView, FlatList, View } from "react-native";
import { Container, Content, Input, Item, Button, Icon, ListItem, List, Fab } from "native-base";
import * as firebase from "firebase";
 

export default class CategoriesControl extends React.Component {
  static navigationOptions = {
    title: null,
    headerStyle: {
      backgroundColor: "#ffe3e3"
    },
    headerRight: (
      <Icon name="md-mail" 
      style={{marginRight: 15}} />
    )
  };
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      listViewData: [],
      newCategory: "",
      numberOfcategory: "",
      clicked: false,
    };
  }
  async componentDidMount() {    
    var that = this
    await firebase.database().ref('/Categories/').on('child_added', function (data) {
        var newData = [...that.state.listViewData]
        newData.push(data)
        that.setState({ listViewData: newData,
        })     
    })
  }
  
  addCategory(catname){
    var key 
    firebase.database().ref('/Categories/').once('value', function(snapshot) { 
        key = snapshot.numChildren()
    });
    firebase.database().ref("/Categories").child(key+1).set({categoryname: catname});
  }
  deleteData(key){
    firebase.database().ref('Categories/'+key).remove();
    
  }
  render() {
    return (
      <Container>
        <Content>  
          {this.state.clicked? (
            <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10, paddingLeft:20, paddingRight: 20}}>
            <Item  style={{width: 300}}>
              <Input placeholder="Category name"
                onChangeText={newCategory => this.setState({ newCategory })} 
                value={this.state.newCategory}/>
            </Item>
            <Button 
              style={{backgroundColor: '#FF3879', marginTop: 5, marginLeft: 5,width: 50  }}
              onPress={ () => {
                if(this.state.newCategory==""){
                  alert("Categoryname is empty")
                }
                else{
                  this.addCategory( this.state.newCategory );
                  this.setState({ newCategory: "" });
                  this.setState({ clicked: !this.state.clicked });
                  //alert("Add "+this.state.newCategory+" already");
                }
              }}>
              <Text style={{marginLeft: 10, color: 'white'}}>Add</Text>
            </Button>
          </Item>
          ):null}
          <List enableEmptySections
            style={{marginLeft: 20, marginRight: 20}}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
            <ListItem>                  
              <Button iconLeft warning style={{height: 40}}
                onPress={ () => {this.props.navigation.navigate('SubcategoriesControl', {'categorykey': data.key, 'categoryname': data.val().categoryname} )}}>
                <Icon name='md-create' style={{fontSize: 14}} />
                <Text style={{color: 'white'}}>  Edit  </Text>
              </Button>
              <Text style={{fontSize:16, color: '#444FAD', marginLeft: 10}}>{data.val().categoryname}</Text>
            </ListItem>
            }
            renderRightHiddenRow={(data) =>
              <Button full danger
                onPress={() => {
                  this.deleteData(data.key)
                }}>
                <Icon name="md-trash" />
              </Button>
            }       
            rightOpenValue={-60}
          />
          
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