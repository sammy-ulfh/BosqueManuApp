import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CapacitacionesAdmin from "../pages/admin/CapacitacionesAdmin";
import VoluntariosAdmin from "../pages/admin/VoluntariosAdmin";
import DonativosAdmin from "../pages/admin/DonativosAdmin";
import SOSAlertsScreen from "../pages/admin/SOSAlertsScreen";
import Login from "../pages/admin/Login";
import Signup from "../pages/admin/Singup";
import Info from "../pages/admin/Info";
import HomeAdmin from '../pages/admin/HomeAdmin';
import AddCourseAdmin from '../pages/admin/AddCourseAdmin'; 
import AddEventAdmin from '../pages/admin/AddEventAdmin'; 
import RutasAdmin from '../pages/admin/RutasAdmin';
import { startSosListener } from '../services/sosListener';


const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    startSosListener().catch(err => console.error('Error starting global SOS listener', err));
  }, []);
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
          name="Info" 
          component={Info} 
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
          name="SOSAlertsAdmin" 
          component={SOSAlertsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AddEventAdmin" 
          component={AddEventAdmin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RutasAdmin" 
          component={RutasAdmin} 
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
