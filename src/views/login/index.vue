<template>
  <div class="logincontainer">
    <el-form
      class="loginForm"
      :model="loginForm"
      ref="loginForm"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <div class="loginLeft">
        <!-- <img src="../../assets/images/bg.png" /> -->
        <el-carousel height="380px">
          <el-carousel-item v-for="item in specImages" :key="item">
            <img :src="item" style="width: 100%; height: 100%;"/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="loginRight">
        <el-form-item>
          <span class="loginTitle">小区物业管理系统</span>
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userType">
          <el-radio-group v-model="loginForm.userType">
            <el-radio :label="0">业主</el-radio>
            <el-radio :label="1">物业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-button type="primary" class="mybtn" @click="onSubmit"
                >登录</el-button
              >
            </el-col>

            <el-col :span="12" :offset="0">
              <el-button class="mybtn">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: "",
      specImages: ["https://scpic.chinaz.net/files/default/imgs/2022-11-02/ef0e4bab22a08494.jpg"
          , "https://scpic.chinaz.net/files/default/imgs/2022-10-16/d34367f413668279.jpg"
          // , "https://scpic.chinaz.net/files/default/imgs/2022-10-06/8105db2afe794e65.jpg"
          // , "https://scpic.chinaz.net/files/default/imgs/2022-09-01/720b9ab754f90f6e.jpg"
          // , "https://scpic.chinaz.net/files/default/imgs/2022-10-21/47fa6f662157326f.jpg"
          ,"https://xdclass-wuye-img.oss-cn-hangzhou.aliyuncs.com/img/2023/01/31/5a1819dcf2a1451ebf8c40801ee0dd16.png"
      ],
      loginForm: {
        username: "", //登录名
        password: "", //密码
        userType: "", //用户类型 0：业主 1：物业
      },
      rules: {
        username: [
          {
            required: true,
            trigger: "change",
            message: "请输入用户名",
          },
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: "请输入密码",
          },
        ],
        userType: [
          {
            required: true,
            trigger: "change",
            message: "请选择用户类型",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$message.success("登录成功！");
              this.$router.push({ path: this.redirect || "/adminIndex" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logincontainer {
  height: 100%;
  width: 100%;
  background: #87ceeb;
  // background: #fff;
  // background-image: url("../../assets/images/login.jpg");
  background-size: 100% 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loginForm {
  height: 380px;
  width: 830px;
  background-color: #fff;
  // padding: 35px 20px;
  border-radius: 10px;
}
.loginTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
  margin-top: 40px;
  margin-left: -30px;
}
.logincontainer ::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
.logincontainer ::v-deep input.el-input__inner {
  width: 270px;
  /* padding-right: 15px; */
  margin-right: 30px;
}
form.el-form.loginForm {
  box-shadow: 0px 1px 10px rgb(0 0 0 / 20%), 0px 0px 50px #ddd;
  // justify-content: center;
}

.loginLeft .el-carousel {
  float: left;
  width: 500px;
  height: 380px;
  background-color: #409eff;
  // border-top-left-radius: 10px;
  // border-bottom-left-radius: 10px;
  border-radius: 10px 0px 0px 10px;
}
.loginRight {
  float: right;
}
.mybtn {
  width: 80%;
}

// .el-carousel__item h3 {
//     color: #475669;
//     font-size: 14px;
//     opacity: 0.75;
//     line-height: 150px;
//     margin: 0;
//   }

//   .loginLeft .el-carousel__item:nth-child(2n) {
//      background-color: #99a9bf;
//   }
  
//   .loginLeft .el-carousel__item:nth-child(2n+1) {
//      background-color: #d3dce6;
//   }
</style>