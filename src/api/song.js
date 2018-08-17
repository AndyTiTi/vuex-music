import {commonParams} from './config'
import axios from 'axios'

export function getLyric(id) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    musicid: id,  //歌曲id
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getVkey(songmid) {
  const url = '/api/vkey'

  const data = Object.assign({}, commonParams, {
    hostUin:0,
    format:'json',  
    platform:'yqq',
    needNewCode:0 , 
    cid:205361747,
    songmid:songmid,
    filename:`C400${songmid}.m4a`,
    guid:7332953645,
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}