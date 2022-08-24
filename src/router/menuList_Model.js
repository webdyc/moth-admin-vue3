/**
* hidden: true,               是否隐藏路由
* path: '/welcome',           路由地址
* component:'Layout',         vue文件路径
* redirect: noredirect,       路由重定向
* name:'welcome',             路由名称父级可不填
* meta : {                    单层级路由父级可不填
   role: ['admin','editor'],    页面权限
   title: 'title'               页面标题
   icon: 'svg-name'             页面图标
   breadcrumb: false,           如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
   keepAlive: false,            页面是否缓存
 }
**/

export default [
  // 首页
  {
    path: '/',
    redirect: '/home',
    component: 'Layout',
    meta: {
      title: '首页',
      langTitle: 'home',
      icon: 'dashboard',
      role: ['admin', 'addbtn1']
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: '/home/Index'
      }
    ]
  },
  // 权限管理
  // {
  //   path: '/authority',
  //   redirect: '/role',
  //   name: 'authority',
  //   component: 'Layout',
  //   meta: {
  //     title: '权限管理',
  //     langTitle: 'authority',
  //     icon: 'eye-open'
  //   },
  //   children: [
  //     {
  //       path: '/role',
  //       name: 'Role',
  //       meta: {
  //         title: '角色管理',
  //         langTitle: 'role'
  //       },
  //       component: '/authority/role/Index'
  //     },
  //     {
  //       path: '/user',
  //       name: 'User',
  //       meta: {
  //         title: '用户管理',
  //         langTitle: 'user'
  //       },
  //       component: '/authority/user/Index'
  //     },
  //     {
  //       path: '/menu',
  //       name: 'Menu',
  //       meta: {
  //         title: '菜单管理',
  //         langTitle: 'menu'
  //       },
  //       component: '/authority/menu/Index'
  //     }
  //   ]
  // },
  // 组件
  {
    path: '/components',
    redirect: '/tinymce',
    component: 'Layout',
    meta: {
      title: '组件',
      langTitle: 'components',
      icon: 'eye-open'
    },
    children: [
      {
        path: '/tinymce',
        name: 'Tinymce',
        meta: {
          title: '富文本编译器',
          langTitle: 'tinymce'
        },
        component: '/components/tinymce/Index'
      },
      {
        path: '/dragDalog',
        name: 'dragDalog',
        meta: {
          title: '可拖拽弹窗',
          langTitle: 'dragDalog'
        },
        component: '/components/dragDalog/Index'
      }
    ]
  },
  // 日程管理
  {
    path: '/agendaManage',
    component: 'Layout',
    redirect: '/agendaManage/agenda/index',
    meta: {
      title: '日程管理',
      icon: 'eye-open',
      langTitle: 'agendaManage'
    },
    children: [
      {
        path: 'agenda/index',
        name: 'agenda',
        component: '/agendaManage/agenda/index',
        meta: {
          title: "日程",
          langTitle: 'agenda'
        },
      },
      {
        path: 'agendaGrid/index',
        name: 'agendaGrid',
        component: '/agendaManage/agendaGrid/index',
        meta: {
          title: "日程组",
          langTitle: 'agendaGrid'
        },
      }
    ]
  },
  // 指令权限
  {
    path: '/permission',
    component: 'Layout',
    redirect: '/permission/index',
    meta: {
      title: '指令权限',
      icon: 'eye-open',
      langTitle: 'permission'
    },
    children: [
      {
        path: '/permission/index',
        name: 'permission',
        component: '/permission/Index'
      }
    ]
  },
  // 系统管理
  {
    path: "/systemManage",
    component: "Layout",
    redirect: "/systemManage/role",
    meta: {
      title: "系统管理",
      icon: "eye-open",
      langTitle: 'systemManage'
    },
    children: [
      {
        path: "organization",
        name: "organization",
        component: "/systemManage/organization/index",
        meta: {
          title: "组织管理",
          langTitle: 'organization'
        },
      },
      {
        path: "user",
        name: "user",
        component: "/systemManage/user/index",
        meta: {
          title: "用户管理",
          langTitle: 'user'
        },
      },
      {
        path: "role",
        name: "role",
        component: "/systemManage/role/index",
        meta: {
          title: "角色管理",
          langTitle: 'role'
        },
      },
      {
        path: "menu",
        name: "menu",
        component: "/systemManage/menu/index",
        meta: {
          title: "菜单管理",
          langTitle: 'menu'
        },
      },
    ],
  },
  {
    path: '/about',
    component: 'Layout',
    redirect: '/about/index',
    meta: {
      icon: 'link',
      title: '关于',
      langTitle: 'about'
    },
    children: [
      {
        path: '/about/index',
        name: 'About',
        component: '/About'
      }
    ]
  }
]
