import Vue from 'vue';
import App from './App.vue';
import router from './router';

import {
  BAlert, BButton, BCard, BCardBody, BCardImg, BCol, BFormInput, BFormSelect,
  BImg, BInputGroup, BInputGroupText, BNavbar, BNavbarBrand, BOverlay,
  BPagination, BRow, BSpinner, BIconSearch, BIconFilter, BIconLinkedin,
  BIconGithub, VBTooltip,
} from 'bootstrap-vue';
import './scss/override.scss';

const components = {
  BAlert, BButton, BCard, BCardBody, BCardImg, BCol, BFormInput, BFormSelect,
  BImg, BInputGroup, BInputGroupText, BNavbar, BNavbarBrand, BOverlay,
  BPagination, BRow, BSpinner, BIconSearch, BIconFilter, BIconLinkedin, BIconGithub,
};
Object.entries(components).forEach(([name, component]) => Vue.component(name, component));
Vue.directive('b-tooltip', VBTooltip);

Vue.config.productionTip = false;

Vue.filter('ucFirstWord', (str) => str.charAt(0).toUpperCase() + str.slice(1));
Vue.filter('kebabCaseToTitleCase', (str) => {
  return str.split('-')
    .map(word => {
      return word.slice(0, 1).toUpperCase() + word.slice(1)
    })
    .join(' ');
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
