import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../../Utils/SupabaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import PostItem from "./PostItem";
import { useRoute } from "@react-navigation/native";

export default function HomeScreen() {
  const { user } = useUser();
  const params = useRoute().params;
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(0);
  const WindowHeight = Dimensions.get("window").height;
  const BottomTabHeight = useBottomTabBarHeight();
  const [page, setPage] = useState(0);

  useEffect(() => {
    user && updateProfileImage();
  }, [user]);

  useEffect(() => {
    getLatestPost();
  }, []);

  const getLatestPost = async () => {
    const userSport = user?.sport;
    setLoading(true);
    const { data, error } = await supabase
      .from("Posts")
      .select(
        "*, Users(username, name, profileImage, sport), Reactions(postId, userEmail)"
      )
      .eq("Users.sport", userSport)
      .range(page * 8, (page + 1) * 8 - 1) // Trae 8 publicaciones por página
      .order("id", { ascending: false });

    if (!error) {
      console.log("Fetched posts:", data);
      setPostList((prevPostList) => [...prevPostList, ...data]);
      setLoading(false);
    } else {
      console.error("Error fetching posts from Supabase:", error);
    }
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
