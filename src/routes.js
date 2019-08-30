import {createAppContainer, createStackNavigator} from 'react-navigation';

import Main from './pages/Main';
import User from './pages/User';
import Repository from './pages/Repository';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      Repository,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#0078d4',
        },
        headerTintColor: '#eee',
      },
    }
  )
);

export default Routes;
