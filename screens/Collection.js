import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Platform, ActivityIndicator } from 'react-native';
import GridView from 'react-native-super-grid';
import Lightbox from 'react-native-lightbox';
import contextWrap from '../util/contextWrap';

class Collection extends Component {
  static navigationOptions = {
    title: 'Collection',
  };

  render() {
    const { dudesCollection, isLoading } = this.props;
    return !isLoading
      ? dudesCollection.length
        ?
          <GridView
            itemDimension={130}
            items={dudesCollection}
            style={styles.gridView}
            renderItem={({ thumbnail }) => (
              <Lightbox>
                <View style={styles.itemContainer}>
                  <Image source={{ uri: thumbnail }} style={styles.backgroundImage} />
                </View>
              </Lightbox>
        )}
          />
        :
          <View style={styles.tabBarInfoContainer}>
            <Text style={styles.tabBarInfoText}>No Frogs to see here just yet.</Text>
          </View>
      : <ActivityIndicator size="large" color="#0000ff" />;
  }
}

export default contextWrap(Collection);

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});
