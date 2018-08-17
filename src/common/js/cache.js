import storage from 'good-storage'

//缓存最大15条数据 有新数据就把旧数据剔除 有重复数据就删除 把新数据插入到最前面
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare) //查找arr中是否有compare元素有的话返回索引
    if (index === 0) { //如果索引index === 0 代表 有这个元素 并且为第一个元素
      return //直接返回不操作
    }
    if (index > 0) { //index > 0 代表 有这个元素 但不是第一个
      arr.splice(index, 1) //删除这个元素
    }
    arr.unshift(val)//并插入到arr最前
    if (maxLen && arr.length > maxLen) {
      arr.pop() //删除arr最后一个元素
    }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
      return item === query
    }, SEARCH_MAX_LEN)
    storage.set(SEARCH_KEY, searches)
    return searches
}

//读取本地存储
export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY , [])
  insertArray(songs, song, (item)=>{
    return item.id === song.id
  },PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
   return storage.get(PLAY_KEY , [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY , [])
  insertArray(songs, song, (item)=>{
    return item.id === song.id
  },FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite(song) {
  return storage.get(FAVORITE_KEY, [])
}
