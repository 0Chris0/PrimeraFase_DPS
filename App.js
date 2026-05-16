import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import Buscar from './Buscar';
import DetalleLibro from './DetalleLibro';
import Favoritos from './Favs';
import Perfil from './Perfil';
import Login from './Login';
import Registro from './Registro';
import Splash from './Splash';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InicioLibros" component={Buscar} options={{ headerShown: false }} />
      <Stack.Screen name="Detalle" component={DetalleLibro} options={{ title: 'Detalle del Libro' }} />
    </Stack.Navigator>
  );
}

function BuscarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BuscarLibros" component={Buscar} options={{ headerShown: false }} />
      <Stack.Screen name="Detalle" component={DetalleLibro} options={{ title: 'Detalle del Libro' }} />
    </Stack.Navigator>
  );
}

function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Buscar') iconName = 'search';
          else if (route.name === 'Favoritos') iconName = 'heart';
          else if (route.name === 'Perfil') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Inicio" component={InicioStack} options={{ headerShown: false }} />
      <Tab.Screen name="Buscar" component={BuscarStack} options={{ headerShown: false }} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
      <Tab.Screen name="Perfil">
        {() => <Perfil onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
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

export default function App() {
  const [sesionActiva, setSesionActiva] = useState(false);

  const handleLogin = () => setSesionActiva(true);
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('sesion_activa');
    setSesionActiva(false);
  };

  return (
    <NavigationContainer>
      {sesionActiva
        ? <MainTabs onLogout={handleLogout} />
        : <AuthStack onLogin={handleLogin} />
      }
    </NavigationContainer>
  );
}