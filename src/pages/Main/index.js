import React, {Component} from 'react';
import {Keyboard, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconTitle from 'react-native-vector-icons/Feather';

import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  TitleApp,
} from './styles';

export default class Main extends Component {
  static navigationOptions = {
    headerTitle: (
      <IconTitle name="github" size={30} color="#FFF">
        <TitleApp>Favorite Repo Github</TitleApp>
      </IconTitle>
    ),
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const {users, newUser} = this.state;

    this.setState({loading: true});

    try {
      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });

      Keyboard.dismiss();
    } catch (error) {
      Keyboard.dismiss();

      this.setState({
        loading: false,
      });

      Alert.alert('Usuário não encontrado no Github.');
    }
  };

  handleDeleteUser = user => {
    const {users} = this.state;
    this.setState({loading: true});

    const newUsers = users.filter(u => u.login !== user.login);

    this.setState({
      users: newUsers,
      newUser: '',
      loading: false,
    });

    Keyboard.dismiss();
  };

  handleNavigate = user => {
    const {navigation} = this.props;

    navigation.navigate('User', {user});
  };

  render() {
    const {users, newUser, loading} = this.state;
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            returnKeyLabel="send"
            onSubmitEditing={this.handleAddUser}
            onChangeText={text => this.setState({newUser: text})}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>

              <ProfileButton
                backgroundColor="#ff5050"
                onPress={() => this.handleDeleteUser(item)}>
                <ProfileButtonText>Desvincular perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
