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
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import Language from "../../Utils/Language";
import { useTranslation } from "react-i18next";
import { Appbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";
import profileImg from "../../../assets/images/profile-avatar.png";
import profileCover from "../../../assets/images/profile-cover.jpg";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const profileScreen = t("profileScreen", { returnObjects: true });
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const user = {
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
        <Image source={user.coverPhoto} style={styles.coverImage} />
        <Appbar.Header style={styles.transparentAppbar}>
          <Appbar.Action icon="cog" onPress={openMenu} />
        </Appbar.Header>
        <View style={styles.avatarContainer}>
          <Image source={user.profilePicture} style={styles.avatar} />
        </View>
      </View>

      {/* Contenido del perfil */}

      {/* Información del usuario */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userBio}>{user.bio}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followers}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>Seguidos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.posts}</Text>
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
    borderWidth: 3,
    borderColor: Colors.WHITE,
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
});
