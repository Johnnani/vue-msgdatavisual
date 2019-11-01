<template>
  <div class="industry">
    <h3 class="ls2">行业短信业务</h3>
    <!-- 第一行start -->
    <section class="body1">
      <!-- 模块一start -->
      <div class="body1-left">
        <bgborder></bgborder>
        <div class="body1-left-light"></div>
        <div class="body1-left-content">
          <div class="body1-left-content-first">
            <div class="item">
              <h4><span class="cfx"></span>累计下发量</h4>
              <p class="ls2">{{industryOverviewData.totalNum}}</p>
              <p class="finished"><i>完成率</i><span class="ls2">{{industryOverviewData.totalRate}}%</span></p>
            </div>
            <div class="item">
              <h4><span class="cfx"></span>累计收入</h4>
              <p class="ls2">{{industryOverviewData.incomeNum}}</p>
              <p class="finished"><i>完成率</i><span class="ls2">{{industryOverviewData.incomeRate}}%</span></p>
            </div>
          </div>
          <div class="body1-left-content-second">
            <div class="item">
              <h4><span class="cfx"></span>当月下发量</h4>
              <p class="ls2">{{industryOverviewData.monthNum}}</p>
              <p class="finished"><i>完成率</i><span class="ls2">{{industryOverviewData.monthRate}}%</span></p>
            </div>
            <div class="item">
              <h4><span class="cfx"></span>当日下发量</h4>
              <p class="ls2">{{industryOverviewData.dayNum}}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 模块一end   -->
      <!-- 模块二start -->
      <div class="body1-right">
        <bgborder></bgborder>
        <div class="body1-right-light"></div>
        <div class="body1-right-light2"></div>
        <div class="body1-right-content">
          <h4><span class="cfx"></span>行业短信日下发量</h4>
          <div class="daily" id="industry-daily"></div>
        </div>
      </div>
      <!-- 模块二end -->
    </section>
    <!-- 第二行end -->
    <!-- 第一行start -->
    <section class="body2">
      <div class="body2-left">
        <bgborder></bgborder>
        <div class="body2-left-content">
          <h4><span class="cfx"></span>年度个人累计完成收入情况</h4>
          <div class="person-year" id="person-income" style="width:100%;height:90%"></div>
        </div>
      </div>
      <div class="body2-middle">
        <bgborder></bgborder>
        <div class="body2-middle-content">
          <h4><span class="cfx"></span>每月下发量</h4>
          <div class="person-month" id="industry-month" style="width:100%;height:90%"></div>
        </div>
      </div>
      <div class="body2-right">
        <bgborder></bgborder>
        <div class="body2-right-light2"></div>
        <div class="body2-right-content">
          <h4><span class="cfx"></span>某月合作伙伴TOP10</h4>
          <div class="partner" id="partner" style="width:100%;height:90%"></div>
        </div>
      </div>
    </section>
    <!-- 第二行end -->
  </div>
</template>
<script>
import bgborder from "./bgborder.vue";
import echarts from "echarts";
import {getIndustryOverview,
    getIndustryDayNum,
    personIncomeOverview,
    personmOverview,
    partnerRank} from '@/api';
