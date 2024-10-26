import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Utils/SupabaseConfig";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import PostItem from "./PostItem";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const { user } = useUser();
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(0);
  const WindowHeight = Dimensions.get("window").height;
  const BottomTabHeight = useBottomTabBarHeight();
  const [page, setPage] = useState(0);
  const [username, setUsername] = useState("");
  const [profileImg, setprofileImg] = useState("");

  useEffect(() => {
    user && updateProfileImage();
    setPage(0);
  }, [user]);

  // useEffect(() => {
  //   user && getLatestPost();
  // }, [user]);

  useFocusEffect(
    useCallback(() => {
      getLatestPost();
    }, [])
  );

  const getLatestPost = async () => {
    setLoading(true);
  
    const userSport = await getUserSport();
    console.log("🚀 ~ getLatestPost ~ userSport:", userSport);
  
    if (!userSport) {
      console.error("No se encontró deporte");
      setLoading(false);
      return;
    }
  
    const { data, error } = await supabase
      .from("Users")
      .select("name, sport, Posts(*)")
      .eq("sport", userSport)
      .range(page * 8, (page + 1) * 8 - 1)
      .order("id", { ascending: false });
      console.log("🚀 ~ getLatestPost ~ data:", data)
  
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
  
    // Aplanamos los posts y añadimos la información del propietario (username y profileImage)
    const allPosts = data.flatMap(user => user.Posts);
    console.log("🚀 ~ getLatestPost ~ allPosts:", allPosts)
  
    // Actualizamos el estado de postList con todos los posts junto con sus propietarios
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
    console.log("🚀 ~ getUserSport ~ data:", data[0].sport)

    if (error) {
      console.error("Error fetching user sport:", error);
      return null;
    }

    return data[0].sport || null;
  };

  const loadMorePosts = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from("Users")
      .update({ profileImage: user?.imageUrl })
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .is("profileImage", null)
      .select();
  };
  return (
    <View style={styles.main}>
      <FlatList
        data={postList}
        pagingEnabled
        onRefresh={getLatestPost}
        refreshing={loading}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.2}
        onScroll={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / (WindowHeight - BottomTabHeight)
          );
          setCurrentMedia(index);
        }}
        renderItem={({ item, index }) => (
          <PostItem
            media={item}
            index={index}
            activeIndex={currentMedia}
            user={user}
            owner={{
              username: username,
              profileImage: profileImg,
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 20,
    paddingTop: 50,
    marginBottom: 60,
  },
});
