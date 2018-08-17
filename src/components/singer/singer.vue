<template>
<transition name="slider">
  <div class="singer" ref="singer">
      <div class="m-header">
          <span class="singerTitle">歌手</span>
      </div>
      <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <listview @select="selectSinger" :data="singers" ref="list"></listview>
      <router-view></router-view>
  </div>
</transition>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import listview from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 100
export default {
   mixins: [playlistMixin],
    data() {
      return {
        allSingers: [],
        singers: []
      }
    },
  created(){
    this._getSingerList()
  },
  methods:{
    handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '100px' : '' //播放器高度加上原有bottom 等于100
          this.$refs.singer.style.bottom = bottom
          this.$refs.list.refresh()
    },
    _getSingerList(){
        //其他为 安英文字母查询
        //查询田间 all_all_A
        //每页为100个歌手数据，不去过多查询
        //我这里查询了all，key下的10页数据，再根据字母分类排序
      for(var i=1;i<=10;i++){
        getSingerList('all',i).then((res) => {
          if(res.code === ERR_OK){
            this.allSingers = this.allSingers.concat(res.data.list)
            this._normalizeSinger(this.allSingers)
          }
        })
      }
        
    },
    back(){
      this.$router.push({
        path:'/appShow/recommend'
      })
    },
    // 规范化歌手数据
    _normalizeSinger(list) {
       
      let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          // 添加至热门数据

          // 由constructor构造器Singer对象，直接引用singer.js
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          // 给list做聚类
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // 字母排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        // 得到一个一维数组
        this.singers = hot.concat(ret)
      
    },
    selectSinger(singer){
      this.$router.push({
        path: `/appShow/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components:{
    listview
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
  .singer
    background: $color-background
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 40px
    right: 0
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
        font-size: $font-size-large
        color: $color-theme
    
</style>
