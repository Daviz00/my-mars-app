import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoverImages } from '../api/RoverImages';
import { RoverPhoto } from '../api/types';
import { Card } from '../components/Card';
import { ScreenHeader } from '../components/Layout/ScreenHeader';
import { useFavoritesPhoto } from '../context/FavoritesPhotoContext';
import { Colors } from '../theme/Colors';

const COUNT_CARDS = 3;

export const CardsScreen: React.FC = () => {
  const { data, loading, loadMore, loadingMore } = useRoverImages();
  const { likePhoto, undoLikePhoto, photos: favoritesPhotos } = useFavoritesPhoto();

  const safeArea = useSafeAreaInsets();
  const nav = useNavigation();

  const [currentCardIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!loadingMore && data && currentCardIndex > data.photos.length - 10) {
      loadMore();
    }
  }, [data, currentCardIndex, loadingMore]);

  const photos = React.useMemo(() => {
    return data?.photos.slice(currentCardIndex, currentCardIndex + COUNT_CARDS).reverse() || [];
  }, [data, currentCardIndex]);

  const countPhotos = React.useMemo(() => {
    return data?.photos.slice(currentCardIndex).length || 0;
  }, [currentCardIndex, data]);

  const isActiveUndo = React.useMemo(() => {
    return photos.length > 0 && currentCardIndex > 0;
  }, [photos, currentCardIndex]);



  const handleSwipe = React.useCallback((direction: 'left' | 'right', photo: RoverPhoto) => {
    setCurrentIndex((prev) => prev + 1);
    if (direction === 'right') {
      likePhoto(photo);
    }
  }, []);


  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Rooms"
        leftContent={() => (
          <TouchableOpacity
            hitSlop={{ top: 4, left: 4, right: 4, bottom: 4 }}

          >
            <Text
              style={[
                styles.headerLeftButtonText,
                !isActiveUndo && styles.headerLeftButtonInactive
              ]}
            >
              None
            </Text>
          </TouchableOpacity>
        )}
        rightContent={() => (
          <TouchableOpacity onPress={() => setCurrentIndex(0)}>
          <Text style={styles.statusText}>
            {loading || loadingMore ? 'Loading' : `${countPhotos} Rooms`}
          </Text>
        </TouchableOpacity>
        )}

      />
      <View style={styles.cardsContainer}>
        {
          photos.map((item, index) => (
            <Card
              key={item.id}
              index={index}
              item={item}
              onSwipe={(direction) => handleSwipe(direction, item)}
            />
          ))
        }
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  headerLeftButtonText: {
    paddingLeft: 16,
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.25
  },
  headerLeftButtonInactive: {
    color: Colors.inactive
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.75,
    color: Colors.accentPrimary,
  }
});
