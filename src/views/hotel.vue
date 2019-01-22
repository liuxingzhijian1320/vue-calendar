
<style lang="scss" scoped>
.calendarsimple {
  font-size: 16px;
}
.canclder {
  font-size: 16px;
  margin-top: 50px;
}
.date {
  display: flex;
  width: 850px;
  margin: 0 auto;
}
.date-value {
  flex: 1;
  text-align: center;
}
.box {
  width: 50px;
  font-size: 16px;
  cursor: pointer;
}
.weekday {
  height: 30px;
  background: red;
  display: flex;
  width: 100%;
}
.weekday-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrapper {
  display: flex;
  width: 850px;
  margin: 0 auto;
}
.content {
  display: flex;
  flex-wrap: wrap;
  width: 423px;
  border: 1px solid #000;
}
.item {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.outdate {
    color: #999;
  }
  &.select {
    background: #ff0ff0;
    color: #fff;
    // border-radius: 50%;
  }
}
</style>
<template>
  <div class="calendarsimple">
    <!-- <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
    <br />
    选择某一个月份
    <el-select v-model="value" placeholder="请选择" @change="changeSelect">
      <el-option v-for="item in options" :key="item.value" :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    开始：{{startDate.year}}年{{startDate.month}}月{{startDate.day}}日
    结束：{{endDate.year}}年{{endDate.month}}月{{endDate.day}}日

    <hr />
    <div class="canclder">
      <header class="date">
        <div class="prev-year box" @click="prevYearHandler">上一年</div>
        <div class="prev-month box" @click="prevMonthHandler">上一月</div>
        <div class="date-value">{{year}}年{{month}}月</div>
        <div class="date-value">{{nextYear}}年{{nextMonth}}月</div>
        <div class="next-year box" @click="nextMonthHandler">下一月</div>
        <div class="next-month box" @click="nextYearHandler">下一年</div>
      </header>

      <div class="wrapper">
        <div class="content">
          <div class="weekday">
            <div class="weekday-item" v-for="(item,index) in week" :key="index">{{item}}</div>
          </div>
          <div class="item" :class="{'outdate':item.isOutdate,'select':item.isSelect&&!item.isOutdate}"
            v-for="(item,index) in rows[1]" :key="index" @click="selectDayHandler(item)">{{item.day}}</div>
        </div>
        <div class="content">
          <div class="weekday">
            <div class="weekday-item" v-for="(item,index) in week" :key="index">{{item}}</div>
          </div>
          <div class="item" :class="{'outdate':item.isOutdate,'select':item.isSelect&&!item.isOutdate}"
            v-for="(item,index) in rows[2]" :key="index" @click="selectDayHandler(item)">{{item.day}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hotel",
  data() {
    return {
      value1: "",
      date: {},
      firstDayOfWeek: 7,
      week: ["日", "一", "二", "三", "四", "五", "六"],
      rows: [[], [], [], []],
      year: 0,
      month: 0,
      offset: [], // 偏移量
      startDate: "", // 起止的日期
      endDate: "", // 起止的日期
      count: 0,
      leftDate: [],
      rightDate: [],
      options: [
        {
          value: "2018-10-1",
          label: "2018-10-1"
        },
        {
          value: "2019-2-27",
          label: "2019-2-27"
        },
        {
          value: "2020-9-1",
          label: "2020-9-1"
        },
        {
          value: "2022-1-1",
          label: "2022-1-1"
        }
      ],
      value: ""
    };
  },
  computed: {
    nextYear() {
      var year = this.year;
      if (this.month == 12) {
        return year - 0 + 1;
      } else {
        return year;
      }
    },
    nextMonth() {
      if (this.month == 12) {
        return 1;
      } else {
        return this.month - 0 + 1;
      }
    },
    prevYear() {
      var year = this.year;
      if (this.month == 1) {
        return year - 1;
      } else {
        return year;
      }
    },
    prevMonth() {
      if (this.month == 1) {
        return 12;
      } else {
        return this.month - 1;
      }
    }
  },

  methods: {
    // 快速定位某一个月份
    changeSelect(val) {
      console.info("val", val);
      this.year = val.split("-")[0];
      this.month = val.split("-")[1];
      this._initCalendar(this.year, this.month);
    },
    // 超时
    changeOutDateHandler(e) {
      this._initCalendar(this.year, this.month);
    },

    // 选中某一天
    selectDayHandler(item) {
      item.isSelect = true;
      // 计数法
      if (item.isOutdate) {
        return false;
      } else if (this.count == 0) {
        this.startDate = item;
        this.count = this.count + 1;
      } else if (this.count == 1) {
        this.count = this.count + 1;
        this.endDate = item;

        // 进行换位操作
        if (
          +new Date(
            `${this.startDate.year}/${this.startDate.month}/${
              this.startDate.day
            } 23:59:59`
          ) >
          +new Date(
            `${this.endDate.year}/${this.endDate.month}/${
              this.endDate.day
            } 23:59:59`
          )
        ) {
          let temp = this.endDate;
          this.endDate = this.startDate;
          this.startDate = temp;
          console.info("反向操作");
        }

        // 进行转化，用户的先选和后选 不确定起止顺序
        var firstDate = `${this.startDate.year}/${this.startDate.month}/${
          this.startDate.day
        } 23:59:59`;
        var lastDate = `${this.endDate.year}/${this.endDate.month}/${
          this.endDate.day
        } 23:59:59`;

        this.rows.forEach(item => {
          item.forEach(el => {
            let date = `${el.year}/${el.month}/${el.day} 23:59:59`;
            // 取时间差
            if (
              +new Date(firstDate) <= +new Date(date) &&
              +new Date(date) <= +new Date(lastDate)
            ) {
              el.isSelect = true;
            }
          });
        });
      } else if (this.count == 2) {
        this.rows.forEach(item => {
          item.forEach(el => {
            el.isSelect = false;
          });
        });

        this.startDate = item;
        this.endDate = "";
        this.count = 1;
        item.isSelect = true;
      }
      console.info("this.count", this.count);
    },
    // 每个月多少天
    getDayCountOfMonth(year, month) {
      if (month == -1) {
        year = year - 1;
      } else if (month == -11) {
        year = year + 1;
      }

      if (month === 3 || month === 5 || month === 8 || month === 10) {
        return 30;
      }

      if (month === 1) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return 29;
        } else {
          return 28;
        }
      }

      return 31;
    },
    // 上月
    prevMonthHandler() {
      if (this.month == 1) {
        this.month = 12;
        this.year = this.year - 1;
      } else {
        this.month = this.month - 1;
      }
      this._initCalendar(this.year, this.month);
    },
    // 下月
    nextMonthHandler() {
      if (this.month == 12) {
        this.month = 1;
        this.year = this.year - 0 + 1;
      } else {
        this.month = this.month - 0 + 1;
      }
      this._initCalendar(this.year, this.month);
    },
    // 上年
    prevYearHandler() {
      this.year = this.year - 1;
      this._initCalendar(this.year, this.month);
    },
    // 下年
    nextYearHandler() {
      this.year = this.year - 0 + 1;
      this._initCalendar(this.year, this.month);
    },
    // 偏移量
    offsetDay(year, month) {
      // console.info("偏移量", year, month);
      if (month == -1) {
        year = year - 1;
      } else if (month == 12) {
        year = year - 0 + 1;
      }
      return this.getFirstDayOfMonth(new Date(year, month, 1));
    },
    // 获取当月的1号 在周几
    getFirstDayOfMonth(date) {
      const temp = new Date(date.getTime());
      temp.setDate(1);
      return temp.getDay();
    },
    // 计算当前月的时间
    _initCalendar(year, month) {
      // 相邻三个月天数
      this.rows = [
        Array.from(
          new Array(this.getDayCountOfMonth(year, month - 2)),
          (n, i) => ({
            day: i + 1,
            month: month - 1 == 0 ? 12 : month,
            year: month - 1 == 0 ? year - 1 : year,
            isOutdate: false, // 是否 过期
            isSelect: false // 是否 选中
          })
        ),

        Array.from(
          new Array(this.getDayCountOfMonth(year, month - 1)),
          (n, i) => ({
            day: i + 1,
            month: month,
            year: year,
            isOutdate: false, // 是否 过期
            isSelect: false // 是否 选中
          })
        ),

        Array.from(new Array(this.getDayCountOfMonth(year, month)), (n, i) => ({
          day: i + 1,
          month: month - 0 + 1 == 13 ? 1 : month - 0 + 1,
          year: month - 0 + 1 == 13 ? year - 0 + 1 : year,
          isOutdate: false, // 是否 过期
          isSelect: false // 是否 选中
        })),

        Array.from(
          new Array(this.getDayCountOfMonth(year, month - 0 + 1)),
          (n, i) => ({
            day: i + 1,
            month: month - 0 + 2 == 13 ? 1 : month - 0 + 2,
            year: month - 0 + 2 == 13 ? year - 0 + 1 : year,
            isOutdate: false, // 是否 过期
            isSelect: false // 是否 选中
          })
        )
      ];

      let copyDate = [...this.rows];
      // console.info("copyDate", copyDate);

      //月份 偏移量
      this.offset = [
        this.offsetDay(year, month - 2),
        this.offsetDay(year, month - 1),
        this.offsetDay(year, month),
        this.offsetDay(year, month + 1)
      ];
      // console.info("offset", this.offset);

      // 空位补齐

      // 上一个月 填充的变量
      // 备注： 当当月填充量为0，即为空一行（为7个数量）
      let prevDate = copyDate[0].slice(
        this.offset[1] == 0 ? -7 : this.offset[1] * -1
      );
      // console.info("prevDate", prevDate);
      prevDate = prevDate.map(el => {
        return {
          ...el,
          // 上一个月
          isOutdate: true,
          month: this.prevMonth,
          year: this.prevYear
        };
      });
      // console.info("prevDate", prevDate);

      // 下一个月 填充的变量 (42个填充，42-当月天数-头部填充数量)
      let nextDate = copyDate[2].slice(
        0,
        42 - copyDate[1].length - (this.offset[1] == 0 ? 7 : this.offset[1])
      );
      // console.info("nextDate", nextDate);
      nextDate = nextDate.map(el => {
        return {
          ...el,
          // 下一个月
          isOutdate: true,
          month: this.nextMonth,
          year: this.nextYear
        };
      });
      // console.info("nextDate", nextDate);

      this.rows[1] = [...prevDate, ...copyDate[1], ...nextDate];

      // 下一个月 填充的变量
      // 备注： 当当月填充量为0，即为空一行（为7个数量）
      let prevDate2 = copyDate[1].slice(
        this.offset[2] == 0 ? -7 : this.offset[2] * -1
      );
      prevDate2 = prevDate2.map(el => {
        return {
          ...el,
          // 本月
          isOutdate: true,
          month: this.month,
          year: this.year
        };
      });
      // console.info("prevDate2", prevDate2);

      // 下一个月 填充的变量 (42个填充，42-当月天数-头部填充数量)
      let nextDate2 = copyDate[3].slice(
        0,
        42 - copyDate[2].length - (this.offset[2] == 0 ? 7 : this.offset[2])
      );
      nextDate2 = nextDate2.map(el => {
        return {
          ...el,
          // 下2个月
          isOutdate: true,
          month: this.nextMonth - 0 + 1 == 13 ? 1 : this.nextMonth - 0 + 1,
          year:
            this.nextYear - 0 + 1 == 13 ? this.nextYear - 0 + 1 : this.nextYear
        };
      });
      // console.info("nextDate2", nextDate2);
      this.rows[2] = [...prevDate2, ...copyDate[2], ...nextDate2];
      this.isOutdateHandler();
    },
    isOutdateHandler() {
      // 是否显示过期时间

      this.rows.forEach((item, index) => {
        // console.info(item);
        item.forEach((el, elindex) => {
          // ios 不会识别 00:00:00 这样的写法 和 日期需要使用的‘/’的连接符
          let date = `${el.year}/${el.month}/${el.day} 23:59:59`;

          if (+new Date(date) > +new Date()) {
            if (item[15].month == el.month) {
              // console.info("当月", date, el.isOutdate);
              el.isOutdate = false;
            } else {
              el.isOutdate = true;
              // console.info("兄弟月", date, el.isOutdate);
            }
          } else {
            // console.info("上一跃", date, el.isOutdate);
            el.isOutdate = true;
          }
        });
      });

      // console.info("rows[1]", this.rows);
    }
  },
  mounted() {
    // 初始化当前时间
    this.date = new Date();

    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;
    // console.info(333, this.year, this.month);

    this._initCalendar(this.year, this.month);
  }
};
</script>


