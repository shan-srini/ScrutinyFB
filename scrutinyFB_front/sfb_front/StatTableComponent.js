import React from 'react';
import { StyleSheet, Text, View, Button, StatusBar, ScrollView } from 'react-native';
import { Platform } from '@unimodules/core';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

// This screen is an the component for stat Table, update for future should fix the statPage to call this component
export default class StatTableComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tableKeys: [],
            tableHeaders: [],
            tableData: []
        }
    }

    componentDidMount() {
        this.chooseKeys()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allStats != this.props.allStats) {
            // { console.log(this.props.allStats) }
            this.chooseKeys()
        }
        if (prevProps.player.player_name != this.props.player.player_name) {
            this.chooseKeys()
        }
    }

    // Chooses keys order depending on position
    chooseKeys() {
        if (this.props.player.player_position == 'RB') {
            this.setState({
                tableKeys: [`week`, 'Opponent', 'rushing_att', 'rushing_yds', 'rushing_yds_per_att', 'rushing_td', "fumbles", 'receiving_tgts', 'receptions', 'receiving_yds', 'receiving_tds', 'receiving_yds_per_tgt', 'receiving_yds_per_rec'],
                tableHeaders: ["Wk", "Opp", "Rush Atts", "Rush Yds", "Yds/Carry", "Rush TDs", "Fumbles", "Rec Tgts", "Receptions", 'Rec Yds', 'Rec TDs', 'Yds/Per Tgt', 'Yds/Per Rec']
            })
        }
        if (this.props.player.player_position == 'WR' || this.props.player.player_position == 'TE') {
            this.setState({
                tableKeys: [`week`, 'Opponent', 'receiving_tgts', 'receptions', 'receiving_yds', 'receiving_tds', 'catch_percentage', 'receiving_yds_per_tgt', 'receiving_yds_per_rec', 'rushing_att', 'rushing_yds'],
                tableHeaders: ["Wk", "Opp", "Rec Tgts", "Receptions", 'Rec yds', 'Rec tds', 'Catch %', 'Yds/Per Tgt', 'Yds/Per Rec', "Rush Atts", "Rush Yds"]
            })
        }
        if (this.props.player.player_position == 'QB') {
            this.setState({
                tableKeys: [`week`, 'Opponent', 'passing_atts', 'passing_completions', 'passing_yds', 'passing_yds_per_att', 'passing_tds', 'passing_interceptions', 'rushing_att', 'rushing_yds', 'rushing_td', "fumbles"],
                tableHeaders: ["Wk", "Opp", "Pass Atts", "Pass Comps", "Pass Yds", "Yds/Att", "Pass TDs", "Int", "Rush atts", "Rush yds", "Rush TDs", "Fumbles"]
            })
        }
        // this.setData()
    }

    // sets the data according to the keys
    setData() {
        toReturn = []
        for (i in this.props.allStats) {
            // console.log(this.state.jsonResponse[i]["rushing_yds"]) // working correctly
            innerAppend = [];
            this.state.tableKeys.map((header) => {
                innerAppend.push(this.props.allStats[i][header])
            })
            toReturn.push(innerAppend)
        }
        // this.setState({ tableData: toReturn })
        return toReturn
        // console.log(this.state.tableData)  //Working correctly
    }

    render() {
        return (
            this.props.allStats.length < 1 ?
                <Text style={{ top: hp(50), left: wp(40) }}> Loading </Text>
                :
                <View>
                    <View style={styles(this.props, this.state).triangleBG} />
                    <View style={styles(this.props, this.state).tableContainer}>
                        <ScrollView horizontal={true} alwaysBounceVertical={false}>
                            <ScrollView alwaysBounceVertical={false}>
                                <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                                    <Row data={this.state.tableHeaders} style={styles(this.props, this.state).columnConfig} textStyle={styles(this.props, this.state).columnText} />
                                </Table>
                                <ScrollView alwaysBounceVertical={false}>
                                    <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                                        <TableWrapper>
                                            {
                                                this.setData().map((cellData, cellIndex) => (
                                                    <Row data={cellData} style={styles(this.props, this.state).dataConfig} textStyle={styles(this.props, this.state).dataText} key={`${cellIndex}+${cellData}`} />
                                                ))
                                            }
                                        </TableWrapper>
                                    </Table>
                                </ScrollView>
                            </ScrollView>
                        </ScrollView>
                    </View>
                    <View style={styles(this.props, this.state).header}>
                        <View style={styles(this.props, this.state).titleContainer}>
                            <Text style={styles(this.props, this.state).playerName}>{this.props.player.player_name}</Text>
                        </View>
                    </View>
                    <View style={styles(this.props, this.state).bottom} />
                </View>
        )
    }
}

const columnHeaderColor = '#2e2e2e';
const columnHeaderHeight = hp('4');
const headerTextColor = 'white';
const columnFontSize = wp('3.5');
const columnWidth = wp('24');
const dataBackgroundColor = '#4B4A49';
const dataTextColor = 'white';
const dataFontSize = wp('5');
const stickTopHeader = hp('0');
namePosition = hp('6');
namePosition = (isIPad) ? hp('3.5') : namePosition


isX = Platform.OS == 'ios' && Expo.Constants.platform.ios.model.toLowerCase().includes('iphone x')
playerNameSize = (isX) ? wp('5') : wp('7')

const styles = (props, state) => StyleSheet.create({
    tableContainer: {
        position: 'absolute',
        top: hp('14'),
        flex: 1, paddingTop: 0, backgroundColor: '#fff',
        height: hp('76'),
        backgroundColor: 'transparent'
    },
    columnConfig: {
        height: columnHeaderHeight,
        width: state.tableHeaders.length * columnWidth,
        backgroundColor: columnHeaderColor,
        top: stickTopHeader
    },
    columnText: {
        fontWeight: '500',
        fontSize: columnFontSize,
        color: headerTextColor,
        textAlign: 'center'
    },
    dataConfig: {
        width: state.tableHeaders.length * columnWidth,
        backgroundColor: dataBackgroundColor,
    },
    dataText: {
        fontSize: dataFontSize,
        color: dataTextColor,
        textAlign: 'center'
    },
    playerName: {
        position: 'absolute',
        fontSize: playerNameSize,
        fontWeight: '600',
        top: namePosition,
        color: 'white',
    },
    header: {
        borderBottomColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: props.chosenColor,
        width: wp('100'),
        height: hp('14')
    },
    titleContainer: {
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'red',
        top: hp('1')
    },
    triangleBG: {
        position: 'absolute',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        top: hp('14'),
        height: hp('78'),
        width: wp('100'),
        backgroundColor: props.chosenColor2
    },
    bottom: {
        position: 'absolute',
        width: wp('100'),
        height: hp('20'),
        top: hp('90'),
        backgroundColor: props.chosenColorBottom
    }
});