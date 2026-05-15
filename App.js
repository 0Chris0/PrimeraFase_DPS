import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Buscar from './Buscar';
import DetalleLibro from './DetalleLibro';
import Favoritos from './Favs';
import Perfil from './Perfil';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function InicioStack() {

  return (

    <Stack.Navigator>

      <Stack.Screen
        name="InicioLibros"
        component={Buscar}
        options={{ headerShown: false }} // Esto elimina la barra de titulos de las pantallas
      />

      <Stack.Screen
        name="Detalle"
        component={DetalleLibro}
        options={{ title: 'Detalle del Libro' }}
      />

    </Stack.Navigator>
  );
}
function BuscarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BuscarLibros"
        component={Buscar}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleLibro}
        options={{ title: 'Detalle del Libro' }}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Inicio') {
              iconName = 'home';
            }
            else if (route.name === 'Buscar') {
              iconName = 'search';
            }
            else if (route.name === 'Favoritos') {
              iconName = 'heart';
            }
            else if (route.name === 'Perfil') {
              iconName = 'person';
            }
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          }
        })}
      >
        <Tab.Screen
          name="Inicio"
          component={InicioStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Buscar"
          component={BuscarStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Favoritos"
          component={Favoritos}
        />
        <Tab.Screen
          name="Perfil"
          component={Perfil}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}