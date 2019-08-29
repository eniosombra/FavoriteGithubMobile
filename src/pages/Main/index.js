import React from 'react';
import {View, Text} from 'react-native';

import {Container} from './styles';

export default function Main() {
  return (
    <Container>
      <Text>Main Component</Text>
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Usuários',
};
