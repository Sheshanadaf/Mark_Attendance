import {useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotifyHelper = ({ bodyMessage }) => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Fetch expo push token and set up notification listeners
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
    });

    // Schedule the notification when the component mounts
    schedulePushNotification(bodyMessage);

    // Clean up the listeners when the component unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [bodyMessage]); // Re-run effect when bodyMessage changes

  return null; // You might want to return some JSX here if necessary
};

async function schedulePushNotification(bodyMessage) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: bodyMessage || 'Default notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
    console.log('Notification scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use a physical device for Push Notifications');
  }

  return token;
}

export default NotifyHelper;
