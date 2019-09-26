import Mock from 'mockjs'
import {
    getMediaOverview,
    getMediaDayNum,
    personYearOverview,
    personMonthOverview,
    monthsNum,
    getIndustryOverview,
    getIndustryDayNum,
    personIncomeOverview,
    personmOverview,
    partnerRank
} from './data'


//配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
    timeout: 1000
})

//多媒体消息相关信息
Mock.mock('/media/get_media_overview', getMediaOverview)
Mock.mock(/\/media\/get_day_num/, getMediaDayNum)
Mock.mock(/\/media\/person_year_overview/, personYearOverview)
Mock.mock(/\/media\/person_month_overview/, personMonthOverview)
Mock.mock(/\/media\/months_num/, monthsNum)

//行业短信相关信息
Mock.mock('/industry/get_industry_overview', getIndustryOverview)
Mock.mock(/\/industry\/get_day_num/, getIndustryDayNum)
Mock.mock(/\/industry\/person_income_overview/, personIncomeOverview)
Mock.mock(/\/industry\/person_m_overview/, personmOverview)
Mock.mock(/\/industry\/partner_rank/, partnerRank)

export default Mock