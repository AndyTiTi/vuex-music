<template>
  <transition name="slide">
    <div class="album-detail-desc" ref="desc" :style="bgStyle">
      <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <scroll class="desclist" ref="scroll" :data="albumDesc.list" >
        <div>
          <div class="image">
            <img width="185px" height="190px" v-lazy="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumDesc.mid}.jpg?max_age=2592000`"/>
          </div>
          <div class="desc">
            <span class="albumname" >专辑：{{albumDesc.name}}</span>
            <span class="lan" >语种：{{albumDesc.lan}}</span>
            <span class="aDate" >发行时间：{{albumDesc.aDate}}</span>
            <span class="company" >发行公司：{{albumDesc.company}}</span>
            <span class="genre" >类型：Single</span>
            <span class="genre" >流派：{{albumDesc.genre}}</span>
            <p class="desc-info" v-html="albumDesc.desc"></p>
          </div>
        </div>
       </scroll>
    </div>
   
  </transition>
</template>
<script type="text/ecmascript-6">
import {getColor} from 'common/js/dom'
import {mapGetters,mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
  
  export default {
    mixins: [playlistMixin],
    data(){
      return{
      }
    },
    computed:{
        bgStyle(){
          return 'background:' + getColor(this.albumDesc.color)
        },
        ...mapGetters([
            'albumDesc'
        ])
    },
    methods:{
        back(){
          this.$router.back()
        },
        handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '60px' : '' 
          this.$refs.desc.style.bottom = bottom
          this.$refs.scroll.refresh()
        }
    },
    components: {
      Scroll
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
  .album-detail-desc
    position: fixed
    z-index: 200
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
    .desclist
      position: fixed
      top: 0
      left: 0
      bottom: 50px
      right: 0
      .image
        display :flex
        margin-top :45px
        justify-content :center
      .desc
        display:flex
        flex-direction :column
        margin-top :20px
        color :$color-text
        font-size :$font-size-medium
        margin-left :30px
        margin-right :30px
        .albumname
          no-wrap()
          margin-bottom :10px
        .lan
          margin-bottom :10px
        .aDate
          margin-bottom :10px
        .company
          margin-bottom :10px
        .genre
          margin-bottom :10px
        .desc-info
          line-height :25px
</style>