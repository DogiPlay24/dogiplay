import React, { useState } from "react";
import { FlatList, View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

export default function Dogibar() {

    const [menu, setMenu] = useState([
        {
            id: 1,
            className: 'gold',
            likes: 0
        },
        {
            id: 2,
            className: 'silver',
            likes: 0
        },
        {
            id: 3,
            className: 'bronze',
            likes: 0
        },
        {
            id: 4,
            source: require('../../../img/dogi.png'),
            likes: 0
        },
        {
            id: 5,
            source: require('../../../img/fuego.png'),
            likes: 0
        },
        {
            id: 6,
            source: require('../../../img/halterofilia.png'),
            likes: 0
        },
        {
            id: 7,
            source: require('../../../img/futbol.png'),
            likes: 0
        },
        {
            id: 8,
            source: require('../../../img/beisbol.png'),
            likes: 0
        }
        
    ]);
    
    const handleLike = (index) => {
        let newState = JSON.parse(JSON.stringify(menu))
        newState[index].likes++;
        setMenu(newState);
    }

    const isLiked = (item) => {
        if(item.likes === 0) return styles.disabled;
    }

    return <View style={styles.wrapper}>
        <FlatList
            data={menu}
            renderItem={({ item, index }) => {
                if(item.className) {
                    return <TouchableOpacity onPress={() => handleLike(index)} >
                    <Text style={[styles.medal, styles[item.className]]}>1</Text>
                    <Text style={styles.note}>{item.likes}</Text>
                    </TouchableOpacity >
                }
                return <TouchableOpacity onPress={() => handleLike(index)} >
                    <Image source={item.source} style={[styles.menuIcon, isLiked(item)]} />
                    <Text style={styles.note}>{item.likes}</Text>
                    </TouchableOpacity>
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
        marginTop:100,
        flex:1,
        flexDirection: 'column',
        position: 'absolute',
        right:0,
        zIndex:1,
        top: 0,
        borderRadius:10,
        right:10,
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
        paddingTop:2
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
    },
    disabled: {
        filter: 'grayscale(100%)'
    }
  });
  