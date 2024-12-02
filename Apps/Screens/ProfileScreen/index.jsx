import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Language from "../../Utils/Language";
import { useTranslation } from "react-i18next";
import { Appbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";
import profileImg from "../../../assets/images/profile-avatar.png";
import profileCover from "../../../assets/images/profile-cover.jpg";
import { supabase } from "../../Utils/SupabaseConfig";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { user } = useUser();
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const profileScreen = t("profileScreen", { returnObjects: true });
  const [menuVisible, setMenuVisible] = useState(false);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const loadUserProfile = async () => {
    const { data, error } = await supabase
      .from("Users")
      .select("name, username, profileImage, bio")
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .single();

    if (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Error al obtener el perfil.",
      });
    } else {
      setName(data.name);
      setProfileImage(data.profileImage);
      setBio(data.bio);
    }
  };

  const handleEditCover = () => {
    Toast.show({ type: "info", text1: "Editar portada" });
  };

  const handleEditProfileImage = () => {
    Toast.show({ type: "info", text1: "Editar imagen de perfil" });
  };

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const userData = {
    name: "Carlos Pérez",
    bio: "Hola 👋 soy futbolista",
    followers: "1",
    following: "1",
    posts: "5",
    profilePicture: profileImg,
    coverPhoto: profileCover,
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Portada y avatar */}
      <View style={styles.coverContainer}>
        <Image source={userData.coverPhoto} style={styles.coverImage} />
        <TouchableOpacity
          style={styles.coverEditIcon}
          onPress={handleEditCover}
        >
          <MaterialIcons name="edit" size={24} color={Colors.WHITE} />
        </TouchableOpacity>
        <Appbar.Header style={styles.transparentAppbar}>
          <Appbar.Action icon="cog" onPress={openMenu} />
        </Appbar.Header>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profileImage }} style={styles.avatar} />
          <TouchableOpacity
            style={styles.avatarEditIcon}
            onPress={handleEditProfileImage}
          >
            <MaterialIcons name="edit" size={20} color={Colors.WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido del perfil */}

      {/* Información del usuario */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userBio}>{bio}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.followers}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.following}</Text>
            <Text style={styles.statLabel}>Seguidos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.posts}</Text>
            <Text style={styles.statLabel}>Publicaciones</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Publicaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Estadisticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.insightButton]}>
            <Text style={[styles.actionText, styles.insightText]}>Records</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido de publicaciones */}

      {/* Modal de configuración */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeMenu}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Configuraciones</Text>
            <Language />

            <View style={{ marginTop: 20 }}>
              <Button title={profileScreen.logout} onPress={signOut} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  coverContainer: {
    height: 250,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  transparentAppbar: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  avatarContainer: {
    position: "absolute",
    bottom: -40,
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.GREY,
  },
  userInfoContainer: {
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  userBio: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: "center",
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.GRAY,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: Colors.BLACK,
    borderRadius: 20,
    alignItems: "center",
  },
  actionText: {
    color: Colors.WHITE,
    fontSize: 10,
    fontWeight: "bold",
  },
  insightButton: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BLACK,
  },
  insightText: {
    color: Colors.BLACK,
  },
  postsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  postImage: {
    width: "48%",
    aspectRatio: 1,
    margin: "1%",
    borderRadius: 10,
  },
  coverImage: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeIcon: {
    position: "absolute",
    top: -50,
    backgroundColor: Colors.RED,
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  coverEditIcon: {
    position: "absolute",
    bottom: 60,
    right: 10,
    backgroundColor: Colors.BLACK,
    borderRadius: 20,
    padding: 5,
  },
  avatarEditIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: Colors.BLACK,
    borderRadius: 15,
    padding: 5,
  },
});
