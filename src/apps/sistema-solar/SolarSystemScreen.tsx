import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

const planets = [
  {
    id: 'mercurio',
    name: 'Mercurio',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/18_mercury_new.png',
    distance: '57,9 milhoes km',
    diameter: '4.879 km',
    description: 'O menor planeta e o mais proximo do Sol.',
  },
  {
    id: 'venus',
    name: 'Venus',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/27_venus_jg.png',
    distance: '108,2 milhoes km',
    diameter: '12.104 km',
    description: 'Atmosfera densa e temperatura extrema.',
  },
  {
    id: 'terra',
    name: 'Terra',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/17_earth.png',
    distance: '149,6 milhoes km',
    diameter: '12.742 km',
    description: 'Nosso lar e unico planeta com vida conhecida.',
  },
  {
    id: 'marte',
    name: 'Marte',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/19_mars.png',
    distance: '227,9 milhoes km',
    diameter: '6.779 km',
    description: 'Planeta vermelho com montanhas gigantes.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/16_jupiter_new.png',
    distance: '778,5 milhoes km',
    diameter: '139.820 km',
    description: 'Maior planeta, famoso pela Grande Mancha Vermelha.',
  },
  {
    id: 'saturno',
    name: 'Saturno',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/28_saturn.png',
    distance: '1,43 bilhao km',
    diameter: '116.460 km',
    description: 'Conhecido pelos aneis brilhantes.',
  },
  {
    id: 'urano',
    name: 'Urano',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/29_uranus.png',
    distance: '2,87 bilhoes km',
    diameter: '50.724 km',
    description: 'Gira quase de lado e tem tom azul-esverdeado.',
  },
  {
    id: 'netuno',
    name: 'Netuno',
    image:
      'https://solarsystem.nasa.gov/system/feature_items/images/30_neptune.png',
    distance: '4,5 bilhoes km',
    diameter: '49.244 km',
    description: 'Ventos extremamente fortes e azul intenso.',
  },
];

interface PlanetView {
  id: number;
  planetId: string;
  viewedAt: string;
}

const db = Platform.OS === 'web' ? null : SQLite.openDatabase('solar.db');

export function SolarSystemScreen() {
  const [selectedPlanet, setSelectedPlanet] = useState<typeof planets[0] | null>(
    null
  );
  const [recentViews, setRecentViews] = useState<PlanetView[]>([]);

  useEffect(() => {
    if (!db) return;
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS planet_views (id INTEGER PRIMARY KEY AUTOINCREMENT, planetId TEXT, viewedAt TEXT)'
      );
    });
  }, []);

  const loadRecent = () => {
    if (!db) return;
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM planet_views ORDER BY id DESC LIMIT 5',
        [],
        (_, { rows }) => {
          setRecentViews(rows._array as PlanetView[]);
        }
      );
    });
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const recentPlanets = useMemo(() => {
    return recentViews
      .map((view) => planets.find((planet) => planet.id === view.planetId))
      .filter(Boolean) as typeof planets;
  }, [recentViews]);

  const handleOpenPlanet = (planet: typeof planets[0]) => {
    setSelectedPlanet(planet);
    if (!db) return;
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO planet_views (planetId, viewedAt) VALUES (?, ?)',
        [planet.id, new Date().toISOString()],
        () => loadRecent()
      );
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sistema Solar</Text>
        <Text style={styles.subtitle}>
          Toque em um planeta para ver detalhes
        </Text>

        {recentPlanets.length > 0 ? (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Ultimos vistos</Text>
            <View style={styles.recentRow}>
              {recentPlanets.map((planet) => (
                <View key={`recent-${planet.id}`} style={styles.recentCard}>
                  <Image source={{ uri: planet.image }} style={styles.recentImage} />
                  <Text style={styles.recentName}>{planet.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.grid}>
          {planets.map((planet) => (
            <TouchableOpacity
              key={planet.id}
              style={styles.card}
              onPress={() => handleOpenPlanet(planet)}
            >
              <Image source={{ uri: planet.image }} style={styles.planetImage} />
              <Text style={styles.planetName}>{planet.name}</Text>
              <Text style={styles.planetMeta}>{planet.distance}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedPlanet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPlanet(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedPlanet ? (
              <>
                <Image
                  source={{ uri: selectedPlanet.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedPlanet.name}</Text>
                <Text style={styles.modalText}>{selectedPlanet.description}</Text>
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoBox}>
                    <Text style={styles.modalInfoLabel}>Distancia</Text>
                    <Text style={styles.modalInfoValue}>
                      {selectedPlanet.distance}
                    </Text>
                  </View>
                  <View style={styles.modalInfoBox}>
                    <Text style={styles.modalInfoLabel}>Diametro</Text>
                    <Text style={styles.modalInfoValue}>
                      {selectedPlanet.diameter}
                    </Text>
                  </View>
                </View>
              </>
            ) : null}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPlanet(null)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#080a1a',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#e0e7ff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(199,210,254,0.8)',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fbbf24',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 10,
    letterSpacing: 1,
  },
  recentSection: {
    marginBottom: 20,
  },
  recentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recentCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  recentImage: {
    width: 46,
    height: 46,
  },
  recentName: {
    color: '#e0e7ff',
    fontSize: 11,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  planetImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  planetName: {
    color: '#e0e7ff',
    fontWeight: '700',
    fontSize: 14,
  },
  planetMeta: {
    color: 'rgba(148,163,184,0.8)',
    fontSize: 11,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 10, 26, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  modalImage: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#e0e7ff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalText: {
    color: 'rgba(226,232,240,0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalInfoBox: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modalInfoLabel: {
    color: 'rgba(148,163,184,0.8)',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
  },
  modalInfoValue: {
    color: '#e0e7ff',
    fontWeight: '700',
    fontSize: 12,
  },
  closeButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#0f172a',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
