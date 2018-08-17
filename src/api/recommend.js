import jsonp from 'common/js/jsonp'
import {commonParams, options , options1} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList(startNo,endNo) {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: startNo,
    ein: endNo,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  const url = '/api/getSongList'
  //const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const data = Object.assign({}, commonParams, {
    disstid : disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    //因为返回的jsonp需要解析 所以format
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 为你推荐第一个歌曲，新歌，新碟API
export function getNewList(i,type,area) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  let data = {}
  if(i == 0){ // 推荐第一首歌
    data = {"comm":{"ct":24},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"}}
  }else if(i == 1){// 新歌 
    data = {"comm":{"ct":24},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":type}}}
  }else{// 新碟
    data = {"comm":{"ct":24},"new_album":{"module":"music.web_album_library","method":"get_album_by_tags","param":{"area":area,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":40,"click_albumid":0}}}
  }
  const items = Object.assign({}, commonParams, {
    platform: 'yqq',
    uin: 0, 
    hostUin: 0,
    needNewCode: 0,
    callback:'recom5198562962718434',
    jsonpCallback:'recom5198562962718434',
    data: JSON.stringify(data)
  })
   // 这个接口特殊 所以传{},在items需要传callback和jsonpCallback
   return jsonp(url, items, {})
}
