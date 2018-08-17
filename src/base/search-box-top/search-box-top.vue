<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" @click="pushSearch" readonly :placeholder="placeholder"/>
    <!-- <i class="icon-dismiss"></i> -->
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props:{
      placeholder:{
        type:String,
        default:''
      }
    },
      methods:{
          pushSearch(){
            this.$emit('pushSearch')
          }
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
 

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 95%
    padding: 0 6px
    height: 30px
    background: $color-highlight-background
    .icon-search
      font-size: 21px
      margin-right :5px
    .box
      flex: 1
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>