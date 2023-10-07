import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'

const RentalPostScreen = () => {
  const [fullName, onChangeFullName] = useState('');
  const [currentPassword, onChangeCurrentPassword] = useState('');
  const [newPassword, onChangeNewPassword] = useState('');

  return (
    <View style={{flex: 1, paddingTop:'5%', backgroundColor:'white'}}>
        <ScrollView>
            <Text style={{fontSize:20, fontWeight:'bold', marginLeft:'5%',marginBottom:'3%'}}>Rental Address</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangeFullName}
                value={fullName}
                maxLength={20}
                placeholder='Enter Home address'
            />
        </ScrollView>
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
            <TouchableOpacity style={styles.cancelButton}>
                <Text style={{fontWeight:'bold', color:'#424242'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={{fontWeight:'bold', color:'white'}}>Post</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: '3%',
  },
  nameInput: {
    height: '80%',
    marginLeft:'5%',
    marginRight:'5%',
    marginTop: '3%',
    borderBottomWidth:.3,
    fontSize:16
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width:'30%',
    height:30,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:20
},
saveButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width:'30%',
    height:30,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:20
},

});

export default RentalPostScreen