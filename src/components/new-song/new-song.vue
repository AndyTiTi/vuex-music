<template>
<transition name="slider">
  <div id="new-song" ref="newsong">
    <div class="m-header">
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
    </div>
    <div class="back" @click="back">
        <i class="icon-back"></i>
    </div>
    <div>
      <tab :line-width=3 active-color='#956d39' v-model="index">
        <tab-item   v-for="(item, index) in list" :key="index">{{item}}</tab-item>
      </tab>
      <swiper v-model="index" :height="computHeight" :show-dots="false">
        <swiper-item v-for="(item, index) in list" :key="index" >
            <scroll  :data="changeData(index)" :probe-type="probeType" :listen-scroll="listenScroll" class="list" ref="index">
              <div class="song-list-wrapper" v-if="currentIndex===0">
                  <song-list :songs="changeData(index)" @select="selectItem" @random="random"></song-list>
              </div>
              <div class="album-list-wrapper" v-if="currentIndex===1">
                <ul class="diss">
                  <li v-for="item in changeData(index)" class="item" @click="toAlbum(item)" :style="computWidth">
                      <div class="icon">
                        <img class="image" :style="computWidth" v-lazy="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.album_mid}.jpg?max_age=2592000`"/>
                      </div>
                      <div class="text">
                          <h2 class="desc" v-html="item.album_name"></h2>
                          <p class="name" v-html="item.singers[0].singer_name"></p>
                      </div>
                  </li>
                </ul>
              </div>
              <div v-show="!showLoading(index)" class="loading-container">
               <loading></loading>
              </div>
            </scroll>
        </swiper-item>
      </swiper>
    </div>
    <router-view></router-view>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
  import {getNewList,getSongList} from 'api/recommend'
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  import {ERR_OK} from 'api/config'
  import Switches from 'base/switches/switches'
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getVkey} from 'api/song'
  import {createSong} from 'common/js/song'
  import {playlistMixin} from 'common/js/mixin'
  import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
  const list1 = () => ['最新','内地','港台','欧美','日本','韩国']
  const list2 = () => ['推荐','内地','港台','欧美','韩国','日本']
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        currentIndex: 0,
        disstid1:'',
        disstid2:'',
        songs0:[],songs1:[],songs2:[],songs3:[],songs4:[],songs5:[],
        album0:[],album1:[],album2:[],album3:[],album4:[],album5:[],
        switches: [
          {
            name: '新歌'
          },
          {
            name: '新碟'
          }
        ],
        list: list1(),
        index: 0 ,
        data:{},
        refreshIndex:0,
        length:false
      }
     },
     created(){
       this.disstid1 = this.$route.params.disstid1 //最新
       this.disstid2 = this.$route.params.disstid2 //推荐
       this.currentIndex = parseInt(this.$route.params.index)
       this.probeType = 3 //better-scroll的probeType属性默认是1,如果想要在scroll快速滚动的时候,正确的监听scroll,需把该属性设置为3。
       this.listenScroll = true
       if(this.currentIndex == 0){
         this._getSongList()
       }else{
         this._getNewList(2,0,7)
       }
       
     },
      methods:{
        handlePlaylist(playlist){
          playlist.length > 0 ? this.length = true : this.length = false
          this.$refs.index[this.refreshIndex].refresh() // 因为scroll嵌套在swiper-item里 所以绑定的ref要用 this.refreshIndex才能取到
        },
        back(){
            this.$router.push({
                path:'/appShow/recommend'
            })
        },
        toAlbum(item){
          this.$router.push({
            path: `/appShow/recommend/${this.disstid1}/${this.disstid2}/${this.currentIndex}/${item.album_mid}`
          })
        },
        switchItem(index) {
         this.currentIndex = index
         this.currentIndex == 0 ? this.list = list1() : this.list = list2()
         this.changeIndex(this.newSongRefsh)
         this.$refs.index[this.refreshIndex].refresh() 
        },
        _getSongList(){
          let dissitid = this.newSongRefsh == 0 ? this.disstid1 : this.disstid2
          getSongList(dissitid).then(async (res) =>{
            if(res.code === ERR_OK){
                this.songs0 = await this._normalizeSongs1(res.cdlist[0].songlist)
            }
          })
        },
        _getNewList(i,type,area){
          if(this.currentIndex == 0){
             i = 1
          }else{
            i = 2
          }
          getNewList(i,type,area).then(async (res) => {
              if(res.code === ERR_OK){
               let item = []
               this.currentIndex == 0 ? item = await this._normalizeSongs2(res.new_song.data.song_list) : item = res.new_album.data.list.slice(0,39)
               console.log(item)
                switch (this.newSongRefsh) {
                  case 0:
                     this.currentIndex == 0 ? "" : this.album0 = item
                     break
                  case 1:
                     this.currentIndex == 0 ? this.songs1 = item : this.album1 = item
                     break
                  case 2:
                     this.currentIndex == 0 ? this.songs2 = item : this.album2 = item
                     break
                  case 3:
                     this.currentIndex == 0 ? this.songs3 = item : this.album3 = item
                     break
                  case 4:
                     this.currentIndex == 0 ? this.songs4 = item : this.album4 = item
                     break
                  case 5:
                     this.currentIndex == 0 ? this.songs5 = item : this.album5 = item
                     break
                  default:
                      return false
              }
                
              }
          })
        },
         _normalizeSongs1(list){
          let songItems = []
           list.forEach((musicData) => {
            if(musicData.songid && musicData.albumid){
              getVkey(musicData.songmid).then(res=>{
              if(res.code === ERR_OK){
                  let data = res.data.items[0]
                  let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`
                  songItems.push(createSong(musicData,url))
                }
            })
            }
          })
          return songItems
        },
        _normalizeSongs2(list){
          let songItems = []
           list.forEach((item) => {
            let musicData = item
            if(musicData.id && musicData.mid){
              getVkey(musicData.mid).then(res=>{
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
       changeData(index){
        switch (index) {
            case 0:
              return this.currentIndex == 0 ? this.songs0 : this.album0
              break
            case 1:
              return this.currentIndex == 0 ? this.songs1 : this.album1
              break
            case 2:
              return this.currentIndex == 0 ? this.songs2 : this.album2
              break
            case 3:
              return this.currentIndex == 0 ? this.songs3 : this.album3
              break
            case 4:
              return this.currentIndex == 0 ? this.songs4 : this.album4
              break
            case 5:
              return this.currentIndex == 0 ? this.songs5 : this.album5
              break
            default:
                return false
        }
       },
       changeIndex(index){
        console.log(index+"---"+"index")
        this.refreshIndex = index // scroll绑定的ref 的数组下标
        switch (index) {
            case 0://最新
                 this.setNewSongRefsh(index)
                 if(this.currentIndex == 0 ? this.songs0.length !== 0 : this.album0.length !== 0){
                   return false
                 }
                 this.currentIndex == 0 ? this._getSongList() : this._getNewList(2,0,7)
                 break
            case 1://内地
                this.setNewSongRefsh(index)
                if(this.currentIndex == 0 ? this.songs1.length !== 0 : this.album1.length){
                   return false
                 }
                this.currentIndex == 0 ? this._getNewList(1,1,0) : this._getNewList(2,0,1)
                break
            case 2://港台
                this.setNewSongRefsh(index)
                if(this.currentIndex == 0 ? this.songs2.length !== 0 : this.album2.length !== 0){
                   return false
                 }
                this.currentIndex == 0 ? this._getNewList(1,2,0) : this._getNewList(2,0,0)
                break
            case 3://欧美
                 this.setNewSongRefsh(index)
                 if(this.currentIndex == 0 ? this.songs3.length !== 0 : this.album3.length !== 0){
                   return false
                 }
                 this.currentIndex == 0 ? this._getNewList(1,3,0) : this._getNewList(2,0,3)
                 break
            case 4://日本
                 this.setNewSongRefsh(index)
                 if(this.currentIndex == 0 ? this.songs4.length !== 0 : this.album4.length !== 0){
                   return false
                 }
                 this.currentIndex == 0 ? this._getNewList(1,4,0) : this._getNewList(2,0,14)
                 break
            case 5://韩国
                 this.setNewSongRefsh(index)
                 if(this.currentIndex == 0 ? this.songs5.length !== 0 : this.album5.length !== 0){
                   return false
                 }
                 this.currentIndex == 0 ? this._getNewList(1,5,0) : this._getNewList(2,0,15)
                 break
            default:
                return false
        }
       },
       showLoading(index){
          switch (index) {
            case 0:
              return this.currentIndex == 0 ? this.songs0.length : this.album0.length
              break
            case 1:
              return this.currentIndex == 0 ? this.songs1.length : this.album1.length
              break
            case 2:
              return this.currentIndex == 0 ? this.songs2.length : this.album2.length
              break
            case 3:
              return this.currentIndex == 0 ? this.songs3.length : this.album3.length
              break
            case 4:
              return this.currentIndex == 0 ? this.songs4.length : this.album4.length
              break
            case 5:
              return this.currentIndex == 0 ? this.songs5.length : this.album5.length
              break
            default:
                return false
        }
        
        },
        selectItem(item,index){
          let songs = this.changeData(this.index) // 处理在当前歌曲哪个songs里
          this.selectPlay({
            list:songs,
            index
          })
        },
        random(){
          let songs = this.changeData(this.index)// 处理在当前歌曲哪个songs里
          this.randomPlay({
            list: songs
          })
        },
        ...mapMutations({
          setNewSongRefsh : 'SET_NEW_SONG_REFSH'
        }),
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ]),
      },
      computed:{
        computHeight(){ // 计算高度 适配当迷你播放器出现时 滚动到最底部遮挡问题
          if(this.length){
            return (window.innerHeight)-70+'px'
          }else{
           return window.innerHeight+'px'
          }
        },
        computWidth(){
           return 'width:' + (window.innerWidth-20)/3 + 'px'
        },
        ...mapGetters([
          'newSongRefsh'
        ])
      },
      components: {
        Switches,
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        Loading,
        SongList,
        Scroll
      },
      // 检测index变化 请求数据 渲染页面
      watch:{
        index(val){
          this.changeIndex(val)
        }
      }
}
</script>


<style lang="stylus" >
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slider-enter-active, .slider-leave-active
    transition: all 0.3s
  .slider-enter, .slider-leave-to
    transform : translate3d(100%,0,0)

  #new-song
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom:0
    right: 0
    background: $color-background
    // vux tab 样式修改 已符合项目主题颜色
    .vux-tab 
      background-color :$color-background !important
     .vux-tab-item
       background-size: 0% !important
    .m-header
      height:30px
      margin-bottom :10px
      .switches-wrapper
        margin-top :10px
    .back
      position absolute
      top: 5px
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-xl
        color: $color-theme
    .list
      height:87%
      overflow hidden
      background: $color-background
      // .song-list-wrapper
      //   padding: 20px 30px
      .album-list-wrapper
        .diss
          display :flex
          flex-wrap:wrap 
          justify-content :center
          margin-left :5px
          .item
            margin-right :5px
            .icon
              margin-bottom :13px
            .text
              font-size: $font-size-small
              .desc
                no-wrap()
                color: $color-text
                margin-bottom :10px
                line-height: 18px
              .name
                no-wrap()
                color: $color-text-d
                margin-bottom :20px
      .loading-container
        position: absolute
        width: 100%
        top: 40%
        transform: translateY(-50%)

</style>
