import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "@/mvc/views/user/Principal";
import ClientHome from "@/mvc/views/user/home/Home";
import Login from "@/mvc/views/user/Login";
import Singup from "@/mvc/views/user/Singup";
import Community from "@/mvc/views/user/Community";
import Donar from "@/mvc/views/user/Donar";
import Capacitacion from "@/mvc/views/user/Capacitacion";
import Capacitarme from "@/mvc/views/user/Capacitarme";
import Voluntariado from "@/mvc/views/user/Voluntariado";
import Voluntario from "@/mvc/views/user/Voluntario";
import Configuration from "@/mvc/views/user/Configuration";
import Routes from "@/mvc/views/user/rutas/Routes";
import Nineth from "@/mvc/views/user/Nineth";
import Tenth from "@/mvc/views/user/Tenth";
import Eleventh from "@/mvc/views/user/Eleventh";
import Info from "@/mvc/views/user/info/Info";
import Security from "@/mvc/views/user/configuracion/cambiarContrasena";
import ChangePassword from "@/mvc/views/user/configuracion/ChangePassword";
import PersonalData from "@/mvc/views/user/configuracion/PersonalData";
import Permissions from "@/mvc/views/user/configuracion/Permissions";
import Help from "@/mvc/views/user/configuracion/Help";

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

            <Stack.Screen
        name="Security"
        component={Security}
        options={{ headerShown: false }}
      />

            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{ headerShown: false }}
            />

      <Stack.Screen
        name="PersonalData"
        component={PersonalData}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Permissions"
        component={Permissions}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Help"
        component={Help}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
