import React from 'react';
import { StyleSheet, Text, View, Button, StatusBar, Image, Alert } from 'react-native';
import { Platform } from '@unimodules/core';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FlatList, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import StatTableComponent from './StatTableComponent';
import { fetchUpdateAsync } from 'expo/build/Updates/Updates';

const headerWidth = wp('150')
const headerHeight = hp('52')
const backButtonHeight = hp('4')
const backButtonWidth = wp('5.2')

export default class FullStatPage extends React.Component {

    constructor(props) {
        super(props);
        var { params } = this.props.navigation.state
        this.getColor1 = params.getColor1.bind(this)
        this.getColor2 = params.getColor2.bind(this)
        this.state = {
            splitsSwitch: true,
            statsWith: [],
            statsWithout: [],
            player2Info: []
        }
    }

    static navigationOptions = {
        header: null
    };

    goBackToPlayer() {
        const { navigate } = this.props.navigation;
        navigate('Player');
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        var { params } = this.props.navigation.state
        const { navigate } = this.props.navigation;
        var formData = new FormData()
        formData.append('playerName', params.playerName)
        formData.append('splitPlayerName', params.playerSplitName)
        formData.append('home_or_away', params.logStatus)
        formData.append('year', params.year)

        //?playerID='+params.player.player_id)
        fetch('https://scrutiny-fb-api.herokuapp.com/getSplits', {
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then(stats => {
                this.setState({
                    statsWith: JSON.parse((stats)["splitsWith"]),
                    statsWithout: JSON.parse(stats["splitsWithout"])
                })
                if (this.state.statsWith.length == 0) {
                    // alert(`${params.playerName} has played every game WITHOUT ${params.playerSplitName} in ${params.year}`)
                    Alert.alert("oops!",
                        `${params.playerName} has played every game WITHOUT ${params.playerSplitName} in ${params.year}`,
                        [
                            { text: `Go back`, onPress: () => navigate("Player") },
                            {
                                text: `See every ${params.playerName} stat for ${params.year}`, onPress: () => navigate('StatPage', {
                                    player: params.player,
                                    logStatus: params.logStatus,
                                    year: params.year,
                                    chosenColor: this.getColor1(params.player.current_team),
                                    chosenColor2: this.getColor2(params.player.current_team)
                                })
                            }
                        ]
                    )
                }
                if (this.state.statsWithout.length == 0) {
                    Alert.alert("oops!",
                        `${params.playerName} has played every game WITH ${params.playerSplitName} in ${params.year}`,
                        [
                            { text: `Go back`, onPress: () => navigate("Player") },
                            {
                                text: `See every ${params.playerName} stat for ${params.year}`, onPress: () => navigate('StatPage', {
                                    player: params.player,
                                    logStatus: params.logStatus,
                                    year: params.year,
                                    chosenColor: this.getColor1(params.player.current_team),
                                    chosenColor2: this.getColor2(params.player.current_team)
                                })
                            }
                        ]
                    )
                }
                // console.log((stats)["splitsWithout"]) //works to get splits without or with
                // tableHeaders: JSON.parse(stats).keys()})
                //  console.log((JSON.parse(stats)[0])["rushing_yds"])
            })
            .catch((error) => {
                console.log(error)
            });

        fetch('https://scrutiny-fb-api.herokuapp.com/getPlayerByName?playerName=' + params.playerSplitName)
            .then((response) => response.json())
            .then(player => {
                this.setState({ player2Info: JSON.parse(player) })
                if (this.state.player2Info.current_team != params.player.current_team) {
                    Alert.alert("Hmm...", `${params.playerName} & ${params.playerSplitName} are not on the same team... Are you sure you would like to see how ${params.playerName} performs when ${params.playerSplitName} is on/off the field on a given day?`,
                        [
                            { text: `Go back`, onPress: () => navigate("Player") },
                            { text: 'Stay', onPress: () => { } }
                        ]
                    )
                }
            })
            .catch((error) => {
                // alert("Unable to find " + params.playerSplitName)
                // navigate("Player")
            });
    }

    render() {
        var { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                {this.state.splitsSwitch ?
                    <StatTableComponent
                        player={params.player}
                        allStats={this.state.statsWith}
                        chosenColor={this.getColor1(params.player.current_team)}
                        chosenColor2={this.getColor2(params.player.current_team)}
                        chosenColorBottom={this.getColor1(params.player.current_team)}
                    />
                    :
                    <StatTableComponent
                        player={params.player}
                        allStats={this.state.statsWithout}
                        chosenColor={this.getColor1(params.player.current_team)}
                        chosenColor2={this.getColor2(params.player.current_team)}
                        chosenColorBottom={this.getColor1(params.player.current_team)}
                    />
                }

                {/* <View style={styles.bottom}/> */}
                <View style={styles.playerButtonContainer}>
                    <TouchableHighlight style={styles.playerNameBox1} underlayColor='#6e6e6e' onPress={() => this.setState({ splitsSwitch: true })}>
                        <Text style={[styles.playerNameBoxText]}>
                            With{params.playerSplitName.substring(params.playerSplitName.indexOf(" "))}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.playerNameBox2} underlayColor='#6e6e6e' onPress={() => this.setState({ splitsSwitch: false })}>
                        <Text style={[styles.playerNameBoxText]}>
                            Without{params.playerSplitName.substring(params.playerSplitName.indexOf(" "))}
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity style={styles.backButton}
                        onPress={() => this.goBackToPlayer()}>
                        <Image
                            source={require('./components/backButtonArrow.png')}
                            style={{ width: backButtonWidth, height: backButtonHeight }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mainBackgroundColor = 'white';
playerNameTop = hp('1')
playerNameTop = (isIPad) ? hp('0.5') : playerNameTop

const styles = StyleSheet.create({
    container: {
        backgroundColor: mainBackgroundColor,
        flex: 1
    },
    backButton: {
        width: wp('8'),
        height: hp('6'),
    },
    backButtonContainer: {
        position: 'absolute',
        top: hp('5.5'),
        left: wp('5'),
    },
    playerButtonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: hp('90'),
        width: wp('100'),
        height: hp('5'),
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderWidth: 1,
    },
    playerNameBox1: {
        alignContent: 'center',
        alignItems: 'center',
        width: wp('49.75'),
        height: hp('4.75'),
        backgroundColor: '#B0B0B0',
        borderColor: 'black',
        borderWidth: 0.5,
    },
    playerNameBox2: {
        alignContent: 'center',
        alignItems: 'center',
        width: wp('49.75'),
        height: hp('4.75'),
        backgroundColor: '#B0B0B0',
        borderColor: 'black',
        borderWidth: 0.5,
    },
    playerNameBoxText: {
        fontSize: wp('4'),
        top: playerNameTop
    },
    bottom: {
        position: 'absolute',
        width: wp('100'),
        height: hp('20'),
        top: hp('90'),
        backgroundColor: '#4B4A49'
    },
});

