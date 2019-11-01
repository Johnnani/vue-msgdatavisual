import axios from '@/libs/api.request';
import moment from 'moment';
import encrypt from '@/libs/encrypt';
let Phone = '17744537705';
let date = moment().format("YYYYMMDD")
let MacId = "W628L45X";
let RandCode = "662537";
//当前年数据
export const getYearData = () => {
  let year = moment().format('YYYY')
  let Sign = encrypt.md5(Phone+date+RandCode+MacId+year+'000000')
  let params = {
    Phone,
    date,
    Sign,
    year,
    month:'00',
    day:'00',
    hour:'00',
    type:'00'
  }
  return axios.request({
    url:'http://124.126.120.102/api/report',
    // url: 'http://172.16.148.116:9702/api/report',
    method: 'post',
    data:params
  })
}
//当前月数据
export const getMonthData = () => {
  let year = moment().format('YYYY')
  let month = moment().format('MM')
  let Sign = encrypt.md5(Phone+date+RandCode+MacId+year+month+'0000')
  let params = {
    Phone,
    date,
    Sign,
    year,
    month,
    day:'00',
    hour:'00',
    type:'00'
  }
  return axios.request({
    url: 'http://124.126.120.102/api/report',
    // url:'http://172.16.148.116:9702/api/report',
    method: 'post',
    data:params
  })
}
//前一月数据
export const getPreviousMonthData = () => {
  let year = moment().format('YYYY')
  let month = moment().subtract(1,'month').format('MM')
  let Sign = encrypt.md5(Phone+date+RandCode+MacId+year+month+'0000')
  let params = {
    Phone,
    date,
    Sign,
    year,
    month,
    day:'00',
    hour:'00',
    type:'00'
  }
  return axios.request({
    // url:'http://172.16.148.116:9702/api/report',
    url: 'http://124.126.120.102/api/report',
    method: 'post',
    data:params
  })
}
//当日数据
export const getDayData = () => {
  let year = parseInt(moment().format('YYYY'))
  let month = parseInt(moment().format('M'))
  let day = parseInt(moment().format('D'))
  let Sign = encrypt.md5(Phone+date+RandCode+MacId+year+month+day+'0')
  let params = {
    Phone,
    date,
    Sign,
    year,
    month,
    day,
    hour:0
  }
  return axios.request({
    url: 'http://124.126.120.102/api/total',
    method: 'post',
    data:params
  })
}
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