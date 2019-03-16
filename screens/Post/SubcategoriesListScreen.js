import React from 'react';
import { StyleSheet, Text, ListView } from 'react-native';
import {
  StyleProvider, Container, Content, CheckBox, Body, Left, Right, Header, Title, Form,
  Input, Item, Button, Icon, ListItem, Textarea, Card, CardItem, Picker, DatePicker, List
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
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    
        this.state = {
          listViewData: data,
          categorykey: "",
          categoryname: "",
        }
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
    render() {
        //const { navigate } = this.props.navigation;
        return (
            <Container>
                <Content style={{marginLeft: 10, marginRight: 10}}>
                    <List
                        enableEmptySections
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={data =>
                            <ListItem>
                                <Text style={{fontSize:17}}
                                    onPress={ () => {this.props.navigation.navigate('PostListScreen', 
                                    {'categoryname': this.state.categoryname, 
                                    'subcategoryname': data.val().subcategoryname
                                    })}}> 
                                    {data.val().subcategoryname}
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