import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {createSong} from 'common/js/song'
import {getVkey} from 'api/song'
import {ERR_OK} from 'api/config'
import {saveSearch ,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index , radio}) {
    if(!radio){
      commit(types.SET_PLAYING_RADIO_ID, "") // 不是播放电台时需要清空radioid
    }
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      commit(types.SET_PLAYLIST, randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  }

  export const randomPlay = function ({commit}, {list}) {
    commit(types.SET_PLAYING_RADIO_ID, "") // 随机播放时需要清空radioid
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  }

  export const insertSong = function ({commit, state},song) {
    //修改insertSong方法 重新构造song类的 url 因为原来的不可以播放了
    getVkey(song.mid).then(res=>{
      if(res.code === ERR_OK){
         let data = res.data.items[0]
         let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`
         song['url'] = url

          let playlist = state.playlist.slice() // slice()为返回playlist的副本，解决vuex在matations外部修改警告
          let sequenceList = state.sequenceList.slice()
          let currentIndex = state.currentIndex
          //记录当前歌曲
          let currentSong = playlist[currentIndex]
          //查找当前播放列表有没有这首歌曲返回索引
          let fpIndex = findIndex(playlist,song)
          //因为插入歌曲所以索引加一
          currentIndex++
          //插入当前歌曲到当前索引位置
          playlist.splice(currentIndex,0,song)
          //如果已经包含这首歌
          if(fpIndex > -1){
            //如果当前插入的序号大于列表中的序号
            if(currentIndex > fpIndex){
              playlist.splice(fpIndex,1)
              currentIndex--
            }else{
              playlist.splice(fpIndex + 1,1)
            }
          }

          let currentSIndex = findIndex(sequenceList,currentSong) + 1
          let fsIndex = findIndex(sequenceList, song)
          sequenceList.splice(currentSIndex,0,song)
          if(fpIndex > -1){
            if(currentSIndex > fsIndex){
              sequenceList.splice(fpIndex,1)
            }else{
              playlist.splice(fpIndex + 1,1)
            }
          }
          commit(types.SET_PLAYING_RADIO_ID, "") 
          commit(types.SET_PLAYLIST, playlist)
          commit(types.SET_SEQUENCE_LIST, sequenceList)
          commit(types.SET_CURRENT_INDEX, currentIndex)
          commit(types.SET_FULL_SCREEN, true)
          commit(types.SET_PLAYING_STATE, true)
       }
    })

  }

  export const saveSearchHistory = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
  }

  export const deleteSearchHistory = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
  }
  
  export const clearSearchHistory = function ({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
  }

  export const deleteSong = function ({commit,state}, song) {
    let playlist = state.playlist.slice() // slice()为返回playlist的副本，解决vuex在matations外部修改警告
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist,song)
    playlist.splice(pIndex, 1) // 从playlist删除pIndex
    let sInsex = findIndex(sequenceList,song)
    sequenceList.splice(sInsex, 1)
    
    if(currentIndex > pIndex || currentIndex === playlist.length){
      currentIndex--
    }

    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)

    const playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE,playingState)
  }

  export const deleteSongList = function ({commit}) {
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCE_LIST,[])
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYING_STATE,false)
  }

  export const savePlayHistory = function ({commit},song) {
    commit(types.SET_PLAY_HISTORY,savePlay(song))
  }

  export const saveFavoriteList = function ({commit},song) {
    commit(types.SET_FAVORITE_LIST,saveFavorite(song))
  }

  export const deleteFavoriteList = function ({commit},song) {
    commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
  }
  
  
