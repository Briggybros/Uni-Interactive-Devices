import { User } from '../../common/types';

export interface UserRecord extends User {
  connectTime: number;
}

enum ActionTypes {
  ADD_USER_ACTION = 'ADD_USER_ACTION',
  UPDATE_USER_ACTION = 'UPDATE_USER_ACTION',
  DELETE_USER_ACTION = 'DELETE_USER_ACTION',
}

interface AddUserAction {
  type: ActionTypes.ADD_USER_ACTION;
  user: UserRecord;
}
export function addUser(user: User): AddUserAction {
  return {
    type: ActionTypes.ADD_USER_ACTION,
    user: {
      ...user,
      connectTime: Date.now(),
    },
  };
}

interface UpdateUserAction {
  type: ActionTypes.UPDATE_USER_ACTION;
  user: User;
}
export function updateUser(user: User): UpdateUserAction {
  return {
    user,
    type: ActionTypes.UPDATE_USER_ACTION,
  };
}

interface DeleteUserAction {
  type: ActionTypes.DELETE_USER_ACTION;
  userId: string;
}
export function deleteUser(userId: string): DeleteUserAction {
  return {
    userId,
    type: ActionTypes.DELETE_USER_ACTION,
  };
}

type Action = AddUserAction | UpdateUserAction | DeleteUserAction;

export interface Contacts {
  [userId: string]: UserRecord;
}

export interface State {
  contacts: Contacts;
}

export default function reducer(
  state: State = { contacts: {} },
  action: Action
) {
  switch (action.type) {
    case ActionTypes.ADD_USER_ACTION:
      return {
        ...state,
        contacts: {
          ...state.contacts,
          [action.user.userId]: action.user,
        },
      };
    case ActionTypes.UPDATE_USER_ACTION:
      return {
        ...state,
        contacts: {
          ...state.contacts,
          [action.user.userId]: {
            ...action.user,
            connectTime: state.contacts[action.user.userId].connectTime,
          },
        },
      };
    case ActionTypes.DELETE_USER_ACTION:
      const { [action.userId]: killed, ...contacts } = state.contacts;
      return {
        ...state,
        contacts,
      };
    default:
      return state;
  }
}
