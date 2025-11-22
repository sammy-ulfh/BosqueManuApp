import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../../mvc/views/user/Principal.js";
import ClientHome from "../../mvc/views/user/home/Home.js";
import Login from "../../mvc/views/user/Login.js";
import Singup from "../../mvc/views/user/Singup.js";
import Community from '../../mvc/views/user/Community.js';
import Donar from "../../mvc/views/user/Donar.js";
import Capacitacion from "../../mvc/views/user/Capacitacion.js";
import Capacitarme from "../../mvc/views/user/Capacitarme.js";
import Voluntariado from "../../mvc/views/user/Voluntariado.js";
import Voluntario from "../../mvc/views/user/Voluntario.js";
import Configuration from "../../mvc/views/user/Configuration.js";
import Routes from "../../mvc/views/user/rutas/Routes.js";
import Nineth from "../../mvc/views/user/Nineth.js";
import Tenth from "../../mvc/views/user/Tenth.js";
import Eleventh from "../../mvc/views/user/Eleventh.js";
import Info from "../../mvc/views/user/info/Info.js";

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
