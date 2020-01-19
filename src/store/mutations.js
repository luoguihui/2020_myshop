/*
直接更新state的多个方法的对象
 */
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USERINFO
} from './mutation-types'

export default {
    [RECEIVE_ADDRESS] (state, {address}) {
      state.address = address
    },

    [RECEIVE_CATEGORYS] (state, {data}) {
        state.categorys = data
    },

    [RECEIVE_SHOPS] (state, {data}) {
        state.shops = data
    },

    [RECEIVE_USERINFO] (state, {data}) {
        state.userInfo = data
    }
}
