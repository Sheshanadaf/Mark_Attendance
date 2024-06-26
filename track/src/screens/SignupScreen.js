import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const { state, signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [batchCode, setBatchCode] = useState('');

  console.log(state);

  return (
    <View style={styles.container}>
      <Spacer>
        <Text h3>Sign Up for Tracker</Text>
      </Spacer>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Input
          label="Email"
          value={email}
          onChangeText={(newEmail) => setEmail(newEmail)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Spacer />
        <Input
          secureTextEntry
          label="Password"
          value={password}
          onChangeText={(newPassword) => setPassword(newPassword)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Spacer />
        <Input
          label="Batch Code"
          value={batchCode}
          onChangeText={(newBatchCode) => setBatchCode(newBatchCode)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {state.errorMessage ? (
          <Text style={styles.errorMessage}>{state.errorMessage}</Text>
        ) : null}
        <Spacer>
          <Button title="Sign Up" onPress={() => signup({ email, password, batchCode })} />
        </Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Spacer>
            <Text style={styles.link}>Already have an account? Sign in instead</Text>
          </Spacer>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 250,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15,
  },
  link: {
    color: 'blue',
  },
});

export default SignupScreen;
