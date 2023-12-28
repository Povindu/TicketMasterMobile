import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {db} from './components/config';
import {ref, get, set, onValue, update, child} from "firebase/database";

export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  let modifiedTicketNo;



  function checkTicket(dataIN){
    let ticketNo;
    if((Number.parseInt(dataIN.slice(3, 7),10) - 4900) == (Number.parseInt(dataIN.slice(9, 13),10) - 8458)){
      ticketNo = Number.parseInt(dataIN.slice(3, 7),10) - 4900;
    }

    if(ticketNo<10){
      modifiedTicketNo = 'T' + '00' + ticketNo.toString();
    }
    else if(ticketNo<100){
      modifiedTicketNo = 'T' + '0' + ticketNo.toString();
    }
    else{
      modifiedTicketNo = 'T' + ticketNo.toString();
    }


    let data; 
    const reference = ref(db, 'ticketsTest/' + modifiedTicketNo);
    get(reference)
        .then((snapshot) => {
          if (snapshot.exists()) {
            data = snapshot.val();

            if(data.checkIn == true){
              Alert.alert("Validity",`Ticket NO:${modifiedTicketNo} is valid, Already checked in`,[
              {text: "Scan Again", 
              onPress: () => {
                setScanned(false),
                setText("Not yet scanned")
                },
              },
              // {text: 'OK', onPress: () => console.log('OK Pressed')},
              ])
            }
            else if(data.checkIn == false){
              Alert.alert("Validity", `Ticket NO:${modifiedTicketNo} valid, Not checked in`,[
                {
                  text: "Check IN", 
                  onPress: () => {
                    update(reference, {
                      checkIn : true
                    })
                    setScanned(false),
                    setText("Not yet scanned")
                  },
              },
              {text: 'OK', 
              onPress: () => console.log('OK Pressed')},
            ])
            }
          } 
          else {
            console.log("Data not available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
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

      <Text style={{fontSize: 20, marginBottom: 20}}>Nilwala Ticket Master</Text>
      <Image
        style={styles.tinyLogo}
        source={require('./assets/club_logo.png')}
      />


      { !scanned && 
      < View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{height: 400, width: 400}}
          >
        </BarCodeScanner>
      </View>
      }
      

      
      { scanned &&
      <View>
        <Text style={styles.maintext}>Scanned: {text}</Text>
        <Button title={'Tap to Scan Again'} onPress={() => {
          setScanned(false),
          setText("Not yet scanned")
          }} />
        <Button title={'Check Validity'} onPress={ ()=> checkTicket(text)} />
        <View style={{marginTop:100}}>
          {/* <Button  title={'Add Ticket'} onPress={ ()=> addTicket(text)} /> */}
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
  },

  tinyLogo: {
    marginBottom:50,
    width: 80,
    height: 80,
  }
});
