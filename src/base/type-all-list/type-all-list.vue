<template>
    <div class="type-all-list">
        <ul class="type-all-wrapper">
          <li v-for="(typeItem,index) in allTypeList" class="typeItem">
            <div class="typeItem-wrapper">
              <div class="left-wrapper" :style="computHeight(typeItem.items.length)">
                <i :class="returnLeftIcon(typeItem,index)" class="icon-size"></i>
                <span class="left-wrapper-title" v-html="typeItem.categoryGroupName"></span>
              </div>
              <ul class="right-wrapper">
                <li class="item" v-for="item in typeItem.items" :style="computItemWidth" @click="selectItem(item)">
                  <span class="item-title" v-html="item.categoryName"></span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
  export default {
    props: {
      allTypeList: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    created(){
    },
    computed:{
      computItemWidth(){
        return 'width:' + (window.innerWidth-80-3)/3 + 'px'
      },
      
    },
    methods: {
      returnLeftIcon(item,index){
        if(item.categoryGroupName == '语种'){
          return 'new-icon-languages'
        }else if(item.categoryGroupName == '流派'){
          return 'new-icon-schools'
        }else if(item.categoryGroupName == '主题'){
          return 'new-icon-theme'
        }else if(item.categoryGroupName == '心情'){
          return 'new-icon-mood'
        }else{
          return 'new-icon-scene'
        }
      },
      computHeight(length){
        return 'height:'+ ((length/3)*38+(length/3)-1) + 'px'
      },
      selectItem(item){
        this.$emit('select',item)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .type-all-list
    .type-all-wrapper
      display :flex
      flex-direction :column
      .typeItem
        margin-bottom :5px
        .typeItem-wrapper
          display :flex
          flex-direction :row
          align-items :center
          .left-wrapper
            display :flex
            flex:0 0 80px
            justify-content :center
            flex-direction :column
            margin-bottom :1px
            align-items :center
            background: $color-highlight-background
            .new-icon-languages
              font-size :18px
            .new-icon-schools
              font-size :19px
            .new-icon-theme
              font-size :28px
            .new-icon-mood
              font-size :20px
            .new-icon-scene
              font-size :21px
            .left-wrapper-title
              margin-top :8px
              font-size :$font-size-medium
              color:$color-text-d
          .right-wrapper
            display :flex
            flex-direction :row
            flex-wrap:wrap 
            .item
              display :flex
              justify-content :center
              align-items :center
              background: $color-highlight-background
              height:38px
              margin: 0 0 1px 1px
              .item-title
                font-size :$font-size-medium
                color:$color-text-l
      
</style>