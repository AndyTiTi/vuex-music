<template>
  <transition name="slide">
    <div id="disc" ref="disc">
      <fade-out-header header-text1="歌单" :header-text2="title" :scrollY="scrollY"></fade-out-header>
      <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="scroll" ref="list">
        <div>
          <div class="image-bg" >
              <img class="image" width="125px" height="125px" v-lazy="bgImage" />
                <div class="diss" :style="computWidth">
                    <span class="albumname">{{title}}</span>
                    <div class="avatar-wrapper">
                      <img class="avatar" v-lazy="data.headurl" >
                      <span class="singername">{{data.nickname}}</span>
                    </div>
                    <div class="desc" v-show="tags.length">
                      <span class="info">标签：{{getTags(tags)}}</span>
                      <!-- <i class="new-icon-rightarrow"></i> -->
                    </div>
                </div>
          </div>
          <div class="song-list-wrapper">
            <song-list :rank="false" :in-count="[]" :songs="songs" @select="selectItem" @random="random"></song-list>
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
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import FadeOutHeader from 'base/fade-out-header/fade-out-header'
  import {playlistMixin} from 'common/js/mixin'
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  import {getSongList} from 'api/recommend'
  import Loading from 'base/loading/loading'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {getVkey} from 'api/song'
  export default {
    mixins: [playlistMixin],
    data(){
      return{
        data:[],
        songs: [],
        newSongs:[],
        tags:[],
        scrollY:0,
        probeType:3,
        listenScroll:true,
        showFlag:false
      }
    },
    computed:{
      title(){
        return this.disc.dissname
      },
      bgImage(){
        return this.disc.imgurl
      },
      computWidth(){
         return 'width:'+(window.innerWidth/1.8)+'px'
      },
      ...mapGetters([
        'disc'
      ])
    },
    methods:{
        handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '60px' : ''
          this.$refs.list.$el.style.bottom = bottom
          this.$refs.list.refresh()
        },
        getTags(tags){
          if(tags.length == 1){
            return tags[0].name
          }else{
            let name = ""
            tags.forEach((item)=>{
              name = name+" "+item.name
            })
            return name
          }
        },
        _getSongList(){
          if(!this.disc.dissid){
            this.$router.back()
            return
        }
        getSongList(this.disc.dissid).then((res) =>{
          if(res.code === ERR_OK){
             this.data = res.cdlist[0]
             this.tags = res.cdlist[0].tags
             console.log(this.tags)
             this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      back(){
        this.$router.back()
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      _normalizeSongs(list){
        list.forEach((musicData) => {
          if(musicData.songid && musicData.albumid){
            getVkey(musicData.songmid).then(res=>{
             if(res.code === ERR_OK){
                let data = res.data.items[0]
                let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`
                this.newSongs.push(createSong(musicData,url))
              }
           })
          }
        })
        return this.newSongs
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
           if(newVal <= -185){
             this.showFlag = true
           }else{
             this.showFlag = false
           }
       }
    },
    components: {
      FadeOutHeader,
      SongList,
      Scroll,
      Loading
    },
    created(){
      this._getSongList()
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
  #disc
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
      // .song-list-wrapper
      //   margin-left :20px
      //   margin-right :20px
    .posButton
      position: absolute
      top: 40px
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