/*
通过mutation间接更新state的多个方法的对象
 */
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USERINFO
} from './mutation-types'
import {
    reqAddress,
    reqFoodCategorys,
    reqShops,
    reqGetUserInfo,
    reqLogout
} from '../api'

export default {
    // 异步获取地址
    async getAddress ({commit, state}) {
      // 发送异步ajax请求
      const geohash = state.latitude + ',' + state.longitude
      const result = await reqAddress(geohash)
      // 提交一个mutation
      if (result.code === 0) {
        const address = result.data
        commit(RECEIVE_ADDRESS, {address})
      }
    },

    // 异步获取商品分类列表
    async getFoodCategorys ({commit}) {
        const result = await reqFoodCategorys()
        if (result.code === 0) {
            const data = result.data
            commit(RECEIVE_CATEGORYS, {data})
        }
    },

    // 异步获取商家列表
    async getShops ({commit, state}) {
        const {longitude, latitude} = state
        const result = await reqShops(longitude, latitude)
        if (result.code === 0) {
            const data = result.data
            commit(RECEIVE_SHOPS, {data})
        }
    },

    // 同步更新用户信息
    updateUserInfo ({commit}, data) {
        commit(RECEIVE_USERINFO, {data})
    },

    // 异步获取用户信息
    async getUserInfo ({commit}) {
        const result = await reqGetUserInfo()
        if (result.code === 0) {
            const data = result.data
            commit(RECEIVE_USERINFO, {data})
        }
    },

    // 退出登录
    async reqLogout ({commit}) {
        const result = await reqLogout()
        if (result.code === 0) {
            const data = {}
            commit(RECEIVE_USERINFO, {data})
        }
    }

}
