class IndexedDB {
  constructor() {
    this.indexedDB = ""
    this.myDB = {
      name: 'cesiumData',
      version: 1,
      db: null
    };
    this.transaction = ""
    this.store = ""
    this.test()
    this.open(this.myDB.name, this.myDB.version)

    // setTimeout(() => {
    //   this.addData(this.myDB.db, 'students');
    //   this.getDataByKey(this.myDB.db, 'students', 1001)

    // }, 2000);
    // setTimeout(() => {
    //   this.closeDB(this.myDB)

    // }, 5000)
    // setTimeout(() => {
    //   this.deleteDB(this.myDB)

    // }, 10000)
  }
  test() {
    this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    if (!this.indexedDB) {
      console.log("你的浏览器不支持IndexedDB");
    } else {
      console.log('支持', this.indexedDB)
    }
  }
  open(name, version) {
    let request = this.indexedDB.open(name, version);
    request.onerror = (e) => {
      console.log(e.currentTarget.error.message);
    };

    request.onsuccess = (e) => {
      this.myDB.db = e.target.result;
      console.log('成功打开DB', this.myDB);

      this.transaction = this.myDB.db.transaction('students', 'readwrite');
      this.store = this.transaction.objectStore('students');
    };

    request.onupgradeneeded = (e) => {
      this.myDB.db = e.target.result;
      if (!this.myDB.db.objectStoreNames.contains('sobjectData')) {
        console.log("我需要创建一个新的存储对象");
        //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
        this.myDB.db.createObjectStore('sobjectData', {
          keyPath: "id",
          autoIncrement: true
        });

        // //指定可以被索引的字段，unique字段是否唯一

        // objectStore.createIndex("name", "name", {
        //   unique: false
        // });

        // objectStore.createIndex("phone", "phone", {
        //   unique: false
        // });

      }
      // if (db.objectStoreNames.contains('students')) {
      //   db.deleteObjectStore('students');
      // }
      console.log('数据库版本更改为： ', this.myDB);
    };
  }

  addData(db, storeName) { //添加数据
    let students = [{
      // id: 1001,
      name: "Byron",
      age: 24
    }, {
      // id: 1002,
      name: "Frank",
      age: 30
    }, {
      // id: 1003,
      name: "Aaron",
      age: 26
    }];


    // for (let p = 0; p < 1000; p++) {
    //   for (let i = 0; i < students.length; i++) {
    //     this.store.add(students[i]);
    //   }
    // }
  }
  getDataByKey(value) { //获取数据
    console.log(this.store)
    let request = this.store.get();
    request.onsuccess = (e) => {
      let student = e.target.result;
      console.log(student);
    };
  }
  updateDataByKey(value) { //更新数据

    var request = this.store.get(value);
    request.onsuccess = function (e) {
      var student = e.target.result;
      student.age = 35;
      store.put(student);
    };
  }

  deleteDataByKey(value) { //根据id删除数据
    this.store.delete(value);
  }

  clearObjectStore() { //清空数据

    this.store.clear();
  }
  closeDB() { //关闭数据库
    this.myDB.db.close();
    console.log(this.myDB)
  }
  deleteDB() { //删除数据库
    this.indexedDB.deleteDatabase(this.myDB.name);
    console.log(this.myDB, this.indexedDB)

  }

}
export default IndexedDB
