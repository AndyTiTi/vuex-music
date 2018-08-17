<template>
  <transition name="slide">
    <div id="album-detail" ref="album">
        <!-- <div class="m-header">
            <span class="albumTitle">专辑</span>
        </div> -->
        <fade-out-header header-text1="专辑" :header-text2="data.name" :scrollY="scrollY"></fade-out-header>
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="scroll" ref="list">
          <div>
            <span class="adate" :style="colorStyle">{{data.aDate}}</span>
            <div class="image-bg" >
                  <img class="image" width="125px" height="125px" v-lazy="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.$route.params.albummid}.jpg?max_age=2592000`" />
                  <div class="diss" :style="computWidth">
                      <span class="albumname">{{data.name}}</span>
                      <div class="avatar-wrapper">
                        <img class="avatar" v-lazy="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${data.singermid}.jpg?max_age=2592000`" v-show="data.singermid">
                        <span class="singername">{{data.singername}}</span>
                      </div>
                      <div class="desc" @click="todesc">
                        <span class="info">简介：{{data.desc}}</span>
                        <i class="new-icon-rightarrow"></i>
                      </div>
                  </div>
            </div>
            <div class="suiji">
              <div class="button">
                <div class="random" @click="random">
                  <i class="icon-play"></i>
                  <span class="text">随机播放</span>
                </div>
                  <span class="count" >共{{songs.length}}首</span>
              </div>
            </div>
            <div class="list">
               <ul class="song-list">
                 <li class="item" v-for="(song, index) in songs" @click="selectItem(song,index)">
                    <div class="wrapper">
                      <span class="index" v-text="getRankText(index)"></span>
                      <div class="content">
                        <h2 class="name">{{song.name}}</h2>
                        <p class="desc">{{getDesc(song)}}</p>
                      </div>
                    </div>
                 </li>
               </ul>
             </div>
            </div>
          </scroll>
          <div class="posButton" v-show="showFlag">
              <div class="button">
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
          <router-view></router-view>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">

  import {mapGetters,mapMutations,mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  import Scroll from 'base/scroll/scroll'
  import {createSong} from 'common/js/song'
  import Loading from 'base/loading/loading'
  import {getVkey} from 'api/song'
  import FadeOutHeader from 'base/fade-out-header/fade-out-header'
  import {getColor} from 'common/js/dom'
  import {ERR_OK} from 'api/config'
  import {getAlbumDetail} from 'api/album'
  export default {
    mixins: [playlistMixin],
    data(){
      return{
          data:{},
          songs:[],
          newSongs:[],
          scrollY:0,
          probeType:3,
          listenScroll:true,
          showFlag:false
      }
    },
    computed:{
      computWidth(){
         return 'width:'+(window.innerWidth/1.8)+'px'
      },
      bgStyle(){
        return 'background:' + getColor(this.data.color)
      },
      colorStyle(){
        return this.data.color == 0 ? 'color:#956d39' : 'color:#fff'
      }
    },
    methods:{
        handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '60px' : ''
          this.$refs.list.$el.style.bottom = bottom
          this.$refs.list.refresh()
        },
        back(){
          this.$router.back()
        },
        todesc(){
          if(this.$route.params.disstid1){
            this.$router.push({
              path:`/appShow/recommend/${this.$route.params.disstid1}/${this.$route.params.disstid2}/${this.$route.params.index}/${this.$route.params.albummid}/desc`
            })
          }else{
            this.$router.push({
              path:`/appShow/recommend/album/detail/${this.$route.params.albummid}/desc`
            })
          }
         
          this.setAlbumDesc(this.data)
        },
        getDesc(song) {
          return `${song.singer}`
        },
        getRankText(index) {
            return index + 1
        },
        _getAlbumDetail(albummid){
          getAlbumDetail(albummid).then((res) => {
                this.data = res.data
                this.songs = this._normalizeSongs(res.data.list)
          })
        },
        _normalizeSongs(list){
          list.forEach((musicData) => {
            if(musicData.songid && musicData.albumid){
              getVkey(musicData.songmid).then(res=>{
              if(res.code === ERR_OK){
                  let data = res.data.items[0]
                  let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`
                  this.newSongs.push(createSong(musicData,url,false))
                }
            })
            }
          })
          return this.newSongs
        },
        scroll(pos){
          this.scrollY = pos.y
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
        ]),
        ...mapMutations({
          setAlbumDesc:'SET_ALBUM_DESC',
        })
    },
    watch:{
       scrollY(newVal){
           if(newVal <= -185){
             this.showFlag = true
           }else{
             this.showFlag = false
           }
       }
    },
    components: {
      Scroll,
      Loading,
      FadeOutHeader
    },
    created(){
        // this.probeType = 3 //better-scroll的probeType属性默认是1,如果想要在scroll快速滚动的时候,正确的监听scroll,需把该属性设置为3。
        // this.listenScroll = true
        this._getAlbumDetail(this.$route.params.albummid)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  #album-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom:0
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
    .scroll
      position: fixed
      top: 40px
      left: 0
      bottom: 0
      right: 0
      overflow: hidden
      // position: relative
      // width: 100%
      // height: 100%
      // overflow: hidden
      .adate
        z-index : 10
        position:absolute
        top 125px
        left 30px
      .image-bg
        display :flex
        flex-direction :row
        margin-left :25px
        height :165px
        width:100%
        padding-top :20px
        .image
          margin-right :8px
        .diss
          display :flex
          flex-direction :column
          margin-top :15px
          line-height: 20px
          .albumname
            no-wrap()
            margin-bottom :15px
            font-size :$font-size-medium-xl
            color:$color-text
          .avatar-wrapper
            display :flex
            align-items :center
            margin-bottom :20px
            .avatar
              width: 30px
              height: 30px
              border-radius: 50%
            .singername
              no-wrap()
              margin-left :8px
              font-size :$font-size-medium-s
              color:$color-text
          .desc
            display :flex
            align-items :center
            .info
              no-wrap()
              font-size :$font-size-small
              color:$color-text
            .new-icon-rightarrow
              color :$color-text
      .suiji
        display :flex
        height:45px
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
      .list
        margin-top :15px
        .song-list
          .item
            display: flex
            align-items: center
            box-sizing: border-box
            height: 64px
            font-size: $font-size-medium
            margin-left:20px
            .wrapper
              display :flex
              flex-direction :row
              align-items :center
              .index
                color: $color-theme
                font-size: $font-size-large
                width: 25px
                text-align :center
                margin-right :23px
              .content
                flex: 1
                line-height: 20px
                Zoverflow: hidden
                .name
                  no-wrap()
                  color: $color-text
                .desc
                  no-wrap()
                  margin-top: 4px
                  color: $color-text-d
                  font-size: $font-size-small
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