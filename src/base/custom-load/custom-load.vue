<template>
  <div class="custom-load">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

        .custom-load
          width: 10px
          height: 10px
          border-radius: 50%
          border: 3px solid #666
          border-left: 3px solid #956d39
          animation: load 1s linear infinite
          -moz-animation:load 1s linear infinite
          -webkit-animation: load 1s linear infinite
          -o-animation:load 1s linear infinite
        
        @-webkit-keyframes load
          from
            -webkit-transform:rotate(0deg)
          to
            -webkit-transform:rotate(360deg)
        
        @-moz-keyframes load
          from
            -moz-transform:rotate(0deg)
          to
            -moz-transform:rotate(360deg)
        
        @-o-keyframes load
          from
            -o-transform:rotate(0deg)
          to
            -o-transform:rotate(360deg)
</style>