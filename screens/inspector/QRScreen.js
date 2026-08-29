import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRScreen() {
    const [vendorId, setVendorId] = useState('');
    const [showQR, setShowQR] = useState(false);

    const url = `http://192.168.1.9:8081/vendor/${vendorId}`;
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.brand}>TRUSTSCAN</Text>
                    <Text style={styles.title}>QR Code Generator</Text>
                    <Text style={styles.sub}>Generate a QR code for any registered vendor</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>VENDOR ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. vendor001"
                        placeholderTextColor="#999"
                        value={vendorId}
                        onChangeText={(v) => { setVendorId(v); setShowQR(false); }}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => { if (vendorId) setShowQR(true); }}
                    >
                        <Text style={styles.btnText}>Generate QR Code</Text>
                    </TouchableOpacity>
                </View>

                {showQR && (
                    <View style={styles.qrCard}>
                        <Text style={styles.qrLabel}>QR Code for {vendorId}</Text>
                        <View style={styles.qrBox}>
                            <QRCode
                                value={url}
                                size={200}
                                color="#1A1A18"
                                backgroundColor="#FFFFFF"
                            />
                        </View>
                        <Text style={styles.qrUrl}>{url}</Text>
                        <Text style={styles.qrNote}>
                            Print this QR code and display it at the vendor's stall.
                            Customers scan it to view the live hygiene score.
                        </Text>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F2EC' },
    container: { flex: 1, padding: 24 },
    header: { marginBottom: 28, alignItems: 'center' },
    brand: { fontSize: 11, fontWeight: '700', color: '#1A56A0', letterSpacing: 3, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '800', color: '#1A1A18', marginBottom: 6 },
    sub: { fontSize: 13, color: '#6B6B60', textAlign: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16 },
    label: { fontSize: 11, fontWeight: '700', color: '#6B6B60', letterSpacing: 1.5, marginBottom: 8 },
    input: {
        borderWidth: 1, borderColor: '#E2DDD4', borderRadius: 10,
        padding: 14, fontSize: 14, color: '#1A1A18',
        backgroundColor: '#FAFAF8', marginBottom: 14
    },
    btn: { backgroundColor: '#1A56A0', borderRadius: 10, padding: 14, alignItems: 'center' },
    btnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    qrCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 24,
        alignItems: 'center'
    },
    qrLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A18', marginBottom: 20 },
    qrBox: {
        padding: 16, backgroundColor: '#fff',
        borderRadius: 12, borderWidth: 1, borderColor: '#E2DDD4',
        marginBottom: 16
    },
    qrUrl: { fontSize: 11, color: '#1A56A0', marginBottom: 12, fontFamily: 'monospace' },
    qrNote: { fontSize: 12, color: '#6B6B60', textAlign: 'center', lineHeight: 18 },
});