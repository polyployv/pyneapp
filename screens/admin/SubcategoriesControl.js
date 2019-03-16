import React from "react";
import { StyleSheet, Text, ListView, FlatList, View } from "react-native";
import { Container, Content, Input, Item, Button, Icon, ListItem, List, Fab} from "native-base";
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
      subcategoryname: "",
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
  }
  editCategory(catname){
    firebase.database().ref('/Categories/' + this.state.categorykey).update({
      "categoryname": catname
    });
  }
  editSubcategory(subcatname){
    firebase.database().ref('/Categories/' + this.state.categorykey +'/Subcategories/'+this.state.subcategorykey).update({
      "subcategoryname": subcatname
    });
  }
  deleteData(key){
    firebase.database().ref('/Categories/' + this.state.categorykey +'/Subcategories/'+key).remove();
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
              style={{backgroundColor: '#FF3879', marginTop: 5, marginLeft: 5,width: 50  }}
              onPress={ () => {
                if(this.state.newSubcategory==""){
                  alert("Subcategoryname is empty")
                }
                else{
                  this.addSubcategory( this.state.newSubcategory );
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

        <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10, paddingLeft:20, paddingRight: 20}}>
            <Item style={{width: 300}}>
              <Input placeholder={this.state.categoryname}
                onChangeText={categoryname => this.setState({ categoryname })} 
                value={this.state.categoryname}/>
            </Item>
            <Button warning 
              style={{ marginTop: 5, marginLeft: 5 , width: 50}}
              onPress={ () => {
                if(this.state.categoryname==""){
                  alert("Categoryname is empty")
              }
              else{
                  this.editCategory( this.state.categoryname );
                  //alert("Edit Categoryname alrealdy")
              }}}>
              <Text style={{marginLeft: 10, color: 'white'}}> Edit</Text>
            </Button>
          </Item>
          {this.state.Isedit? (
            <Item style={{alignSelf: 'center', borderColor:'transparent', marginTop:10, paddingLeft:20, paddingRight: 20}}>
            <Item style={{width: 300}}>
            <Input placeholder={this.state.subcategoryname}
              onChangeText={subcategoryname => this.setState({ subcategoryname })} 
              value={this.state.subcategoryname}/>
          </Item>
          <Button warning 
            style={{marginTop: 5, marginLeft: 5 , width: 50}}
            onPress={ () => {
              if(this.state.subcategoryname==""){
                alert("Subcategoryname is empty")
            }
            else{
                this.editSubcategory( this.state.subcategoryname );
                //alert("Edit Subcategoryname alrealdy")
                this.setState({ 
                  subcategoryname: "",
                  Isedit: false 
                });
            }
            }}>
            <Text style={{marginLeft: 10, color: 'white'}}> Edit</Text>
          </Button>
          </Item>
          ): null}
          <List enableEmptySections
            style={{marginLeft: 20, marginRight: 20}}
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
            <ListItem>                  
              <Button iconLeft warning style={{height: 40}}
                onPress={() => 
                  this.setState({ 
                    Isedit: !this.state.Isedit,
                    subcategorykey: data.key,
                    subcategoryname: data.val().subcategoryname
                  })  
                }>
                <Icon name='md-create' style={{fontSize: 14}} />
                <Text style={{color: 'white'}}>  Edit  </Text>
              </Button>
              <Text style={{fontSize:16, color: '#444FAD', marginLeft: 10}}>{data.val().subcategoryname}</Text>
              
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