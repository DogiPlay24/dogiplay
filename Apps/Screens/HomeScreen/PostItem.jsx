import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
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
  likeHandler,
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

  const checkIsAlreadyLike = () => {
    const result = media.PostLikes?.find(
      (item) => item.userEmail == user.primaryEmailAddress.emailAddress
    );
    return result;
  };


  useEffect(() => {
    if (index === activeIndex) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.stopAsync();
    }
  }, [activeIndex]);

  return (
    <View>
      {/* <View style={styles.main}>
        <View>
          <View style={styles.main}>
            <Image
              source={{ uri: owner?.profileImage }}
              style={styles.profileImg}
            />
            <Text style={styles.username}>{owner.username}</Text>
          </View>
          <Text>{media?.caption}</Text>
        </View>
      </View> */}
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
  main: {
    position: "absolute",
    zIndex: 2,
    bottom: 20,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  post: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImg: {
    width: 40,
    height: 40,
    backgroundColor: Colors.WHITE,
    borderRadius: 99,
  },
  username: {
    fontFamily: "Poppins-Bold",
    color: Colors.WHITE,
    fontSize: 16,
  },
  caption: {
    fontFamily: "Poppins-Bold",
    color: Colors.WHITE,
    fontSize: 16,
    marginTop: 8,
  },
  media: {
    alignSelf: "center",
    width: Dimensions.get("window").width,
  },
});
