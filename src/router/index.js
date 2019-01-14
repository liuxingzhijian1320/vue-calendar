import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import simple from '@/views/simple'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/simple',
            name: 'simple',
            component: simple
        }
    ]
})