import { Image } from 'expo-image';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import * as Font from 'expo-font';
import React, { useState } from 'react';

export default function HomeScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'TenorSans': require('../../assets/fonts/TenorSans-Regular.ttf'),
    });
    setFontsLoaded(true);
  };

  React.useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/main/background.png')}
      style={styles.background}
    >

    <View style={[styles.totalWidth, styles.totalHeight, styles.container, styles.overlay]}>
      <View style={[styles.totalWidth, styles.content]}>
        <View style={[styles.totalWidth, styles.right, {height: '20%'}]}>
          <View style={[{width: '80%', height: '100%'}]}>
            <Text style={[styles.totalWidth, styles.totalHeight, styles.whiteText]}>
              Donar a Más Bosque Manu, es donar para salvar una vida
            </Text>
          </View>
        </View>
        <View></View>
        <View></View>
      </View>
    </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  totalWidth: {
    width: '100%',
  },
  totalHeight: {
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  }, 
  content: {
    height: '50%',
  },
  whiteText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'TenorSans',

  },
  right: {
    alignItems: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // llena toda la superficie
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // negro con opacidad 50%
  },
});
