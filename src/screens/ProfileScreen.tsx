import React, { useEffect, useState} from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { AccountStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView } from 'react-native-gesture-handler';
import { collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from '../config/firebase';
import { auth } from "../config/firebase"

type ProfileProps = NativeStackScreenProps<AccountStackParamList, "ProfileScreen">;

const ProfileScreen : React.FC<ProfileProps> = ({ route,  navigation }) => {
    const user = auth.currentUser;
    const [anonymous, onChangeAnonymous] = useState('');
    const [phoneNumber, onChangePhoneNumber] = useState('');
    const [username, onChangeUsername] = useState('');
    const [fullName, onChangeFullName] = useState('');

    const email = user?.email ? user.email : "Email not found...";

    useEffect(() => {

        const subscribe = async () => {
            const docRef = doc(db, "UserReviews", route.params.userId);
            let homeSnapshot = await getDoc(docRef);

            if(homeSnapshot.exists()){
                onChangePhoneNumber(homeSnapshot.data().phoneNumber);
                onChangeUsername(homeSnapshot.data().username);
                onChangeFullName(homeSnapshot.data().fullName);
            }
        }   
        
        subscribe(); 

    }, [])

    const updateProfileInfo = async () => {   
        const docRef = doc(db, "UserReviews", route.params.userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            if (docSnap.data().anonymous !== anonymous){

                const q = query(collection(db, "UserReviews", route.params.userId, "Reviews"));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (document) => {
                    const reviewRef = doc(db, "HomeReviews", document.data().homeId, "IndividualRatings", route.params.userId);
                    await updateDoc(reviewRef, {
                        reviewerUsername: anonymous
                        
                    });
                });
            }

            await updateDoc(docRef, {
                phoneNumber: phoneNumber,
                username: username
            })
        }    
        
    }

    const cancelProfileInfo = () => {
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
                    style={styles.nonEditInput}
                    editable={false} 
                    value={fullName}
                    maxLength={20}
                />
                <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Username</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUsername}
                    value={username}
                    maxLength={20}
                />
                <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Anonymous Username</Text>
                <TextInput
                    style={styles.nonEditInput}
                    maxLength={20}
                    editable={false} 
                    value={"Nothing for now"}
                />
                <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Email</Text>
                <TextInput
                    style={styles.nonEditInput}
                    value={email}
                    maxLength={20}
                    editable={false} 
                    selectTextOnFocus={false}
                />
                <Text style={{marginLeft:'5%', marginTop:'5%', color:'#969696'}}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePhoneNumber}
                    value={phoneNumber}
                    maxLength={10}
                    placeholder='Add your phone number'
                    keyboardType='numeric'
                />
            </ScrollView>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <TouchableOpacity style={styles.saveButton} onPress={updateProfileInfo}>
                    <Text style={{fontWeight:'bold', color:'white'}}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelProfileInfo}>
                    <Text style={{fontWeight:'bold', color:'#424242'}}>Back</Text>
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
  input: {
    height: '7%',
    marginLeft:'5%',
    marginRight:'5%',
    marginTop:'2%',
    borderBottomWidth:.3,
    fontSize:16
  },
  nonEditInput: {
    height: '7%',
    marginLeft:'5%',
    marginRight:'5%',
    marginTop:'2%',
    borderBottomWidth:.3,
    fontSize:16,
    color:'gray'
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width:'40%',
    height:35,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:20
},
saveButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width:'40%',
    height:35,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:20
},

});
export default ProfileScreen;