import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function LoginScreen({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter email and password.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
        } catch (e) {
            setError('Invalid email or password. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.brand}>TRUSTSCAN</Text>
                    <Text style={styles.title}>Inspector Login</Text>
                    <Text style={styles.sub}>Only authorised inspectors can access this panel.</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="your@email.com"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.btnText}>Login</Text>
                        }
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>
                    This panel is restricted to Trust-Scan certified inspectors only.
                </Text>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F2EC' },
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    header: { marginBottom: 40, alignItems: 'center' },
    brand: { fontSize: 12, fontWeight: '700', color: '#1A56A0', letterSpacing: 3, marginBottom: 10 },
    title: { fontSize: 28, fontWeight: '800', color: '#1A1A18', marginBottom: 8 },
    sub: { fontSize: 13, color: '#6B6B60', textAlign: 'center', lineHeight: 20 },
    form: { backgroundColor: '#fff', borderRadius: 16, padding: 24, marginBottom: 24 },
    label: { fontSize: 12, fontWeight: '700', color: '#6B6B60', marginBottom: 6, letterSpacing: 0.5 },
    input: {
        borderWidth: 1, borderColor: '#E2DDD4', borderRadius: 10,
        padding: 14, fontSize: 14, color: '#1A1A18',
        backgroundColor: '#FAFAF8', marginBottom: 16
    },
    error: { color: '#C0392B', fontSize: 13, marginBottom: 12, textAlign: 'center' },
    btn: {
        backgroundColor: '#1A56A0', borderRadius: 10,
        padding: 16, alignItems: 'center', marginTop: 4
    },
    btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    footer: { textAlign: 'center', fontSize: 11, color: '#6B6B60', lineHeight: 18 },
});