import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ErrorView from '@/views/ErrorView.vue'
import { useLeagueChosenStore, type Leagues, leagueConfig } from '@/stores/leagueChosen'
import NotFoundView from '@/views/NotFoundView.vue';

const validLeagueNames = Object.keys(leagueConfig);


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        return { name: 'home', params: { leagueName: 'brasileirao-a' } };
      },
    },
    {
      path: '/:leagueName',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const leagueChosenStore = useLeagueChosenStore()
        const leagueName = to.params.leagueName as Leagues

        if (validLeagueNames.includes(leagueName)) {
          leagueChosenStore.chooseLeague(leagueName)
          next()
        } else {
          next("/league/not-found")
        }
      }
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView
    },
    {
      path: '/:pathMatch(.*)*', // Catch any path that hasn't matched previous routes
      name: 'not-found',
      component: NotFoundView // Replace with your 404 component
    }
  ]
})

export default router
