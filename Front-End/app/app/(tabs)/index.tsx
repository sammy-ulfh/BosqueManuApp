import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CapacitacionesAdmin from "../pages/admin/CapacitacionesAdmin";
import VoluntariosAdmin from "../pages/admin/VoluntariosAdmin";
import DonativosAdmin from "../pages/admin/DonativosAdmin";
import Login from "../pages/admin/Login.tsx";
import Signup from "../pages/admin/Singup.tsx";
import HomeAdmin from '../pages/admin/HomeAdmin.tsx';
import AddCourseAdmin from '../pages/admin/AddCourseAdmin.tsx'; 
import AddEventAdmin from '../pages/admin/AddEventAdmin.tsx'; 


const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Login">
        
        {/* Auth */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{ headerShown: false }} 
        />

        {/* Admin - Aquí es donde irán todos al entrar */}
        <Stack.Screen 
          name="HomeAdmin" 
          component={HomeAdmin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CapacitacionesAdmin" 
          component={CapacitacionesAdmin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VoluntariosAdmin" 
          component={VoluntariosAdmin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="DonativosAdmin" 
          component={DonativosAdmin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AddEventAdmin" 
          component={AddEventAdmin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AddCourseAdmin" 
          component={AddCourseAdmin} 
          options={{ headerShown: false }} 
        />

      </Stack.Navigator>
  );
}
