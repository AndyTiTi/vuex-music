<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder" autofocus="autofocus"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'
  export default {
    data(){
      return{
        query: ''
      }
    },
    methods:{
      clear(){
        this.query = ''
      },
      // 给父亲用的，传进搜索框的值
      setQuery(query){
       this.query =query
      },
      // 给父亲用的，让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
      blur(){
        this.$refs.query.blur()
      },
    },
    props:{
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    created() {
      // 节流方法
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
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