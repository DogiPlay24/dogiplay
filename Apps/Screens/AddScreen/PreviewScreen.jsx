import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "./../../Utils/SupabaseConfig";
import Colors from "./../../Utils/Colors";
import { TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "@expo/vector-icons/Ionicons";
import s3bucket from "./../../Utils/S3BucketConfig";

export default function PreviewScreen() {
  const params = useRoute().params;
  const { user } = useUser();
  const navigation = useNavigation();
  const [caption, setCaption] = useState();
  const [position, setPosition] = useState("");
  const [event, setEvent] = useState("");
  const [mediaURL, setMediaURL] = useState();
  const [thumbnail, setThumbnail] = useState();

  const positions = [
    { label: "1ro", value: 1 },
    { label: "2do", value: 2 },
    { label: "3ro", value: 3 },
    { label: "4to", value: 4 },
    { label: "5to", value: 5 },
  ];

  const eventType = [
    { label: "Municipal", value: 1 },
    { label: "Estatal", value: 2 },
    { label: "Regional", value: 3 },
    { label: "Nacional", value: 4 },
    { label: "Camp. Mundial", value: 5 },
    { label: "Olimpico", value: 6 },
  ];

  const publishHandler = async () => {
    try {
      const mediaType = params.media.split(".").pop().toLowerCase();
      const isVideo =
        mediaType === "mp4" || mediaType === "mov" || mediaType === "avi";

      const media = await uploadFileToAws(
        params.media,
        isVideo ? "video" : "image"
      );

      let thumbnail;
      if (isVideo) {
        thumbnail = await uploadFileToAws(params.thumbnail, "image");
      }

      await savePost(media, thumbnail);
    } catch (error) {
      console.log("Error al publicar:", error);
    }
    console.log("🚀 ~ publishHandler ~ params.media,:", params.media);
  };

  const uploadFileToAws = async (file, type) => {
    const fileType = file.split(".").pop(); // obtener extensión de archivo
    const params = {
      Bucket: "dogiplay-bucket",
      Key: `file-${Date.now()}.${fileType}`,
      Body: await fetch(file).then((resp) => resp.blob()),
      ACL: "public-read",
      ContentType: type === "video" ? `video/${fileType}` : `image/${fileType}`,
    };

    try {
      // Subir el archivo a AWS S3
      const data = await s3bucket.upload(params).promise();
      console.log("Subiendo archivo...");
      console.log("RESP:", data.Location);

      // Actualizar la URL del archivo dependiendo del tipo
      if (type === "video") {
        setMediaURL(data.Location);
      } else if (type === "image") {
        setThumbnail(data.Location);
      }

      return data.Location;
    } catch (error) {
      console.log("Error en la carga del archivo:", error);
      throw error;
    }
  };

  const savePost = async (mediaUrl, thumbnailUrl = null) => {
    try {
      const { data, error } = await supabase
        .from("Posts")
        .insert([
          {
            caption: caption,
            position: position,
            event: event,
            mediaUrl: mediaUrl,
            thumbnail: thumbnailUrl,
            emailRef: user.primaryEmailAddress.emailAddress,
          },
        ])
        .select();

      if (error) {
        console.log("Error al almacenar:", error);
      } else {
        console.log("Publicación guardada:", data);
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error en savePost:", error);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.keyboard}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnBack}
        >
          <Ionicons name="arrow-back-circle" size={35} color="black" />
          <Text style={styles.txtBack}>Volver</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.txtTitle}>Agregar Detalles</Text>
          <Image
            source={{ uri: params?.thumbnail || params?.media }}
            style={styles.previewImg}
          />
          <TextInput
            onChangeText={(value) => setCaption(value)}
            multiline={true}
            numberOfLines={4}
            placeholder="Describe tu logro, el lugar del evento, la categoría, el lugar que obtuviste y lo que consideres importante."
            style={[styles.txtCaption]}
          />

          <View style={styles.pickerContainer}>
            <View style={styles.picker}>
              <RNPickerSelect
                placeholder={{
                  label: `Posición`,
                  value: null,
                }}
                value={position}
                onValueChange={(itemValue) => setPosition(itemValue)}
                items={positions}
              />
            </View>
            <View style={styles.picker}>
              <RNPickerSelect
                placeholder={{
                  label: `Evento`,
                  value: null,
                }}
                value={event}
                onValueChange={(itemValue) => setEvent(itemValue)}
                items={eventType}
              />
            </View>
          </View>
          <TouchableOpacity onPress={publishHandler} style={styles.btnSubmit}>
            <Text style={styles.txtSubmit}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  btnBack: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 30,
    alignItems: "center",
    gap: 4,
  },
  txtBack: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  container: {
    alignItems: "center",
    marginTop: 25,
  },
  txtTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    fontWeight: "bold",
  },
  previewImg: {
    width: 200,
    height: 300,
    borderRadius: 15,
    marginTop: 16,
  },
  txtCaption: {
    borderWidth: 1,
    borderColor: Colors.BACKGROUND_TRANSPARENT,
    width: "100%",
    borderRadius: 10,
    marginTop: 16,
    paddingHorizontal: 16,
    textAlign: "justify",
  },
  btnSubmit: {
    backgroundColor: Colors.BLACK,
    padding: 8,
    paddingHorizontal: 24,
    borderRadius: 99,
    marginTop: 16,
  },
  txtSubmit: {
    color: Colors.WHITE,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  pickerContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
  picker: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "49%",
    overflow: "hidden",
    borderColor: Colors.GREY,
    borderWidth: 1,
    borderRadius: 10,
    height: 44,
    marginTop: 8,
  },
});
