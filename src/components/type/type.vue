<template>
<transition name="slider">
  <div id="type" ref="type">
    <div class="m-header">
          <span class="typeTitle">分类歌单</span>
    </div>
    <div class="back" @click="back">
          <i class="icon-back"></i>
    </div>
    <scroll class="typeList" ref="typeList" :data="typeList">
      <div>
      <h1 class="type-hot-title">热门分类</h1>
      <div class="type-hot-key">
          <ul class="type-wrapper" ref="typeWrapper">
            <li class="item" ref="typeItem" :class="{'active': currentIndex === index}" v-for="(item,index) in randomHotItems" @click="changeTypeList(item.categoryId,item.categoryName,index)">
              <span class="span" v-html="item.categoryName"></span>
            </li>
          </ul>
          <div class="type-all" @click="toTypeAllKey">
            <span class="type-span">查看全部分类</span>
          </div>
      </div>
      <div class="type-middle">
         <span class="typeName">{{typeName}}</span>
         <div class="type-right">
          <span class="recommond" :class="{'active': sortId === 3}" @click="changeSortId">最热</span>
          <span class="wrapper">|</span>
          <span class="new" :class="{'active': sortId === 2}" @click="changeSortId">最新</span>
         </div>
      </div>
        <two-column-list :items="typeList" @select="selectItems"></two-column-list>
      </div>
      <div class="loading-container" v-show="!typeList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</transition>
</template>

<script>
import {getTypeKeyList,getTypeList} from 'api/type'
import {getRandomArrayElements} from 'common/js/util'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import TwoColumnList from 'base/two-column-list/two-column-list'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playlistMixin],
  data(){
    return{
      categories: [],
      currentIndex:-1,
      categorieItems: [],
      randomHotItems: [],
      typeList:[],
      typeName : '全部歌单',
      categoryId : 10000000,
      sortId:3, // 默认显示全部歌单 最热
    }
  },
  created(){
      //查询所有分类名称
      this._getTypeKeyList()
      //查询分类条件下的歌单
      this._getTypeList(this.categoryId,this.sortId)
  },
  computed:{
    computWidth(){
      return 'width:' + (window.innerWidth-40)/2 + 'px'
    }
  },
  methods:{
    back(){
      this.$router.push({
        path:'/appShow/recommend'
      })
    },
    handlePlaylist(playlist){
          const bottom = playlist.length > 0 ? '100px' : '' // 播放器高度加上原有bottom 等于148
          this.$refs.type.style.bottom = bottom
          this.$refs.typeList.refresh()
    },
    _getTypeList(categoryId,sortId){
      getTypeList(categoryId,sortId).then((res)=>{
        if(res.code === ERR_OK){
          this.typeList = res.data.list
        }
      })
    },
    _getTypeKeyList(){
        getTypeKeyList().then((res) => {
          console.log(res)
              if(res.code === ERR_OK){
                  this.categories = res.data.categories // 大分类
                  this.categories.forEach((element,index) => {
                      element.items.forEach((item,i)=>{
                        if(item.usable != 0){ // 不是全部分类
                           this.categorieItems = this.categorieItems.concat(item)
                        }
                      })
                  });
                  this._getRandomArrayElements(this.categorieItems)
              }
        })
    },
    _getRandomArrayElements(list){
        this.randomHotItems = getRandomArrayElements(list,9)// 随机截取9个数据
    },
    changeSortId(){
      if(this.sortId === 3){
        this.sortId = 2
        this._getTypeList(this.categoryId,this.sortId)
      }else{
        this.sortId = 3
        this._getTypeList(this.categoryId,this.sortId)
      }
    },
    changeTypeList(categoryId,categoryName,index){
       // 点击分类时需要判断是否点击的是上一个，如果是要查询全部，并且更新class
       if(this.currentIndex === index){
          this.currentIndex = -1
          this.categoryId = 10000000 // 全部歌单的id
          this.typeName = '全部歌单'
          this._getTypeList(this.categoryId,this.sortId)
       }else{
          this._getTypeList(categoryId,this.sortId)
          this.currentIndex = index
          this.typeName = categoryName
          this.categoryId = categoryId
       }
    },
    selectItems(item){
      this.$router.push({
        path: `/appShow/type/${item.dissid}`
      })
      this.setDisc(item)
    },
    toTypeAllKey(){
       this.$router.push({
        path: `/appShow/type/typeAll`
      })
    },
    ...mapMutations({
        setDisc: 'SET_DISC'
    })
  },
  components: {
      Scroll,
      Loading,
      TwoColumnList
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
  #type
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom:40px
    right: 0
    background: $color-background
    .m-header
      height:30px
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
      .icon-back
        display: block
        padding: 10px
        font-size:  $font-size-large-xl
        color: $color-theme
    .typeList
      height: 100%
      overflow: hidden
      .type-hot-title
        display :flex
        align-items :center
        height: 40px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-medium-x
        color: $color-text-l
        background: $color-highlight-background
        margin-bottom :15px
      .type-wrapper
        display:flex
        flex-direction :row
        width:100%
        justify-content :center
        flex-wrap:wrap 
        margin-left :1%
        .item
          display:flex
          justify-content :center
          width:18%
          padding: 2.3% 6%
          margin: 0 1.5% 1.5% 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
          &.active
            background: $color-theme
      .type-all
        display :flex
        justify-content :center
        align-items :center
        height: 38px
        border-radius: 6px
        margin-left :3.6%
        width:93.2%
        background: $color-highlight-background
        margin-top :0.5%
        .type-span
          font-size: $font-size-medium
          color: $color-text-d
      .type-middle
        display :flex
        align-items :center
        justify-content :space-between 
        padding-left :20px
        padding-right:20px
        height: 40px
        line-height: 30px
        font-size: $font-size-medium-x
        color: $color-text-l
        background: $color-highlight-background
        margin-bottom :15px
        margin-top :15px
        .type-right
          .recommond
            &.active
              color: $color-theme
          .new
            &.active
              color: $color-theme
      .loading-container
        position: absolute
        width: 100%
        top: 65%
        transform: translateY(-50%)
</style>
