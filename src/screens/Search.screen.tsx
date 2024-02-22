import {StyleSheet, Text, View} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';
import SearchHeader from '../components/header/SearchHeader';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {searchVideos} from '../store/slices/searchSlice';
import VideoList from '../components/video/VideoList';
import {videoInterface} from '../interfaces/video';
import {colors} from '../utils/theme';

type SearchScreenProps = NativeStackScreenProps<RootParamList, 'Search'>;

export default function Search({navigation, route}: SearchScreenProps) {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const resultVideos: [videoInterface] | [] = useSelector(
    (state: RootState) => state.searchReducer.resultVideos,
  );
  const onSearchHandler = () => {
    dispatch(searchVideos({query: searchText}));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SearchHeader
          onBack={() => navigation.popToTop()}
          onDescPress={() => {}}
          onTextChange={(text: string) => {
            setSearchText(text);
          }}
          onSearch={onSearchHandler}
        />
      ),
    });
  }, []);
  return (
    <View style={styles.container}>
      {resultVideos && (
        <>
          <Text style={styles.title}>Search Result For: {searchText}</Text>
          <VideoList data={resultVideos} horizontal={false} />
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
