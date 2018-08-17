import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getTypeKeyList() {
    // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg'
    const url = '/api/getTypeKeyList'
  
    const data = Object.assign({}, commonParams, {
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      format:'json'
    })
  
    return axios.get(url, {
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    })
}

export function getTypeList(categoryId,sortId) {
  const url = '/api/getTypeList'

  const data = Object.assign({}, commonParams, {
    picmid:1,
    rnd:Math.random(),
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    categoryId:categoryId,
    sortId:sortId,
    sin:0,
    ein:39,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}