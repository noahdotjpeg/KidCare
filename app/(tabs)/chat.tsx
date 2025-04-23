import { Image, StyleSheet, Platform, Button, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import {chat} from '@/app/(tabs)/ppx'
export default function HomeScreen() {
  const [userText, setUserText] = useState('');
  const [chatOut, setChatOut] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);
  const doPromptStuff = () => {
    const generateSummary = async () => {
        try {
            if (userText) {
                const summary = await chat(userText);
                setChatOut(summary);
                return summary;
            }

        } catch (error) {
        setChatOut("Summary not available")
        return 'Summary not available' ;
        }
    }
    generateSummary();
  };

  return (
      <View style={styles.outer}>
      <View style={styles.titleContainer}>
        <ThemedText style={{color:'#000000'}} type="title">Chat</ThemedText>
      </View>
      <View style={styles.stepContainer}>
        {!chatOut && buttonPressed && (
          <Text>Thinking...</Text>
        )}
        <ScrollView>
        <ThemedText style={styles.response}>{chatOut || ''}</ThemedText>
        </ScrollView>
        <TextInput
        placeholder="Enter your question here!"
        value={userText}
        onChangeText={setUserText}
        style={styles.input}
        />
        <Button title="Chat" onPress={() => {
            setChatOut('');
            doPromptStuff();
            setButtonPressed(true);
        }}
        />
        
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    color: '#000000',
    alignContent: 'flex-start'
  },
  response: {
    flex: 3,
    color: '#000000'
  },
  outer: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
    inputContainer: {
        marginBottom: 24,
    },
    container: {
      flex: 3,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    summary: {
      fontSize: 16,
      marginTop: 20,
      fontWeight: 'normal',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      flex: 1,
    },
    powderItem: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
      //backgroundColor: 'green',
    },
    filterButton: {
      width: '100%',
      borderWidth: 0,
      borderLeftWidth: 1,
      overflow: 'hidden',
      paddingVertical: 10,
      marginBottom: 5,
      alignSelf: 'center',
      backgroundColor: '#bcbcbc',
    },
    filterItem: {
      width: '100%',
      borderWidth: 0,
      paddingHorizontal: 20,
      overflow: 'hidden',
      paddingVertical: 10,
      marginBottom: 5,
      backgroundColor: '#bcbcbc',
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    sliderText: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    slider: {
        width: 'auto',
        height: 40,
        marginBottom: 10,
    },
    result: {
        marginTop: 24,
        fontSize: 16,
    },
});
