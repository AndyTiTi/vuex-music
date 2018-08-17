<template>
  <div class="appShow">
      <mheader></mheader>
      <!-- <tab></tab> -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    <player></player>
  </div>
</template>

<script>
import mheader from 'components/header/header'
//import tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
    components:{
     mheader,
     //tab,
     Player
  }
}

</script>

<style lang="stylus">
</style>
