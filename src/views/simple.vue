
<style lang="scss" scoped>
.calendarsimple {
  font-size: 16px;
}
.canclder {
  width: 423px;
  // height: 420px;
  border: 1px solid #000;
  font-size: 16px;
  margin: 0 auto;
}
.date {
  display: flex;
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
}
.weekday-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  display: flex;
  flex-wrap: wrap;
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
    border-radius: 50%;
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

    禁用超时<el-switch v-model="isShowOutDate" active-color="#13ce66"
      inactive-color="#ff4949" @change="changeOutDateHandler">
    </el-switch>

    显示相邻月份日期<el-switch v-model="isShowBothDate" active-color="#13ce66"
      inactive-color="#ff4949" @change="changeBothDateHandler">>
    </el-switch>
    <hr />
    <div class="canclder">
      <header class="date">
        <div class="prev-year box" @click="prevYear">上一年</div>
        <div class="prev-month box" @click="prevMonth">上一月</div>
        <div class="date-value">{{year}}年{{month}}月</div>
        <div class="next-year box" @click="nextMonth">下一月</div>
        <div class="next-month box" @click="nextYear">下一年</div>
      </header>
      <div class="weekday">
        <div class="weekday-item" v-for="(item,index) in week" :key="index">{{item}}</div>
      </div>
      <div class="content">
        <div class="item" :class="{'outdate':item.isOutdate || item.isBothDate,'select':item.isSelect}"
          v-for="(item,index) in rows[1]" :key="index" @click="selectDayHandler(item)">{{item.day}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      value1: "",
      date: {},
      firstDayOfWeek: 7,
      week: ["日", "一", "二", "三", "四", "五", "六"],
      rows: [[], [], []],
      year: 0,
      month: 0,
      offset: [], // 首月偏移量
      isShowOutDate: true, // 超时outdate (可扩展变量)
      isShowBothDate: true, // 展示相邻2个月的日期
      options: [
        {
          value: "2018-10-1",
          label: "2018-10-1"
        },
        {
          value: "2018-2-27",
          label: "2018-2-27"
        },
        {
          value: "2020-9-1",
          label: "2020-9-1"
        }
      ],
      value: ""
    };
  },
  computed: {},
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
      this.isShowOutDate = e;
      this._initCalendar(this.year, this.month);
    },
    // 相邻的月份
    changeBothDateHandler(e) {
      this.isShowBothDate = e;
      this._initCalendar(this.year, this.month);
    },
    // 选中某一天
    selectDayHandler(item) {
      if (item.isOutdate || item.isBothDate) {
        return false;
      }
      // 重制所有状态
      this.rows.forEach(item => {
        item.forEach(code => (code.isSelect = false));
      });
      item.isSelect = true;
      console.info("选中日期", item);
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
    prevMonth() {
      if (this.month == 1) {
        this.month = 12;
        this.year = this.year - 1;
      } else {
        this.month--;
      }
      this._initCalendar(this.year, this.month);
    },
    // 下月
    nextMonth() {
      if (this.month == 12) {
        this.month = 1;
        this.year = this.year - 0 + 1;
      } else {
        this.month++;
      }
      this._initCalendar(this.year, this.month);
    },
    // 上年
    prevYear() {
      this.year = this.year - 1;
      this._initCalendar(this.year, this.month);
    },
    // 下年
    nextYear() {
      this.year = this.year - 0 + 1;
      this._initCalendar(this.year, this.month);
    },
    // 偏移量
    offsetDay(year, month) {
      // console.info("偏移量", year, month);
      if (month == -1) {
        year = year - 1;
      } else if (month == 12) {
        year = year + 1;
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
      // console.info("this.month", this.month); //0 对应的是 1 月份
      // console.info(year, month);
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
          month: month + 1 == 13 ? 1 : month + 1,
          year: month + 1 == 13 ? year + 1 : year,
          isOutdate: false, // 是否 过期
          isSelect: false // 是否 选中
        }))
      ];

      // 偏移量
      this.offset = [
        this.offsetDay(year, month - 2),
        this.offsetDay(year, month - 1),
        this.offsetDay(year, month)
      ];
      // console.info("offset", this.offset);

      // 空位补齐
      if (!this.isShowBothDate) {
        this.offset.forEach((item, i) => {
          Array.from(new Array(item), (n, i) => i).forEach((code, jest) => {
            this.rows[i].unshift({});
          });
        });
      } else {
        // 上一个月 填充的变量
        let prevDate = this.rows[0].slice(
          this.offset[1] == 0 ? -7 : this.offset[1] * -1
        );
        prevDate.forEach(item => (item.isBothDate = true));
        // 下一个月 填充的变量 (42个填充，42-当月天数-头部填充数量)
        // 备注： 当当月填充量为0，即为空一行（为7个数量）
        let nextDate = this.rows[2].slice(
          0,
          42 - this.rows[1].length - (this.offset[1] == 0 ? 7 : this.offset[1])
        );
        nextDate.forEach(item => (item.isBothDate = true));
        // console.info("prevDate", prevDate, "nextDate", nextDate);
        this.rows[1] = [...prevDate, ...this.rows[1], ...nextDate];
      }

      // 是否显示过期时间
      if (this.isShowOutDate) {
        this.rows.forEach((item, index) => {
          item.forEach(el => {
            // ios 不会识别 00:00:00 这样的写法 和 日期需要使用的‘/’的连接符
            let date = `${el.year}/${el.month}/${el.day} 23:59:59`;
            if (+new Date(date) > +new Date()) {
              el.isOutdate = false;
            } else {
              el.isOutdate = true;
            }
          });
        });
      } else {
        this.rows.forEach(item => {
          item.forEach(code => (code.isBothDate = false));
          // console.info("item", item);
        });
      }

      // console.info("rows", this.rows);
    }
  },
  mounted() {
    // 初始化当前时间
    this.date = new Date();

    this.year = this.date.getFullYear();
    // this.year = 2019 || this.date.getFullYear();
    this.month = this.date.getMonth() + 1;
    // this.month = 9 || this.date.getMonth() + 1;

    // console.info(333, this.year, this.month);

    this._initCalendar(this.year, this.month);
  }
};
</script>


