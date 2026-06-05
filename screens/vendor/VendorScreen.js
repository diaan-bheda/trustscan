import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, SafeAreaView
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function VendorScreen({ vendorId }) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const docRef = doc(db, 'vendors', vendorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVendor(docSnap.data());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1A56A0" />;
  if (!vendor) return <Text style={styles.error}>Vendor not found.</Text>;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const params = [
    { label: '🧤 Personal Hygiene', score: vendor.personalHygiene, max: 20 },
    { label: '🧊 Food Storage', score: vendor.foodStorage, max: 20 },
    { label: '💧 Water Quality', score: vendor.waterQuality, max: 20 },
    { label: '🍽️ Utensil Cleanliness', score: vendor.utensilCleanliness, max: 15 },
    { label: '🗑️ Waste Disposal', score: vendor.wasteDisposal, max: 15 },
    { label: '🥬 Ingredient Freshness', score: vendor.ingredientFreshness, max: 10 },
  ];

  const getGrade = (score) => {
    if (score >= 85) return 'Excellent ✅';
    if (score >= 70) return 'Good 👍';
    if (score >= 50) return 'Average ⚠️';
    return 'Poor ❌';
  };

  const getBarColor = (ratio) => {
    if (ratio >= 0.8) return '#1D8A4B';
    if (ratio >= 0.6) return '#C47C0A';
    return '#C0392B';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>TRUSTSCAN · Inspector Verified</Text>
          <Text style={styles.vendorName}>{vendor.name}</Text>
          <Text style={styles.vendorSub}>{vendor.foodType} · {vendor.location}</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNum}>{vendor.totalScore}</Text>
          <Text style={styles.scoreLabel}>/ 100</Text>
          <Text style={styles.scoreGrade}>{getGrade(vendor.totalScore)}</Text>
          <Text style={styles.lastInspected}>
            Last inspected: {formatDate(vendor.lastInspected)}
          </Text>
        </View>

        {/* Score Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SCORE BREAKDOWN</Text>
          {params.map((p, i) => (
            <View key={i} style={styles.param}>
              <View style={styles.paramHeader}>
                <Text style={styles.paramName}>{p.label}</Text>
                <Text style={styles.paramScore}>{p.score}/{p.max}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {
                  width: `${(p.score / p.max) * 100}%`,
                  backgroundColor: getBarColor(p.score / p.max)
                }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Vendor Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>VENDOR INFO</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>FSSAI</Text>
              <Text style={styles.infoValue}>{vendor.fssai ? '✅ Active' : '❌ None'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Registered Since</Text>
              <Text style={styles.infoValue}>{formatDate(vendor.registeredSince)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Food Type</Text>
              <Text style={styles.infoValue}>{vendor.foodType}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Inspections</Text>
              <Text style={styles.infoValue}>{vendor.inspectionCount} total</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Scores are set exclusively by Trust-Scan certified inspectors.{'\n'}
          Ratings cannot be altered by vendors or customers.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F2EC' },
  container: { flex: 1 },
  header: {
    backgroundColor: '#1A56A0',
    padding: 28,
    paddingTop: 48,
  },
  brand: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 10,
    fontWeight: '600',
  },
  vendorName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  vendorSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
  },
  scoreCard: {
    backgroundColor: '#1A3A6A',
    padding: 28,
    alignItems: 'center',
  },
  scoreNum: {
    color: '#52D48A',
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    marginBottom: 8,
  },
  scoreGrade: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  lastInspected: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6B60',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  param: { marginBottom: 14 },
  paramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  paramName: { fontSize: 13, fontWeight: '500', color: '#1A1A18' },
  paramScore: { fontSize: 13, fontWeight: '700', color: '#1A56A0' },
  barTrack: {
    height: 7,
    backgroundColor: '#F0E6D3',
    borderRadius: 99,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 99 },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoItem: {
    backgroundColor: '#F5F2EC',
    borderRadius: 10,
    padding: 12,
    width: '47%',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B6B60',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: { fontSize: 13, fontWeight: '500', color: '#1A1A18' },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#6B6B60',
    padding: 20,
    lineHeight: 18,
  },
  error: {
    flex: 1,
    textAlign: 'center',
    marginTop: 40,
    color: 'red',
  },
});