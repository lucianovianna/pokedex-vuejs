import Vue from 'vue';
import App from './App.vue';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Titulo from './components/Titulo.vue';
import InputBusca from './components/InputBusca.vue';
import ListarPokemons from './components/ListarPokemons.vue';
import Paginacao from './components/Paginacao.vue';

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

Vue.filter('ucFirstWord', (val) => val.charAt(0).toUpperCase() + val.slice(1));

Vue.component('titulo', Titulo);
Vue.component('input-busca', InputBusca);
Vue.component('listar-pokemons', ListarPokemons);
Vue.component('paginacao', Paginacao);


new Vue({
  render: h => h(App),
}).$mount('#app')
