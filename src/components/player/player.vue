<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal" 
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
          <div class="background">
            <!-- <img width="100%" height="100%" :src="currentSong.image"> -->
          </div>
          <div class="top">
            <div class="back" @click="back">
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <div class="swith-line">
					</div>
          <div class="middle" 
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
               >
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <!-- 播放图标 -->
                <div class="triger" ref="triger" :class="this.playing ? '' : 'pause'">
                  <img width="90px" height="120px" src="./swith.png" alt="">
                </div>
                <div class="cd" :class="cdCls" ref="cd">
                  <img class="image" :src="currentSong.image">
                </div>
                <div class="playing-lyric-wrapper">
                 <div class="playing-lyric">{{playingLyric}}</div>
                </div>
              </div>
            </div>
           <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
          </div>
          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
              <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{format(currentTime)}}</span>
               <div class="progress-bar-wrapper">
                <progress-bar :percent="percent"  @percentChange="onProgressBarChange"></progress-bar>
              </div>
              <span class="time time-r">{{format(currentSong.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left" @click="changeMode">
                <i :class="iconMode"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i @click="togglePlaying" :class="playIcon"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
              </div>
            </div>
          </div>
      </div>
      </transition>
      <transition name="mini">
      <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight">
       <div class="mini-player" v-show="!fullScreen" @click="open">
          <div class="icon">
            <img :class="cdCls" width="40" height="40" :src="currentSong.image">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer" v-show="this.playing"></p>
            <p class="desc-touch" v-show="!playing">左右横滑可以切换上下首</p>
          </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
           <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
      </v-touch>
      </transition>
      <playlist ref="playlist"></playlist>
      <!-- w3c 标准的音乐播放器时间 @play="ready" @error="error" -->
      <audio ref="audio" :src="currentSong.url" 
       @play="ready"
       @error="error" 
       @timeupdate="updateTime"
       @ended="end"
       >
       </audio>
  </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import {playMode} from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import Lyric from 'lyric-parser'
import {shuffle} from 'common/js/util'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import Playlist from 'components/playlist/playlist'
import {playerMixin} from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  mixins: [playerMixin],
  data(){
    return {
      songReady: false,
      currentTime: 0,
      radius:32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  created(){
    console.log(currentSong)
  },
  computed:{
      percent(){
        return this.currentTime / this.currentSong.duration
      },
      playIcon(){
       return this.playing? 'icon-pause' : 'icon-play'
      },
      miniIcon(){
        return this.playing? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCls(){
        return this.playing? 'play' : 'play pause'
      },
      disableCls(){
        return this.songReady? '' : 'disacle'
      },
      // iconMode(){
      //   return this.mode === playMode.sequence? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      // },
      ...mapGetters([
          'fullScreen',
          // 'playlist',
          // 'currentSong',
          'playing',
          'currentIndex',
          // 'mode',
          // 'sequenceList'
      ])
  },
  created(){
    this.touch = {}
  },
  methods:{
    end(){
      if(this.mode === playMode.loop){
        this.loop()
      }else{
        this.next()
      }
      
    },
    loop(){
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
    },
    // changeMode(){
    //   const mode = (this.mode + 1) % 3
    //   this.setPlayMode(mode)
    //   let list = null
    //   if(mode === playMode.random){
    //     list = shuffle(this.sequenceList)
    //   }else{
    //     list = this.sequenceList
    //   }
    //   this._resetCurrent(list)
    //   this.setPlayList(list)
    // },
    // _resetCurrent(list){
    //   let index = list.findIndex((item) =>{
    //     return item.id === this.currentSong.id
    //   })
    //   this.setCurrentIndex(index)
    // },
    back(){
      this.setFullScreen(false)
    },
    open(){
      this.setFullScreen(true)
    },
    enter(el, done){
     const {x,y,scale} = this._getPosAndScale()
     let animation = {
       0: {
         transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
       },
       60: {
         transform:`translate3d(0,0,0) scale(1.1)`
       },
       100: {
         transform:`translate3d(0,0,0) scale(1)`
       }
     }
     animations.registerAnimation({
       name: 'move',
       animation,
       presets: {
         duration: 400,
         easing: 'linear'
       }
     })
      
     animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter(){
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done){
      this.$refs.cdWrapper.style.transition= 'all 0.4s'
      const {x,y,scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave(){
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale(){
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
    },
    togglePlaying(){
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
        
    },
    onSwipeLeft(){
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
    },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
        //  this.$refs.cd.style[transform] = `translate3d(100px,0,0)`
        //  this.$refs.cd.style[transition] = 'all 0.4s'
         
        //控制播放状态 来达到控制 播放器swith动画
        this.setPlayingState(false)
        setTimeout(() => {
          this.setPlayingState(true)
        }, 500)
        //
        //下一首 变为cd 界面
        this.currentShow = 'cd'
        const time = 300
        const width = window.innerWidth
        this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = 1
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
      },
    onSwipeRight(){
       if(!this.songReady){
        return
      }
      let index = this.currentIndex - 1
      if(index === -1){
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if(!this.playing){
        this.togglePlaying()
      }
      this.songReady = false
    },
    prev(){
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
       
      //控制播放状态 来达到控制 播放器swith动画
      this.setPlayingState(false)
      setTimeout(() => {
        this.setPlayingState(true)
      }, 500)
      this.currentShow = 'cd'
      const time = 300
      const width = window.innerWidth
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = 1
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    ready(){
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error(){
      this.songReady = true
    },
    updateTime(e){
      this.currentTime = e.target.currentTime
    },
    format(interval){
     interval = interval | 0
     const minute = interval / 60 | 0 //分
     const second = this._pad(interval % 60)  //秒
     return `${minute}:${second}`
    },
    _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
           this.currentLyric.seek(currentTime * 1000)
        }
      },
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e){
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e){
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd(){
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
      showPlaylist(){
        this.$refs.playlist.show()
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
        // setPlayingState: 'SET_PLAYING_STATE',
        // setCurrentIndex: 'SET_CURRENT_INDEX',
        // setPlayMode: 'SET_PLAY_MODE',
        // setPlayList: 'SET_PLAYLIST'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
  },
  watch:{
      currentSong(newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
    playing(newPlaying){
      const audio = this.$refs.audio
      this.$nextTick(()=>{
         newPlaying? audio.play() : audio.pause()
      })
    }
  },
  components:{
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}

</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        background: $color-background
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 8px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-xl
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          text-align: center
          no-wrap()
          line-height: 40px
          font-size: $font-size-large
          color: $color-text
        .subtitle
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .swith-line
        position: relative
        width:80%
        height:1px
        background-image:-webkit-linear-gradient(to left, rgba(255,255,255,0),rgba(255,255,255,0.6),rgba(255,255,255,0))
        background-image:linear-gradient(to left, rgba(255,255,255,0),rgba(255,255,255,0.6),rgba(255,255,255,0))
        margin:0 auto
      .middle
        position: fixed
        width: 100%
        top: 100px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 13.5%
            top: 0
            width: 80%
            height: 100%
            .triger
              position:absolute
              top:-43px
              left:51%
              transform: translate3d(-16px,0,0)
              transition:all 0.4s
              transform-origin:14px 16px
              z-index :5
              &.pause 
                transform: translate3d(-16px,0,0) rotateZ(-40deg)
            .cd
              width: 90%
              height: 90%
              //box-sizing: border-box
              //border: 5px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              background:url('./cd.png')
              background-size:100%
              background-color:rgba(255, 255, 255, 0.1)
              z-index:2
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 18.2%
                top: 18.2%
                width: 64%
                height: 64%
                border-radius: 50%
                z-index:1
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 20px
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-new 
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
        .desc-touch
          no-wrap()
          font-size: $font-size-small
          color: $color-text-new
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-text-new
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)


</style>
