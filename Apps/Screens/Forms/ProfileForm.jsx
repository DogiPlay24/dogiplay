import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../Utils/SupabaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../Utils/Colors";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { images } from "./../../../assets/images/index";
import { countries } from "../../Utils/Locations";

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
  const [completed, setCompleted] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [dataSports, setDataSports] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

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
      setCompleted(data.completed);

      if (completed) {
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

  return (
    <>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.BLUE_DARK} />
        </View>
      ) : (
        <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
          <View style={styles.justifyContainer}>
            <Text style={styles.title}>Completar Perfil</Text>
            <Image source={images.logo} style={styles.img} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.txtInput}>
              <Text>Nombre</Text>
              <TextInput
                placeholder="Jhon Doe"
                value={name}
                onChangeText={setName}
                editable={false}
              />
            </View>

            <View style={styles.txtInput}>
              <Text>Nombre de usuario</Text>
              <TextInput
                placeholder="JhonDoe"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.picker}>
              <Picker
                selectedValue={genre}
                onValueChange={(itemValue) => setGenre(itemValue)}
              >
                <Picker.Item
                  style={styles.pickerItem}
                  label="Selecciona tu sexo"
                  value=""
                />
                <Picker.Item label="Masculino" value="M" />
                <Picker.Item label="Femenino" value="F" />
                <Picker.Item label="Personalizado" value="P" />
              </Picker>
            </View>

            <View style={styles.txtInput}>
              <Text>Fecha de nacimiento</Text>
              <Pressable onPress={toggleDatePicker}>
                <TextInput
                  placeholder="Selecciona tu fecha de nacimiento"
                  value={date.toLocaleDateString()}
                  editable={false}
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
              <Picker
                selectedValue={sport}
                onValueChange={(itemValue) => setSport(itemValue)}
              >
                <Picker.Item
                  style={styles.pickerItem}
                  label="Selecciona tu Deporte"
                  value=""
                />
                {dataSports?.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.name}
                    value={item.name}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={handleCountryChange}
              >
                <Picker.Item
                  style={styles.pickerItem}
                  label="Selecciona tu país"
                  value=""
                />
                {countryOptions.map((country) => (
                  <Picker.Item
                    key={country.value}
                    label={country.label}
                    value={country.value}
                  />
                ))}
              </Picker>
            </View>

            {selectedCountry && (
              <View style={styles.picker}>
                <Picker
                  selectedValue={selectedState}
                  onValueChange={(value) => setSelectedState(value)}
                >
                  <Picker.Item label="Selecciona tu estado" value="" />
                  {stateOptions.map((state) => (
                    <Picker.Item
                      key={state.value}
                      label={state.label}
                      value={state.value}
                    />
                  ))}
                </Picker>
              </View>
            )}

            {selectedState && (
              <View style={styles.picker}>
                <Picker
                  selectedValue={selectedMunicipality}
                  onValueChange={(value) => setSelectedMunicipality(value)}
                >
                  <Picker.Item label="Selecciona tu municipio" value="" />
                  {municipalityOptions.map((municipality) => (
                    <Picker.Item
                      key={municipality.value}
                      label={municipality.label}
                      value={municipality.value}
                    />
                  ))}
                </Picker>
              </View>
            )}

            <View style={styles.txtInput}>
              <Text>Equipo / Club / Gimnasio</Text>
              <TextInput
                placeholder="SmartFit"
                value={club}
                onChangeText={setClub}
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  },
  img: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  formContainer: {
    marginTop: 15,
    gap: 10,
  },
  txtInput: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 10,
  },
  picker: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  pickerItem: {
    color: Colors.GREY,
  },
  pickerItemSelect: {
    color: Colors.BLACK,
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
  },
});
