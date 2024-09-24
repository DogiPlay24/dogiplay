import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { icons } from "./../../../assets/icons/index";
import Colors from "./../../Utils/Colors";

export default function AddScreen() {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const generateThumbnail = async (videoUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 10000,
      });
      setThumbnail(uri);
      setSelectedImage(null);
      navigation.navigate("PreviewScreen", {
        media: videoUri,
        thumbnail: uri,
      });
    } catch (error) {
      console.warn("Error al generar el thumbnail:", error);
    }
  };

  const selectMediaFile = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        if (asset.type === "video") {
          await generateThumbnail(asset.uri);
        } else if (asset.type === "image") {
          setSelectedImage(asset.uri);
          setThumbnail(null);
          navigation.navigate("PreviewScreen", {
            media: asset.uri,
            thumbnail: null,
          });
        }
      } else {
        console.log("Selección de media cancelada");
      }
    } catch (error) {
      console.error("Error al seleccionar media: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={icons.folder} style={styles.img} />
      <Text style={styles.caption}>
        Selecciona tu foto o video para validar tu logro
      </Text>
      <TouchableOpacity onPress={selectMediaFile} style={styles.btn}>
        <Text style={styles.btnText}>Seleccionar archivo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  img: {
    width: 140,
    height: 140,
  },
  caption: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  btn: {
    backgroundColor: Colors.BLACK,
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 99,
    marginTop: 25,
  },
  btnText: {
    color: Colors.WHITE,
    fontFamily: "Poppins-Regular",
  },
});
