import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  ImageBackground
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../Utils/SupabaseConfig";
import { useUser } from "@clerk/clerk-expo";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../Utils/Colors";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { images } from "./../../../assets/images/index";
import { countries } from "../../Utils/Locations";
import { getBackground } from "./../../../assets/images/index";

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [genre, setGenre] = useState("");
  const [date, setDate] = useState(new Date());
  const [sport, setSport] = useState("");
  const [club, setClub] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [dataSports, setDataSports] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const bg = useMemo(() => getBackground(), [])

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const validateInputs = () => {
    if (!username.trim()) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "El nombre de usuario no puede estar vacío.",
      });
      return false;
    }
    if (!genre) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Debes seleccionar un género.",
      });
      return false;
    }
    if (!date) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Debes seleccionar una fecha de nacimiento.",
      });
      return false;
    }
    if (!sport.trim()) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Debes seleccionar un deporte.",
      });
      return false;
    }
    if (!selectedCountry) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Debes seleccionar un país.",
      });
      return false;
    }
    if (!selectedState) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Debes seleccionar un estado.",
      });
      return false;
    }
    if (!selectedMunicipality.trim()) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Debes seleccionar un municipio.",
      });
      return false;
    }
    if (!club.trim()) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Debes ingresar el nombre de tu equipo o club.",
      });
      return false;
    }
    return true;
  };

  const loadUserProfile = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("Users")
      .select(
        "name, username, genre, birth, sport, country, state, municipality, club, completed"
      )
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .single();

    if (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Error al obtener el perfil.",
      });
    } else if (data) {
      setName(data.name || "");
      setUsername(data.username || "");
      setGenre(data.genre || "");
      setDate(new Date(data.birth) || new Date());
      setSport(data.sport || "");
      setSelectedCountry(data.country || "");
      setSelectedState(data.state || "");
      setSelectedMunicipality(data.municipality || "");
      setClub(data.club || "");

      if (data.completed) {
        navigation.navigate("TabNavigation");
      }
    }

    setIsLoading(false);
  };

  const loadSports = async () => {
    const { data, error } = await supabase.from("Sports").select("name");

    if (data) {
      setDataSports(data);
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      loadUserProfile();
      loadSports();
    }
  }, [user]);

  const updateProfile = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("Users")
      .update({
        name,
        username,
        genre,
        birth: date.toISOString(),
        sport,
        country: selectedCountry,
        state: selectedState,
        municipality: selectedMunicipality,
        club,
        completed: true,
      })
      .eq("email", user?.primaryEmailAddress?.emailAddress);

    if (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Error al actualizar el perfil.",
      });
    } else {
      Toast.show({
        type: "success",
        text1: "✔️ Éxito",
        text2: "Perfil actualizado con éxito.",
      });
      navigation.navigate("TabNavigation");
    }

    setIsLoading(false);
  };

  const countryOptions = countries.map((country) => ({
    label: country.shortName,
    value: country.shortName,
  }));

  const handleCountryChange = (countryShortName) => {
    setSelectedCountry(countryShortName);
    setSelectedState("");
    setSelectedMunicipality("");
  };

  const selectedCountryData = countries.find(
    (country) => country.shortName === selectedCountry
  );

  const stateOptions = selectedCountryData
    ? selectedCountryData.states.map((state) => ({
      label: state.name,
      value: state.name,
    }))
    : [];

  const selectedStateData = selectedCountryData
    ? selectedCountryData.states.find((state) => state.name === selectedState)
    : null;

  const municipalityOptions = selectedStateData
    ? selectedStateData.municipalities.map((municipality) => ({
      label: municipality,
      value: municipality,
    }))
    : [];


  const genres = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Personalizado', value: 'P' },
  ]

  const mappedSports = useMemo(() => {
    if (!dataSports) return []
    return dataSports.map(sport => (
      {
        label: sport.name,
        value: sport.name
      }
    ))
  }, [dataSports])

  return (
    <>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.BLUE_DARK} />
        </View>
      ) : (
        <ImageBackground source={bg} style={styles.background}>
          <View style={styles.overlay} />
          <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
            <View style={styles.justifyContainer}>
              <Text style={styles.title}>Completar Perfil</Text>
              <Image source={images.logo} style={styles.img} />
            </View>
            <View style={styles.formContainer}>
              <View style={{ ...styles.txtInput, backgroundColor: '#ffffff10', borderRadius: 0 }}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  placeholder="Jhon Doe"
                  placeholderTextColor="#ffffff70"
                  value={name}
                  onChangeText={setName}
                  editable={false}
                />
              </View>
              <View style={styles.txtInput}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput
                  placeholder="Jhon Doe"
                  placeholderTextColor="#ffffff70"
                  style={{ color: Colors.WHITE }}
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
              <View style={styles.picker}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Selecciona tu sexo',
                    value: null,
                  }}
                  style={styles}
                  value={genre}
                  onValueChange={(itemValue) => setGenre(itemValue)}
                  items={genres}
                />
              </View>
              <View style={styles.txtInput}>
                <Text style={styles.label}>Fecha de nacimiento</Text>
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    placeholder="Selecciona tu fecha de nacimiento"
                    value={date.toLocaleDateString()}
                    editable={false}
                    color='white'
                  />
                </Pressable>
                {showPicker && (
                  <DateTimePicker
                    mode="date"
                    display="default"
                    value={date}
                    onChange={onChangeDate}
                  />
                )}
              </View>
              <View style={styles.picker}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Selecciona tu deporte',
                    value: null,
                  }}
                  style={styles}
                  value={sport}
                  onValueChange={(itemValue) => setSport(itemValue)}
                  items={mappedSports}
                />
              </View>
              <View style={styles.picker}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Selecciona tu país',
                    value: null,
                  }}
                  style={styles}
                  value={selectedCountry}
                  onValueChange={handleCountryChange}
                  items={countryOptions.map((country) => (
                    {
                      label: country.label,
                      value: country.value
                    }
                  ))}
                />
              </View>
              {selectedCountry && (
                <View style={styles.picker}>
                  <RNPickerSelect
                    placeholder={{
                      label: 'Selecciona tu estado',
                      value: null,
                    }}
                    style={styles}
                    value={selectedState}
                    onValueChange={(value) => setSelectedState(value)}
                    items={stateOptions.map((state) => (
                      {
                        label: state.label,
                        value: state.value
                      }
                    ))}
                  />
                </View>
              )}
              {selectedState && (
                <View style={styles.picker}>
                  <RNPickerSelect
                    placeholder={{
                      label: 'Selecciona tu municipio',
                      value: null,
                    }}
                    style={styles}
                    value={selectedMunicipality}
                    onValueChange={(value) => setSelectedMunicipality(value)}
                    items={municipalityOptions.map((municipality) => (
                      {
                        label: municipality.label,
                        value: municipality.value
                      }
                    ))}
                  />
                </View>
              )}
              <View style={styles.txtInput}>
                <Text style={styles.label}>Equipo / Club / Gimnasio</Text>
                <TextInput
                  placeholder="SmartFit"
                  placeholderTextColor="#ffffff70"
                  value={club}
                  onChangeText={setClub}
                  color="white"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.btnSave} onPress={updateProfile}>
              <Text style={styles.textSave}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.WHITE} />
                ) : (
                  "Guardar"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.WHITE,
    opacity: 0.5,
    fontSize: 11
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.BLUE,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    paddingRight: 30,
    color: Colors.WHITE
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  loader: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  justifyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
  title: {
    fontFamily: "Poppins-Regular",
    fontWeight: "700",
    fontSize: 20,
    color: Colors.WHITE
  },
  img: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  formContainer: {
    marginTop: 15,
    gap: 10,
    backgroundColor: Colors.BLUE_DARK,
    borderRadius: 5,
    padding: 20
  },
  txtInput: {
    borderRadius: 0,
    borderColor: Colors.WHITE,
    borderWidth: 0,
    borderBottomColor: Colors.WHITE,
    borderBottomWidth: 1,
    padding: 10,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10
  },
  picker: {
    borderColor: Colors.WHITE,
    borderWidth: 1,
    borderRadius: 10,
    height: 44,
    overflow: "hidden",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  textSave: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  btnSave: {
    backgroundColor: Colors.BLUE_DARK,
    padding: 12,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    // Propiedades de sombra para iOS
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Propiedad para sombra en Android
    elevation: 5,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
