import axios from 'axios';
import { Transaction, Insight, ChatMessage } from '../types';

// IMPORTANT: Update this to your machine's LAN IP for physical device testing
// Android Emulator: use 10.0.2.2
// iOS Simulator: use localhost
// Physical device: use your computer's LAN IP (e.g., 192.168.1.x)
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

export const getTransactions = async (): Promise<Transaction[]> => {
    const res = await api.get('/api/transactions/');
    return res.data;
};

export const uploadCSV = async (uri: string, fileName: string): Promise<Transaction[]> => {
    const formData = new FormData();
    formData.append('file', {
        uri,
        name: fileName || 'upload.csv',
        type: 'text/csv',
    } as any);

    const res = await api.post('/api/transactions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const seedDemo = async (): Promise<Transaction[]> => {
    const res = await api.post('/api/transactions/seed');
    return res.data;
};

export const chatWithAdvisor = async (message: string): Promise<string> => {
    const res = await api.post('/api/insights/chat', { message });
    return res.data.response;
};

export const generateInsights = async (): Promise<Insight[]> => {
    const res = await api.post('/api/insights/generate');
    return res.data;
};
