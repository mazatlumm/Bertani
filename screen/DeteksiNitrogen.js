import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
  } from 'react-native'
  import React, { useEffect, useState } from 'react'
  import ImageColors from 'react-native-image-colors'
  
  const yunaUrl = '../assets/images/tembakau.jpeg'
  
  const initialState = {
    colorOne: { value: '', name: '' },
    colorTwo: { value: '', name: '' },
    colorThree: { value: '', name: '' },
    colorFour: { value: '', name: '' },
    rawResult: '',
  }
  
    const DeteksiNitrogen = ({navigation, route}) => {
        const [colors, setColors] = useState(initialState)
        const [loading, setLoading] = useState(true)
        const [UriImage, setUriImage] = useState('')
        const [BWD, setBWD] = useState('')
        const [Urea, setUrea] = useState('')

        const AmbilDataRoute = () => {
            console.log(route.params);
            if(route.params != undefined){
                console.log(route.params.uriImage);
                setUriImage(route.params.uriImage);
                fetchColors(route.params.uriImage)
            }
        }

        const convertToRGB = (HexCode) => {
            if(HexCode.length != 6){
                throw "Only six-digit hex colors are allowed.";
            }
            
            var aRgbHex = HexCode.match(/.{1,2}/g);
            var RedColor = parseInt(aRgbHex[0], 16);
            var GreenColor = parseInt(aRgbHex[1], 16);
            var BlueColor = parseInt(aRgbHex[2], 16);
            console.log('Red : ' + RedColor);
            console.log('Green : ' + GreenColor);
            console.log('Blue : ' + BlueColor);
            
            if (GreenColor > 170) {
                setBWD('1');
                setUrea('175-200');
              } else if (GreenColor > 157 && GreenColor <= 170) {
                setBWD('2');
                setUrea('175');
              } else if (GreenColor > 145 && GreenColor <= 157) {
                setBWD('3');
                setUrea('150');
              } else if (GreenColor > 130 && GreenColor <= 145) {
                setBWD('4');
                setUrea('125');
              } else if (GreenColor > 117 && GreenColor <= 130) {
                setBWD('5');
                setUrea('100');
              } else if (GreenColor > 104 && GreenColor <= 117) {
                setBWD('6');
                setUrea('75');
              } else if (GreenColor > 92 && GreenColor <= 104) {
                setBWD('7');
                setUrea('50');
              } else if (GreenColor > 20 && GreenColor <= 92) {
                setBWD('8');
                setUrea('0-50');
              } else {
                setBWD('');
                setUrea('');
              }
        }
        

        const fetchColors = async (urlFoto) => {
            const result = await ImageColors.getColors(urlFoto, {
            fallback: '#000000',
            quality: 'low',
            pixelSpacing: 5,
            cache: true,
            headers: {
                authorization: 'Basic 123',
            },
            })
            console.log(result)
            var darkVibrant = result.darkVibrant;
            var RemoveHastgdarkVibrant = darkVibrant.replace('#', '');
            convertToRGB(RemoveHastgdarkVibrant);

            switch (result.platform) {
            case 'android':
            case 'web':
                setColors({
                colorOne: { value: result.lightVibrant, name: 'Light Vibrant' },
                colorTwo: { value: result.dominant, name: 'Dominant' },
                colorThree: { value: result.vibrant, name: 'Vibrant' },
                colorFour: { value: result.darkVibrant, name: 'Dark Vibrant' },
                rawResult: JSON.stringify(result),
                })
                break
            case 'ios':
                setColors({
                colorOne: { value: result.background, name: 'background' },
                colorTwo: { value: result.detail, name: 'detail' },
                colorThree: { value: result.primary, name: 'primary' },
                colorFour: { value: result.secondary, name: 'secondary' },
                rawResult: JSON.stringify(result),
                })
                break
            default:
                throw new Error('Unexpected platform')
            }

            setLoading(false)
        }

        useEffect(() => {
        AmbilDataRoute();
        }, [])

        if (loading) {
        return (
            <View style={styles.container}>
            <Text style={styles.loading}>Loading...</Text>
            </View>
        )
        }

        return (
        <View style={styles.container}>
            <SafeAreaView style={styles.resultContainer}>
            <Text style={styles.loading}>Hasil Pengukuran</Text>
            {BWD != ''?  
              <View>
                <Text style={styles.result}>Nilai BWD {BWD}</Text>
                <Text style={styles.result}>Rekomendasi Takaran Urea {Urea} Kg/Ha</Text> 
              </View> :
              <Text style={styles.result}>Foto Anda tidak mengandung zat hijau daun, pastikan objek yang Anda foto merupakan jenis dedaunan</Text>
            }
            </SafeAreaView>
            <Image
            resizeMode="contain"
            style={styles.image}
            source={{ uri: UriImage }}
            />
            <View style={styles.row}>
            <Box name={colors.colorOne.name} value={colors.colorOne.value} />
            <Box name={colors.colorTwo.name} value={colors.colorTwo.value} />
            </View>
            <View style={styles.row}>
            <Box name={colors.colorThree.name} value={colors.colorThree.value} />
            <Box name={colors.colorFour.name} value={colors.colorFour.value} />
            </View>
        </View>
        )
    }

  
    const Box = (props) => {
    return (
        <View
        style={[
            styles.box,
            {
                backgroundColor: props.value,
            },
        ]}
        >
            <Text style={styles.colorName}>{props.name}</Text>
        </View>
        )
    }

    export default DeteksiNitrogen
  
    const styles = StyleSheet.create({
        image: {
        width: '100%',
        height: 250,
        marginBottom:10
        },
        colorName: {
        backgroundColor: 'white',
        padding: 4,
        fontSize: 18,
        },
        box: {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        },
        row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        },
        resultContainer: {
        flex: 1,
        padding: 20,
        width: Platform.select({
            web: 'fill-available',
            ios: '100%',
            android: '100%',
        }),
        },
        container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        },
        loading: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        },
        result: {
        textAlign: 'center',
        color: '#333333',
        },
    })