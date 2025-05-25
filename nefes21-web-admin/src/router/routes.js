import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../pages/Dashboard.vue'

import Users from '../pages/Users/UserSearch'
import UserDetail from '../pages/Users/UserDetail'
import TransactionSearch from '../pages/Users/Transaction/TransactionSearch'

import Authors from '../pages/Authors/Authors.vue'
import Narrators from '../pages/Narrators/Narrators.vue'

import Contents from '../pages/Contents/Contents.vue'
import ContentDetail from '../pages/Contents/ContentDetail'
import Soundscapes from '../pages/SoundScapes/Soundscapes.vue'
import Decks from '../pages/Decks/Decks.vue'
import Cards from '../pages/Decks/Cards.vue'

import MoodCheckinLayout from '../pages/Layouts/MoodCheckinLayout.vue'
import Categories from '../pages/Layouts/Categories'
import QuickStartLayout from '../pages/Layouts/QuickStartLayout.vue'
import DimensionLayout from '../pages/Layouts/DimensionLayout.vue'
import TodayStarters from '../pages/Today/TodayStarters.vue'
import TodayShowcaseItems from '../pages/Today/TodayShowcaseItems.vue'
import TodayShowcaseItemDetail from '../pages/Today/TodayShowcaseItemDetail.vue'

import TodaySeriesPool from '../pages/Today/TodaySeriesPool.vue'
import TodayShowcasePool from '../pages/Today/TodayShowcasePool.vue'

import Programs from '../pages/Programs/Programs.vue'
import ProgramDetail from '@/pages/Programs/ProgramDetail'
import ProgramLayout from '../pages/Programs/ProgramLayout'

import Parts from '../pages/Parts/Parts'
import PartDetail from '../pages/Parts/PartDetail'

import AuthorDetail from '../pages/Authors/AuthorDetail.vue'

import NarratorDetail from '../pages/Narrators/NarratorDetail'

import SoundScapeDetail from '../pages/SoundScapes/SoundScapeDetail'

import TrackDetail from '../pages/Tracks/TrackDetail'
import Tracks from '../pages/Tracks/Tracks'

import DeckDetail from '../pages/Decks/DeckDetail'

import PrepaidCodes from '../pages/Products/PrepaidCodes'
import PrepaidCodeDetail from '../pages/Products/PrepaidCodeDetail'
import PromoCodes from '../pages/Products/PromoCodes'
import PromoCodeDetail from '../pages/Products/PromoCodeDetail'
import Products from '../pages/Products/Products'
import Suppliers from '../pages/Products/Suppliers'

import MainLayout from '../App/MainLayout'

import Login from '../pages/Login'

import { TokenService } from '../api/ServiceLayer/TokenService'
import Maintenance from '@/pages/Settings/Maintenance'
import MaintenanceMode from '@/pages/MaintenanceMode'

const ifAuthenticated = (to, from, next) => {
  if (TokenService.getToken() !== null) {
    next()
    return
  }
  next('/login')
}
const ifNotAuthenticated = (to, from, next) => {
  if (TokenService.getToken() === null) {
    next()
    return
  }
  next('/')
}

