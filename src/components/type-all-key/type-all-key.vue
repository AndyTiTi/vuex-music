<template>
<transition name="slider">
  <div id="type-all-key" ref="typeAllKey">
    <div class="m-header">
       <span class="typeTitle">全部分类</span>
    </div>
    <div class="back" @click="back">
       <i class="icon-back"></i>
    </div>
    <scroll :data="categories" class="allTypeList" ref="allTypeList"> 
      <div>
        <type-all-list :allTypeList="categories" @select="toTypeDetail"></type-all-list>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</transition>
</template>

<script>
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import TypeAllList from 'base/type-all-list/type-all-list'
import {getTypeKeyList,getTypeList} from 'api/type'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playlistMixin],
  data(){
    return{
        categories:[] //所有分类集合
    }
  },
  created(){
      this._getTypeKeyList()
  },
  methods:{
    handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '105px' : '' //播放器高度加上原有bottom 等于148
          this.$refs.typeAllKey.style.bottom = bottom
          this.$refs.allTypeList.refresh()
    },
    back(){
      this.$router.push({
        path:'/appShow/type'
      })
    },
     _getTypeKeyList(){
        getTypeKeyList().then( (res)=> {
              if(res.code === ERR_OK){
                  res.data.categories.forEach( (element,index) => {
                      if(element.usable != 0){
                          let length = 0
                          if ( (element.items.length % 3) != 0){
                           length = 3-(element.items.length % 3)
                           for(let i=0;i<length;i++){//如果除以3有余数就补全
                              element.items.push({
                                no_type:true //no_type为true代表没有分类
                              }) 
                           }
                          }
                          this.categories = this.categories.concat(element)
                         
                      }
                      
                  });
              }
        })
    },
    toTypeDetail(item){
      if(!item.categoryId){ // 处理空白选项 不做任何操作
        return
      }
      this.$router.push({
        path:`/appShow/type/typeAll/${item.categoryId}/${item.categoryName}`
      })
    }
  },
  components: {
      TypeAllList,
      Scroll,
      Loading
  }
}

</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slider-enter-active, .slider-leave-active
    transition: all 0.3s
  .slider-enter, .slider-leave-to
    transform : translate3d(100%,0,0)
  #type-all-key
    position: fixed
    z-index: 150
    top: 0
    left: 0
    bottom:48px
    right: 0
    background: $color-background
    .m-header
      height:30px
      margin-bottom :8px
      .typeTitle
        display:flex
        font-size: $font-size-large
        color:$color-theme
        justify-content :center
        margin-top :10px
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
    .allTypeList
      height: 100%
      overflow: hidden
      background: $color-background
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-xl
        color: $color-theme
</style>
