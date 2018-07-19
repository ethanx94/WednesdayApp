import React, { Component } from 'react';
import {
  AsyncStorage,
} from 'react-native';
import Sound from 'react-native-sound';
import { APPID, APPSECRET } from 'react-native-dotenv';
import { fetchJSON } from '../util/fetchJSON';
import { GlobalContext } from './GlobalContext';

export default class GlobalProvider extends Component {
  constructor(props) {
    super(props);

    Sound.setCategory('Playback', true);
    this.state = this.initialState;
    this.token = `${APPID}|${APPSECRET}`;
    this.trueWednesday = (new Date().getDay() === 3);
    this.curDate = (new Date()).toLocaleDateString();
  }

  get initialState() {
    return {
      isLoading: true,
      isWednesday: (new Date().getDay() === 3),
      godmode: false,
      notWednesday: new Sound('NotWednesday.mp3', Sound.MAIN_BUNDLE),
      REEEEE: new Sound('REEEEE.m4a', Sound.MAIN_BUNDLE),
      notWednesdayDude: {},
      todaysDudes: [],
      dudesCollection: [],
      lastFetched: '',
    };
  }

  async componentDidMount() {
    await this.initialize();
  }

  initialize = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(allKeys);
    const storageObj = {};
    for (const store of stores) {
      storageObj[store[0]] = JSON.parse(store[1]);
    }
    const notWedUrl = `https://graph.facebook.com/v3.0/1726444857365752/photos?fields=images&access_token=${this.token}`;
    const { lastFetched } = storageObj;
    if (this.state.isWednesday && (lastFetched !== this.curDate)) {
      await this.fetchFroggos();
    }
    return this.setState({
      notWednesdayDude: (await fetchJSON(notWedUrl)).data[0].images[0],
      isLoading: false,
      ...storageObj,
    });
  }

  clearState = async () => {
    this.setState(this.initialState);
    await this.initialize();
  }

  clearDudesData = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(allKeys);
    await this.clearState();
  };

  fetchFroggos = async () => {
    this.setState({ isLoading: true });
    const { todaysDudes } = this.state;
    try {
      if (!this.state.dudesRepository) await this.cacheFroggos();
      for (let i = 0; i < 5; i++) {
        const randomIndex = (Math.random() * this.state.dudesRepository.length | 0);
        // Implement categorization strats here
        const loopDude = this.state.dudesRepository[randomIndex];
        const { id } = loopDude;
        const { source } = loopDude.images[0];
        const thumbnail = findThumbnailDude(loopDude.images);
        todaysDudes.push({
          id,
          source,
          thumbnail,
        });
      }
      await AsyncStorage.setItem('todaysDudes', JSON.stringify(todaysDudes));
      const lastFetched = (new Date()).toLocaleDateString();
      await AsyncStorage.setItem('lastFetched', JSON.stringify(lastFetched));
      const newDudes = [];
      for (const dude of todaysDudes) {
        if (!this.state.dudesCollection.includes(dude)) {
          newDudes.push(dude);
        }
      }
      const finalResults = this.state.dudesCollection.concat(newDudes);
      await AsyncStorage.setItem('dudesCollection', JSON.stringify(finalResults));
      return this.setState({
        todaysDudes,
        dudesCollection: finalResults,
        lastFetched,
        isLoading: false,
      });
    } catch (err) {
      return console.log(err);
    }
  }

  cacheFroggos = async () => {
    let url = `https://graph.facebook.com/v3.0/202537220084441/photos?fields=images,id&limit=100&access_token=${this.token}`;
    let dudesRepository = [];
    while (url) {
      const response = await fetchJSON(url);
      dudesRepository = dudesRepository.concat(response.data);
      url = response.paging.next;
    }
    this.setState({ dudesRepository });
    await AsyncStorage.setItem('dudesRepository', JSON.stringify(dudesRepository));
  }

  toggleGodmode = async () => {
    if (!this.trueWednesday) {
      console.log('toggling godmode');
      const godmode = !this.state.godmode;
      this.setState({ godmode, isLoading: true });
      if (godmode && (this.state.lastFetched !== this.curDate)) {
        await this.fetchFroggos();
      }
      this.setState({ isLoading: false, isWednesday: !this.state.isWednesday });
    }
  };

  render() {
    return (
      <GlobalContext.Provider value={{
        ...this.state,
        clearState: () => this.clearState(),
        toggleGodmode: this.toggleGodmode,
        clearDudesData: this.clearDudesData,
      }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

const findThumbnailDude = (dudeArr) => {
  let minHeight = dudeArr[0].height;
  let sourceUrl = dudeArr[0].source;
  for (const { height, source } of dudeArr) {
    if (height < minHeight) { minHeight = height; sourceUrl = source; }
  }
  return sourceUrl;
};