// 用户相关的请求模块
import request from '@/utils/require'
// 登录注册
export const login = data => {
  return request({
    method: 'POST',
    url: 'app/v1_0/authorizations',
    data
  })
}
/**
 * 发送短信验证码
 */
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `app/v1_0/sms/codes/${mobile}`
  })
}
