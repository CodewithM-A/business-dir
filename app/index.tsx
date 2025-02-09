import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageViewer from '../components/customComp/ImageViewer';
import Button from '../components/customComp/Button';
import EmojiPicker from '../components/EmojiPicker'
import EmojiList from '../components/EmojiList'
import EmojiSticker from '../components/EmojiSticker'
import CircleButton from '../components/CircleButton';
import IconButton from '../components/IconButton';
import * as MediaLibrary from 'expo-media-library'
import { useRef, useState } from 'react';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';


const PlaceholderImage = require('../assets/images/background-image.png');

export default function App() {
  const imageRef = useRef();
  const [status, requestPerminssion] = MediaLibrary.usePermissions();
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  
  if(status === null){
    requestPerminssion();
  }
  const onAddSticker = () =>{
    setIsModelVisible(true);
  };
  const onModelClose = ()=>{
    setIsModelVisible(false);
  };
  const onReset = () => {
    setShowAppOptions(false);
  };


  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });
  
        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };
  
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);

    }
    else {
      alert("You did not select any image");
    }
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>

        <ImageViewer placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage} />
          {
            pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>
          }
          </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={()=> setShowAppOptions(true)}/>
      </View>
      )}
      <EmojiPicker isVisible={isModelVisible} onClose={onModelClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModelClose}/>
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
