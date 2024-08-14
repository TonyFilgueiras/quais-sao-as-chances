import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ErrorView from "@/views/ErrorView.vue";
import { useLeagueChosenStore, type Countries, leagueConfig } from "@/stores/leagueChosen";
import NotFoundView from "@/views/NotFoundView.vue";

const validLeagueNames = Object.keys(leagueConfig);

const router = createRouter({
  history: createWebHistory("/quais-sao-as-chances/"),
  routes: [
    {
      path: "/",
      redirect: () => {
        return { name: "home", params: { leagueCountry: "brazil", leagueDivision: "serieA" } };
      },
    },
    {
      path: "/:leagueCountry/:leagueDivision",
      name: "home",
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const leagueChosenStore = useLeagueChosenStore();
        const leagueCountry = to.params.leagueCountry as Countries;
        const leagueDivision = to.params.leagueDivision as Countries;

        if (validLeagueNames.includes(leagueCountry)) {
          leagueChosenStore.chooseLeague(leagueCountry, leagueDivision);
          next();
        } else {
          next("/league/not/found");
        }
      },
    },
    {
      path: "/error",
      name: "error",
      component: ErrorView,
    },
    {
      path: "/:pathMatch(.*)*", // Catch any path that hasn't matched previous routes
      name: "not-found",
      component: NotFoundView, // Replace with your 404 component
    },
  ],
});

export default router;
