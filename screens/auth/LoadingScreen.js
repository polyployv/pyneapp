import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'

class LoadingScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentDidMount = () => {
        if(this.props.loggedIn){
        this.props.navigation.navigate('DrawerNavigator')
        } else {
            this.props.navigation.navigate('LoginScreen')
        }
    }
    render(){
        return(
            <View><Text>{this.props.loggedIn ? 'true' : 'false'}</Text></View>
        )
    }
}

function mapStateToProps(state) {
    return{
        loggedIn: state.loggedIn
    }
}
export default connect(mapStateToProps,null)(LoadingScreen)