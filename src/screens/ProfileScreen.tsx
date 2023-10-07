import React, { useEffect, useState} from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { RootStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView } from 'react-native-gesture-handler';
import { collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from '../utils/firebase';
import { auth } from "../utils/firebase"

type ProfileProps = NativeStackScreenProps<RootStackParamList, "ProfileScreen">;

const ProfileScreen : React.FC<ProfileProps> = ({ route,  navigation }) => {
    const user = auth.currentUser;
    const [fullName, onChangeFullName] = useState('');
    const [phoneNumber, onChangePhoneNumber] = useState('');
    const [currentPassword, onChangeCurrentPassword] = useState('');
    const [newPassword, onChangeNewPassword] = useState('');
    const email = user?.email ? user.email : "Email not found...";

    useEffect(() => {

        const subscribe = async () => {
            const docRef = doc(db, "UserReviews", route.params.userId);
            let homeSnapshot = await getDoc(docRef);

            if(homeSnapshot.exists()){
                onChangeFullName(homeSnapshot.data().fullName);
                onChangePhoneNumber(homeSnapshot.data().phoneNumber);
            }
        }   
        
        subscribe(); 

    }, [])
    
    const updateProfileInfo = async () => {   
        const docRef = doc(db, "UserReviews", route.params.userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            if (docSnap.data().fullName !== fullName){
  
                const q = query(collection(db, "UserReviews", route.params.userId, "Reviews"));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (document) => {
                    const reviewRef = doc(db, "HomeReviews", document.data().homeId, "IndividualRatings", route.params.userId);
                    await updateDoc(reviewRef, {
                        reviewerFullName: fullName
                        
                    });
                });
            }

            await updateDoc(docRef, {
                fullName: fullName, 
                phoneNumber: phoneNumber,
            })
        }    
        
        navigation.navigate("AccountScreen")
        
    }

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
                placeholder='Add your name'
            />
            <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Email</Text>
            <TextInput
                style={styles.nameInput}
                value={email}
                maxLength={20}
                editable={false} 
                selectTextOnFocus={false}
            />
            <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Phone Number</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangePhoneNumber}
                value={phoneNumber}
                maxLength={10}
                placeholder='Add your phone number'
                keyboardType='numeric'
            />
            <Text style={{fontSize:20, fontWeight:'bold',marginTop:'10%', marginLeft:'5%', marginBottom:'3%'}}>Change Password</Text>
            <Text style={{marginLeft:'5%', color:'#969696'}}>Current Password</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangeCurrentPassword}
                value={currentPassword}
                maxLength={20}
                secureTextEntry
            />
            <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>New Password</Text>
            <TextInput
                style={styles.nameInput}
                onChangeText={onChangeNewPassword}
                value={newPassword}
                maxLength={10}
                secureTextEntry
            />
        </ScrollView>
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
            <TouchableOpacity style={styles.cancelButton}>
                <Text style={{fontWeight:'bold', color:'#424242'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={updateProfileInfo}>
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
