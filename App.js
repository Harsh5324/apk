import {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const App = () => {
  const [ip, setIp] = useState(null);
  const [data, setData] = useState([]);
  const [isIp, setIsIp] = useState(false);

  const check = async () => {
    const ip = await AsyncStorage.getItem('ip');
    setIsIp(ip ? true : false);
    setIp(ip);
  };

  const getData = async () => {
    try {
      const {
        data: {data},
      } = await axios.get(`http://${ip}/files`);
      setData(data);
    } catch (err) {
      console.log('🚀 ~ file: App.js:19 ~ getData ~ err:', err);
      alert('Something went wrong');
    }
  };

  useEffect(() => {
    check();
  }, []);

  useEffect(() => {
    isIp && ip && getData();
  }, [isIp, ip]);

  return (
    <View style={{flex: 1, padding: 20}}>
      {!isIp ? (
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#f3f3f3',
          }}>
          <TextInput
            placeholder="Enter IP"
            onChangeText={setIp}
            style={{width: '100%', color: '#000'}}
          />
          <Button
            title="save"
            onPress={async () => {
              await AsyncStorage.setItem('ip', ip);
              setIsIp(true);
            }}
          />
        </View>
      ) : (
        <View style={{backgroundColor: '#f3f3f3', flex: 1}}>
          <Button onPress={() => setIsIp(false)} title="Change IP" />
          <FlatList
            data={data}
            numColumns={2}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  margin: 10,
                }}
                onPress={() => Linking.openURL(`http://${ip}/files/${item}`)}>
                <Text style={{fontSize: 14, color: '#000'}}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default App;
