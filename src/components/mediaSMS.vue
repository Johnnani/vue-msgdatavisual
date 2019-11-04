<template>
  <div class="media">
    <h3 class="ls2">多媒体消息业务</h3>
    <!-- 第一行start -->
    <section class="body1">
      <!-- 模块一start -->
      <div class="body1-left">
        <bgborder></bgborder>
        <div class="body1-left-light"></div>
        <div class="body1-left-content">
          <div class="item">
            <h4><span class="cfx"></span>累计下发量</h4>
            <p class="ls2">{{totalData.yearTotal}}</p>
            <p class="finished"><i>完成率</i><span class="ls2">30%</span></p>
          </div>
          <div class="item">
            <h4><span class="cfx"></span>当月下发量</h4>
            <p class="ls2">{{totalData.monthTotal}}</p>
            <p class="finished"><i>完成率</i><span class="ls2">2%</span></p>
          </div>
          <div class="item">
            <h4><span class="cfx"></span>当日下发量</h4>
            <p class="ls2">{{totalData.dayTotal}}</p>
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
          <h4><span class="cfx"></span>多媒体消息日下发量</h4>
          <div class="daily" id="media-daily"></div>
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
          <h4><span class="cfx"></span>年度个人累计完成情况</h4>
          <div class="person-year" id="person-year" style="width:100%;height:90%"></div>
        </div>
      </div>
      <div class="body2-middle">
        <bgborder></bgborder>
        <div class="body2-middle-content">
          <h4><span class="cfx"></span>当月个人累计完成情况</h4>
          <div class="person-month" id="person-month" style="width:100%;height:90%"></div>
        </div>
      </div>
      <div class="body2-right">
        <bgborder></bgborder>
        <div class="body2-right-light2"></div>
        <div class="body2-right-content">
          <h4><span class="cfx"></span>每月下发量</h4>
          <div class="month-amount" id="month-amount" style="width:100%;height:90%"></div>
        </div>
      </div>
    </section>
    <!-- 第二行end -->
  </div>
