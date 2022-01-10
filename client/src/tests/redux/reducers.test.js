import authReducer, { authActions } from 'redux/reducers/authReducer'




describe('auth reducer', () => {

  const initialState = {
    currentUserId: null,
    isTryingToLogin: false
  }
  
  test('should return initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState)
  })

  test('setCurrentUserId', () => {
    expect(authReducer(initialState, authActions.setCurrentUserId('id0001'))).toEqual({
      currentUserId: 'id0001',
      isTryingToLogin: false
    })
  })
  

})
