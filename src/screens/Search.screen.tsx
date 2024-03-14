import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';
import SearchHeader from '../components/header/SearchHeader';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {searchVideos, setResultVideos} from '../store/slices/searchSlice';
import VideoList from '../components/video/VideoList';
import {videoInterface} from '../interfaces/video';
import {colors} from '../utils/theme';
import {useSocket} from '../context/SocketContext';

type SearchScreenProps = NativeStackScreenProps<RootParamList, 'Search'>;

export default function Search({navigation, route}: SearchScreenProps) {
  return <SearchScreen navigation={navigation} route={route} />;
}

function SearchScreen({navigation, route}: SearchScreenProps) {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const {socket} = useSocket();
  const [suggestions, setSuggestions] = useState<[string] | null>(null);
  const resultVideos: videoInterface[] | null = useSelector(
    (state: RootState) => state.searchReducer.resultVideos,
  );
  const hasNextPage = useSelector(
    (state: RootState) => state.searchReducer.hasNextPage,
  );
  const [isLoading, setIsLoading] = useState(false);
  const onTextChangeTimeOutRef = useRef<NodeJS.Timeout | null>(null);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);

  const onSearchHandler = async (text: string, page: number, limit: number) => {
    setIsEditingText(false);
    try {
      setIsLoading(true);
      dispatch(searchVideos({query: text, page: page, limit: limit}));
      setPage(prev => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const receiveSuggestionHandler = ({data}: any) => {
    setSuggestions(data);
  };

  useEffect(() => {
    socket?.on('receive-suggestion', receiveSuggestionHandler);
    return () => {
      socket?.off('receive-suggestion', receiveSuggestionHandler);
      dispatch(setResultVideos(null));
    };
  }, []);

  useEffect(() => {
    socket?.emit('search-auto-suggest', searchText);
  }, [searchText]);

  const onTextChangeHandler = (text: string) => {
    if (text.length > 0) {
      setSearchText(text);
      setIsEditingText(true);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SearchHeader
          onBack={() => navigation.popToTop()}
          onDescPress={() => {}}
          onTextChange={onTextChangeHandler}
          onSearch={() => onSearchHandler(searchText, 1, 2)}
        />
      ),
    });
  }, []);
  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={50} color={colors.text} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {isEditingText && suggestions && !isLoading && (
        <FlatList
          data={suggestions}
          renderItem={({item, index}) => {
            return (
              <Pressable
                android_ripple={{color: colors.gray}}
                style={{padding: 8, flexDirection: 'row'}}
                onPress={() => {
                  setSearchText(item);
                  onSearchHandler(item, 1, 2);
                }}>
                <Text style={{color: colors.text}}>{item}</Text>
              </Pressable>
            );
          }}
        />
      )}
      {resultVideos &&
        resultVideos.length > 0 &&
        !isLoading &&
        !isEditingText && (
          <>
            <VideoList
              data={resultVideos}
              horizontal={false}
              footerComponent={() => <></>}
              handleRefresh={() => {}}
              headerComponent={() => (
                <Text style={styles.title}>
                  Search Result For: {searchText}
                </Text>
              )}
              listEmptyComponent={() => <></>}
              onEndReach={() => {
                if (hasNextPage) onSearchHandler(searchText, page, limit);
              }}
              refreshing={false}
              shouldShowSubscriberButton={false}
            />
          </>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