</template>
<script>
import bgborder from "./bgborder.vue";
import echarts from "echarts";
import { setTimeout } from 'timers';
import {personYearOverview,personMonthOverview,monthsNum} from '@/api';//多媒体消息概况
import util from '@/libs/util';
export default {
  components: {
    bgborder
  },
  created() {
    //全部实际数据
    util.getData().then(res1 => {
      this.totalData.yearTotal=res1.yearTotal
      this.totalData.monthTotal=res1.monthTotal
      this.totalData.dayTotal=res1.dayTotal
      this.dayNumData = {
        preMonth:res1.prevNums,
        currentMonth:res1.currNums
      };
      this.monthsNumData = res1.monthsNum;
      setInterval(() => {
        util.getData().then(res2 => {
          this.$set(this.totalData,'yearTotal',res2.yearTotal)
          this.$set(this.totalData,'monthTotal',res2.monthTotal)
          this.$set(this.totalData,'dayTotal',res2.dayTotal)
          this.dayNumData = {
            preMonth:res2.prevNums,
            currentMonth:res2.currNums
          }
          this.monthsNumData = res2.monthsNum
        })
      },60000)
    })
    //多媒体消息概况
    // getMediaOverview().then(res => {
    //   if(res.data.code===0){
    //     this.overViewData = res.data.data
    //     for(let p in this.overViewData){
    //       if(p === 'totalNum' || p === 'dayNum' || p === 'monthNum'){
    //         this.overViewData[p] = util.formatNumber(this.overViewData[p])
    //       }else{
    //         this.overViewData[p] = this.overViewData[p] * 100
    //       }
    //     }
    //   }
    // })
    //多媒体消息日下发量
    // getMediaDayNum().then(res => {
    //   this.dayNumData = res.data.data;
    // })
    //年度个人累计完成情况
    personYearOverview().then(res => {
      this.personYearOverviewData = res.data.data;
    })
    //当月个人累计完成情况
    personMonthOverview().then(res => {
      this.personMonthOverviewData = res.data.data;
    })
    //每月下发量
    // monthsNum().then(res => {
    //   this.monthsNumData = res.data.data;
    // })
  },
  mounted() {
    //监听窗口变化事件
    window.addEventListener("resize",()=>{
      this.$store.commit("changeScreen",!this.$store.state.isFullScreen)
    })

  },
  data(){
    return {
      totalData:{
        yearTotal:0,//年累计下发量
        monthTotal:0,//当月下发量
        dayTotal:0//当日下发量
      },//全部数据
      overViewData:{},//多媒体消息概况数据
      dayNumData:{},//多媒体消息日下发量数据
      dailyChart:null,//日下发量chart
      personYearOverviewData:[],//年度个人累计完成情况数据
      personYearChart:null,//年度个人累计完成情况
      personMonthOverviewData:[],//年度个人累计完成情况数据
      personMonthChart:null,//当月个人完成
      monthsNumData:{},//每月下发量数据
      monthAmountChart:null,// 每月下发量
      dataAxis: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      zoomSize:6,
    }
  },
  computed:{
    //页面宽度
    isFullScreen(){
      return this.$store.state.isFullScreen
    }
  },
  watch:{
    isFullScreen(){
      setTimeout(()=>{
        this.dailyChart.resize();
        this.personYearChart.resize();
        this.personMonthChart.resize();
        this.monthAmountChart.resize();
      },500)
    },
    dayNumData(){
      this.dailyDetail()
    },
    personYearOverviewData(){
      this.personYear();
    },
    personMonthOverviewData(){
      this.personMonth();
    },
    monthsNumData(){
      this.monthAmount()
    }
  },
  methods: {
    //消息日下发量
    dailyDetail() {
      let arr = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
      let currentMonthData = [];
      let preMonthData = [];
      // for(let i = 1;i<=31;i++){
      //   arr.push((i).toString());
      // }
      arr.forEach(item => {
        this.dayNumData.currentMonth[item]?currentMonthData.push(this.dayNumData.currentMonth[item]) : 0;
        this.dayNumData.preMonth[item]?preMonthData.push(this.dayNumData.preMonth[item]) : 0;
      })
      this.dailyChart = echarts.init(document.getElementById("media-daily"));
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
          bottom: "8%",
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
    //年度个人累计完成情况
    personYear(){
      let msg = {
        'name':[],
        'targetData':[],
        'data':[],
        'percentData':[]
      };
      this.personYearOverviewData.forEach(item => {
        let rate = (item.totalNum/item.targetNum * 100).toFixed(2) + '%'
        msg.name.push(item.name)
        msg.targetData.push(item.targetNum);
        msg.data.push(item.totalNum);
        msg.percentData.push(rate)
      })
      this.personYearChart = echarts.init(document.getElementById("person-year"));
      // let colors = ['#5793f3', '#b33a6f', '#675bba'];
      let colors = ['#207ad9','#8773fd'];
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
        this.personYearChart.setOption(option, true);
      }
    },
    // 当月个人累计完成情况
    personMonth(){
      let msg = {
        'name':[],
        'data':[],
        'percentData':[]
      }
      this.personMonthOverviewData.forEach(item => {
        msg.name.push(item.name);
        msg.data.push(item.totalNum);
        msg.percentData.push(item.finishingRate*100)
      })
      let maxData = Math.max(...msg.data)
      this.personMonthChart = echarts.init(document.getElementById("person-month"));
      // let colors = ['#5793f3', '#b33a6f', '#675bba'];
      let colors = ["#27a1fd","#ffb600"];
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        legend: {
          data:['当月下发量', '当月完成率'],
          top: '8%',
          itemGap:20,
          itemWidth:16,
          itemHeight:8,
          textStyle:{
            fontSize:13,
            color:'#fff'
          },
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
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
              }
            },
            axisLabel: {
              textStyle: {
                  color: '#939499',//坐标值得具体的颜色

              }
            },
          }
        ],
        yAxis: [
        {
          type: 'value',
          name: '月下发量',
          min: 0,
          max: maxData,
          splitNum:5,
          interval:maxData / 5,
          position: 'left',
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
          splitLine:{
            show:true,
            lineStyle:{
              color:'#2f7a9b'
            }
          }
        },
        {
          type: 'value',
          name: '月完成率',
          min: 0,
          max: 100,
          position: 'right',
          textStyle:{
            fontSize:15,
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
          splitLine:{
            show:true,
            lineStyle:{
              color: "#2f7a9b"
            }
          }
        }
        ],
        series: [
          {
            name:'当月下发量',
            type:'bar',
            barWidth : 20,
            data:msg.data
          },
          {
            name:'当月完成率',
            type:'line',
            yAxisIndex: 1,
            data:msg.percentData,
            areaStyle:{
              color:new echarts.graphic.LinearGradient(0,0,0,1,[{
                offset:0,
                color:'rgba(255,182,0,0.3)'
              },{
                offset:1,
                color:'rgba(255,182,0,0.02)'
              }],false)
            }
            // itemStyle:{
            //   normal:{
            //     color:new echarts.LinearGradient(0,0,0,1,[{
            //       offset:0,
            //       color:'rgba(255,182,0,0.2)'
            //     },{
            //       offset:1,
            //       color:'rgba(255,182,0,0.8)'
            //     }],false)
            //   }
            // }
          }
        ]
      }
      if (option && typeof option === "object") {
        this.personMonthChart.setOption(option, true);
      }
    },
    // 每月下发量
    monthAmount(){
      let dataAxis = [];
      let data = [];
      for(let i = 1;i<=12;i++){
        i<10?
          dataAxis.push((`0${i}`)):
          dataAxis.push((`${i}`));

      }
      dataAxis.forEach(item => {
        data.push(this.monthsNumData[item])
      })
      this.monthAmountChart = echarts.init(document.getElementById("month-amount"));

      let yMax = Math.max(...dataAxis);
      let dataShadow = [];
      for (var i = 0; i < data.length; i++) {
          dataShadow.push(yMax);
      }
      let option = {
        grid: {
          left: 0,
          right: '4%',
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
        this.monthAmountChart.setOption(option, true);
      }
    }
  }
}
</script>
<style lang="less" scoped>
.media {
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
      width:25%;
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
        .item {
          margin-bottom: 14px;
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
      width:73%;
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
        background: url("../assets/imgs/line1.png") 86% center no-repeat;
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