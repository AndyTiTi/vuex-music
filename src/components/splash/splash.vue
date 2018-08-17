<template>
  <div class="splash">
      <img  src="./home.png">
  </div>
</template>

<script>
export default {
    mounted(){
        setTimeout(() => {
          this._showSplash()
        }, 2100)
    },
    methods:{
      _showSplash(){
          this.$router.push({
              path:'/appShow/recommend'
          })
      }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.splash 
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  background: $color-background
  display :flex
  justify-content :center
  align-items :center
  img
    width:93%
    height:75%
</style>