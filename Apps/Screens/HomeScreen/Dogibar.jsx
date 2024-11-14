import React from "react";
import { FlatList, View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

const menu = [
    {
        id:-2,
        className: 'gold',
        callback: () => alert('elegiste oro')
    },
    {
        id:-1,
        className: 'silver',
        callback: () => alert('elegiste plata')
    },
    {
        id:0,
        className: 'bronze',
        callback: () => alert('elegiste bronce')
    },
    {
        id:1,
        source: require('../../../img/dogi.png'),
        callback: () => alert('elegiste dogi')
    },
    {
        id: 2,
        source: require('../../../img/fuego.png'),
        callback: () => alert('elegiste fuego')
    },
    {
        id:3,
        source: require('../../../img/halterofilia.png'),
        callback: () => alert('elegiste halterofilia')
    },
    {
        id:4 ,
        source: require('../../../img/futbol.png'),
        callback: () => alert('elegiste futbol Americano')
    },
    {
        id:5 ,
        source: require('../../../img/beisbol.png'),
        callback: () => alert('elegiste beisbol')
    }
    
];

export default function Dogibar() {
    return <View style={styles.wrapper}>
        <FlatList
            data={menu}
            renderItem={({ item }) => {
                if(item.className) {
                    return <TouchableOpacity onPress={() =>item.callback()} >
                    <Text style={[styles.medal, styles[item.className]]}>1</Text>
                    <Text style={styles.note}>1</Text>
                    </TouchableOpacity >
                }
                return <TouchableOpacity onPress={() =>item.callback()} ><Image source={item.source} style={styles.menuIcon} /></TouchableOpacity>
            }}
            keyExtractor={item => item.id}
        />
    </View>
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    title: {
      fontSize: 32,
    },
    wrapper: {
        marginTop:150,
        flex:1,
        flexDirection: 'column',
        position: 'absolute',
        right:0,
        zIndex:1,
        top: 0,
        borderRadius:10,
        right:10
    },
    menuIcon: {
        margin: 10,
        width: 35, 
        height: 35,
    },
    medal: {
        fontSize: 15,
        justifyContent: "center",
        alignItems: "center",
        height: 25,
        width: 25,
        borderRadius: 12,
        color: 'white',
        boxSizing: 'border-box',
        overflow:'hidden',
        textAlign:'center',
        marginLeft:15,
        paddingTop:5
    },
    gold: {
        backgroundColor: '#FFD700'
    },
    silver: {
        backgroundColor: '#C0C0C0',
    },
    bronze: {
        backgroundColor: '#CD7F32'
    },
    note: {
        color:'white', 
        marginLeft:23, 
        fontWeight:'bold', 
        fontSize:18,
        marginBottom:15
    }
  });
  