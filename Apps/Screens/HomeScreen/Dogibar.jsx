import { FlatList, View, StyleSheet, Text, Image } from "react-native";

const menu = [
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
            renderItem={({ item }) => <Image source={item.source} style={styles.menuIcon} />}
            keyExtractor={item => item.id}
            onPress={() => item.callback()}
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
        backgroundColor:'rgba(0, 0, 0, 0.43)',
        marginTop:200,
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
    }
  });
  