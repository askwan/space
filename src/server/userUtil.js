//用户管理
let userMgr = {
    isUser() {
        let user = this.getUser()

        if (user && user.id) {
          return true
        } else {
          // window.OneGis.$message.error('请先登录!')
          return false
        }
      },
      setUserInfo(userEntity) {
        sessionStorage.setItem('userId', userEntity.id)
        sessionStorage.setItem('user', JSON.stringify(userEntity))
      },
      getUser() {
        let userJsonStr = sessionStorage.getItem('user')
        if (userJsonStr) {
          return JSON.parse(userJsonStr)
        }
        return null
      },
      isMyself(userId) {
        return this.getUserId() == userId
      },
      logout() {
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('userId')
      }
}

export default userMgr
