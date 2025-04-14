import React from 'react';
import { View, Text, Image, StyleSheet, Button, Linking, FlatList } from 'react-native';
import images from '@/assets/PowderImages'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ppxIngredientSummary } from '../app/(tabs)/ppx';

const Details = ({ route }: any) => {
  const { powder } = route.params;
  const [summaries, setSummaries] = useState({});

    useEffect(() => {
          let notGenerated = true;
          const generateSummaries = async () => {
            const summaryPromises = powder.ingredients.map(async (ingredient: string) => {
              try {
                const prompt = ingredient;
                const summary = await ppxIngredientSummary(prompt);
                return { id: powder.ingredients.indexOf(ingredient), summary };
              } catch (error) {
                return { id: powder.ingredients.indexOf(ingredient), summary: 'Summary not available' };
              }
            });
            const results = await Promise.all(summaryPromises);
            if (notGenerated) {
              setSummaries(prev => ({
                ...prev,
                ...Object.fromEntries(results.map(powder => [powder.id, powder.summary]))
              }));
            }
          };
          generateSummaries();
          return () => {
            notGenerated = false;
          };
      }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={(images as any)[powder.id]}
      />
      <Text style={styles.title}>{powder.name}</Text>
      <View style={styles.container2}>
      <Text style={[styles.detailText, {fontWeight:'bold'}]}>Price: <Text style={[styles.detailText, {fontWeight:'normal'}]}>${powder.price}</Text></Text>
      <Text style={[styles.detailText, {fontWeight:'bold'}]}>Our Safety Rating: <Text style={[styles.detailText, {fontWeight:'normal'}]}>{powder.safetyRating}</Text></Text>
      </View>
      <View style={styles.container3}>
      <FlatList
          data={powder.ingredients}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <SafeAreaView style={styles.ingredientCell}>
                <Text>{item.charAt(0).toUpperCase() + item.slice(1)}:</Text>
                <Text style={styles.summary}>{(summaries as any)[powder.ingredients.indexOf(item)] || 'Generating safety summary...'}</Text>
                
            </SafeAreaView>
          )}
      />
      </View>
      <Button title="Buy Now" onPress={() => Linking.openURL(powder.amazon)} />
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  container2: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  container3: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:10,
  },
  ingredientCell: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: 10,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 5,
  },
  summary: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  detailText: {
    fontSize: 16,
  }
});