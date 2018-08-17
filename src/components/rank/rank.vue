<template>
<transition name="slider">
  <div id="rank" ref="rank">
    <div class="m-header">
          <span class="singerTitle">排行</span>
    </div>
    <div class="back" @click="back">
          <i class="icon-back"></i>
    </div>
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <div class="topSpan">
          <span class="topTitle">Love Music 巅 峰 榜</span>
        </div>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
            <div class="headset">
               <img width="15" height="15" src="./headset1.png" alt="">
               <!-- 判断听过数量是否大于10000 如果大于显示万单位  Math.round四舍五入取整-->
               <span class="count" v-if="item.listenCount >= 10000">{{Math.round(item.listenCount/10000)}}万</span>
               <span class="count" v-if="item.listenCount < 10000">{{item.listenCount}}</span>
            </div>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</transition>
</template>

<script>
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playlistMixin],
  data(){
    return{
      topList: []
    }
  },
  created(){
    this._getTopList()
  },
  methods:{
    back(){
      this.$router.push({
        path:'/appShow/recommend'
      })
    },
     handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '100px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
    _getTopList(){
      getTopList().then((res) => {
        if(res.code === ERR_OK){
          this.topList = res.data.topList
        }
      })
    },
    selectItem(item){
       this.$router.push({
         path: `/appShow/rank/${item.id}`
       })
       this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
      Scroll,
      Loading
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
  #rank
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 40px
    right: 0
    background: $color-background
    .m-header
      height:30px
      .singerTitle
        display:flex
        font-size: $font-size-large
        color:$color-theme
        justify-content :center
        margin-top :10px
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-xl
        color: $color-theme
    .toplist
      height: 100%
      overflow: hidden
      .topSpan
        display: flex
        flex-direction: column
        align-items :center
        margin-top :18px
        .topTitle
          font-size :17px
          color:$color-text-d
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
          .headset
            position relative
            top:-20px
            left:5px
            img 
              vertical-align :middle
            .count
              font-size :10px
              color:$color-text-d
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
