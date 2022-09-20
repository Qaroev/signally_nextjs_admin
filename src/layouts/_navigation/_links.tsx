import Iconify from '../../components/others/Iconify';

const iconWidthHeight = 22;

const adminNavbarLinks = [
  {
    subheader: 'general',
    items: [
      {
        title: 'Signals',
        path: '/signals',
        icon: <Iconify icon={'bi:signal'} width={iconWidthHeight} height={iconWidthHeight} />,
        children: [
          { title: 'List', path: '/signals' },
          { title: 'Create', path: '/signals/create' }
        ]
      },
      {
        title: 'Announcements',
        path: '/announcements',
        icon: <Iconify icon={'zondicons:announcement'} width={iconWidthHeight} height={iconWidthHeight} />,
        children: [
          { title: 'List', path: '/announcements' },
          { title: 'Create', path: '/announcements/create' }
        ]
      },
      {
        title: 'Notifications',
        path: '/notifications',
        icon: <Iconify icon={'carbon:notification-filled'} width={iconWidthHeight} height={iconWidthHeight} />
      }
    ]
  },
  {
    subheader: 'members',
    items: [
      {
        title: 'Users',
        path: '/users',
        icon: <Iconify icon={'fa6-solid:users'} width={iconWidthHeight} height={iconWidthHeight} />
      }
    ]
  }
];

export { adminNavbarLinks };
