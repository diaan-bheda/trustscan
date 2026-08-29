import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { signOut } from 'firebase/auth';

export default function RatingScreen({ onLogout }) {
    const [vendorId, setVendorId] = useState('');
    const [scores, setScores] = useState({
        personalHygiene: '',
        foodStorage: '',
        waterQuality: '',
        utensilCleanliness: '',
        wasteDisposal: '',
        ingredientFreshness: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const params = [
        { key: 'personalHygiene', label: 'Personal Hygiene', max: 20 },
        { key: 'foodStorage', label: 'Food Storage', max: 20 },
        { key: 'waterQuality', label: 'Water Quality', max: 20 },
        { key: 'utensilCleanliness', label: 'Utensil Cleanliness', max: 15 },
        { key: 'wasteDisposal', label: 'Waste Disposal', max: 15 },
        { key: 'ingredientFreshness', label: 'Ingredient Freshness', max: 10 },
    ];

    const handleSubmit = async () => {
        if (!vendorId) {
            Alert.alert('Error', 'Please enter a vendor ID.');
            return;
        }

        for (const p of params) {
            const val = parseInt(scores[p.key]);
            if (isNaN(val) || val < 0 || val > p.max) {
                Alert.alert('Error', `${p.label} must be between 0 and ${p.max}.`);
                return;
            }
        }

        const totalScore =
            parseInt(scores.personalHygiene) +
            parseInt(scores.foodStorage) +
            parseInt(scores.waterQuality) +
            parseInt(scores.utensilCleanliness) +
            parseInt(scores.wasteDisposal) +
            parseInt(scores.ingredientFreshness);

        setLoading(true);
        try {
            const vendorRef = doc(db, 'vendors', vendorId);
            await updateDoc(vendorRef, {
                personalHygiene: parseInt(scores.personalHygiene),
                foodStorage: parseInt(scores.foodStorage),
                waterQuality: parseInt(scores.waterQuality),
                utensilCleanliness: parseInt(scores.utensilCleanliness),
                wasteDisposal: parseInt(scores.wasteDisposal),
                ingredientFreshness: parseInt(scores.ingredientFreshness),
                totalScore,
                lastInspected: serverTimestamp(),
                inspectionCount: (await import('firebase/firestore')).increment(1),
            });

            await addDoc(collection(db, 'inspections'), {
                vendorId,
                personalHygiene: parseInt(scores.personalHygiene),
                foodStorage: parseInt(scores.foodStorage),
                waterQuality: parseInt(scores.waterQuality),
                utensilCleanliness: parseInt(scores.utensilCleanliness),
                wasteDisposal: parseInt(scores.wasteDisposal),
                ingredientFreshness: parseInt(scores.ingredientFreshness),
                totalScore,
                inspectorEmail: auth.currentUser?.email,
                inspectedAt: serverTimestamp(),
            });

            setSuccess(true);
            setScores({
                personalHygiene: '',
                foodStorage: '',
                waterQuality: '',
                utensilCleanliness: '',
                wasteDisposal: '',
                ingredientFreshness: '',
            });
            setVendorId('');
        } catch (e) {
            Alert.alert('Error', 'Failed to submit. Check vendor ID and try again.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        onLogout();
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.brand}>TRUSTSCAN</Text>
                    <Text style={styles.title}>Hygiene Audit Form</Text>
                    <Text style={styles.sub}>Logged in as {auth.currentUser?.email}</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.logout}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {success && (
                    <View style={styles.successBox}>
                        <Text style={styles.successText}>✅ Score submitted successfully!</Text>
                    </View>
                )}

                {/* Vendor ID */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>VENDOR ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. vendor001"
                        placeholderTextColor="#999"
                        value={vendorId}
                        onChangeText={setVendorId}
                        autoCapitalize="none"
                    />
                </View>

                {/* Score Parameters */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>HYGIENE SCORES</Text>
                    {params.map((p) => (
                        <View key={p.key} style={styles.param}>
                            <View style={styles.paramHeader}>
                                <Text style={styles.paramLabel}>{p.label}</Text>
                                <Text style={styles.paramMax}>/ {p.max}</Text>
                            </View>
                            <TextInput
                                style={styles.scoreInput}
                                placeholder={`0 – ${p.max}`}
                                placeholderTextColor="#999"
                                value={scores[p.key]}
                                onChangeText={(v) => setScores({ ...scores, [p.key]: v })}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                        </View>
                    ))}
                </View>

                {/* Total preview */}
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Total Score</Text>
                    <Text style={styles.totalScore}>
                        {Object.values(scores).every(v => v !== '')
                            ? Object.values(scores).reduce((a, b) => a + parseInt(b || 0), 0)
                            : '--'} / 100
                    </Text>
                </View>

                {/* Submit */}
                <TouchableOpacity
                    style={styles.btn}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.btnText}>Submit Audit Score</Text>
                    }
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F2EC' },
    container: { flex: 1 },
    header: { backgroundColor: '#1A56A0', padding: 28, paddingTop: 48, alignItems: 'center' },
    brand: { color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 2, marginBottom: 8 },
    title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
    sub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 10 },
    logout: { color: '#A8C8F0', fontSize: 12, fontWeight: '600', textDecorationLine: 'underline' },
    successBox: { backgroundColor: '#E6F4ED', margin: 12, borderRadius: 10, padding: 14 },
    successText: { color: '#1D7A45', fontWeight: '600', textAlign: 'center' },
    card: { backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 20 },
    cardTitle: { fontSize: 11, fontWeight: '700', color: '#6B6B60', letterSpacing: 1.5, marginBottom: 14 },
    input: {
        borderWidth: 1, borderColor: '#E2DDD4', borderRadius: 10,
        padding: 14, fontSize: 14, color: '#1A1A18', backgroundColor: '#FAFAF8'
    },
    param: { marginBottom: 14 },
    paramHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    paramLabel: { fontSize: 13, fontWeight: '500', color: '#1A1A18' },
    paramMax: { fontSize: 12, color: '#6B6B60' },
    scoreInput: {
        borderWidth: 1, borderColor: '#E2DDD4', borderRadius: 10,
        padding: 12, fontSize: 14, color: '#1A1A18', backgroundColor: '#FAFAF8'
    },
    totalCard: {
        backgroundColor: '#1A3A6A', margin: 12, borderRadius: 16,
        padding: 20, alignItems: 'center'
    },
    totalLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 },
    totalScore: { color: '#52D48A', fontSize: 48, fontWeight: '800' },
    btn: {
        backgroundColor: '#1A56A0', margin: 12, borderRadius: 12,
        padding: 18, alignItems: 'center'
    },
    btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});