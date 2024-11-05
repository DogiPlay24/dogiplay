import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, StyleSheet, FlatList, Dimensions, Animated } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Utils/SupabaseConfig";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import PostItem from "./PostItem";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome"; // Importa el ícono
import Dogibar from './Dogibar';

export default function HomeScreen() {
  const { user } = useUser();
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(0);
  const WindowHeight = Dimensions.get("window").height;
  const WindowWidth = Dimensions.get("window").width;
  const BottomTabHeight = useBottomTabBarHeight();
  const [page, setPage] = useState(0);
  const [username, setUsername] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [verified, setVerified] = useState(false); // Estado de verificación

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    user && updateProfileImage();
    setPage(0);
    // getUserVerified(); // Llama la función para obtener el estado de verificación desde la base de datos
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      getLatestPost();
    }, [])
  );

  const getLatestPost = async () => {
    setLoading(true);

    const userSport = await getUserSport();
    if (!userSport) {
      console.error("No se encontró deporte");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("Users")
      .select("name, sport, Posts(*)") // Se omite el campo 'verified' aquí, pero se puede agregar si es necesario
      .eq("sport", userSport)
      .range(page * 8, (page + 1) * 8 - 1)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching posts from Supabase:", error);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "❌ Error de actualización",
        text2: "Error al encontrar publicaciones.",
      });
      return;
    }

    const allPosts = data.flatMap(user => user.Posts);
    setPostList((prevPostList) =>
      page === 0 ? allPosts : [...prevPostList, ...allPosts]
    );

    setLoading(false);
  };

  const getUserSport = async () => {
    const { data, error } = await supabase
      .from("Users")
      .select("sport")
      .eq("email", user?.primaryEmailAddress.emailAddress);

    if (error) {
      console.error("Error fetching user sport:", error);
      return null;
    }

    return data[0].sport || null;
  };

  // Función que obtendría el estado de verificación del usuario
  const getUserVerified = async () => {
    // const { data, error } = await supabase
    //   .from("Users")
    //   .select("verified") // Cambia 'verified' al nombre correcto en tu base de datos
    //   .eq("email", user?.primaryEmailAddress.emailAddress);

    // if (error) {
    //   console.error("Error fetching verified status:", error);
    //   return null;
    // }

    // setVerified(data[0]?.verified || false); // Actualiza el estado de verificación
  };

  const loadMorePosts = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const updateProfileImage = async () => {
    await supabase
      .from("Users")
      .update({ profileImage: user?.imageUrl })
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .is("profileImage", null)
      .select();
  };

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / WindowHeight);

    if (index !== currentMedia) {
      setCurrentMedia(index);

      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  return (
    <View style={styles.main}>
      <Dogibar/>
      <FlatList
        data={postList}
        pagingEnabled
        snapToInterval={WindowHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onRefresh={getLatestPost}
        refreshing={loading}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.2}
        onScroll={handleScroll}
        renderItem={({ item, index }) => (
          <Animated.View
          style={[
            styles.postContainer,
            {
              height: WindowHeight,
              width: WindowWidth,
              transform: [{ scale: currentMedia === index ? scaleAnim : 1 }],
            },
          ]}
        >
          <PostItem
            media={item}
            index={index}
            activeIndex={currentMedia}
            user={user}
            verified={verified} // Pasa el estado de verificación aquí
            owner={{
              username: username,
              profileImage: profileImg,
            }}
          />
        </Animated.View>
        
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  postContainer: {
    flex: 1,
  },
  verifiedIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Para centrar verticalmente
  },
});
