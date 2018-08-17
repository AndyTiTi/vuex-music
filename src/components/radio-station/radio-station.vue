<template>
<transition name="slider">
  <div id="radio" ref="radio">
    <div class="m-header">
          <span class="radioTitle">电台</span>
    </div>
    <div class="back" @click="back">
          <i class="icon-back"></i>
    </div>
    <div class="group-radio-wrapper">
      <scroll class="group-wrapper" :data="groupList" ref="groupScroll">
        <div>
          <ul >
          <li v-for="(item,index) in groupList" class="group-item" :class="{'current':currentIndex===index}" @click="selectGroup(index,$event)">
            <span class="text border-1px">{{item.name}}</span>
          </li>
        </ul>
        </div>
        
      </scroll>
      <scroll :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll" class="radio-wrapper" :data="groupList" ref="radiolist">
        <div>
          <ul>
            <li class="radio-list" v-for="item in groupList" ref="groupList">
              <h1 class="title">{{item.name}}</h1>
              <ul class="radio-info">
                <li class="radio-item" v-for="(radio,index) in item.radioList">
                  <div class="icon">
                    <img class="image" :style="computWidth" v-lazy="radio.radioImg"/>
                  </div>
                  <div class="text">
                    <h2 class="desc" v-html="radio.radioName"></h2>
                    <!-- <p class="name" v-html="item.singers[0].singer_name"></p> -->
                  </div>
                  <i class="new-icon-play2" :class="playIcon(radio.radioId)" @click="seclecRadio(radio.radioId)"></i>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
          <div class="fixed-title">{{fixedTitle}} </div>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</transition>
</template>

