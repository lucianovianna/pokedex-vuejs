import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: "Pokédex" }
  },
  {
    path: '/pokemon/:pokeId',
    name: 'Pokemon',
    meta: { title: "Detalhes do Pokémon" },
    component: () => import('../views/Pokemon.vue')
  },
  {
    path: '*',
    name: 'NotFound',
    meta: { title: 'Página não encontrada | Pokédex' },
    component: () => import('../views/NotFound.vue')
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.path === from.path) return false;
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  document.title = nearestWithTitle ? nearestWithTitle.meta.title : "Pokédex";

  next();
});

export default router
