import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
        'sequenceList',
        'currentSong',
        'playlist',
        'mode',
        'favoriteList'
    ]),
    iconMode(){
      return this.mode === playMode.sequence? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods:{
    changeMode(){
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if(mode === playMode.random){
        list = shuffle(this.sequenceList)
      }else{
        list = this.sequenceList
      }
      this._resetCurrent(list)
      this.setPlayList(list)
    },
    _resetCurrent(list){
      let index = list.findIndex((item) =>{
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song){
      if(this.isFavorite(song)){
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song){
      if(this.isFavorite(song)){
        this.deleteFavoriteList(song)
      }else{
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song){
     const index = this.favoriteList.findIndex((item)=>{
         return item.id === song.id
     })
     return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data(){
    return {
      query : '',
      refreshDelay : 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
  },
  methods:{
        // 滚动前触发事件
        blurInput(){
          this.$refs.searchBox.blur()
        },
        // 保存搜索结果历史到 vuex 和 localstorage 中
        saveSearch(){
           this.saveSearchHistory(this.query)
        },
        // 当检索值改变时
        onQueryChange(query){
          this.query = query
        },
        addQuery(query){
          this.$refs.searchBox.setQuery(query)
        },
        ...mapActions([
          'saveSearchHistory',
          'deleteSearchHistory'
        ])
  }
}