const routes = [
  {
    path: '/maintenance/active',
    component: MaintenanceMode
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: MainLayout,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { label: 'Home' }
      }
    ]
  },
  {
    path: '/users',
    component: MainLayout,
    redirect: '/users/search',
    beforeEnter: ifAuthenticated,
    meta: { label: 'User Management' },
    children: [
      {
        path: 'search',
        name: 'User-search',
        component: Users
      },
      {
        name: 'UserDetail',
        path: '/users/:userId',
        props: true,
        component: UserDetail
      }
    ]
  },
  {
    path: '/transactions',
    name: 'TransactionSearch',
    component: MainLayout,
    redirect: 'transactions/search',
    meta: { label: 'Transaction Management' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: TransactionSearch
      }
    ]
  },
  {
    path: '/authors',
    component: MainLayout,
    redirect: '/authors/authorList',
    beforeEnter: ifAuthenticated,
    meta: { label: 'Authors' },
    children: [
      {
        path: 'authorList',
        name: 'Authors',
        component: Authors
      },
      {
        name: 'AuthorEdit',
        path: '/authors/:state',
        props: true,
        component: AuthorDetail
      },
      {
        name: 'AuthorDetail',
        path: '/authors/:state/:authorId',
        props: true,
        component: AuthorDetail
      }
    ]
  },
  {
    path: '/narrators',
    component: MainLayout,
    redirect: '/narrators/narratorList',
    beforeEnter: ifAuthenticated,
    meta: { label: 'Narrators' },
    children: [
      {
        path: 'narratorList',
        name: 'Narrators',
        component: Narrators
      },
      {
        name: 'NarratorEdit',
        path: '/narrators/:state',
        component: NarratorDetail
      },
      {
        name: 'NarratorDetail',
        path: '/narrators/:state/:narratorId',
        props: true,
        component: NarratorDetail
      }
    ]
  },
  {
    path: '/soundscapes',
    component: MainLayout,
    redirect: '/soundscapes/soundscapeList',
    beforeEnter: ifAuthenticated,
    meta: { label: 'Soundscapes' },
    children: [
      {
        path: 'soundscapeList',
        name: 'Soundscapes',
        component: Soundscapes
      },
      {
        name: 'SoundScapeEdit',
        path: '/soundscapes/:state',
        component: SoundScapeDetail
      },
      {
        name: 'SoundScapeDetail',
        path: '/soundscapes/:state/:soundscapeId',
        props: true,
        component: SoundScapeDetail
      }
    ]
  },
  {
    path: '/contents',
    component: MainLayout,
    redirect: '/contents/contentList',
    meta: { label: 'Contents' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        name: 'Contents',
        path: 'contentList',
        component: Contents
      },
      {
        name: 'ContentEdit',
        path: '/contents/:state',
        props: true,
        component: ContentDetail
      },
      {
        name: 'ContentDetail',
        path: '/contents/:state/:contentId',
        props: true,
        component: ContentDetail
      },
      {
        name: 'Tracks',
        path: '/contents/:contentId/tracks',
        props: true,
        component: Tracks
      },
      {
        name: 'TrackEdit',
        path: '/contents/:contentId/tracks/:state',
        props: true,
        component: TrackDetail
      },
      {
        name: 'TrackDetail',
        path: '/contents/:contentId/tracks/:state/:trackId',
        props: true,
        component: TrackDetail
      }
    ]
  },
  {
    path: '/decks',
    component: MainLayout,
    meta: { label: 'Decks' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        name: 'Decks',
        path: '',
        component: Decks
      },
      {
        name: 'DeckEdit',
        path: '/decks/:state',
        component: DeckDetail
      },
      {
        name: 'DeckDetail',
        path: '/decks/:deckId',
        props: true,
        component: DeckDetail
      },
      {
        name: 'CardList',
        path: '/decks/:deckId/cards',
        props: true,
        component: Cards
      }
    ]
  },
  {
    path: '/categories',
    name: 'Categories',
    component: MainLayout,
    meta: { label: 'Categories' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: Categories
      }
    ]
  },
  {
    path: '/moodcheckin-layout',
    name: 'MoodCheckinLayout',
    component: MainLayout,
    meta: { label: 'Mood Checkin Layout' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: MoodCheckinLayout
      }
    ]
  },
  {
    path: '/quickstart-layout',
    name: 'QuickStartLayout',
    component: MainLayout,
    meta: { label: 'Quick Start Layout' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: QuickStartLayout
      }
    ]
  },
  {
    path: '/dimension-layout',
    name: 'DimensionLayout',
    component: MainLayout,
    meta: { label: 'Dimension Layout' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: DimensionLayout
      }
    ]
  },
  {
    path: '/today-starters',
    name: 'TodayStarters',
    component: MainLayout,
    meta: { label: 'Today Starters' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: TodayStarters
      }
    ]
  },
  {
    path: '/today-showcase-items',
    name: 'TodayShowcaseItems',
    component: MainLayout,
    meta: { label: 'Today Showcase Items' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: TodayShowcaseItems
      },
      {
        name: 'TodayShowcaseItemDetail',
        props: true,
        path: '/today-showcase-items/:showcase_id',
        component: TodayShowcaseItemDetail
      },
      {
        name: 'TodayShowcaseNewItem',
        props: true,
        path: '/today-showcase-items/:state',
        component: TodayShowcaseItemDetail
      }
    ]
  },
  {
    path: '/today-series-pool',
    name: 'TodaySeriesPool',
    component: MainLayout,
    meta: { label: 'Today Series Pool' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: TodaySeriesPool
      }
    ]
  },
  {
    path: '/programs',
    component: MainLayout,
    redirect: '/programs/programList',
    meta: { label: 'Programs' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        name: 'Programs',
        path: 'programList',
        component: Programs
      },
      {
        name: 'ProgramEdit',
        path: '/programs/:state',
        props: true,
        component: ProgramDetail
      },
      {
        name: 'ProgramDetail',
        path: '/programs/:state/:programId',
        props: true,
        component: ProgramDetail
      },
      {
        name: 'Parts',
        path: '/programs/:state/:programId/parts',
        props: true,
        component: Parts
      },
      {
        name: 'PartEdit',
        path:
          '/programs/:state/:programId/:sectionId/parts/:partState/:partType',
        props: true,
        component: PartDetail
      },
      {
        name: 'PartDetail',
        path:
          '/programs/:state/:programId/:sectionId/parts/:partState/:partType/:partId',
        props: true,
        component: PartDetail
      }
    ]
  },
  {
    path: '/program-layout',
    name: 'ProgramLayout',
    component: MainLayout,
    meta: { label: 'Program Layout' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: ProgramLayout
      }
    ]
  },
  {
    path: '/today-showcase-pool',
    name: 'TodayShowcasePool',
    component: MainLayout,
    meta: { label: 'Today Showcase Pool' },
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        component: TodayShowcasePool
      }
    ]
  },
  {
    path: '/prepaid-codes',
    component: MainLayout,
    beforeEnter: ifAuthenticated,
    meta: { label: 'Prepaid Codes' },
    children: [
      {
        path: '',
        component: PrepaidCodes
      },
      {
        name: 'PrepaidCodeEdit',
        path: '/prepaid-codes/:state',
        props: true,
        component: PrepaidCodeDetail
      },
      {
        name: 'PrepaidCodeDetail',
        path: '/prepaid-codes/:state/:codeId',
        props: true,
        component: PrepaidCodeDetail
      }
    ]
  },
  {
    path: '/promo-codes',
    component: MainLayout,
    beforeEnter: ifAuthenticated,
    meta: { label: 'Promo Codes' },
    children: [
      {
        path: '',
        component: PromoCodes
      },
      {
        name: 'PromoCodeEdit',
        path: '/promo-codes/:state',
        props: true,
        component: PromoCodeDetail
      },
      {
        name: 'PromoCodeDetail',
        path: '/promo-codes/:state/:codeId',
        props: true,
        component: PromoCodeDetail
      }
    ]
  },
  {
    path: '/settings',
    component: MainLayout,
    beforeEnter: ifAuthenticated,
    meta: { label: 'Settings' },
    children: [
      {
        name: 'Maintenance',
        path: '/settings/maintenance',
        component: Maintenance
      }
    ]
  },
  {
    path: '/products',
    component: MainLayout,
    beforeEnter: ifAuthenticated,
    meta: { label: 'Products' },
    children: [
      {
        path: '',
        component: Products
      }
    ]
  },
  {
    path: '/suppliers',
    component: MainLayout,
    beforeEnter: ifAuthenticated,
    meta: { label: 'Suppliers' },
    children: [
      {
        path: '',
        component: Suppliers
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