<script>
import {ERR_OK} from 'api/config'
import {getGroupRadioList,getRadioSonglist,getPersonalityRadio} from 'api/radio'
import Scroll from 'base/scroll/scroll'
import {getVkey} from 'api/song'
import {createSong} from 'common/js/song'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations,mapActions,mapGetters} from 'vuex'
const TITLE_HEIGHT = 35
export default {
  mixins: [playlistMixin],
  data(){
    return{
      groupList:[],
      listHeight:[],
      scrollY: 0,
      diff: -1,
      songs1:[],
      songs2:[],
    }
  },
  created(){
    this.probeType = 3
    this.listenScroll = true
    this._getGroupRadioList()
  },
  computed:{
      ...mapGetters([
          'playing',
          'playingRadioId'
      ]),
      computWidth(){
        return 'width:' + (window.innerWidth-45-80)/2 + 'px'
      },
      currentIndex(){ // 计算当前处于哪个index
        for(let i=0;i<this.listHeight.length;i++){
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i+1]
          if(!height2 || (-this.scrollY >= height1 && -this.scrollY < height2)){
            this.diff = height2 + this.scrollY
            // console.log(this.diff)
            return i
          }
        }
        return 0
      },
      fixedTitle() { // 滚动时标题的样式和动画
        if (this.scrollY > 0) {
          return ''
        }
        return this.groupList[this.currentIndex] ? this.groupList[this.currentIndex].name : ''
      }
  },
  methods:{
    back(){
      this.$router.push({
        path:'/appShow/recommend'
      })
    },
    handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '40px' : '' 
          this.$refs.radio.style.bottom = bottom
          this.$refs.groupScroll.refresh()
          this.$refs.radiolist.refresh()
    },
    _getGroupRadioList(){ // 所有分类list
      getGroupRadioList().then((res) => {
          if(res.code === ERR_OK){
              this.groupList = res.data.data.groupList
          }
      })
    },
    seclecRadio(radioId){
      this._getRadioSonglist(radioId)
    },
    playIcon(radioId){ // 根绝播放状态显示播放图标
       if(this.playingRadioId == radioId){
         return this.playing ? 'new-icon-suspend' : 'new-icon-play2' 
       }
    },
    _getRadioSonglist(radioId){
      if(radioId == 99){ // 个性电台
        if(radioId == this.playingRadioId){
          this.setPlayingState(!this.playing)
          this.setPlayingRadioId(radioId)
          return
        }
        getPersonalityRadio().then((res)=>{
          if(res.code === ERR_OK){
             this.songs1 = this._normalizeSongs(res.songlist)
             let index = 0
             let radio = true
             this.setPlayingRadioId(radioId)
             this.selectPlay({
                list:this.songs1,
                index,
                radio
             })
          }
        })
      }else{ // 其他电台
        if(radioId == this.playingRadioId){
            this.setPlayingState(!this.playing)
            this.setPlayingRadioId(radioId)
            return
        }
        getRadioSonglist(radioId).then((res) => {
          if(res.code === ERR_OK){
            this.songs2 = this._normalizeSongs(res.songlist.data.track_list)
            let index = 0
            let radio = true
            this.setPlayingRadioId(radioId)
            this.selectPlay({
                list:this.songs2,
                index,
                radio
            })
          }
        })
      }
    },
    _normalizeSongs(list){ // 处理电台歌曲数据
      let songItems = []
        list.forEach((musicData) => {
        if(musicData.mid){
          getVkey(musicData.mid).then(res=>{ // 获取vkey
            if(res.code === ERR_OK){
              let data = res.data.items[0]
              let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`
              songItems.push(createSong(musicData,url,true))
            }
           })
          }
      })
      return songItems
    },
    _calculateHeight(){ // 计算每个group的高度 存储到listHeight
        this.listHeight = []
        const list = this.$refs.groupList
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
    },
    scroll(pos){
      this.scrollY = pos.y // 转换滚动时的Y值为正值
    },
    selectGroup(index,event){ // 滚动到相应index
      if(event._constructed){ // 解决pc端点击触发两次
         const list = this.$refs.groupList
         this.$refs.radiolist.scrollToElement(list[index], 300)
      }
    },
    ...mapActions([
      'selectPlay'
    ]),
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayingRadioId:'SET_PLAYING_RADIO_ID'
    }),
  },
  watch:{
    groupList(){ // 监听groupList变化 重新计算高度
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    diff(newVal) {// 计算滚动的距离来控制fixedTop
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
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
  #radio
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom:0
    right: 0
    background: $color-background
    .m-header
      height:30px
      .radioTitle
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
        font-size:  $font-size-large-xl
        color: $color-theme
    .group-radio-wrapper
      position:fixed
      top:45px
      left :0
      right :0
      bottom :0
      display :flex
      flex-direction :row
      overflow: hidden
      .group-wrapper
        flex:0 0 80px
        overflow: hidden
        width:80px
        background :$color-highlight-background
        .group-item
          display :table // 垂直居中
          height:60px
          width:56px
          padding:0 25px
          line-height :14px
          &.current
            background :$color-background
          .text
            display :table-cell
            width:56px
            vertical-align :middle
            font-size :$font-size-small
            color :$color-text
            // border-1px($color-background) 1px边框
      .radio-wrapper
        overflow: hidden
        flex:1
        .radio-list
          .title
            padding-left :14px
            height:35px
            line-height :36px
            border-left :2px solid #d9dde1
            font-size :$font-size-small
            color :$color-text
            background :$color-highlight-background
          .radio-info
            display :flex
            flex-wrap:wrap 
            padding-top:20px
            padding-bottom :15px
            margin-left :15px
            .radio-item
              margin-right :15px
              position:relative
              .icon
                margin-bottom :13px
                .image
                  border-radius :50%
              .new-icon-play2
                  position absolute
                  font-size :20px
                  top:32%
                  left:46%
                  color:$color-text
              .new-icon-suspend
                  position absolute
                  font-size :25px
                  top:25%
                  left:42%
                  color:$color-text
              .text
                font-size: $font-size-small
                margin-bottom :15px
                text-align :center
                .desc
                  no-wrap()
                  color: $color-text
        .list-fixed
          position: absolute
          top: 0px
          left: 80px
          width: 100%
          .fixed-title
            padding-left :14px
            height:35px
            line-height :36px
            border-left :2px solid #d9dde1
            font-size :$font-size-small
            color :$color-text
            background :$color-highlight-background


</style>
