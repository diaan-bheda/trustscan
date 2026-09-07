import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView,
    ActivityIndicator, Switch
} from 'react-native';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function VendorRegistrationScreen() {
    const [form, setForm] = useState({
        name: '',
        location: '',
        foodType: '',
        fssai: false,
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const generateVendorId = (name) => {
        const clean = name.toLowerCase().replace(/\s+/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${clean}${random}`;
    };

    const handleRegister = async () => {
        if (!form.name || !form.location || !form.foodType) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const vendorId = generateVendorId(form.name);
            const vendorRef = doc(db, 'vendors', vendorId);

            await setDoc(vendorRef, {
                name: form.name,
                location: form.location,
                foodType: form.foodType,
                fssai: form.fssai,
                totalScore: 0,
                personalHygiene: 0,
                foodStorage: 0,
                waterQuality: 0,
                utensilCleanliness: 0,
                wasteDisposal: 0,
                ingredientFreshness: 0,
                inspectionCount: 0,
                registeredSince: serverTimestamp(),
                lastInspected: serverTimestamp(),
            });

            setSuccess(`Vendor registered! ID: ${vendorId}`);
            setForm({ name: '', location: '', foodType: '', fssai: false });

        } catch (e) {
            setError('Registration failed. Try again.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.brand}>TRUSTSCAN</Text>
                    <Text style={styles.title}>Register Vendor</Text>
                    <Text style={styles.sub}>Add a new vendor to the Trust-Scan system</Text>
                </View>

                {success ? (
                    <View style={styles.successBox}>
                        <Text style={styles.successTitle}>Vendor Registered!</Text>
                        <Text style={styles.successId}>{success}</Text>
                        <Text style={styles.successNote}>
                            Save this ID — use it in the Audit Form and QR Generator.
                        </Text>
                    </View>
                ) : null}

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>VENDOR DETAILS</Text>

                    <Text style={styles.label}>Vendor Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Rishi Koli's Vada Pav"
                        placeholderTextColor="#999"
                        value={form.name}
                        onChangeText={(v) => setForm({ ...form, name: v })}
                    />

                    <Text style={styles.label}>Location</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. FC Road, Pune"
                        placeholderTextColor="#999"
                        value={form.location}
                        onChangeText={(v) => setForm({ ...form, location: v })}
                    />

                    <Text style={styles.label}>Food Type</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Veg Street Food"
                        placeholderTextColor="#999"
                        value={form.foodType}
                        onChangeText={(v) => setForm({ ...form, foodType: v })}
                    />

                    <View style={styles.switchRow}>
                        <View>
                            <Text style={styles.label}>FSSAI License</Text>
                            <Text style={styles.switchSub}>Does this vendor have an active FSSAI license?</Text>
                        </View>
                        <Switch
                            value={form.fssai}
                            onValueChange={(v) => setForm({ ...form, fssai: v })}
                            trackColor={{ false: '#E2DDD4', true: '#1A56A0' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.btnText}>Register Vendor</Text>
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
    header: { backgroundColor: '#1A56A0', padding: 28, paddingTop: 32, alignItems: 'center' },
    brand: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 3, marginBottom: 8 },
    title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
    sub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },
    successBox: {
        backgroundColor: '#E6F4ED', margin: 12, borderRadius: 12,
        padding: 16, borderLeftWidth: 4, borderLeftColor: '#1D7A45'
    },
    successTitle: { fontSize: 14, fontWeight: '700', color: '#1D7A45', marginBottom: 4 },
    successId: { fontSize: 13, color: '#1A1A18', fontFamily: 'monospace', marginBottom: 6 },
    successNote: { fontSize: 12, color: '#6B6B60' },
    errorBox: { backgroundColor: '#FDECEA', margin: 12, borderRadius: 12, padding: 14 },
    errorText: { color: '#C0392B', fontSize: 13, textAlign: 'center' },
    card: { backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 20 },
    cardTitle: { fontSize: 11, fontWeight: '700', color: '#6B6B60', letterSpacing: 1.5, marginBottom: 16 },
    label: { fontSize: 12, fontWeight: '700', color: '#6B6B60', marginBottom: 6, letterSpacing: 0.5 },
    input: {
        borderWidth: 1, borderColor: '#E2DDD4', borderRadius: 10,
        padding: 14, fontSize: 14, color: '#1A1A18',
        backgroundColor: '#FAFAF8', marginBottom: 16
    },
    switchRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 4
    },
    switchSub: { fontSize: 11, color: '#6B6B60', marginTop: 2, maxWidth: 240 },
    btn: {
        backgroundColor: '#1A56A0', margin: 12, borderRadius: 12,
        padding: 18, alignItems: 'center'
    },
    btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});