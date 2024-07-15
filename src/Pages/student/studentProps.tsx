import {
    ChromeFilled,
    CrownFilled,
    SmileFilled,
    TabletFilled,
} from '@ant-design/icons';

export default {
    route: {
        path: '/',
        routes: [
            {
                path: '/admin/home',
                name: 'Home',
                icon: <SmileFilled />,
            },
            {
                path: '/admin/manage',
                name: 'Management',
                icon: <CrownFilled />,
                access: 'canAdmin',
                component: './Admin',
                routes: [
                    {
                        path: '/admin/manage/users',
                        name: 'Users List',
                        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
                    },
                    {
                        path: '/admin/form-add',
                        name: 'Add User By Form',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                    {
                        path: '/admin/file-add',
                        name: 'Add User by File',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                ],
            },
            {
                name: 'Messages',
                icon: <TabletFilled />,
                path: '/list',
                component: './ListTableList',
                routes: [
                    {
                        path: '/list/sub-page',
                        name: 'List Page',
                        icon: <CrownFilled />,
                        routes: [
                            {
                                path: 'sub-sub-page1',
                                name: 'First Level List Page',
                                icon: <CrownFilled />,
                                component: './Welcome',
                            },
                            {
                                path: 'sub-sub-page2',
                                name: 'Second Level List Page',
                                icon: <CrownFilled />,
                                component: './Welcome',
                            },
                            {
                                path: 'sub-sub-page3',
                                name: 'Third Level List Page',
                                icon: <CrownFilled />,
                                component: './Welcome',
                            },
                        ],
                    },
                    {
                        path: '/list/sub-page2',
                        name: 'Second Level List Page',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                    {
                        path: '/list/sub-page3',
                        name: 'Third Level List Page',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                ],
            },
        ],
    },
    location: {
        pathname: '/',
    }
};