import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
    baseURL: 'https://d52a-2402-4000-b117-c90e-a9b2-cf34-b91b-3952.ngrok-free.app'
});

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;