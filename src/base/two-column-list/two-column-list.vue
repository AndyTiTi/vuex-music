<template>
  <div class="two-column-list">
    <ul class="diss">
    <li v-for="item in items" class="item" @click="selectItem(item)" :style="computWidth">
            <div class="icon">
              <img class="image" :style="computWidth" v-lazy="item.imgurl"/>
              <div class="headset">
               <img width="" height="15" src="./img/headset.png" alt="">
               <!-- 判断听过数量是否大于10000 如果大于显示万单位  Math.round四舍五入取整-->
               <div class="listencount" v-if="item.listennum >= 10000">
                 <span class="count">{{Math.round(item.listennum/10000)}}</span><span class="count">万</span>
               </div>
               <span class="count" v-if="item.listennum < 10000">{{item.listennum}}</span>
              </div>
            </div>
            <div class="text">
              <h2 class="desc" v-html="item.dissname"></h2>
              <p class="name" v-html="item.creator.name"></p>
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
        return 'width:' + (window.innerWidth-40)/2 + 'px'
      }
     },
    methods: {
        selectItem(item){
            this.$emit('select',item)
        }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .two-column-list
    .diss
      display :flex
      flex-wrap:wrap 
      justify-content :center
      margin-right :10px
      margin-left :15px
      .item
        margin-right :5px
        .icon
          .image
            height:190px
          .headset
            z-index:110px
            display :flex
            position relative
            align-items :center
            top:-23px
            left:10px
            img 
              margin-right :3px
          .listencount
            display :flex
            flex-direction :row
            margin-top :3px
            .count
              display :block
              flex-direction:row
              font-size :10px
              color:$color-text
        .text
          font-size: $font-size-small
          .desc
            color: $color-text
            margin-bottom :10px
            line-height: 18px
          .name
            color: $color-text-d
            margin-bottom :20px
</style>