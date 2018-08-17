<template>
  <div class="header">
    <!-- <div class="icon"></div> -->
   <div class="link-search">
    <div class="link">
     <router-link tag="div" class="tab-item-one" to="/appShow/user">
      <span class="tab-link">我的</span>
     </router-link>
     <router-link tag="div" class="tab-item" to="/appShow/recommend">
      <span class="tab-link">音乐馆</span>
     </router-link>
     <router-link tag="div" class="tab-item" to="/appShow/about">
      <span class="tab-link">关于</span>
     </router-link>
    </div>
    <div class="search">
     <search-box-top @pushSearch="pushSearch" :placeholder="placeholder"></search-box-top>
    </div>
   </div> 
  </div>
</template>

<script>
import SearchBoxTop from 'base/search-box-top/search-box-top'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import {getRandomArrayElements} from 'common/js/util'
import {mapMutations} from 'vuex'
export default { 
    data(){
      return{
        placeholder:'',
        randomHotKey:[],
        hotKey:[]
      }
    },
    created(){
      this._getHotKey()
    },
    destoryed(){
     clearInterval(this.interval1)
    },
    methods:{
    _getHotKey(){
      getHotKey().then((res) =>{
        if(res.code === ERR_OK){
          this.hotKey = res.data.hotkey
          this._getRandomArrayElements(res.data.hotkey)
          //循环显示随机10条
          this.interval1 = setInterval(() =>{
            this._getRandomArrayElements(res.data.hotkey)
          },5000)
        }
      })
    },
    _getRandomArrayElements(list){
      this.randomHotKey = getRandomArrayElements(list,1)//随机截取1个数据
      this.randomHotKey.forEach((item) => {
        this.placeholder = item.k
      })
    },
    pushSearch(){
      this.$router.push({
        path:'/appShow/search'
      })
      //vuex传值
      this.setHotSearchList(this.hotKey)
    },
    ...mapMutations({
      setHotSearchList: 'SET_HOT_SEARCH_LIST'
    })
  },
    components: {
      SearchBoxTop
    }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .header
    display:flex
    align-items :center
    position: relative
    height: 88px
    color: $color-theme
    .link-search
      display:flex
      flex-direction: column
      width:100%
      .link
        display:flex
        flex-direction: row
        align-items :center
        justify-content :center
        margin-bottom :15px
        .tab-item-one
          text-align: center
          .tab-link
            color: $color-text
          &.router-link-active
            .tab-link
              color:$color-text-new
              font-weight :700
              font-size :17.5px
        .tab-item
          text-align: center
          margin-left :22px
          .tab-link
            color: $color-text
          &.router-link-active
            .tab-link
              color:$color-text-new
              font-weight :700
              font-size :17.5px
      .search
        display:flex
        justify-content :center
</style>
