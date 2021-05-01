import * as React from 'react';
import { StyleSheet, View, Button, Alert, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { Text } from '../components/UI';
import * as Types from '../api/types';

import { MaterialIcons } from '@expo/vector-icons';

interface RoverPhotoProps {
  item: Types.RoverPhoto;
  width: number;
  height: number;
}

export const RoverPhoto = React.memo<RoverPhotoProps>((props) => {
  const { item, width, height } = props;
  const opacityImage = useSharedValue(0);

  React.useEffect(() => {
    opacityImage.value = 1;
  }, []);

  const imageStyle = useAnimatedStyle(() => {
    return { opacity: withTiming(opacityImage.value, { duration: 300 }) }
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.Image
        // source={{ uri: item.img_src }}
        style={[styles.borderRadius, imageStyle, { flex: 1 }]}
      />
      <LinearGradient
        colors={['#2B32B2', '#D6E4FF']}
        style={[StyleSheet.absoluteFillObject, styles.borderRadius]}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.TitleText}>
            The theory of constructivism and conventionalism.
          </Text>
          <View style={styles.DescriptionText}>
            <MaterialIcons
            name="people-alt"
            size={21}
            color="#fff"
            style={{
              marginLeft: 5,
              marginRight: 5,
            }}
          />
          <Text
            style={{
              marginRight: 10,
                  fontSize: 15,
              color:"#fff"
            }}>
            420
          </Text>
          <Text
            style={{
              marginRight: 10,
                  fontSize: 15,
              color:"#fff"
            }}>
            |
          </Text>
          <MaterialIcons
            name="record-voice-over"
            size={19}
            color="#fff"
            style={{marginRight: 10}}
          />
          <Text
            style={{
              marginRight: 10,
                  fontSize: 15,
              color:"#fff"
            }}>
            69
            </Text>
            </View>

        <View
          style={{
          marginTop: 20,
          alignItems: 'center',
          }}>
          <Image
            source={{
            uri:
              'https://pbs.twimg.com/profile_images/1334955566993604608/vo4Ep1TZ_400x400.jpg',
            }}
            style={{
            width: 90,
            height: 90,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: '#2B32B2',
            }}
          />




          </View>
          <View
            style={styles.roomButton}
          >
          <Button
            title="Enter Room"
              style={{ borderRadius: 15 }}
              color="#2E9994"
            onPress={() => Alert.alert('Room Screen')}
      />
          </View>

        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  borderRadius: {
    flex: 1,
    borderRadius: 12
  },
  shadow: {
    shadowColor: "#102027",
    elevation: 16,
  },
  cardContainer: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  TitleText: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'left'
  },
  DescriptionText: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  roomButton: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginHorizontal: 30,

  }
});
