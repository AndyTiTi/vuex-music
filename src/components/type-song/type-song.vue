<template>
<transition name="slider">
  <div class="type-song">
      <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="this.categoryName"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
       <div class="play-wrapper">
       </div>
          <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="typeList" class="list" ref="list">
         <div class="list-wrapper">
            <two-column-list :items="typeList" @select="selectItems"></two-column-list>
         </div>
        <div v-show="!typeList.length" class="loading-container">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'
  import Loading from 'base/loading/loading'
  import {getTypeList} from 'api/type'
  import Scroll from 'base/scroll/scroll'
  import {prefixStyle} from 'common/js/dom'
  import {ERR_OK} from 'api/config'
  import TwoColumnList from 'base/two-column-list/two-column-list'
  import {playlistMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')
  export default {
    mixins: [playlistMixin],
    data(){
      return{
        typeList: [],
        imgurl:'',
        scrollY : 0,
        categoryName:'',
        categoryId:''
        
      }
    },
    mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.imgurl})`
        }
    },
    methods:{
        handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '60px' : ''
          this.$refs.list.$el.style.bottom = bottom
          this.$refs.list.refresh()
        },
        selectItems(item){
            this.$router.push({
                path: `/appShow/type/typeAll/${this.categoryId}/${this.categoryName}/${item.dissid}`
            })
            this.setDisc(item)
        },
        back(){
            this.$router.push({
                path:'/appShow/type/typeAll'
            })
        },
        _getTypeList(categoryId,sortId){
            getTypeList(categoryId,sortId).then((res)=>{
                if(res.code === ERR_OK){
                  this.typeList = res.data.list
                  this.imgurl = res.data.list[0].imgurl
                }
            })
       },
       scroll(pos){
          this.scrollY =pos.y
        },
       ...mapMutations({
         setDisc: 'SET_DISC'
       })
    },
    watch:{
       scrollY(newVal){
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
        } else{
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
       }
    },
    components: {
      Scroll,
      Loading,
      TwoColumnList
    },
    created(){
      this.probeType = 3 //better-scroll的probeType属性默认是1,如果想要在scroll快速滚动的时候,正确的监听scroll,需把该属性设置为3。
      this.listenScroll = true
      this.categoryId = this.$route.params.categoryId
      this.categoryName = this.$route.params.categoryName
      this._getTypeList(this.$route.params.categoryId,3)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slider-enter-active, .slider-leave-active
    transition: all 0.3s
  .slider-enter, .slider-leave-to
    transform : translate3d(100%,0,0)
  .type-song
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
          border: 1px solid $color-theme
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
      .list-wrapper
        padding-top :15px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>