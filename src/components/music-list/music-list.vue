<template>
  <div class="music-list">
      <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
       <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" >
          <!-- <i class="icon-play"></i>
          <span class="text">随机播放全部</span> -->
        </div>
       </div>
          <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
        <div class="song-list-wrapper">
            <song-list :rank="rank" :in-count="inCount" @select="selectItem" @random="random" :songs="songs"></song-list>
        </div>
        
      </scroll>
      <div class="posButton" v-show="showFlag">
          <div class="button" >
              <div class="random" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放</span>
              </div>
              <span class="count" >共{{songs.length}}首</span>
          </div>
      </div>
      <div v-show="!songs.length" class="loading-container">
          <loading></loading>
      </div>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
import {mapActions, mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
    mixins: [playlistMixin],
    props:{
        bgImage:{
            type: String,
            default: ''
        },
        songs:{
            type: Array,
            default: []
        },
        title:{
            type: String,
            default: ''
        },
        rank:{
          type: Boolean,
          default: false
        },
        //若果为排行页面 则显示排行上升%
        inCount:{
         type: Array,
         default: () => []
       }
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    data(){
        return {
            scrollY : 0,
            showFlag:false,
            probeType:3,
            listenScroll:true
        }
    },
    created(){
        // this.probeType = 3 //better-scroll的probeType属性默认是1,如果想要在scroll快速滚动的时候,正确的监听scroll,需把该属性设置为3。
        // this.listenScroll = true
    },
    methods:{
        handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '60px' : ''
          this.$refs.list.$el.style.bottom = bottom
          this.$refs.list.refresh()
        },
        scroll(pos){
          this.scrollY =pos.y
        },
        back(){
            this.$router.back()
        },
        selectItem(item,index){
          // if(item.payalbum === 1){
          //   alert("此歌曲为收费歌曲，暂时无法播放！")
          //   return 
          // }
          this.selectPlay({
            list:this.songs,
            index
          })
        },
        random(){
          this.randomPlay({
            list: this.songs
          })
        },
        ...mapActions([
          'selectPlay',
          'randomPlay'
        ])

    },
    watch:{
       scrollY(newVal){
        if(newVal <= -250){
            this.showFlag = true
          }else{
            this.showFlag = false
        }
        let translateY = Math.max(this.minTransalteY, newVal)
        let zIndex= 0
        let scale = 1
        let blur = 0
        this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`
        const percent = Math.abs(newVal / this.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        }else{
             blur = Math.min(20, percent * 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
         if (newVal < this.minTransalteY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else{
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
       }
    },
    components:{
        Scroll,
        SongList,
        Loading
    }
  
}

</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          // border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      // .song-list-wrapper
      //   padding: 20px 30px
    .posButton
      position: absolute
      top: 39px
      left: 0
      width: 100%
      display :flex
      height:45px
      z-index :105
      background : $color-highlight-background
      align-items :center
      .button
        display :flex
        align-items :center
        margin-left :15px
        .random
          display :flex
          align-items :center
          margin-right :8px
          .icon-play
            margin-right :5px
            color:$color-theme
          .text
            color:$color-theme
        .count
          font-size :$font-size-small
          color:$color-theme
    .loading-container
      position: absolute
      width: 100%
      top: 60%
      transform: translateY(-50%)
</style>
