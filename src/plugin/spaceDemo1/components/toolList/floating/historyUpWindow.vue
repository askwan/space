<template>
  <div class="historyUpWindow">
    <el-dialog
      class="dialog"
      title="播放历史版本"
      :visible="GlobalData.historyUpWindow"
      @close="closeDialogTV"
    >
      <el-form>
        <el-form-item label="请选择开始-结束时间 :" label-width="180px">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '00:00:00']"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogTV">取 消</el-button>
        <el-button type="primary" @click="openDialogTV">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import GlobalData from "../../../jscript/GlobalData";
import historyDataStroe from '../../../jscript/dataStore/control/HistoryDataStroe'
export default {
  data() {
    return {
      GlobalData,
      timeValue: [new Date(2019, 0,14, 10), new Date(2019, 0, 14, 10, 31)]
    };
  },
  props: {},
  components: {},
  computed: {},
  mounted() {},
  methods: {
    closeDialogTV() {
      GlobalData.historyUpWindow = false;
    },
    openDialogTV() {
      if (this.timeValue && this.timeValue.length == 2) {
        var start = new Date(this.timeValue[0]).getTime();
        var startTime =
          this.TimeShift(start, 1).date + " " + this.TimeShift(start, 1).time;
        var end = new Date(this.timeValue[1]).getTime();
        var endTime =
          this.TimeShift(end, 1).date + " " + this.TimeShift(end, 1).time;
        console.log(startTime, endTime);
        historyDataStroe.loadHistory(startTime, endTime);
        this.$notify({
          title: "成功",
          message: "进入版本历史",
          type: "success"
        });
      }
      this.closeDialogTV();
    },
    TimeShift(timeStamp, select) {
      //时间戳格式转换日期
      if (timeStamp == "") {
        var time = new Date();
      } else {
        var time = new Date(JSON.parse(timeStamp));
      }
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hour = time.getHours();
      var minute = time.getMinutes();
      if (select == 5) {
        return month + "月" + date + "日";
      }
      var second = time.getSeconds(); //+ "   " + hour + ":" + minute + ":" + second
      hour < 10 ? (hour = "0" + hour) : "";
      minute < 10 ? (minute = "0" + minute) : "";
      second < 10 ? (second = "0" + second) : "";
      month < 10 ? (month = "0" + month) : "";
      date < 10 ? (date = "0" + date) : "";

      if (select == 4) {
        return month + "." + date;
      }
      if (select == 3) {
        return {
          date: year + "." + month + "." + date,
          time: hour + ":" + minute + ":" + second
        };
      }
      if (select == 2) {
        return {
          year: year,
          month: month,
          date: date,
          hour: hour,
          minute: minute,
          second: second
        };
      }
      if (select == 1) {
        return {
          date: year + "-" + month + "-" + date,
          time: hour + ":" + minute + ":" + second
        };
      }
      if (select == 0) {
        return {
          date: year + "-" + month + "-" + date,
          time: hour + ":" + minute
        };
      }
      return year + "." + month + "." + date;
    }
  }
};
</script>
<style lang='scss' scoped>
</style>