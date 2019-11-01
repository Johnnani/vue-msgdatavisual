<template>
  <div class="business-map-wrapper">
    <h3 class="ls2">多媒体信息业务签约省</h3>
    <div class="business-map" id="business-map">
    </div>
    <div class="business-table">
      <div class="business-table-row business-table-tit">
        <p>负责人</p>
        <p>目标省</p>
        <p>已完成占比</p>
      </div>
      <div class="business-table-row">
        <p>王佳</p>
        <p><span>福建、吉林、</span>广东、广西、天津、宁夏</p>
        <p>1/3</p>
      </div>
      <div class="business-table-row">
        <p>阿鲍</p>
        <p>北京、陕西、河北、甘肃、青海、四川</p>
        <p>0</p>
      </div>
      <div class="business-table-row">
        <p>王云</p>
        <p><span>浙江、</span>安徽、上海、江西、湖北</p>
        <p>1/5</p>
      </div>
      <div class="business-table-row">
        <p>王鹏</p>
        <p><span>江苏、山东、</span>湖南、山西</p>
        <p>1/2</p>
      </div>
    </div>
  </div>

</template>
<script>
import echarts from "echarts";
import china from "../../node_modules/echarts/map/json/china.json";
import util from "../libs/util.js";
// import chongqing from '../../node_modules/echarts/map/json/province/chongqing.json'
export default {
  data() {
    return {
      signProvinceChart: null //签约省echarts
    };
  },
  computed: {
    isFullScreen() {
      return this.$store.state.isFullScreen;
    }
  },
  mounted() {
    this.signProvince();
    //监听窗口变化事件
    window.addEventListener("resize", () => {
      this.$store.commit("changeScreen", !this.$store.state.isFullScreen);
    });
  },
  watch: {
    isFullScreen() {
      setTimeout(() => {
        this.signProvinceChart.resize();
      }, 500);
    }
  },
  methods: {
    //业务签约省
    signProvince() {
      this.signProvinceChart = echarts.init(
        document.getElementById("business-map")
      );
      let colors = ["#C4CCD3", "#E7BCF3", "#ffc100", "#93d150"];
      let chinaGeoCoordMap = {
        黑龙江: [127.9688, 45.368],
        内蒙古: [110.3467, 41.4899],
        吉林: [125.8154, 44.2584],
        北京: [116.4551, 40.2539],
        辽宁: [123.1238, 42.1216],
        河北: [114.4995, 38.1006],
        天津: [117.4219, 39.4189],
        山西: [112.3352, 37.9413],
        陕西: [109.1162, 34.2004],
        甘肃: [103.5901, 36.3043],
        宁夏: [106.3586, 38.1775],
        青海: [101.4038, 36.8207],
        新疆: [87.9236, 43.5883],
        西藏: [91.11, 29.97],
        四川: [103.9526, 30.7617],
        重庆: [108.384366, 30.439702],
        山东: [117.1582, 36.8701],
        河南: [113.4668, 34.6234],
        江苏: [118.8062, 31.9208],
        安徽: [117.29, 32.0581],
        湖北: [114.3896, 30.6628],
        浙江: [119.5313, 29.8773],
        福建: [119.4543, 25.9222],
        江西: [116.0046, 28.6633],
        湖南: [113.0823, 28.2568],
        贵州: [106.6992, 26.7682],
        云南: [102.9199, 25.4663],
        广东: [113.12244, 23.009505],
        广西: [108.479, 23.1152],
        海南: [110.3893, 19.8516],
        上海: [121.4648, 31.2891]
      };
      let voltageLevel = ["王佳", "王云", "王鹏", "阿鲍"];
      let mapData = [
        //时间轴每个人的数据
        [],
        [],
        [],
        []
      ];
      //每人负责省状态，1：已签约，2：重点省，3：开发省，4，无意向
      let provincePersonData = [
        {
          province: "北京",
          name: "阿鲍",
          value: 2
        },
        {
          province: "天津",
          name: "王佳",
          value: 2
        },
        {
          province: "上海",
          name: "王云",
          value: 2
        },
        {
          province: "重庆",
          name: "阿鲍",
          value: 4
        },
        {
          province: "河北",
          name: "阿鲍",
          value: 2
        },
        {
          province: "河南",
          name: "阿鲍",
          value: 4
        },
        {
          province: "云南",
          name: "王云",
          value: 4
        },
        {
          province: "辽宁",
          name: "阿鲍",
          value: 4
        },
        {
          province: "黑龙江",
          name: "王云",
          value: 4
        },
        {
          province: "湖南",
          name: "王鹏",
          value: 2
        },
        {
          province: "安徽",
          name: "王云",
          value: 2
        },
        {
          province: "山东",
          name: "王鹏",
          value: 1
        },
        {
          province: "新疆",
          name: "阿鲍",
          value: 4
        },
        {
          province: "江苏",
          name: "王鹏",
          value: 1
        },
        {
          province: "浙江",
          name: "王云",
          value: 1
        },
        {
          province: "江西",
          name: "王云",
          value: 2
        },
        {
          province: "湖北",
          name: "王云",
          value: 3
        },
        {
          province: "广西",
          name: "王佳",
          value: 2
        },
        {
          province: "甘肃",
          name: "阿鲍",
          value: 2
        },
        {
          province: "山西",
          name: "王鹏",
          value: 3
        },
        {
          province: "内蒙古",
          name: "阿鲍",
          value: 4
        },
        {
          province: "陕西",
          name: "阿鲍",
          value: 2
        },
        {
          province: "吉林",
          name: "王佳",
          value: 1
        },
        {
          province: "福建",
          name: "王佳",
          value: 1
        },
        {
          province: "贵州",
          name: "王佳",
          value: 4
        },
        {
          province: "广东",
          name: "王佳",
          value: 2
        },
        {
          province: "青海",
          name: "阿鲍",
          value: 2
        },
        {
          province: "西藏",
          name: "无",
          value: 4
        },
        {
          province: "四川",
          name: "阿鲍",
          value: 3
        },
        {
          province: "宁夏",
          name: "王佳",
          value: 3
        },
        {
          province: "海南",
          name: "王鹏",
          value: 4
        },
        {
          province: "台湾",
          name: "无",
          value: 4
        },
        {
          province: "香港",
          name: "无",
          value: 4
        },
        {
          province: "澳门",
          name: "无",
          value: 4
        }
      ];
      let areaData = provincePersonData.map(item => {
        // 地图签约情况数据
        let res = {};
        res.name = item.province;
        res.value = item.value;
        return res;
      });
      // console.log(chinaGeoCoordMap)
      for (var key in chinaGeoCoordMap) {
        let obj = util.filterByProperty(provincePersonData, "province", key)
          .length
          ? util.filterByProperty(provincePersonData, "province", key)[0]
          : null;
        let idx = obj ? voltageLevel.indexOf(obj.name) : undefined;
        voltageLevel.forEach((item, index) => {
          if (index === idx) {
            mapData[index].push({
              name: item,
              province: key,
              value: obj.value
            });
          } else {
            mapData[index].push({
              name: item,
              province: key,
              value: 0
            });
          }
        });
      }
      echarts.registerMap("china", china);
      let convertData = function(data) {
        // echarts 各系列数据格式
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let geoCoord = chinaGeoCoordMap[data[i].province];
          if (geoCoord) {
            res.push({
              name: data[i].province,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };
      let optionXyMap01 = {
        baseOption: {
          timeline: {
            axisType: "category",
            autoPlay: true,
            playInterval: 6000,
            left: "12%",
            top: "center",
            width: 80,
            height: "80%",
            data: voltageLevel,
            orient: "vertical",
            label: {
              normal: {
                textStyle: {
                  color: "#fff",
                  fontSize: 20
                }
              },
              emphasis: {
                textStyle: {
                  color: "#fff"
                }
              }
            },
            symbolSize: 14,
            checkpointStyle: {
              borderColor: "#777",
              symbolSize: 16,
              borderWidth: 2
            },
            controlStyle: {
              showNextBtn: true,
              showPrevBtn: true,
              normal: {
                color: "#666",
                borderColor: "#666"
              },
              emphasis: {
                color: "#aaa",
                borderColor: "#aaa"
              }
            }
          },
          animation: true,
          animationDuration: 1000,
          animationEasing: "cubicInOut",
          animationDurationUpdate: 1000,
          animationEasingUpdate: "cubicInOut",
          visualMap: {
            // 图例值控制
            show: true,
            type: "piecewise",
            seriesIndex: 0,
            x: "22%",
            y: "80%",
            textStyle: {
              color: "#fff"
            },
            inverse: true,
            pieces: [
              { value: 1, label: "已签约" },
              { value: 2, label: "重点省" },
              { value: 3, label: "开发省" },
              { value: 4, label: "无意向" }
            ],
            color: colors
          },
          tooltip: {
            trigger: "axis", // hover触发器
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: "rgba(150,150,150,0.1)" //hover颜色
              }
            }
          },
          geo: {
            show: true,
            map: "china",
            roam: false,
            zoom: 1,
            layoutCenter: ["50%", "50%"],
            layoutSize: "120%",
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderColor: "rgba(147, 235, 248, 1)",
                borderWidth: 1,
                areaColor: {
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(147, 235, 248, 0)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(147, 235, 248, .2)" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "rgba(128, 217, 248, 1)",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 120
              },
              emphasis: {
                show: true,
                areaColor: "#389BB7",
                borderWidth: 0
              }
            }
          }
        },
        options: []
      };
      for (var n = 0; n < voltageLevel.length; n++) {
        optionXyMap01.options.push({
          title: [
            {
              // text: "多媒体信息业务签约省",
              left: "center",
              // top: "40px",
              // textStyle: {
              //   color: "#fff",
              //   fontSize: 40,
              //   fontFamily: "思源黑体"
              // },
              subtext: voltageLevel[n] + "负责省份情况",
              subtextStyle: {
                fontSize: 32,
                lineHeight:60
              }
            }
          ],
          series: [
            {
              name: "签约分布",
              type: "map",
              map: "china",
              // geoIndex: 0,
              zoom: 1.152,
              // zlevel: 2,
              left: "center",
              align: "right",
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  borderColor: "#112b3b", // 省市边界线
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowBlur: 100
                },
                emphasis: {
                  areaColor: "#2B91B7",
                  borderColor: "red"
                }
              },
              data: areaData
              // color: colors
            },
            {
              //  name: 'Top 5',
              type: "effectScatter",
              coordinateSystem: "geo",
              // zlevel: 2,
              data: convertData(mapData[n]),
              symbol: "circle",
              symbolSize: function(val) {
                if (val[2] === 0) {
                  return 0.0001;
                } else {
                  return 24;
                }
              }, // 圆环大小
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke"
              },
              // hoverAnimation: true,
              label: {
                normal: {
                  show: true,
                  position: "bottom", // 显示位置
                  offset: [0, 4],
                  color: "#fff",
                  // color:'#fff',
                  formatter: "{b}",
                  fontWeight: "lighter",
                  fontSize: 14
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: "#f00",
                  shadowBlur: 5,
                  shadowColor: "#f00"
                },
                emphasis: {
                  show: true
                }
              }
            }
          ]
        });
      }
      this.signProvinceChart.setOption(optionXyMap01, true);
    },
    randomNum(minNum, maxNum) {
      let res = null;
      switch (arguments.length) {
        case 1:
          res = parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          res = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          res = 0;
          break;
      }
      return res;
    }
  }
};
</script>
<style lang="less">
.business-map-wrapper {
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction:column;
  h3{
    font-size:0.52rem;
    text-align:center;
    font-weight:700;
    padding-top:0.2rem;
    background-image:linear-gradient(top,#f5faf4,#c0cdc6);
    background-clip:text;
    -webkit-text-fill-color: transparent;
  }
  .business-map {
    width: 100%;
    flex-grow:1;
    // height: 100%;
  }
  .business-table {
    position: absolute;
    width: 20%;
    // height:30%;
    top: 56%;
    right: 4%;
    transform: translateY(-50%);
    border-top: 1px solid #78cad8;
    border-left: 1px solid #78cad8;
    text-align: center;
    color: #fff;
    line-height: 0.6rem;
    font-size: 0.14rem;
    .business-table-row {
      height: 0.6rem;
      width: 100%;
      display: flex;
      // justify-content: space-around;
      p {
        border-right: 1px solid #78cad8;
        border-bottom: 1px solid #78cad8;
        span {
          color: #f00;
        }
      }
      p:nth-child(1) {
        width: 14%;
      }
      p:nth-child(2) {
        width: 66%;
      }
      p:nth-child(3) {
        width: 20%;
        color: #ffae4c;
      }
      &.business-table-tit {
        background: #152c78;
        p {
          border-bottom: none;
        }
        p:nth-child(3) {
          color: #fff;
        }
      }
    }
  }
}
</style>