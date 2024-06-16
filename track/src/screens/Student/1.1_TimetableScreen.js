import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const TimetableScreen = ({route}) => {
  const { params } = route || {};
  const { data } = params || {};
  const [events, setEvents] = useState({});
  const notificationListener = useRef();
  const responseListener = useRef();

  const addEventsFromRoute = () => {
    if (data && data.timetable && data.timetable.length > 0) {
      const newEvents = { ...events };
      
      data.timetable.forEach((event) => {
        const currentDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        while (currentDate <= endDate) {
          const currentDateString = currentDate.toISOString().split('T')[0];

          if (!newEvents[currentDateString]) {
            newEvents[currentDateString] = [];
          }

          const eventForDate = { ...event };
          eventForDate.startDate = currentDateString;
          eventForDate.endDate = currentDateString;

          newEvents[currentDateString].push(eventForDate);

          // Increment date by 7 days
          currentDate.setDate(currentDate.getDate() + 7);
        }
      });

      setEvents(newEvents);
      //console.log('Events from route:', newEvents);
      
    }
  };

  const scheduleNotifications = async (events) => {
    
    const now = new Date();
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission to receive push notifications not granted');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    
    
    for (const date in events) {
      events[date].forEach((event) => {
        const time = event.endDate + ' ' + event.startTime;
        console.log("Notification scheduled for:", time, "Module:", event.name);
        const eventTime = new Date(time);
        const tenMinutesBeforeEvent = new Date(eventTime.getTime() - 10 * 60 * 1000);
    
        // Use a closure to capture the correct date value
        (function (event, tenMinutesBeforeEvent) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'Upcoming Lecture',
              body: `${event.name} at ${event.venue} will be starting within 10 minutes`,
            },
            trigger: {
              date: tenMinutesBeforeEvent, // 10 minutes in seconds
            },
          }).then((notificationId) => {
            console.log("Notification scheduled successfully. Notification ID:", date);
          }).catch((error) => {
            console.log("Error scheduling notification:", error);
          });
        })(event, tenMinutesBeforeEvent);
      });
    }
    
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    addEventsFromRoute();
    
  }, []);  // <-- Add an empty dependency array

  useEffect(() => {
    scheduleNotifications(events);
  }, [events]);  // <-- Only run when events change
  

  async function registerForPushNotificationsAsync() {
    let token;

    /* if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    } */

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

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
    });

    return token;
  }

  return (
    <View style={styles.container}>
    <View style={{backgroundColor:"#484BF1", width:"100%",height:18}}><Text></Text></View>
      

      <Agenda
        items={events}
        renderEmptyDate={() => <View />}
        renderItem={(item) => (
          <View style={styles.eventContainer}>
            <Text>{item.name}</Text>
            <Text>{item.code}</Text>
            <Text>{item.venue}</Text>
            <Text>{item.startTime} - {item.endTime}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  eventContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default TimetableScreen;
