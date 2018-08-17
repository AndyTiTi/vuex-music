<template>
  <transition name="slide">
    <music-list :rank="rank" :in-count="inCount" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {getVkey} from 'api/song'
  export default {
    created(){
      this._getTopList()
    },
    computed:{
      title(){
        return this.topList.topTitle
      },
      bgImage(){
         if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    data(){
      return{
        songs:[],
        rank: true,
        inCount: [],
        newSongs:[]
      }
    },
    methods:{
     _getTopList(){
       getMusicList(this.topList.id).then((res) =>{
         if(res.code === ERR_OK){
          this.songs = this._normalizeSongs(res.songlist)
          this.inCount = this._inCount(res.songlist)
         }
       })
     },
     _normalizeSongs(list){
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
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
     _inCount(list){
       let inCount = []
       list.forEach((item) => {
          inCount.push(
             item.in_count
          )
       })
       return inCount
     }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>