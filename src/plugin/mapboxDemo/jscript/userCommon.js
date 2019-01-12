var userCommon = {};
userCommon.TimeShift = function (timeStamp, select) { //时间戳格式转换日期
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
    hour < 10 ? hour = "0" + hour : '';
    minute < 10 ? minute = "0" + minute : '';
    second < 10 ? second = "0" + second : '';
    month < 10 ? month = "0" + month : '';
    date < 10 ? date = "0" + date : '';
  
    if (select == 4) {
      return month + "." + date;
    }
    if (select == 3) {
      return {
        date: (year + "." + month + "." + date),
        time: (hour + ":" + minute + ":" + second)
      }
    }
    if (select == 2) {
      return {
        "year": year,
        "month": month,
        "date": date,
        "hour": hour,
        "minute": minute,
        "second": second,
      }
    }
    if (select == 1) {
      return {
        date: (year + "-" + month + "-" + date),
        time: (hour + ":" + minute + ":" + second)
      }
    }
    if (select == 0) {
      return {
        date: (year + "-" + month + "-" + date),
        time: (hour + ":" + minute)
      }
    }
    return year + "." + month + "." + date;
  }

  export default userCommon;