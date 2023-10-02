import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { RootStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProfileProps = NativeStackScreenProps<RootStackParamList, "ProfileScreen">;

const ProfileScreen : React.FC<ProfileProps> = ({ navigation }) => {

    const [fullName, onChangeFullName] = React.useState('Zane Choudhry');
    const [email, onChangeEmail] = React.useState('zanechoudhry@gmail.com');
    const [phoneNumber, onChangePhoneNumber] = React.useState('9165023590');
    const [currentPassword, onChangeCurrentPassword] = React.useState('Chicostate1');
    const [newPassword, onChangeNewPassword] = React.useState('Chicostate1@');

  return (
    <View style={{flex:1,paddingTop:'5%', backgroundColor:'white'}}>
        <ScrollView>
            <View style={{alignItems:'center', marginBottom:'5%'}}>
                <Image source={{ uri: "https://source.unsplash.com/1024x768/?male" }} style={styles.profilePicture}/>
            </View>
            <Text style={{fontSize:20, fontWeight:'bold', marginLeft:'5%',marginBottom:'3%'}}>Basic Information</Text>
            <Text style={{marginLeft:'5%', color:'#969696'}}>Full Name</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangeFullName}
                value={fullName}
                maxLength={20}
            />
            <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Email</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangeEmail}
                value={email}
                maxLength={20}
            />
            <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Phone Number</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangePhoneNumber}
                value={phoneNumber}
                maxLength={10}
                keyboardType='numeric'
            />
            <Text style={{fontSize:20, fontWeight:'bold',marginTop:'10%', marginLeft:'5%', marginBottom:'3%'}}>Change Password</Text>
            <Text style={{marginLeft:'5%', color:'#969696'}}>Current Password</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangeCurrentPassword}
                value={currentPassword}
                maxLength={20}
            />
            <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>New Password</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangeNewPassword}
                value={newPassword}
                maxLength={10}
                keyboardType='numeric'
            />
        </ScrollView>
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
            <TouchableOpacity style={styles.cancelButton}>
                <Text style={{fontWeight:'bold', color:'#424242'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={{fontWeight:'bold', color:'white'}}>Save</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: '3%',
  },
  nameInput: {
    height: '7%',
    marginLeft:'5%',
    marginRight:'5%',
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
export default ProfileScreen;
