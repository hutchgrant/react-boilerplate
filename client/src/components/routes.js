export default {
    routes: [
        {
            path: '/',
            component: './Landing',
            authenticated: false,
        },
        {
            path: '/dashboard',
            component: './User/Dashboard',
            authenticated: true
        },
        {
            path: '/settings',
            component: './User/Settings',
            authenticated: false
        }
    ],
    admin: [
        {
            name: 'Dashboard',
            icon: 'glyphicon glyphicon-dashboard',
            path: '/admin',
            component: './Admin/Admin'
        },
        {
            name: 'Pages',
            icon: 'glyphicon glyphicon-blackboard',
            path: '/admin/pages',
            component: './Admin/PageList'
        },
        {
            name: 'Posts',
            icon: 'glyphicon glyphicon-pushpin',
            path: '/admin/posts',
            component: './Admin/PostList'
        },
        {
            name: 'Menus',
            icon: 'glyphicon glyphicon-th-list',
            path: '/admin/menus',
            component: './Admin/MenuList'
        },
        {
            name: 'Categories',
            icon: 'glyphicon glyphicon-tags',
            path: '/admin/categories',
            component: './Admin/CategoryList'
        },
        {
            name: 'Galleries',
            icon: 'glyphicon glyphicon-camera',
            path: '/admin/galleries',
            component: './Admin/GalleryList'
        },
        {
            name: 'Users',
            icon: 'glyphicon glyphicon-user',
            path: '/admin/users',
            component: './Admin/UserList'
        }
    ]
}; 