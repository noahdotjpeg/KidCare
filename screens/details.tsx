import React from 'react';
import { View, Text, Image, StyleSheet, Button, Linking, FlatList } from 'react-native';
import images from '@/assets/PowderImages'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ppxIngredientSummary } from '../app/(tabs)/ppx';
import Slider from '@react-native-community/slider';

const Details = ({ route }: any) => {
  const { powder } = route.params;
  const [summaries, setSummaries] = useState({});
  const [userScoreRange, setUserScoreRange] = useState([1,5]);
  const [ratingApplied, setRatingApplied] = useState(false);
  const [toggleView, setToggleView] = useState(false);
  const [open, setOpen] = useState(true);
  
  const updateRating = () => {
    if  (!ratingApplied) {
      let assumeWeight = 10;
      powder.safetyRating = (powder.safetyRating * assumeWeight + userScoreRange[0]) / (assumeWeight + 1);
      setRatingApplied(true);
    }
    setOpen(!open);
  }

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
      <Button title="Buy Now" onPress={() => {Linking.openURL(powder.amazon); setOpen(true);}} />
      {!open && (
        <View>
        <Text style={styles.sliderText}> How would you rate this product?: {userScoreRange[0]}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={0.1}
          value={userScoreRange[0]}
          onValueChange={(val)=> setUserScoreRange([val, userScoreRange[1]])}
        />
        <Button title="Submit Rating" onPress={() => updateRating} />
        </View>
        )}
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
});