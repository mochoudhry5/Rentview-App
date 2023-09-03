import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface RentalDescriptionProps {
  name: string;
  rooms: string;
  address: string; 
}

const RentalDescription: React.FC<RentalDescriptionProps> = ({
  name,
  rooms,
  address
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{rooms}</Text>
      <Text style={styles.hours}>Address: {address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  hours: {
    fontSize: 14,
    marginBottom: 8,
  },
  stalls: {
    fontSize: 14,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RentalDescription;