import { selectCurrentUserId, selectIsTryingToLogin } from 'redux/reducers/authReducer'
import { selectUsers, selectUserById, selectUsersCount } from 'redux/reducers/usersReducer'


const mockState = {
  auth: {
    currentUserId: 'id001',
    isTryingToLogin: true
  },
  users: {
    list: [
      { _id: 'id001', username: 'daler', displayName: 'Saidov Daler' },
      { _id: 'id002', username: 'aziz', displayName: 'Aziz Rasulov' },
    ],
    fetchingStatus: 'loading',
    usersOnline: ['id001', 'id002', 'id003'],
    isUsersOnlineStatusWatching: true
  }
}

describe('auth selectors', () => {
  
  test('selectCurrentUserId', () => {
    expect(selectCurrentUserId(mockState)).toEqual('id001')
  })

  test('selectIsTryingToLogin', () => {
    expect(selectIsTryingToLogin(mockState)).toEqual(true)
  })

})

describe('users selectors', () => {
  
  test('selectUsersCount', () => {
    expect(selectUsersCount(mockState)).toEqual(2)
  })

  test('selectUserById', () => {
    expect(selectUserById(mockState, 'id002')).toEqual({ _id: 'id002', username: 'aziz', displayName: 'Aziz Rasulov' })
  })

  test('selectUsers', () => {
    expect(selectUsers(mockState)).toEqual([
      { _id: 'id001', username: 'daler', displayName: 'Saidov Daler' },
      { _id: 'id002', username: 'aziz', displayName: 'Aziz Rasulov' },
    ])
  }) 

})

