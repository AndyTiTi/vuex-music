<template>
  <transition name="slider">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {getVkey} from 'api/song'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

import {ERR_OK} from 'api/config'
export default {
  data(){
   return{
     songs: [],
     newSongs:[]
   }
  },
  computed:{
    title(){
      return this.singer.name
    },
    bgImage(){
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created(){
    this._getDetail()
  },
  methods:{
    _getDetail(){
       if(!this.singer.id){
         this.$router.push({
           path: '/appShow/singer'
         })
         return
       }
       getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK){
            console.log(res)
            this.songs = this._normalizeSongs(res.data.list)
          }
       })
    },
    _normalizeSongs(list){
      list.forEach((item) => {
        let {musicData} = item
        if(musicData.songid && musicData.albummid){
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
    }
  },
  components:{
    MusicList
  }
}

</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  .slider-enter-active, .slider-leave-active
    transition: all 0.3s
  .slider-enter, .slider-leave-to
    transform : translate3d(100%,0,0)
</style>
