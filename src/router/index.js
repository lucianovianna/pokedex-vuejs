import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: "Pokedex" }
  },
  {
    path: '/pokemon/:pokeId',
    name: 'Pokemon',
    meta: { title: "Visualizar Pokemon" },
    props: true,
    component: () => import('../views/Pokemon.vue')
  }
]

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  document.title = nearestWithTitle.meta.title;

  next();
});

export default router
