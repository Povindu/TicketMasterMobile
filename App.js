import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {db} from './components/config';
import {ref, set, onValue} from "firebase/database";

export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');


  //firebase
  function addTicket(ticketNo){
    const reference = ref(db, 'tickets/' + ticketNo);

    set(reference, {
      checkIn : "False"
    })
  }


  function checkInTicket(ticketNo){
    const reference = ref(db, 'tickets/' + ticketNo);
    set(reference, {
      checkIn : "True"
    })
  }

  function checkTicket(ticketNo){
    const reference = ref(db, 'tickets/' + ticketNo);

    onValue(reference, (snapshot) => {
      const data = snapshot.val();
      if(data){

        if(data.checkIn == "True"){
          Alert.alert("Validity",`Ticket NO:${ticketNo} is valid, Already checked in`,[
          {text: "Scan Again", 
          onPress: () => {
            setScanned(false),
            setText("Not yet scanned")
            },
        },
          // {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        }

        else if(data.checkIn == "False"){
          Alert.alert("Validity", `Ticket NO:${ticketNo} valid, Not checked in`,[
            {
              text: "Check IN", 
              onPress: () => checkInTicket(ticketNo),
          },
          {text: 'OK', 
          onPress: () => console.log('OK Pressed')},
        ])
        }

      }
      else{
        alert("No ticket found");
      }

    })
  }



  const askForCameraPermission = () => {
    ( async () => {
      const status = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == 'granted');
    })()
  }

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    alert(`Ticket No: ${data} has been scanned!`);  
  }

  if (hasPermission === null) {
    return( 
    <View style={styles.container}>
    <Text>Requesting for camera permission</Text>
    </View>
    )
    }

  if (hasPermission == false){
    <View style={styles.container}>
    <Text style={{margin:10}}>No Access to camera</Text>
    <Button title={'Allow Camera'} onPress={() => askForCameraPermission()}/>
    </View>
  }

  return (
    <View style={styles.container}>
      { !scanned && 
      < View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{height: 400, width: 400}}
          >
        </BarCodeScanner>
      </View>
      }
      <Text style={styles.maintext}>Scanned Ticket No: {text}</Text>




      
      {scanned &&
      <View>
        <Button title={'Tap to Scan Again'} onPress={() => {
          setScanned(false),
          setText("Not yet scanned")
          }} />
        <Button title={'Check Validity'} onPress={ ()=> checkTicket(text)} />
        <View style={{marginTop:100}}>
          <Button  title={'Add Ticket'} onPress={ ()=> addTicket(text)} />
        </View>
      </View>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  },

  maintext:{
    fontSize: 16,
    margin: 20
  }
});
