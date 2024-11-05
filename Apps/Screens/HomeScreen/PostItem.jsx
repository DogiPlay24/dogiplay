import { View, Image, Dimensions, ActivityIndicator, StyleSheet, Animated } from "react-native";
import { useRef, useEffect, useState } from "react";
import Colors from "./../../Utils/Colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ResizeMode, Video } from "expo-av";

export default function PostItem({
  media,
  owner,
  activeIndex,
  index,
  verified, // Recibe el estado de verificación
  user,
}) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState();
  const BottomTabHeight = useBottomTabBarHeight();
  const [mediaLoading, setMediaLoading] = useState(true);
  const ScreenHeight = Dimensions.get("window").height - BottomTabHeight / 3.65;

  const isVideo = (url) => {
    return url?.match(/\.(mp4|mov|avi|mkv)$/i);
  };

  // Configuración de la animación para el ícono de verificación
  const iconAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Ejecutar la animación cuando el componente se monta
    Animated.spring(iconAnimation, {
      toValue: 1,
      friction: 3, // Controla la resistencia del rebote
      tension: 40, // Controla la intensidad del rebote
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (index === activeIndex) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.stopAsync();
    }
  }, [activeIndex]);

  return (
    <View>
      {/* Ícono de verificación en el centro vertical de la pantalla con animación */}
      <Animated.View
        style={[
          styles.verifiedIcon,
          {
            transform: [{ scale: iconAnimation }], // Aplica la animación de escala
          },
        ]}
      >
        <Ionicons
          name="checkmark-circle"
          size={28}
          color="#87CEEB" // Cambia el color del ícono a azul cielo
        />
      </Animated.View>
      {isVideo(media?.mediaUrl) ? (
        <Video
          ref={videoRef}
          style={[styles.media, { height: ScreenHeight }]}
          source={{ uri: media?.mediaUrl }}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={activeIndex == index}
          onPlaybackStatusUpdate={(status) => {
            setStatus(() => status);
            if (status.isLoaded) setMediaLoading(false);
          }}
        />
      ) : (
        <Image
          source={{ uri: media?.mediaUrl }}
          style={[styles.media, { height: ScreenHeight }]}
          resizeMode="cover"
          onLoadEnd={() => setMediaLoading(false)}
        />
      )}
      {mediaLoading && <ActivityIndicator size="large" color={Colors.WHITE} />}
    </View>
  );
}

const styles = StyleSheet.create({
  verifiedIcon: {
    position: "absolute",
    left: 10,
    top: Dimensions.get("window").height / 2 - 14, // Centra el ícono verticalmente
    zIndex: 1, // Asegura que el ícono esté sobre la media
  },
  media: {
    alignSelf: "center",
    width: Dimensions.get("window").width,
  },
});
