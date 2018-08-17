<template>
  <scroll ref="suggest" 
          class="suggest" 
          :data="result" 
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result :title="query"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations,mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'
import {getVkey} from 'api/song'
const TYPE_SINGER = 'singer'
// 每一页的数量
const perpage = 20
  export default {
      props:{
          // 接受的检索值
          query:{
              type:String,
              default:''
          },
          // 是否显示歌手
          showSinger:{
              type:Boolean,
              default: true
          }
      },
      data(){
          return{
              // 当前检索页数，用于下拉加载
              page:1,
              // 接收检索结果
              result:[],
              pullup:true,
              // 标志位。是否加载完
              hasMore:true,
              beforeScroll:true,
              newSongs:[]
          }
      },
      methods:{
          search(){
            this.page = 1
            this.hasMore = true
            this.$refs.suggest.scrollTo(0, 0) //将scroll滚动到顶部
            search(this.query,this.page,this.showSinger,perpage).then((res) =>{
                if(res.code === ERR_OK){
                  this.result = this._genResult(res.data)
                  this._checkMore(res.data)
                }
            })
          },
          searchMore(){
            //concat为数组连接方法
            if(!this.hasMore){
              return
            }
            this.page ++
            search(this.query,this.page,this.showSinger,perpage).then((res) =>{
              if(res.code === ERR_OK){
               this.result = this.result.concat(this._genResult(res.data))
               this._checkMore(res.data)
              }
              
            })
          },
          //检查返回数据是否还有更多用于上拉加载
          _checkMore(data){
            const song = data.song
            if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum){
              this.hasMore = false
            }
          },
          _genResult(data){
            let ret =[]
            if(data.zhida && data.zhida.singerid){
              ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }
            if(data.song){
              if(data.song.list.length > 0){
                ret = ret.concat(this._normalizeSongs(data.song.list))
              }
            }
            return ret
          },
          // 获取 icon class 图标样式
          getIconCls(item){
            if(item.type === TYPE_SINGER){
              return 'icon-mine'
            }else{
                return 'icon-music'
            }
          },
          getDisplayName(item){
           if(item.type === TYPE_SINGER){
               return item.singername
           }else{
               return `${item.name}-${item.singer}`
           }
          },
          // 格式化歌手信息
          _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData) => {
            if (musicData.songid && musicData.albummid) {
          //   getVkey(musicData.songmid).then(res=>{
          //    if(res.code === ERR_OK){
          //       let data = res.data.items[0]
          //       let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`
          //       this.urls.push(createSong(musicData,url))
          //     }
          //  })
          ret.push(createSong(musicData,''))
          }
        })
        return ret
        },
        // 路由跳转逻辑
        selectItem(item){
          if(item.type === TYPE_SINGER){
            const singer = new Singer({
              id: item.singermid,
              name: item.singername
            })
            this.$router.push({
             path: `/appShow/search/${singer.id}`
            })
            this.setSinger(singer)
          }else{
            this.insertSong(item)
          }
          this.$emit('select')
        },
        // 滚动前触发事件
        listScroll(){
          this.$emit('listScroll')
        },
        // 给父组件用
        refresh(){
          this.$refs.suggest.refresh()
        },
        ...mapMutations({
          setSinger: 'SET_SINGER'
        }),
        ...mapActions([
          'insertSong'
        ])
      },
      components:{
        Scroll,
        Loading,
        NoResult
      },
      watch:{
          query(newQuery) {
            this.search()
         }
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 40%
      transform: translateY(-50%)
</style>