import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Image, Platform } from "react-native";

// PANTALLAS
import Inicio from "./inicio";
import Buscar from "./Buscar";
import Biblioteca from "./Biblioteca";
import DetalleLibro from "./DetalleLibro";
import Favoritos from "./Favs";
import Perfil from "./Perfil";
import Login from "./Login";
import Registro from "./Registro";
import Splash from "./Splash";
import Resenas from "./Resenas";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* =========================
   STACK PRINCIPAL (INICIO)
========================= */
function InicioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={Inicio} />
      <Stack.Screen name="Detalle" component={DetalleLibro} />

      {/* ✅ SOLO AGREGADO */}
      <Stack.Screen name="Resenas" component={Resenas} />
    </Stack.Navigator>
  );
}

/* =========================
   STACK BUSCAR
========================= */
function BuscarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Buscar" component={Buscar} />
      <Stack.Screen name="Detalle" component={DetalleLibro} />

      {/* ✅ SOLO AGREGADO */}
      <Stack.Screen name="Resenas" component={Resenas} />
    </Stack.Navigator>
  );
}

/* =========================
   STACK BIBLIOTECA
========================= */
function BibliotecaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Biblioteca" component={Biblioteca} />
      <Stack.Screen name="Detalle" component={DetalleLibro} />

      {/* ✅ SOLO AGREGADO */}
      <Stack.Screen name="Resenas" component={Resenas} />
    </Stack.Navigator>
  );
}

/* =========================
   TABS
========================= */
function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Inicio")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Buscar")
            iconName = focused ? "search" : "search-outline";
          else if (route.name === "Biblioteca")
            iconName = focused ? "book" : "book-outline";
          else if (route.name === "Favoritos")
            iconName = focused ? "heart" : "heart-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";

          return (
            <Ionicons
              name={iconName}
              size={30}
              color={color}
              style={{
                marginTop: Platform.OS === "ios" ? 0 : -4,
              }}
            />
          );
        },

        tabBarBackground: () => (
          <Image
            source={require("./assets/fondo.png")}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            resizeMode="cover"
          />
        ),

        tabBarStyle: {
          height: 65,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
          paddingBottom: 10,
          paddingTop: 10,
        },

        tabBarActiveTintColor: "#d5a144",
        tabBarInactiveTintColor: "#e8e3cc",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Inicio" component={InicioStack} />
      <Tab.Screen name="Buscar" component={BuscarStack} />
      <Tab.Screen name="Biblioteca" component={BibliotecaStack} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
      <Tab.Screen name="Perfil">
        {() => <Perfil onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

/* =========================
   AUTH
========================= */
function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login">
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Registro">
        {(props) => <Registro {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/* =========================
   APP
========================= */
/* =========================
   APP PRINCIPAL (Dentro de tu componente App)
========================= */
export default function App() {
  const [sesionActiva, setSesionActiva] = useState(false);
  const [esPrimeraVez, setEsPrimeraVez] = useState(true);

  return (
    <NavigationContainer>
      {sesionActiva ? (
        // Si hay sesión, mostramos las pestañas (MainTabs)
        <MainTabs
          onLogout={() => {
            setSesionActiva(false);
            setEsPrimeraVez(false); // <--- Marcamos que ya no es primera vez
          }}
        />
      ) : (
        // SI NO HAY SESIÓN (Aquí es donde va el bloque que preguntaste)
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={esPrimeraVez ? "Splash" : "Login"}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login">
            {(props) => (
              <Login {...props} onLogin={() => setSesionActiva(true)} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Registro">
            {(props) => (
              <Registro {...props} onLogin={() => setSesionActiva(true)} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
