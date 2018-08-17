<template>
  <div class="recommend-radio">
   <ul class="diss">
    <li v-for="(item,index) in items" class="item" :style="computWidth">
            <div class="icon">
                <img class="image" :style="computWidth" v-lazy="item.radioImg"/>
            </div>
            <div class="text">
              <h2 class="desc" v-html="item.radioName"></h2>
            </div>
            <i class="new-icon-play2" :class="playIcon(item.radioId)" @click="seclecRadio(item)"></i>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations,mapActions,mapGetters} from 'vuex'
  export default {
    props: {
      items: {
        type: Array,
        default: []
      }
    },
    data(){
        return{
            playIndex:0
        }
    },
    computed:{
      ...mapGetters([
          'playing',
          'playingRadioId'
      ]),
      computWidth(){
        return 'width:' + (window.innerWidth-60)/3 + 'px'
      }
     },
    methods: {
        seclecRadio(item){
            this.$emit('seclecRadio',item)
        },
        playIcon(radioId){ // 根绝播放状态显示播放图标
            if(this.playingRadioId == radioId){
                return this.playing ? 'new-icon-suspend' : 'new-icon-play2' 
            }
        }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .recommend-radio
    .diss
      display :flex
      flex-wrap:wrap 
      justify-content :center
      .item
        margin-right :10px
        margin-left :10px
        position:relative
        .icon
          margin-bottom :13px
          .image
            border-radius :50%
        .new-icon-play2
          position absolute
          font-size :20px
          top:30%
          left:45%
          color:$color-text
        .new-icon-suspend
          position absolute
          font-size :25px
          top:29%
          left:40%
          color:$color-text
        .text
          font-size: $font-size-small
          text-align :center
          .desc
            no-wrap()
            color: $color-text
            margin-bottom :10px
            line-height: 18px
</style>