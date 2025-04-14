import {NavigationContainer, NavigationIndependentTree} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Filter from '@/screens/filter';
import Details from '@/screens/details';
import {SafeAreaView, StyleSheet, Button, View, Text} from 'react-native';

const Stack = createNativeStackNavigator();

const Duo = () => {
    return (
        <SafeAreaView style={styles.container}>
        <NavigationIndependentTree>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Filter"
              component={Filter}
              options={{ title: 'Products' }}
            />
            <Stack.Screen
              name="Details"
              component={Details}
              options={{ title: 'Product Description' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </NavigationIndependentTree>
      </SafeAreaView>
    );
};

export default Duo;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    navButton: {
      flex: 1,
      width: '30%',
    },
    title: {
      
    },
  });