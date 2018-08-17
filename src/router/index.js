import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const Recommend = (resolve) => {
  import('components/recommend/recommend').then((recommend)=>{
    resolve(recommend)
  })
}

const Rank = (resolve) => {
  import('components/rank/rank').then((rank)=>{
    resolve(rank)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((search)=>{
    resolve(search)
  })
}

const Singer = (resolve) => {
  import('components/singer/singer').then((singer)=>{
    resolve(singer)
  })
}

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((singerDetail)=>{
    resolve(singerDetail)
  })
}

const Disc = (resolve) => {
  import('components/disc/disc').then((disc)=>{
    resolve(disc)
  })
}

const TopList = (resolve) => {
  import('components/top-list/top-list').then((topList)=>{
    resolve(topList)
  })
}

const AppShow = (resolve) => {
  import('components/appShow/appShow').then((appShow)=>{
    resolve(appShow)
  })
}

const Splash = (resolve) => {
  import('components/splash/splash').then((splash)=>{
    resolve(splash)
  })
}

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((userCenter)=>{
    resolve(userCenter)
  })
}

const Type = (resolve) => {
  import('components/type/type').then((type)=>{
    resolve(type)
  })
}

const TypeAllKey = (resolve) => {
  import('components/type-all-key/type-all-key').then((typeAllKey)=>{
    resolve(typeAllKey)
  })
}

const TypeSong = (resolve) => {
  import('components/type-song/type-song').then((typeSong)=>{
    resolve(typeSong)
  })
}

const NewSong = (resolve) => {
  import('components/new-song/new-song').then((newSong)=>{
    resolve(newSong)
  })
}

const AlbumDetail = (resolve) => {
  import('components/album-detail/album-detail').then((albumDetail)=>{
    resolve(albumDetail)
  })
}

const AlbumDetailDesc = (resolve) => {
  import('components/album-detail-desc/album-detail-desc').then((albumDetailDesc)=>{
    resolve(albumDetailDesc)
  })
}

const About = (resolve) => {
  import('components/about/about').then((about)=>{
    resolve(about)
  })
}

const RadioStation = (resolve) => {
  import('components/radio-station/radio-station').then((radioStation)=>{
    resolve(radioStation)
  })
}

export default new Router({
  routes: [
    {
         path: "*", 
         redirect: '/splash'
    },
    {
      path:'/splash',
      component: Splash,
    },
    {
      path:'/appShow',
      component: AppShow,
      children:[
      {
        path: "", 
        redirect: '/appShow/recommend'
      },
      {
        name: 'recommend',
        path: 'recommend', 
        component: Recommend,
        children:[
        {
          path: ':id',
          component: Disc,
        },
        {
          path: ':disstid1/:disstid2/:index', 
          component: NewSong,
          children:[
            {
              path:':albummid',
              component:AlbumDetail,
              children:[
                {
                  path:'desc',
                  component:AlbumDetailDesc
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: 'rank', 
      component: Rank,
      children:[
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: 'search', 
      component: Search,
      children:[
        {
          path: ':id',
          component: SingerDetail
        }
    ]
    },
    {
      path: 'type', 
      component: Type,
      children:[
        {
          path: 'typeAll',
          component: TypeAllKey,
          children:[
            {
             path: ':categoryId/:categoryName',
             component: TypeSong,
             children:[
                {
                  path: ':id',
                  component: Disc
                }
              ]
            }
          ]
        },
        {
          path: ':id',
          component: Disc
        }
    ]
    },
    {
      path:'radio',
      component:RadioStation
    },
    {
      path: 'singer', 
      component: Singer,
      children:[
        {
          path: ':id',
          component: SingerDetail
        }
    ]
    },
    {
      path: 'user', 
      component: UserCenter
    },
    {
      path: 'about', 
      component: About
    }
  ]
  }]
})
