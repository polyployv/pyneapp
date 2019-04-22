import React from 'react';
import styles from '../../styles'
import * as firebase from 'firebase';
import {
  connect
} from 'react-redux';
import {
  getCards
} from '../../redux/actions'
import SwipeCards from 'react-native-swipe-cards'
import Cards from '../../components/Cards.js'
import NoCards from '../../components/NoCards.js'

const lodash = require('lodash')
const euclidean_distance = require('euclidean-distance')
class RecommenderScreen extends React.Component {
    componentDidMount = async () => {
          let items = []
          await firebase.database().ref('Users/').once('value', (snap) => {
            snap.forEach((child) => {
              item = {}
              item.uid = child.key;
              item.interests_number = child.child('interests_number');
              items.push(item);
            });
          })
          var vecter_all = []
          await items.map(item => {
            var vector_1 = []
            let interest_total = lodash.sum(item.interests_number.val())
            item.interests_number.val().map(value => {
              if (interest_total === 0) {
                vector_1.push(0)
              } else {
                vector_1.push(value / interest_total * 100)
              }
            })
            vector_1.push(item.uid)
            vecter_all.push(vector_1)
          })
          let meindex = lodash.pickBy(this.props.user.interests_number, function (value, key) {
            if (value > 0) {
              return key
            }
          })
          await vecter_all.map( (list,index) => {
            if(list[12] !== this.props.user.uid){
              var temp_me = []
              var temp_other = []
              for(i in meindex){
                temp_me.push(this.props.user.interests_number[i])
                temp_other.push(list[i])
              }
              var interests_fin = euclidean_distance(temp_me,temp_other)
              firebase.database().ref('Users/' + this.props.user.uid +'/interests_fin' ).update({ [list[12]] : interests_fin });
            }
          })
          console.log(this.props.geocodesubstring)
          var geocode = this.props.user.geocode.substr(0,this.props.geocodesubstring)
          console.log("geocode1",geocode)
          this.props.dispatch(getCards(geocode));
        }


          
          handleYup(card) {
            firebase.database().ref('Users/' + this.props.user.uid + '/swipes').update({
              [card.uid]: true
            });
            this.checkMatch(card)
          }

          handleNope(card) {
            firebase.database().ref('Users/' + this.props.user.uid + '/swipes').update({
              [card.uid]: false
            });
          }

          checkMatch(card) {
            firebase.database().ref('Users/' + card.uid + '/swipes/' + this.props.user.uid).once('value', (snap) => {
              if (snap.val() == true) {
                var me = this.props.user.uid;
                var user = card.uid;
              
                firebase.database().ref('Users/' + this.props.user.uid + '/friends/' + card.uid).set(user);
                firebase.database().ref('Users/' + card.uid + '/friends/' + this.props.user.uid).set(me);
              }
            });
          }

          render() {
            return ( 
              <SwipeCards
              cards={this.props.cards}
              stack={false}
              renderCard={(cardData) => <Cards {...cardData} /> }
              renderNoMoreCards={() => <NoCards />}
              showYup={false}
              showNope={false}
              handleYup={this.handleYup.bind(this)}
              handleNope={this.handleNope.bind(this)}
              handleMaybe={this.handleMaybe}
              hasMaybeAction={false}/>
              )
            }
          }

          function mapStateToProps(state) {
            return {
              cards: state.cards,
              user: state.user,
              geocodesubstring: state.geocodesubstring
            };
          }

          export default connect(mapStateToProps)(RecommenderScreen);