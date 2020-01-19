/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */
import axios from 'axios'
import { Indicator } from 'mint-ui';

export default function ajax (url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        Indicator.open()
        if (type === 'GET') {
            // 准备url query参数数据
            let dataStr = ''
            Object.keys(data).forEach(key => {
              dataStr += key + '=' + data[key] + '&'
            })
            if (dataStr !== '') {
              dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
              url = url + '?' + dataStr
            }
            // 发送get请求
            promise = axios.get(url)
          } else {
            // 发送post请求
            promise = axios.post(url, data)
          }

        promise.then((response) => {
            Indicator.close();
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}
