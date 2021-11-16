import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from "@react-navigation/drawer";
import {borderColor, white} from "./styles/mainTheme";
import CustomDrawer from "./components/navigation/customDrawer";
import NoneSelected from "./views/NoneSelected";
import SelectedGroup from "./views/SelectedGroup";
import TeamsCreation from "./views/TeamsCreation";

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer theme={{colors: {background: white}}}>
            <Drawer.Navigator
                screenOptions={{drawerType: "permanent", drawerStyle: {borderColor: borderColor}, header: () => undefined}}
                drawerContent={props => <CustomDrawer {...props}/>}
            >
                <Drawer.Screen name="NoneSelected" component={NoneSelected}/>
                <Drawer.Screen name="SelectedGroup" component={SelectedGroup}/>
                <Drawer.Screen name="TeamsCreation" component={TeamsCreation}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