import util from '@/libs/util';
export default {
  components: {
    bgborder
  },
  created() {
    getIndustryOverview().then(res => {
      this.industryOverviewData = res.data.data
      for(let p in this.industryOverviewData){
        if(p === 'totalNum' || p === 'dayNum' || p === 'monthNum' || p === 'incomeNum'){
            this.industryOverviewData[p] = util.formatNumber(this.industryOverviewData[p])
        }else{
          this.industryOverviewData[p] = this.industryOverviewData[p] * 100
        }
      }
    })
    getIndustryDayNum().then(res => {
      this.dayNumData = res.data.data;
    }),
    personIncomeOverview().then(res => {
      this.incomeOverviewData = res.data.data;
    }),
    personmOverview().then(res => {
      this.monthsNumData = res.data.data;
    }),
    partnerRank().then(res => {
      this.partnerRankData = util.sortByProperty(res.data.data,'data');
    })
  },
  mounted() {
    // this.dailyDetail();
    // this.personIncome();
    // this.industryMonth();
    // this.partnerRank();
    //监听窗口变化事件
    window.addEventListener("resize",()=>{
      this.$store.commit("changeScreen",!this.$store.state.isFullScreen)
    })
  },
  data(){
    return {
      industryOverviewData:{},//
      dayNumData:{},
      dailyChart:null,//日下发量chart
      incomeOverviewData:[],
      personIncomeChart:null,//年度个人累计完成收入情况
      monthsNumData:[],
      industryMonthChart:null,//每月下发量
      partnerRankData:[],
      partnerChart:null,// 某月合作伙伴top10
      dataAxis: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      zoomSize:6
    }
  },
  computed:{
    isFullScreen(){
      return this.$store.state.isFullScreen
    }
  },
  watch:{
    isFullScreen(){
      setTimeout(()=>{
        this.dailyChart.resize();
        this.personIncomeChart.resize();
        this.industryMonthChart.resize();
        this.partnerChart.resize();
      },500)
    },
    dayNumData(){
      this.dailyDetail();
    },
    incomeOverviewData(){
      this.personIncome();
    },
    monthsNumData(){
      this.industryMonth();
    },
    partnerRankData(){
      this.partnerRank();
    }
  },
  methods: {
    //消息日下发量
    dailyDetail() {
      let arr = [];
      let currentMonthData = [];
      let preMonthData = [];
      for(let i = 1;i<=31;i++){
        arr.push((i).toString());
      }
      arr.forEach(item => {
        this.dayNumData.currentMonth[item]?currentMonthData.push(this.dayNumData.currentMonth[item]) : 0;
        this.dayNumData.preMonth[item]?preMonthData.push(this.dayNumData.preMonth[item]) : 0;
      })
      this.dailyChart = echarts.init(document.getElementById("industry-daily"));
      let colors = [ '#6ae6f8','#0069f5', '#675bba'];
      let option = {
        title: {
          show:false,
          text: "多媒体消息日下发量",
          bottom: 10,
          left: "center",
          textStyle: {
            fontSize: 15,
            color: "#fff"
          }
        },
        color: colors,
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["当月日下发量", "上月日下发量"],
          top: "6%",
          textStyle: {
            fontSize: 13,
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "13%",
          containLabel: true
        },

        xAxis: {
          type: "category",
          textStyle: {
            fontSize: 13,
            color: "#939499"
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#2f7a9b", //左边线的颜色
              width: "2" //坐标线的宽度
            }
          },
          axistick:{
            show:false
          },
          axisLabel: {
            textStyle: {
              color: "#939499" //坐标值得具体的颜色
            }
          },
          splitLine:{
            show:false
          },
          // boundaryGap: false,
          data: arr
        },
        yAxis: {
          type: "value",
          textStyle: {
            fontSize: 15,
            color: "#fff"
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#2f7a9b", //左边线的颜色
              width: "2" //坐标线的宽度
            }
          },
          axisLabel: {
            textStyle: {
              color: "#939499" //坐标值得具体的颜色
            }
          },
          splitLine:{
            show:false
          }
          //boundaryGap: false,
        },
        series: [
          {
            name: "当月日下发量",
            type: "line",
            symbol:'none',
            smooth:false,
            areaStyle: {
              color:{
                type:'linear',
                x:0,
                y:0,
                x2:0,
                y2:1,
                colorStops:[{
                  offset:0,color:'rgba(0,106,245,0.3)'
                },{
                  offset:1,color:'rgba(0,106,245,0.02)'
                }]
              },
              // opacity: 0.1
            },
            data: currentMonthData
          },
          {
            name: "上月日下发量",
            type: "line",
            symbol:'none',
            smooth:false,
            areaStyle: {
              color:{
                type:'linear',
                x:0,
                y:0,
                x2:0,
                y2:1,
                colorStops:[{
                  offset:0,color:'rgba(0,234,252,0.3)'
                },{
                  offset:1,color:'rgba(0,234,252,0.02)'
                }]
              }
            },
            data: preMonthData
          }
        ]
      };
      if (option && typeof option === "object") {
        this.dailyChart.setOption(option, true);
      }
    },
    //年度个人累计完成收入情况
    personIncome(){
      let msg = {
        'name':[],
        'targetData':[],
        'data':[],
        'percentData':[]
      };
      this.incomeOverviewData.forEach(item => {
        let rate = (item.totalNum/item.targetNum * 100).toFixed(2) + '%'
        msg.name.push(item.name)
        msg.targetData.push(item.targetNum);
        msg.data.push(item.totalNum);
        msg.percentData.push(rate)
      })
      this.personIncomeChart = echarts.init(document.getElementById("person-income"));
      // let colors = ['#5793f3', '#b33a6f', '#675bba'];
      let colors = ['#207ad9','#8773fd'];
      // let msg = {
      //   'targetData':[
      //     1900, 2100, 3100, 12150
      //   ],
      //   'data':[1820, 2348, 2903, 10497],
      //   'percentData':['95.8%','111%','93.6%','86.4%']
      // }
      let option = {
        color: colors,	
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['累计下发量', '年度目标'],
          top:'8%',
          itemGap:20,
          itemWidth:20,
          itemHeight:10,
          textStyle:{
            fontSize:12,
            color:'#fff'
          },
          borderRadius:10
        },
        grid: {
          left: 0,
          right: '6%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          textStyle:{
            fontSize:13,
            color:'#939499'
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#2f7a9b',//左边线的颜色
              width:'2'//坐标线的宽度
            },
            // symbol:['none','arrow'],  //箭头，表示一边没有，一边有箭头
            // symbolSize:[10,10],
          },
          axisLabel: {
            textStyle: {
              color: '#939499',//坐标值得具体的颜色

            }
          },
          splitLine:{
            show:true,
            lineStyle:{
              color:'#2f7a9b'
            }
          },
          splitArea:{
            show:true,
            areaStyle:{
              color:['rgba(250,250,250,0)','rgba(0,0,0,0.3)']
            }
          }
        
        },
        yAxis: {
          type: 'category',
          data: msg.name,
          textStyle:{
            fontSize:13,
            color:'#939499'
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#2f7a9b',//左边线的颜色
              width:'2'//坐标线的宽度
            },
            symbol:['none','arrow'],  //箭头，表示一边没有，一边有箭头
            symbolSize:[10,10],
          },
          axisLabel: {
            textStyle: {
                color: '#939499',//坐标值得具体的颜色
            }
          }
        },
        series: [
          {
            name: '累计下发量',
            type: 'bar',
            barWidth : '30%',
            data: msg.data,
            itemStyle:{
              normal:{
                color:new echarts.graphic.LinearGradient(1,0,0,0,[{
                  offset:0,
                  color:'#41e1d4'
                },{
                  offset:1,
                  color:'#10a7d8'
                }],false),
                barBorderRadius:[0,14,14,0],
              }
            },
            label:{
              normal:{
                show:true,
                position:'right',
                distance:10,
                formatter:function(params){
                  return msg.percentData[params.dataIndex]
                },
                color:'#fca14a'
              }
            }
          },
          {
            name: '年度目标',
            barWidth : "30%",
            type: 'bar',
            data: msg.targetData,
            itemStyle:{
              normal:{
                color:new echarts.graphic.LinearGradient(1,0,0,0,[{
                  offset:0,
                  color:'#a293ee'
                },{
                  offset:1,
                  color:'#7663ed'
                }],false),
                barBorderRadius:[0,14,14,0],
              },
            },
          },
        ]
      }
      if (option && typeof option === "object") {
        this.personIncomeChart.setOption(option, true);
      }
    },
    // 合作伙伴Top10
    partnerRank(){
      let msg = {
        name:[],
        data:[],
        'waveData':[],
        'rankIcon':{
          'a':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIEAYAAAD9yHLdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABbdJREFUeNrt212IpXMAx/H/c2bZVTZJ7HqJJVey4QKXbCFrZlZqb0htkrK4kDuKsbbd5UJKraW4cKm8XKolFCW5oOQtiSkRuSEXG+b8XTDTZGzr+c2O53iez+dmmqdnTv+p03zndM6vFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgc3PnDC3P15JMXv3Z9HphEo64PABNp38Kt68677rrRrt83jg5ee23Xx4FJJCDwD5qPy4vlvJmZemPzUfPlzEzX54FJJCCwzFytda6ORuWk+mE9sH172VsvLbMzM0vXgSXruj4ATJJNX/xw4QlPXnFF+aq8Pf5p8+Zy6p/XT//5+8NTBy+//M/v3nuv63PCJPAfFSx3/cIn45tmZ/9+eWrn+JT67MrrMGQCAsvtb/Y3W1e+51Hnm2ea/d4LgeUEBEopzzz97R1z9dxzy946W3/ZunXFDffWfWXjJZccqt/VubplS9fnhUkgIFBKWbhg9NK6Q7Oz5e5yVplrmqPdN369fD511w03dH1emAQCAqWU8uh4vl527Pc4RjfXI+UV74VAKQLCwC0tzU9oLi4fXHXVse6vzzd3liPbtj332I+zj322cWPX54cuCQjD9tfivNxY3y0/bthwzPvn68vlvvXrf73o191HXr/mmq6PD10SEAZtcXHe9ucs1EFAGKgVi/O2LNRBQBimZYvzO8obmze3foBTy9byzhlnnP7z94endi4u1GFYBIRhOsrivC0LdYZMQBik5sRyT3l89X/46+3Nq6MtAsIwNat/CPj/WFycL4zLnqm98/PH63Gb3c2ZCw+ef/7u5sxmT/P1113/nvBf8AqEQVlanB9nFuoMkYAwLP9ycd6WhTpDJCAMQtvFeVsW6gyRgDAMbRfnbVmoM0ACwiCki/O2LNQZEgGh11a9OG/LQp0B8QSn11a9OG/LQp0BERD67TgtztuyUGcIBIReO16L87Ys1BkCS3R6aa0W521ZqNNnXoHQS+Oz64GpXTt2dH2O+lpz2rpD09NdnwPWgoDQS/WJZn3Z3f3HaZtbxm/UR7o/B6wFAaFX1npx3paFOn0mIPTLWi/O27JQp8cEhF4ZPVSvrNOT9+mn+lvz2+iFyTsXrIaA0AuLy+96uNxW3v8PFudtfVo31D3T0xbq9IknMr2wtDjfV7aXHZs2dX2eFSzU6SEBoR86Wpy3ZaFOnxgSQinlqXO+PfDI6M03ywNlV3n46quPeuP+8nx5+K237vrmrPsfGm/b1vW5oUtegQAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACJ/AI8Sc2WXtsswAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA4LTAxVDExOjI1OjMxKzA4OjAwYEv/1QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOC0wMVQxMToyNTozMSswODowMBEWR2kAAABTdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL2hvbWUvYWRtaW4vaWNvbi1mb250L3RtcC9pY29uX21mMnE2cnYzdHcvY2hhbmdqaWFudG91LWNvcHkuc3ZnDhVq/AAAAABJRU5ErkJggg==',
          'b':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIEAYAAAD9yHLdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABl1JREFUeNrt3U9o33cdx/HPJ2uRUZUqTtzWiX9g0zGXRFFQFItjTnboBLGpgiKbf1CZsEqpkE4n5DYpA0EnrvPgQbvuoE3tZFtLLvOwtTZZYWx4KU2hWxwi1mKLXT5eZlqo0+zVpN+fv+/jcUtCwju5PPkl3xepBXrs+LYtu8Y/tmlT/e3in9vWjRuX+3ntjpGr6s6ZmXfe/+u7jvxh796uvw/owpquD4AuLYXjQD1Spu65Z9mfd8vieNvx6hsCQk+NdH0AAP+fBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgEjt+gBYCSeen7h1bHJqqq0rby2/m5zs+p7XUmfKz8ojU1MbvrR7/ez1997b9T1wKbwCYTh8tN64uH56uusz/pe2sPjVtnPw74TlEBCGwrV/ueGBZ7c980z9Rvlw2/7ii13fc5H727Zyw8LChq037pl78NChrs+BlSAgDIVaf1hLWVws7y9/q39/7LGu77novudHNpYf79u3dCcMAQFhqLRrammHB+9XRO3lxS+2qwbvLrgUAsJQWXvT2gfbex9/vL6r/L7tOHOm63vqJ8rXy+fOnr3y2jNfPnPXgQNd3wMrSUAYKu+47ZcLz247fbrU9miZn5np+p52oHyv3XHw4Num9378hYdPner6HlhJAsJQareOPF1u37ev6zvK9e3JOjkAd8AqEBCG0hUbXjmy5gvT02W+bCljrXV1x7lz9c1t7/79Xf88YDUICEPpmp/vefTwH48fL29qn2lfO3r0sh9wuKxrR+bm3l1317l67FjXPw9YDQLCUKtr66a6//I//VRPlZ31T566YrgJCMOto4W6xTl9ICAMtcu+ULc4p0cEhKG2tPw+V++rt6z+H7PrnvKB9snpaYtz+kBA6IV2W9navr/6j9O2q8vd5Zse26UfBIReWO2FusU5fSQg9MJqL9QtzukjAaFXWisfqQdX/umodqw8UP/qqSv6RUDolZH7Rj5/7rmVX6ivnbziLfVpi3P6xb+0pZfmj27+x+hTc3Nlff1K/fbNN8df6NXF+XWf3f3wXB0b6/r7gsvJKxB6aaUW6hbn9JmA0E8rtFC3OKfPBIReuuSFusU5CAj9dKkLdYtzEBB6Ll2oW5yDgNBzr3ehbnEO5wkIvfZ6F+oW53CegEBZ/kLd4hzOExAoy1+oW5zDeZbocIH530zcOdpmZ8uHyuk6Pjq69IFHyvaybnb2uu/u/uDsU+PjXd8Jg8ArELhAfV+Zrzsufrqqvr28p/zCU1dwIQGBC73GQt3iHID/qrUftFJGRk7cPvGj0V+dPDn/nc2HxiZeeunf7+/6PgAG3IlPb3nj2MKuXSeu3nx29CcPPdT1PTCI1nR9AAyipYX6y+Xu8tPWyslSyre6vgoGi4DAf/CGDa88989PPfFE2V5K2VNKmej6Ihg8/wJYtcaSJbs6VQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wOC0wMVQxNDo0Njo1NiswODowMH0uCo8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDgtMDFUMTQ6NDY6NTYrMDg6MDAMc7IzAAAAVHRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy9ob21lL2FkbWluL2ljb24tZm9udC90bXAvaWNvbl9wcm9iY2M0enMyay9jaGFuZ2ppYW50b3UtY29weS5zdmdQjbNZAAAAAElFTkSuQmCC'
        }
      }
      this.partnerRankData.forEach( item => {
        msg.name.push(item.name);
        msg.data.push(item.data);
        msg.waveData.push(item.upDown);
      })
      // let msg = {
      //   'waveData':[+2,+2,-1,0,-2,+3,+1,0,-1,+3,0],
      //   'rankIcon':{
      //     'a':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIEAYAAAD9yHLdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABbdJREFUeNrt212IpXMAx/H/c2bZVTZJ7HqJJVey4QKXbCFrZlZqb0htkrK4kDuKsbbd5UJKraW4cKm8XKolFCW5oOQtiSkRuSEXG+b8XTDTZGzr+c2O53iez+dmmqdnTv+p03zndM6vFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgc3PnDC3P15JMXv3Z9HphEo64PABNp38Kt68677rrRrt83jg5ee23Xx4FJJCDwD5qPy4vlvJmZemPzUfPlzEzX54FJJCCwzFytda6ORuWk+mE9sH172VsvLbMzM0vXgSXruj4ATJJNX/xw4QlPXnFF+aq8Pf5p8+Zy6p/XT//5+8NTBy+//M/v3nuv63PCJPAfFSx3/cIn45tmZ/9+eWrn+JT67MrrMGQCAsvtb/Y3W1e+51Hnm2ea/d4LgeUEBEopzzz97R1z9dxzy946W3/ZunXFDffWfWXjJZccqt/VubplS9fnhUkgIFBKWbhg9NK6Q7Oz5e5yVplrmqPdN369fD511w03dH1emAQCAqWU8uh4vl527Pc4RjfXI+UV74VAKQLCwC0tzU9oLi4fXHXVse6vzzd3liPbtj332I+zj322cWPX54cuCQjD9tfivNxY3y0/bthwzPvn68vlvvXrf73o191HXr/mmq6PD10SEAZtcXHe9ucs1EFAGKgVi/O2LNRBQBimZYvzO8obmze3foBTy9byzhlnnP7z94endi4u1GFYBIRhOsrivC0LdYZMQBik5sRyT3l89X/46+3Nq6MtAsIwNat/CPj/WFycL4zLnqm98/PH63Gb3c2ZCw+ef/7u5sxmT/P1113/nvBf8AqEQVlanB9nFuoMkYAwLP9ycd6WhTpDJCAMQtvFeVsW6gyRgDAMbRfnbVmoM0ACwiCki/O2LNQZEgGh11a9OG/LQp0B8QSn11a9OG/LQp0BERD67TgtztuyUGcIBIReO16L87Ys1BkCS3R6aa0W521ZqNNnXoHQS+Oz64GpXTt2dH2O+lpz2rpD09NdnwPWgoDQS/WJZn3Z3f3HaZtbxm/UR7o/B6wFAaFX1npx3paFOn0mIPTLWi/O27JQp8cEhF4ZPVSvrNOT9+mn+lvz2+iFyTsXrIaA0AuLy+96uNxW3v8PFudtfVo31D3T0xbq9IknMr2wtDjfV7aXHZs2dX2eFSzU6SEBoR86Wpy3ZaFOnxgSQinlqXO+PfDI6M03ywNlV3n46quPeuP+8nx5+K237vrmrPsfGm/b1vW5oUtegQAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACJ/AI8Sc2WXtsswAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA4LTAxVDExOjI1OjMxKzA4OjAwYEv/1QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOC0wMVQxMToyNTozMSswODowMBEWR2kAAABTdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL2hvbWUvYWRtaW4vaWNvbi1mb250L3RtcC9pY29uX21mMnE2cnYzdHcvY2hhbmdqaWFudG91LWNvcHkuc3ZnDhVq/AAAAABJRU5ErkJggg==',
      //     'b':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIEAYAAAD9yHLdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABl1JREFUeNrt3U9o33cdx/HPJ2uRUZUqTtzWiX9g0zGXRFFQFItjTnboBLGpgiKbf1CZsEqpkE4n5DYpA0EnrvPgQbvuoE3tZFtLLvOwtTZZYWx4KU2hWxwi1mKLXT5eZlqo0+zVpN+fv+/jcUtCwju5PPkl3xepBXrs+LYtu8Y/tmlT/e3in9vWjRuX+3ntjpGr6s6ZmXfe/+u7jvxh796uvw/owpquD4AuLYXjQD1Spu65Z9mfd8vieNvx6hsCQk+NdH0AAP+fBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgEjt+gBYCSeen7h1bHJqqq0rby2/m5zs+p7XUmfKz8ojU1MbvrR7/ez1997b9T1wKbwCYTh8tN64uH56uusz/pe2sPjVtnPw74TlEBCGwrV/ueGBZ7c980z9Rvlw2/7ii13fc5H727Zyw8LChq037pl78NChrs+BlSAgDIVaf1hLWVws7y9/q39/7LGu77novudHNpYf79u3dCcMAQFhqLRrammHB+9XRO3lxS+2qwbvLrgUAsJQWXvT2gfbex9/vL6r/L7tOHOm63vqJ8rXy+fOnr3y2jNfPnPXgQNd3wMrSUAYKu+47ZcLz247fbrU9miZn5np+p52oHyv3XHw4Num9378hYdPner6HlhJAsJQareOPF1u37ev6zvK9e3JOjkAd8AqEBCG0hUbXjmy5gvT02W+bCljrXV1x7lz9c1t7/79Xf88YDUICEPpmp/vefTwH48fL29qn2lfO3r0sh9wuKxrR+bm3l1317l67FjXPw9YDQLCUKtr66a6//I//VRPlZ31T566YrgJCMOto4W6xTl9ICAMtcu+ULc4p0cEhKG2tPw+V++rt6z+H7PrnvKB9snpaYtz+kBA6IV2W9navr/6j9O2q8vd5Zse26UfBIReWO2FusU5fSQg9MJqL9QtzukjAaFXWisfqQdX/umodqw8UP/qqSv6RUDolZH7Rj5/7rmVX6ivnbziLfVpi3P6xb+0pZfmj27+x+hTc3Nlff1K/fbNN8df6NXF+XWf3f3wXB0b6/r7gsvJKxB6aaUW6hbn9JmA0E8rtFC3OKfPBIReuuSFusU5CAj9dKkLdYtzEBB6Ll2oW5yDgNBzr3ehbnEO5wkIvfZ6F+oW53CegEBZ/kLd4hzOExAoy1+oW5zDeZbocIH530zcOdpmZ8uHyuk6Pjq69IFHyvaybnb2uu/u/uDsU+PjXd8Jg8ArELhAfV+Zrzsufrqqvr28p/zCU1dwIQGBC73GQt3iHID/qrUftFJGRk7cPvGj0V+dPDn/nc2HxiZeeunf7+/6PgAG3IlPb3nj2MKuXSeu3nx29CcPPdT1PTCI1nR9AAyipYX6y+Xu8tPWyslSyre6vgoGi4DAf/CGDa88989PPfFE2V5K2VNKmej6Ihg8/wJYtcaSJbs6VQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wOC0wMVQxNDo0Njo1NiswODowMH0uCo8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDgtMDFUMTQ6NDY6NTYrMDg6MDAMc7IzAAAAVHRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy9ob21lL2FkbWluL2ljb24tZm9udC90bXAvaWNvbl9wcm9iY2M0enMyay9jaGFuZ2ppYW50b3UtY29weS5zdmdQjbNZAAAAAElFTkSuQmCC'
      //   }
      // }
      this.partnerChart = echarts.init(document.getElementById("partner"));
      // let colors = ['#5793f3', '#b33a6f', '#675bba'];
      let colors = ["#27a1fd","#ffb600"];
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
        },
        color: colors,	
        grid: {
          left: 0,
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          splitLine:{show: false},//去除网格线
          textStyle:{
            fontSize:13,
            color:'#939499'
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#2f7a9b',//左边线的颜色
              width:'2'//坐标线的宽度
            }
          },
          axisLabel: {
            textStyle: {
                color: '#939499',//坐标值得具体的颜色
            }
          },
        },
        yAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
                type: 'solid',
                color: '#2f7a9b',//左边线的颜色
                width:'2'//坐标线的宽度
            }
          },
          axisLabel: {
            textStyle: {
              color: '#eaeaea',//坐标值得具体的颜色
            }
          },
          data: msg.name
        },
        series: [
          {
            name: '5月',
            type: 'bar',
            // barWidth:'70%',
            barCategoryGap:'40%',
            // barGap:'-100%',
            data: msg.data,
            itemStyle:{
              shadowBlur:20,
              shadowColor:'rgba(40,40,40,0.5)'
            }
          },
          {
            type:'bar',
            barGap:'-100%',
            data:Math.max(...msg.data),
            itemStyle:{
              color:'rgba(0,0,0,0)'
            },
            label:{
              normal:{
                show:true,
                position:'right',
                distance:10,
                formatter:function(params){
                  if(msg.waveData[params.dataIndex]>0){
                    return `{a|}{aNameStyle|${msg.waveData[params.dataIndex]}}`
                  }else if(msg.waveData[params.dataIndex] === 0){
                    return `{aNameStyle|--}`
                  }else{
                    return `{b|}{bNameStyle|${msg.waveData[params.dataIndex]}}`
                  }
                },
                rich:{
                  a:{
                    width:16,
                    height:16,
                    lineHeight:20,
                    backgroundColor: {
                      image:msg.rankIcon.a,
                    },
                    align:'left'
                  },
                  aNameStyle:{
                    color:'#4fba51',
                    lineHeight:20
                  },
                  b:{
                    width:16,
                    height:16,
                    lineHeight:20,
                    backgroundColor:{
                      image:msg.rankIcon.b,
                    },
                    align:'left'
                  },
                  bNameStyle:{
                    color:'#ef7020',
                    lineHeight:20
                  }
                }
              }
            }
          }
        ]
      }
      if (option && typeof option === "object") {
        this.partnerChart.setOption(option, true);
      }
    },
    // 每月下发量
    industryMonth(){
      let dataAxis = [];
      let data = [];
      for(let i = 1;i<=12;i++){
        dataAxis.push((i).toString())
      }
      dataAxis.forEach(item => {
        data.push(this.monthsNumData[item])
      })
      this.industryMonthChart = echarts.init(document.getElementById("industry-month"));
      // let dataAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      // let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149];
      let yMax = Math.max(...data);
      let dataShadow = [];
      for (var i = 0; i < data.length; i++) {
          dataShadow.push(yMax);
      }
      let option = {
        grid: {
          left: 0,
          right: '14%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          data: dataAxis,
          axisLine: {
            lineStyle: {
                type: 'solid',
                color: '#2f7a9b',//左边线的颜色
                width:'2'//坐标线的宽度
            }
          },
          axisLabel: {
            textStyle: {
                color: '#939499',//坐标值得具体的颜色

            }
          },
          axisTick: {
            show: false
          },
          z: 10
        },
        yAxis: {
          splitLine:{
            show:true,
            lineStyle:{
              color:"#2f7a9b"
            }
          },
          axisTick: {
              show: false
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#2f7a9b',//左边线的颜色
              width:'2'//坐标线的宽度
            }
          },
          axisLabel: {
            textStyle: {
                color: '#939499',//坐标值得具体的颜色
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
                normal: {color: 'rgba(0,0,0,0.05)'}
            },
            barGap:'-100%',
            barCategoryGap:'40%',
            barWidth : 20,
            data: dataShadow,
            animation: false
        },
        {
          type: 'bar',
          barWidth : 20,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#a291ed'},
                            {offset: 0.5, color: '#8673ed'},
                            {offset: 1, color: '#7864ec'}
                        ]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 0.7, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    )
                }
            },
            data: data
        }
    ]
      }
      if (option && typeof option === "object") {
        this.industryMonthChart.setOption(option, true);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.industry {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.5rem 0.3rem 0.5rem;
  box-sizing:border-box;
  display:flex;
  flex-direction: column;
  h3 {
    font-size: 0.52rem;
    text-align: center;
    // font-family: '思源黑体 CN';
    font-weight: 700;
    background-image: linear-gradient(top, #f5faf4, #c0cdc6);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-bottom: 0.3rem;
  }
  .body1 {
    width:100%;
    // height: 4rem;
    flex-grow:1;
    display: flex;
    margin-bottom:0.3rem;
    &-left {
      width:38%;
      height: 100%;
      margin-right: 1.65%;
      position: relative;
      &-light {
        position: absolute;
        width: 100%;
        height: 18px;
        top: -6px;
        right: -6px;
        background: url("../assets/imgs/light1.png") center center no-repeat;
      }
      &-content {
        width: 100%;
        box-sizing: border-box;
        padding: 0.27rem 0 0 0.3rem;
        position: absolute;
        top: 0;
        left: 0;
        display:flex;
        &-first,&-second{
          flex:1;
          display:flex;
          flex-direction: column;
        }
        .item {
          margin-bottom: 50px;
          h4,
          i {
            font-size: 0.24rem;
            color: #0082c9;
            .cfx {
              width: 0.08rem;
              height: 0.22rem;
              background-color: #3567c6;
              display: inline-block;
              vertical-align: -3px;
              margin-right: 0.14rem;
            }
          }
          p {
            font-size: 0.32rem;
            // color: #f62c88;
            color:#fff;
            font-weight: 700;
            line-height: 0.52rem;
            // font-family:'华文黑体';
          }
          .finished {
            span {
              display: inline-block;
              margin-left: 0.2rem;
              font-size: 0.32rem;
              // color:#7e6afd;
              color: #00d1ff;
            }
          }
        }
      }
    }
    &-right {
      // width: 13rem;
      width:60%;
      height: 100%;
      position: relative;
      &-light {
        position: absolute;
        width: 100%;
        height: 18px;
        top: -6px;
        right: 0;
        background: url("../assets/imgs/light1.png") center center no-repeat;
      }
      &-light2 {
        position: absolute;
        width: 20px;
        height: 100%;
        top: 0;
        right: -13px;
        background: url("../assets/imgs/light2.png") center center no-repeat;
      }
      &-content {
        padding: 0.27rem 0 0 0.3rem;
        width:100%;
        position: absolute;
        top: 0;
        left: 0;
        h4 {
          font-size: 0.24rem;
          color: #0082c9;
          background: url("../assets/imgs/line1.png") 90% center no-repeat;
          .cfx {
            width: 0.08rem;
            height: 0.22rem;
            background-color: #3567c6;
            display: inline-block;
            vertical-align: -3px;
            margin-right: 0.14rem;
          }
        }
        .daily {
          width: 96%;
          height: 3.66rem;
        }
      }
    }
  }
  .body2{
    width:100%;
    display:flex;
    justify-content:space-around;
    flex-grow:1;
    &-left,&-middle,&-right{
      flex-grow:1;
      height:100%;
      position: relative;
      margin-right:1.65%;
    }
    div.body2-right{
      margin-right:0;
      &-light2{
        width:20px;
        height:100%;
        position:absolute;
        top:0;
        right:-13px;
        background: url("../assets/imgs/light2.png") center center no-repeat;
      }
    }
    &-left-content,&-middle-content,&-right-content{
      padding: 0.27rem 0 0 0.3rem;
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      box-sizing:border-box;
      & h4{
        font-size:0.24rem;
        color:#0082c9;
        background: url("../assets/imgs/line1.png") 90% center no-repeat;
        background-size:30% auto;
        .cfx{
          width: 0.08rem;
          height: 0.22rem;
          background-color: #3567c6;
          display: inline-block;
          vertical-align: -3px;
          margin-right: 0.14rem;
        }
      }
    }
  }
}
</style>