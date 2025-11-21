import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../pages/Principal.tsx";
import ClientHome from "../pages/client/Home";
import Login from "../pages/client/Login.tsx";
import Singup from "../pages/client/Singup.tsx";
import Community from '../pages/client/Community';
import Donar from "../pages/client/Donar";
import Capacitacion from "../pages/client/Capacitacion";
import Capacitarme from "../pages/client/Capacitarme";
import Voluntariado from "../pages/client/Voluntariado";
import Voluntario from "../pages/client/Voluntario";
import Configuration from "../pages/client/Configuration";
import Routes from "../pages/client/Routes";
import Nineth from "../pages/client/Nineth";
import Tenth from "../pages/client/Tenth";
import Eleventh from "../pages/client/Eleventh";
import Info from "../pages/client/Info";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientHome"
        component={ClientHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Singup"
        component={Singup}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Community"
        component={Community}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Donar"
        component={Donar}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Capacitacion"
        component={Capacitacion}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Capacitarme"
        component={Capacitarme}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Voluntariado"
        component={Voluntariado}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Voluntario"
        component={Voluntario}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Configuration"
        component={Configuration}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Routes"
        component={Routes}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Nineth"
        component={Nineth}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Tenth"
        component={Tenth}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Eleventh"
        component={Eleventh}
        options={{ headerShown: false }}
      />

    <Stack.Screen
        name="Info"
        component={Info}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
