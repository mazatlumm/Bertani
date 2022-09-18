import * as tf from '@tensorflow/tfjs';
import {
  bundleResourceIO,
  cameraWithTensors,
} from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, BackHandler, Alert } from 'react-native';

const windowWidth = parseInt((Dimensions.get('window').width).toFixed(0))-45;
const windowHeight = parseInt((Dimensions.get('window').height).toFixed(0))-45;

const TensorCamera = cameraWithTensors(Camera);

// The size of camera preview.
//
// These are only for iOS devices.
const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (9 / 16);

// The size of the output tensor (image) from TensorCamera.
//
// 9/16.
const OUTPUT_TENSOR_WIDTH = 260;
const OUTPUT_TENSOR_HEIGHT = 480;

const PenyakitTanaman = ({navigation}) => {

  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState();
  const [isHotdog, setIsHotdog] = useState(null);
  const [ClassName, setClassName] = useState('Objek Tidak Dikenali');
  const [Accuracy, setAccuracy] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // We will need to cancel the animation frame properly.
  //
  // - null: unset (initial value)
  // - 0: animation frame has been canceled
  // - >0: animation frame has been scheduled.
  const rafId = useRef(null);

  // Make sure tfjs and tfjs-react-native work, especially the tensor camera.
  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      // Request camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();

      // Load model.
      const modelJson = require('../model/model.json');
      const modelWeights = require('../model/weights.bin');
      // Oh, we also need to make metro to recognize .bin files.
      // See metro.config.js.
      //
      // This particular model is a "layers model".
      //
      // bundleResourceIO is a utility function provided by tfjs-react-native
      // to read model files from a bundle.
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeights)
      );
      setModel(model);

      // Ready!!
      setTfReady(true);
    }
    prepare();

    const backAction = () => {
        Alert.alert("Tunggu!", "Apakah Anda Yakin Ingin Keluar?", [
          {
            text: "Tidak",
            onPress: () => {
                setTfReady(false);
            },
            style: "cancel"
          },
          { text: "Iya", onPress: () => {
                cancelAnimationFrame(rafId.current);
                rafId.current = 0;
                setTimeout(() => {
                    navigation.goBack();
                }, 1000);
          } }
        ]);
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
  }, []);

  // This will be called when the component in unmounted.
  useEffect(() => {
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  // Handler that will be called when TensorCamera is ready.
  const handleCameraStream = (images, updatePreview, gl) => {
    console.log('camera ready!');
    // Here, we want to get the tensor from each frame (image), and feed the
    // tensor to the model (which we will train separately).
    //
    // We will do this repeatly in a animation loop.
    const loop = () => {
      // This might not be necessary, but add it here just in case.
      if (rafId.current === 0) {
        return;
      }

      // Wrap this inside tf.tidy to release tensor memory automatically.
      tf.tidy(() => {
        // Get the tensor.
        //
        // We also need to normalize the tensor/image rgb data from 0-255
        // to -1 to 1.
        //
        // We also need to add an extra dimension so its shape is [1, w, h, 3].
        const imageTensor = images.next().value.expandDims(0).div(127.5).sub(1);

        // From teachable machine, we know that the input image will be
        // cropped from the center and resized to 224x224. So we need to do
        // the same thing here. Luckily tfjs has utility for this.
        //
        // Read more about these in tfjs's repo:
        // https://github.com/tensorflow/tfjs
        //
        // calculate the relative Y position (0-1) to start croppging the
        // image. BTW we assume the image is in portrait mode.
        //
        // Feel free to handle landscape mode here.
        const f =
          (OUTPUT_TENSOR_HEIGHT - OUTPUT_TENSOR_WIDTH) /
          2 /
          OUTPUT_TENSOR_HEIGHT;
        const cropped = tf.image.cropAndResize(
          // Image tensor.
          imageTensor,
          // Boxes. It says we start cropping from (x=0, y=f) to (x=1, y=1-f).
          // These values are all relative (from 0 to 1).
          tf.tensor2d([f, 0, 1 - f, 1], [1, 4]),
          // The first box above
          [0],
          // The final size after resize.
          [224, 224]
        );

        // Feed the processed tensor to the model and get result tensor(s).
        const result = model.predict(cropped);
        // Get the actual data (an array in this case) from the result tensor.
        const logits = result.dataSync();
        // Logits should be the probability of two classes (hot dog, not hot dog).
        console.log(logits)
        const arrClassName = ["Wereng Coklat","Penggerek Batang Padi Kuning","Walang Sangit","Bercak Daun Padi","Bercak Daun Padi Coklat","Hawar Daun Padi","Hawar Daun Jagung","Bercak Daun Jagung Abu-Abu","Karat Daun Jagung"];
        if(logits){
          for (let index = 0; index < logits.length; index++) {
            let ValueClass = logits[index] * 100;
            if(ValueClass >= 80){
              console.log(arrClassName[index]);
              setClassName(arrClassName[index]);
              setAccuracy(ValueClass);
              var date = new Date().getDate(); //Current Date
              var month = new Date().getMonth() + 1; //Current Month
              var year = new Date().getFullYear(); //Current Year
              var hours = new Date().getHours(); //Current Hours
              var min = new Date().getMinutes(); //Current Minutes
              var sec = new Date().getSeconds(); //Current Seconds
              setCurrentDate(
                date + '/' + month + '/' + year 
                + ' '
              );
              setCurrentTime(hours + ':' + min + ':' + sec)
              break;
            }
            if(ValueClass < 80 ){
              setClassName('Objek Tidak Dikenali')
              setAccuracy(0);
              var date = new Date().getDate(); //Current Date
              var month = new Date().getMonth() + 1; //Current Month
              var year = new Date().getFullYear(); //Current Year
              var hours = new Date().getHours(); //Current Hours
              var min = new Date().getMinutes(); //Current Minutes
              var sec = new Date().getSeconds(); //Current Seconds
              setCurrentDate(
                date + '/' + month + '/' + year 
                + ' '
              );
            }
          }
        }
      });
      rafId.current = requestAnimationFrame(loop);
    };
    loop();
  };


  if (!tfReady) {
    return (
      <View style={styles.loadingMsg}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TensorCamera
          style={styles.camera}
          autorender={true}
          type={Camera.Constants.Type.back}
          // Output tensor related props.
          // These decide the shape of output tensor from the camera.
          resizeWidth={OUTPUT_TENSOR_WIDTH}
          resizeHeight={OUTPUT_TENSOR_HEIGHT}
          resizeDepth={3}
          onReady={handleCameraStream}
        />
        <View style={{position:'absolute', top:0, left:0, zIndex:101, borderRadius:10, width:'100%', height:windowHeight, alignItems:'center', justifyContent:'center', paddingHorizontal:40}}>
        <View style={{zIndex:102, borderWidth:2, borderColor:'#3CDFFF', borderRadius:10, width:'100%', height:windowHeight/2}}></View>
        </View>
        <View style={styles.ClassResult}>
          <Text style={styles.resultText}>
            {ClassName}
          </Text>
          <Text style={styles.resultDescription}>
            Tingakat Akurasi : {Accuracy}%
          </Text>
          <Text style={styles.resultDescriptionTime}>
           {currentTime} WIB
          </Text>
          <Text style={styles.resultDescription}>
           {currentDate}
          </Text>
        </View>
      </View>
    );
  }
}

export default PenyakitTanaman;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    // marginTop: Dimensions.get('window').height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  // Tensor camera requires z-index.
  camera: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  loadingMsg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ClassResult:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 100,
    padding: 10,
    borderTopRightRadius:5,
    borderBottomRightRadius:5,
    backgroundColor: 'rgba(172, 172, 172, 0.5)',
  },
  resultText: {
    fontSize: 14,
    color: 'white',
    fontWeight:'bold'
  },
  resultDescription: {
    fontSize: 12,
    color: 'white',
  },
  resultDescriptionTime: {
    fontSize: 20,
    color: 'white',
  },
});
