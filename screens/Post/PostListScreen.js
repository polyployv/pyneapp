import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView, Image } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem, Icon } from 'native-base';
import * as firebase from 'firebase';

var data = []

export default class PostListScreen extends React.Component {
   static navigationOptions = ({ navigation }) => {
    return {
    title: navigation.state.params.subcategoryname,
    headerStyle: {
      backgroundColor: '#ffe3e3',
    },  
    headerBackTitle: null
  };
};

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      listViewData: data,
      categoryname: "",
      subcategoryname: ""
    }
  }
  async componentDidMount() {
    await this.setState({categoryname: this.props.navigation.state.params.categoryname,
      subcategoryname: this.props.navigation.state.params.subcategoryname})
    var that = this
    firebase.database().ref('/Posts').on('child_added', function (data) {
      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData })  
    })
    console.log(this.state.categoryname+"  "+this.state.subcategoryname)
  }

  render() {
    return (
      <Container style={styles.container}>
        
        <Content>
          <List
            enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem>
                <Text style={{fontSize:17}}
                  onPress={ () => {this.props.navigation.navigate('PostDetailsScreen',  {'dataKey': data.key})}}> 
                  {data.val().topicname}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    paddingTop: 20,
  
  },
  
});

