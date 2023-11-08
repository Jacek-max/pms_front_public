import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   meta: { title: '首页', icon: 'dashboard' },
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '首页', icon: 'dashboard' }
  //   },
  //   {
  //     path: 'adminIndex',
  //     name: 'adminIndex',
  //     component: () => import('@/views/dashboard/adminIndex'),
  //     meta: { title: '首页', icon: 'dashboard' }
  //   }
  // ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   name: 'system',
  //   alwaysShow: true,
  //   meta: { title: '系统管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: '/sysUserList',
  //       name: 'sysUserList',
  //       component: () => import('@/views/system/sysUserList'),
  //       meta: { title: '员工管理', icon: 'table' }
  //     },
  //     {
  //       path: '/sysRoleList',
  //       name: 'sysRoleList',
  //       component: () => import('@/views/system/sysRoleList'),
  //       meta: { title: '角色管理', icon: 'tree' }
  //     },
  //     {
  //       path: '/sysMenuList',
  //       name: 'sysMenuList',
  //       component: () => import('@/views/system/sysMenuList'),
  //       meta: { title: '权限管理', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/sysHouse',
  //   component: Layout,
  //   name: 'sysHouse',
  //   alwaysShow: true,
  //   meta: { title: '房屋管理', icon: 'el-icon-s-home' },
  //   children: [
  //     {
  //       path: '/houseBuilding',
  //       name: 'houseBuilding',
  //       component: () => import('@/views/house/houseBuilding'),
  //       meta: { title: '栋数管理', icon: 'el-icon-office-building' }
  //     },
  //     {
  //       path: '/houseUnit',
  //       name: 'houseUnit',
  //       component: () => import('@/views/house/houseUnit'),
  //       meta: { title: '单元管理', icon: 'el-icon-school' }
  //     },
  //     {
  //       path: '/houseList',
  //       name: 'houseList',
  //       component: () => import('@/views/house/houseList'),
  //       meta: { title: '房屋管理', icon: 'el-icon-house' }
  //     }

  //   ]
  // },
  // {
  //   path: '/sysPark',
  //   component: Layout,
  //   name: 'sysPark',
  //   alwaysShow: true,
  //   meta: { title: '车位管理', icon: 'el-icon-s-promotion' },
  //   children: [
  //     {
  //       path: '/parkList',
  //       name: 'parkList',
  //       component: () => import('@/views/park/parkList'),
  //       meta: { title: '车位列表', icon: 'el-icon-truck' }
  //     }

  //   ]
  // },
  // {
  //   path: '/live',
  //   component: Layout,
  //   name: 'live',
  //   alwaysShow: true,
  //   meta: { title: '业主管理', icon: 'el-icon-s-custom' },
  //   children: [
  //     {
  //       path: '/liveUser',
  //       name: 'liveUser',
  //       component: () => import('@/views/live/liveUser'),
  //       meta: { title: '业主列表', icon: 'table' }
  //     }

  //   ]
  // },
  // {
  //   path: '/fee',
  //   component: Layout,
  //   name: 'fee',
  //   alwaysShow: true,
  //   meta: { title: '收费管理', icon: 'el-icon-s-finance' },
  //   children: [
  //     {
  //       path: '/feePower',
  //       name: 'feePower',
  //       component: () => import('@/views/fee/feePower'),
  //       meta: { title: '电费管理', icon: 'el-icon-s-opportunity' }
  //     },
  //     {
  //       path: '/feeWater',
  //       name: 'feeWater',
  //       component: () => import('@/views/fee/feeWater'),
  //       meta: { title: '水费管理', icon: 'el-icon-s-data' }
  //     },
  //     {
  //       path: '/feePark',
  //       name: 'feePark',
  //       component: () => import('@/views/fee/feePark'),
  //       meta: { title: '停车管理', icon: 'el-icon-s-marketing' }
  //     }

  //   ]
  // },
  // {
  //   path: '/userComplaint',
  //   component: Layout,
  //   name: 'userComplaint',
  //   alwaysShow: true,
  //   meta: { title: '投诉管理', icon: 'el-icon-s-release' },
  //   children: [
  //     {
  //       path: '/userComplaintList',
  //       name: 'userComplaintList',
  //       component: () => import('@/views/userComplaint/userComplaint'),
  //       meta: { title: '投诉列表', icon: 'el-icon-edit-outline' }
  //     },
  //     {
  //       path: '/myUserComplaint',
  //       name: 'myUserComplaint',
  //       component: () => import('@/views/userComplaint/myUserComplaint'),
  //       meta: { title: '我的投诉', icon: 'el-icon-chat-dot-round' }
  //     }
  //   ]
  // },
  // {
  //   path: '/repairModel',
  //   component: Layout,
  //   name: 'repairModel',
  //   alwaysShow: true,
  //   meta: { title: '维修管理', icon: 'el-icon-s-cooperation' },
  //   children: [
  //     {
  //       path: '/repairList',
  //       name: 'repairList',
  //       component: () => import('@/views/repair/repairList'),
  //       meta: { title: '维修列表', icon: 'el-icon-cpu' }
  //     },
  //     {
  //       path: '/myRepair',
  //       name: 'myRepair',
  //       component: () => import('@/views/repair/myRepair'),
  //       meta: { title: '我的维修', icon: 'el-icon-postcard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/notice',
  //   component: Layout,
  //   name: 'notice',
  //   alwaysShow: true,
  //   meta: { title: '公告管理', icon: 'el-icon-message-solid' },
  //   children: [
  //     {
  //       path: '/noticeList',
  //       name: 'noticeList',
  //       component: () => import('@/views/notice/noticeList'),
  //       meta: { title: '公告列表', icon: 'el-icon-news' }
  //     },
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
