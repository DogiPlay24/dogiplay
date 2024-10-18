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
      .select("name, username, email, sport, Posts (*)")
      .eq(`Posts.emailRef`, user?.primaryEmailAddress.emailAddress)
      .eq(`sport`, userSport)
      .range(page * 8, (page + 1) * 8 - 1)
      .order("id", { ascending: false });

    if (data == "" || data == []) {
      Toast.show({
        type: "error",
        text1: "❌ Error de actualización",
        text2: "Error al encontrar publicaciones.",
      });
    }

    if (!error) {
      console.log("Fetched posts:", data[0].Posts);
      if (data[0]?.Posts) {
        page === 0
          ? setPostList(data[0].Posts)
          : setPostList((prevPostList) => [...prevPostList, ...data[0].Posts]);
      }
    } else {
      console.error("Error fetching posts from Supabase:", error);
    }

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

    return data?.[0]?.sport || null;
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
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
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
