<template>
  <div class="recommend-album">
   <ul class="diss">
    <li v-for="item in items" class="item" @click="selectItem(item)" :style="computWidth">
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
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      items: {
        type: Array,
        default: []
      }
    },
    computed:{
      computWidth(){
        return 'width:' + (window.innerWidth-20)/3 + 'px'
      }
     },
    methods: {
        selectItem(item){
            console.log(item)
            this.$emit('select',item)
        }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .recommend-album
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
</style>