import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#C89D7A', dark: '#C89D7A' }}
      headerImage={
        <Image
          source={require('@/assets/images/ai_logo2.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to KidCare!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">About Us</ThemedText>
        <ThemedText>
          We're an app dedicated to letting you shop for the clean products that work best for you and your children. To start, tap the Filter tab to find your desired product. Make sure to apply your desired filters first; otherwise, click "Apply Filters" to get shopping!
        </ThemedText>
        <ThemedText>
          We assign a safety rating to all of the products we support; this ranges from <ThemedText style={{fontWeight:"bold"}}>1 - 5</ThemedText>. A lower score indicates a product that contains one or multiple ingredients that are well-known to cause health issues. A higher score indicates a product that doesn't contain ingredients like those.
        </ThemedText>
        <ThemedText>
          We use Perplexity in order to generate source-driven summaries for the products we list; this way, you can always know where the information is coming from.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});
