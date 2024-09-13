export const images = {
    logo: require("./logo.png"),
    pattern: require("./pattern.png")
}
// 'require' solo funciona enviando las cadenas completas sin concatenar
// https://stackoverflow.com/questions/30854232/react-native-image-require-module-using-dynamic-names
const backgrounds = [
    { uri: require('./background0.jpg') },
    { uri: require('./background1.jpg') },
    { uri: require('./background2.jpg') },
    { uri: require('./background3.jpg') },
    { uri: require('./background4.jpg') },
    { uri: require('./background5.jpg') },
]

export const getBackground = () => {
    const number = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[number].uri;
  };