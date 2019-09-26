import axios from '@/libs/api.request';
//多媒体消息概况
export const getMediaOverview = () => {
  return axios.request({
    url: '/media/get_media_overview',
    method: 'post'
  })
}
//多媒体消息日下发量
export const getMediaDayNum = () => {
  return axios.request({
    url: '/media/get_day_num',
    method: 'post'
  })
}
//年度个人累计完成情况
export const personYearOverview = () => {
  return axios.request({
    url: '/media/person_year_overview',
    method: 'post'
  })
}
//当月个人累计完成情况
export const personMonthOverview = () => {
  return axios.request({
    url: '/media/person_month_overview',
    method: 'post'
  })
}
//每月下发量
export const monthsNum = () => {
  return axios.request({
    url: '/media/months_num',
    method: 'post'
  })
}
//行业短信概况
export const getIndustryOverview = () => {
  return axios.request({
    url: '/industry/get_industry_overview',
    method: 'post'
  })
}
//行业短信日下发量
export const getIndustryDayNum = () => {
  return axios.request({
    url: '/industry/get_day_num',
    method: 'post'
  })
}
//行业短信个人年度完成收入概况
export const personIncomeOverview = () => {
  return axios.request({
    url: '/industry/person_income_overview',
    method: 'post'
  })
}
//行业短信概况
export const personmOverview = () => {
  return axios.request({
    url: '/industry/person_m_overview',
    method: 'post'
  })
}
//行业短信概况
export const partnerRank = () => {
  return axios.request({
    url: '/industry/partner_rank',
    method: 'post'
  })
}