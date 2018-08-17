<template>
  <div class="fade-out-header">
      <div class="header1" v-show="showFlag">
         <span class="headerText1">{{headerText1}}</span>
      </div>
      <div :style="opacityStyle" class="header2" v-show="!showFlag">
        <span class="headerText2" v-html="headerText2"></span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
      props:{
        headerText1: {
          type: String,
          default: ''
        },
        headerText2: {
          type: String,
          default: ''
        },
        scrollY:{
            type: Number,
            default: 0
        }
      },
      data(){
          return{
              showFlag : true,
              opacityStyle : { // 透明度
                  opacity : 0
              }
          }
      },
      watch:{
      //  监听scrollY位置变化 来实现header渐隐渐显效果
       scrollY(newVal){
           if(newVal <= -15){
             let opacity = Math.abs(newVal/145)
             opacity = opacity > 1 ? 1 : opacity
             this.opacityStyle = {
                 opacity : opacity
             }
             this.showFlag = false
           }else{
             this.showFlag = true
           }
       }
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .fade-out-header
    height:30px
    .header1
      .headerText1
        display:flex
        font-size: $font-size-large
        color:$color-theme
        justify-content :center
        margin-top :10px
    .header2
      .headerText2
        no-wrap()
        display:flex
        font-size: $font-size-large
        color:$color-theme
        justify-content :center
        margin-top :10px
</style>