// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/register',
          target: true
        },
        {
          id: 'ForgetPassword3',
          title: 'ForgetPassword',
          type: 'item',
          url: '/forgetPassword',
          target: true
        }
      ]
    }
  ]
};

export default pages;
