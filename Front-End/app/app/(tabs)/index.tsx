import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../pages/Principal.tsx";
import Login from "../pages/client/Login.tsx";
import Singup from "../pages/client/Singup.tsx";
import First from "../pages/client/First";
import Second from "../pages/client/Second";
import Third from "../pages/client/Third";
import Fourth from "../pages/client/Fourth";
import Fifth from "../pages/client/Fifth";
import Sixth from "../pages/client/Sixth";
import Seventh from "../pages/client/Seventh";
import Eigth from "../pages/client/Eigth";
import Nineth from "../pages/client/Nineth";
import Tenth from "../pages/client/Tenth";
import Eleventh from "../pages/client/Eleventh";

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
        name="First"
        component={First}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Second"
        component={Second}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Third"
        component={Third}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Fourth"
        component={Fourth}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Fifth"
        component={Fifth}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Sixth"
        component={Sixth}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Seventh"
        component={Seventh}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Eigth"
        component={Eigth}
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
    </Stack.Navigator>
  );
}
