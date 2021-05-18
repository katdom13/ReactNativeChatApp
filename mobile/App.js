import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, Platform, NativeModules } from 'react-native';
import io from 'socket.io-client'

const { StatusBarManager } = NativeModules
let socket = undefined

export default function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket = io('http://192.168.0.106:3000')
  }, [])

  useEffect(() => {
    socket.on('chat message', message => {
      setMessages([...messages, message])
    })
  }, [messages])

  const handleSubmitMessage = () => {
    socket.emit('chat message', message)
    setMessage('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={{
          height: 40,
          borderWidth: 2,
        }}
        autoCorrect={false}
        onChangeText={setMessage}
        onSubmitEditing={handleSubmitMessage}
        value={message}
      />
      {
        messages && messages.map(message => (
          <Text key={message}>
            {message}
          </Text>
        ))
      }
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
  },
});
