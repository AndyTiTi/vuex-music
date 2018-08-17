<template>
<transition name="slider">
  <div class="searchBox" ref="searchPage">
    <div class="top">
       <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
     <scroll ref="shortcut" class="shortcut" :data="shortcutData" :refreshDelay="refreshDelay">
       <div>
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="item in randomHotKey">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
         <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
       </scroll>
      </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
    </div>
   <confirm ref='confirm' text="是否清空所有搜索历史？" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
   <router-view></router-view>
  </div>
</transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import {getRandomArrayElements} from 'common/js/util'
import Suggest from 'components/suggest/suggest'
import {mapGetters,mapActions} from 'vuex'
import Confirm from 'base/confirm/confirm'
import {playlistMixin,searchMixin} from 'common/js/mixin'
export default {
  mixins: [playlistMixin,searchMixin],
  data(){
    return{
      randomHotKey:[],
      // query:'',
    }
  },
  computed:{
      ...mapGetters([
        'hotSearchList'
        // 'searchHistory'
      ]),
      shortcutData() {
        return this.randomHotKey.concat(this.searchHistory)
      },
  },
  created(){
    this._getHotKey()
  },
  //组件销毁清除定时器
  destoryed(){
    clearInterval(this.interval1)
  },
  methods:{
    // 当有迷你播放器时，调整滚动底部距离
    handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '60px' : '' //播放器高度加上原有bottom 等于100
          this.$refs.searchResult.style.bottom = bottom
          this.$refs.suggest.refresh()

          this.$refs.shortcutWrapper.style.bottom = bottom
          this.$refs.shortcut.refresh()
    },
    back(){
      this.$router.back()
    },
    // 获取热搜索数据
    _getHotKey(){
        // if(this.hotSearchList.length <= 0){
        //   alert(111)
        //    this.$router.push({
        //      path: '/appShow/recommend'
        //    })
        //    return
        // }
        this._getRandomArrayElements(this.hotSearchList)
        //循环显示随机10条
        // this.interval1 = setInterval(() =>{
        //   this._getRandomArrayElements(this.hotSearchList)
        // },5000)
    },
    // addQuery(query){
    //   this.$refs.searchBox.setQuery(query)
    // },
    _getRandomArrayElements(list){
      this.randomHotKey = getRandomArrayElements(list,10)//随机截取前10个数据
    },
    // // 当检索值改变时
    // onQueryChange(query){
    //   this.query = query
    // },
    // // 滚动前触发事件
    // blurInput(){
    //   this.$refs.searchBox.blur()
    // },
    // // 保存搜索结果历史到 vuex 和 localstorage 中
    // saveSearch(){
    //    this.saveSearchHistory(this.query)
    // },
    showConfirm(){
      this.$refs.confirm.show()
    },
    ...mapActions([
      // 'saveSearchHistory',
      // 'deleteSearchHistory'
      'clearSearchHistory'
    ])


  },
  watch: {
    // 解决添加歌曲后不能滚动的问题
    query(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
}

</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slider-enter-active, .slider-leave-active
    transition: all 0.3s
  .slider-enter, .slider-leave-to
    transform : translate3d(100%,0,0)
  .searchBox
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .top
      display:flex
      flex-direction :column
      align-items :center
      .back
        position absolute
        top: 8px
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 10px
          font-size: $font-size-large-xl
          color: $color-theme
      .search-box-wrapper
        margin-top:10px
        margin-bottom :20px
        margin-left :20px
        width: 80%
    .shortcut-wrapper
      margin-top:8px
      width:100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 75px
      bottom: 0
</style>
