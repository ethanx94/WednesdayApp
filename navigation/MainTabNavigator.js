import React from 'react';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import DudeScreen from '../screens/DudeScreen';
import CollectionScreen from '../screens/CollectionScreen';
import DefaultHomeScreen from '../screens/DefaultHomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    Dude: {
      screen: DudeScreen,
    },
    Collection: {
      screen: CollectionScreen,
    },
    DefaultHome: {
      screen: DefaultHomeScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Dude':
            iconName =
              Platform.OS === 'ios'
                ? `ios-information-circle${focused ? '' : '-outline'}`
                : 'md-information-circle';
            break;
          case 'Collection':
            iconName = Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link';
            break;
          case 'DefaultHome':
            iconName =
              Platform.OS === 'ios'
                ? `ios-information-circle${focused ? '' : '-outline'}`
                : 'md-information-circle';
            break;
          case 'Settings':
            iconName =
              Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options';
            break;
          default:
            break;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
