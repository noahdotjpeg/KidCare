import { useState, useEffect } from 'react';
import { StyleSheet, Image, Platform, LayoutAnimation, TouchableOpacity, SafeAreaView, Text, View, TextInput, FlatList, Button, Linking } from 'react-native';
import { powders } from '../app/(tabs)/powders';
import { ThemedView } from '@/components/ThemedView';
import images from '@/assets/PowderImages'
import Slider from '@react-native-community/slider';
import { ppxIngredientListSummary } from '../app/(tabs)/ppx';


const Filter = ({navigation}: any) => {
    const [priceRange, setPriceRange] = useState([0,10]);
    const [safetyRange, setSafetyRange] = useState([1,5]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [productName, setProductName] = useState('');
    const [filteredPowders, setFilteredPowders] = useState(powders);
    const [open, setOpen] = useState(true);
    const [filterApplied, setFilterApplied] = useState(false);
    const [summaries, setSummaries] = useState({});

    useEffect(() => {
      let notGenerated = true;
      const generateSummaries = async () => {
        const summaryPromises = powders.map(async (powder) => {
          try {
            const prompt = powder.ingredients.join(', ');
            const summary = await ppxIngredientListSummary(prompt);
            return { id: powder.id, summary };
          } catch (error) {
            return { id: powder.id, summary: 'Summary not available' };
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

    // collapse based on https://stackoverflow.com/questions/62338426/section-list-with-collapsible-section-header-in-react-native
    const onPress = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOpen(!open);
    };
    
    const handle = () => {
      const blacklist = selectedIngredient.split(',').map(i => i.trim().toLowerCase()).filter(i=>i);
      const filtered = powders.filter((powder) => {
        const inPriceRange = ((!priceRange[0] || powder.price >= priceRange[0]) && (!priceRange[1] || powder.price <= priceRange[1]));
        const ingredientMatch = (!blacklist.length || !powder.ingredients.some(ingredient => blacklist.includes(ingredient.toLowerCase())));
        const safetyMatch = ((!safetyRange[0] || powder.safetyRating >= safetyRange[0]));
        const nameMatch = ((!productName || powder.name.toLowerCase().indexOf(productName.toLowerCase()) > -1));
        return inPriceRange && ingredientMatch && safetyMatch && nameMatch;
      });
      setFilteredPowders(filtered);
      setFilterApplied(true);
      setOpen(!open);
    };
  
    const bgColor = (val: number) => {
      if (val > 4.5) return '#99ff99';
      if (val >= 2.5) return '#ffff99';
      return '#ff9999';
    };

    return (
      <ThemedView style={styles.container}>
        <TouchableOpacity style={[styles.filterButton, !open && { height: 40 }]} onPress={onPress} activeOpacity={1}>
        {!open && (<Text style={{textAlign: 'center'}}>Filters</Text>)}
        {open && (
          <ThemedView>
          <TouchableOpacity style={[styles.filterItem, !open && { height: 40 }]} activeOpacity={1}>
            <Text style={styles.title}>Filter Products</Text>
              <TextInput 
                placeholder="Product Name:"
                value={productName}
                onChangeText={setProductName}
                style={styles.input}
              />
              <Text style={styles.sliderText}> Set Max Price: ${priceRange[0]} - ${priceRange[1]}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={0.01}
                value={priceRange[0]}
                onValueChange={(val)=> setPriceRange([priceRange[0], val])}
              />
              <Text style={styles.sliderText}> Set Minimum Safety Rating: {safetyRange[0]} - {safetyRange[1]}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={0.1}
                value={safetyRange[0]}
                onValueChange={(val)=> setSafetyRange([val, safetyRange[1]])}
              />
              <TextInput
                placeholder="Exclude Ingredients:"
                value={selectedIngredient}
                onChangeText={setSelectedIngredient}
                style={styles.input}
              />
            <Button title="Apply Filters" onPress={handle} />
          </TouchableOpacity>
        </ThemedView>
        )}
        </TouchableOpacity>
        {filterApplied && (<FlatList
          data={filteredPowders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ThemedView style={[styles.powderItem, {backgroundColor: bgColor(item.safetyRating)}]}>
              <TouchableOpacity onPress={() => navigation.navigate('Details', {powder: item})}>
              <Image
                style={styles.image}
                source={(images as any)[item.id]}
              />
              <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
              <Text style={{fontWeight: 'bold'}}>Price: <Text style={{fontWeight: 'normal'}}>${item.price}</Text></Text>
              <Text style={{fontWeight: 'bold'}}>Our Safety Rating: <Text style={{fontWeight: 'normal'}}>{item.safetyRating}</Text></Text>
              <Text style={{fontWeight: 'bold'}}>Ingredients:<Text style={{fontWeight: 'normal'}}> {item.ingredients.join(', ')} </Text></Text>
              <Text style={styles.summary}>{(summaries as any)[item.id] || 'Generating safety summary...'}</Text>
              </TouchableOpacity>
              <Button title="Buy Now" onPress={() => Linking.openURL(item.amazon)}/>
            </ThemedView>
          )}
        />)}
      </ThemedView>
    );
  };
  const styles = StyleSheet.create({
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

export default Filter;
