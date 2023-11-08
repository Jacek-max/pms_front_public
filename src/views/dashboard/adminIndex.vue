<template>
  <el-main style="background: #f0f0f4">
    <el-row class="home">
      <!-- 管理员 -->
      <el-col :span="24" :gutter="12" v-if="hasPerm('sys:adminIndex:user')">
        <div class="header">
          <el-card
            shadow="hover"
            style="background: #9bc53b; height: 140px"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i class="icon" :class="'el-icon-user'"></i>
            <div class="detail">
              <p class="num">{{ liveUser.number }}</p>
              <p class="text">{{ liveUser.title }}</p>
            </div>
          </el-card>
          <el-card
            shadow="hover"
            style="background: #55a6e8; height: 140px"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i class="icon" :class="'el-icon-bell'"></i>
            <div class="detail">
              <p class="num">{{ notice.number }}</p>
              <p class="text">{{ notice.title }}</p>
            </div>
          </el-card>
          <el-card
            shadow="hover"
            style="background: #9db0ff; height: 140px"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i class="icon" :class="'el-icon-notebook-2'"></i>
            <div class="detail">
              <p class="num">{{ complaint.number }}</p>
              <p class="text">{{ complaint.title }}</p>
            </div>
          </el-card>
          <el-card
            shadow="hover"
            style="background: #3ed4af; height: 140px"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i class="icon" :class="'el-icon-printer'"></i>
            <div class="detail">
              <p class="num">{{ repair.number }}</p>
              <p class="text">{{ repair.title }}</p>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="24" :gutter="20" v-if="hasPerm('sys:adminIndex:notice')">
        <div class="footer">
          <el-card shadow="hover">
            <div class="cardHead">
              <span>物业公告</span>
            </div>
            <div class="cardBody">
              <el-table :data="noticeList" :show-header="false">
                <el-table-column :width="60">
                  <el-tag type="" size="small" effect="dark">公告</el-tag>
                </el-table-column>
                <el-table-column prop="noticeContent">
                  <!-- -->
                </el-table-column>
              </el-table>
            </div>
          </el-card>

          <el-card shadow="hover">
            <div class="cardHead">
              <span>房屋统计</span>
            </div>
            <div class="cardBodyTotal">
              <el-progress
                type="circle"
                :percentage="this.houseUsage.houseUsage"
                :width="180"
                :show-text="false"
              ></el-progress>

              <div class="circleCenter">
                <p class="centerTitel">使用率</p>
                <p class="centerNum">{{ houseUsage.houseUsage }}%</p>
              </div>
            </div>
            <div class="cardFooter">
              <div class="card-left">
                <p class="ftotal">{{ houseUsage.houseFree }}</p>
                <p class="fname">闲置</p>
              </div>
              <div class="card-right">
                <p class="ftotal">{{ houseUsage.houseCount }}</p>
                <p class="fname">总数</p>
              </div>
            </div>
          </el-card>

          <el-card shadow="hover">
            <div class="cardHead">
              <span>车位统计</span>
            </div>
            <div class="cardBodyTotal">
              <el-progress
                type="circle"
                :percentage="this.parkUsage.parkUsage"
                :width="180"
                :show-text="false"
              ></el-progress>

              <div class="circleCenter">
                <p class="centerTitel">使用率</p>
                <p class="centerNum">{{ parkUsage.parkUsage }}%</p>
              </div>
            </div>
            <div class="cardFooter">
              <div class="card-left">
                <p class="ftotal">{{ parkUsage.parkFree }}</p>
                <p class="fname">闲置</p>
              </div>
              <div class="card-right">
                <p class="ftotal">{{ parkUsage.parkCount }}</p>
                <p class="fname">总数</p>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <!-- 用户面板 -->
      <el-col :span="24" :gutter="12" v-if="hasPerm('sys:adminIndex:userDate')">
        <div class="userHeader">
          <el-card
            shadow="hover"
            style="background: #67c23a; height: 140px"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i class="icon" :class="'el-icon-user'"></i>
            <div class="detail">
              <p class="num">{{ name }}</p>
              <p class="text">{{ user.title }}</p>
            </div>
          </el-card>
          <el-card
            shadow="hover"
            style="background: #e6a23c; height: 140px"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i class="icon" :class="'el-icon-document-delete'"></i>
            <div class="detail">
              <p class="num">{{ myComplaint.number }}</p>
              <p class="text">{{ myComplaint.title }}</p>
            </div>
          </el-card>
          <el-card
            shadow="hover"
            style="background: #f56c6c; height: 140px"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i class="icon" :class="'el-icon-magic-stick'"></i>
            <div class="detail">
              <p class="num">{{ myRepair.number }}</p>
              <p class="text">{{ myRepair.title }}</p>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="24" :gutter="20"  v-if="hasPerm('sys:adminIndex:userLook')">
        <div class="userfooter">
             <el-card shadow="hover">
            <div class="cardHead">
              <span>物业公告</span>
            </div>
            <div class="cardBody">
              <el-table :data="noticeList" :show-header="false">
                <el-table-column :width="60">
                  <el-tag type="" size="small" effect="dark">公告</el-tag>
                </el-table-column>
                <el-table-column prop="noticeContent">
                  <!-- -->
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import {getListApi} from "@/api/liveUser";
import {getNoticeApi, getTopApi} from "@/api/notice";
import {
  getHouseCountApi,
  getMyComplaintNoApi,
  getMyRepairNoApi,
  getParkCountApi,
  getWaitingComplaintApi,
  getWaitingRepairApi
} from "@/api/adminIndex";
import {mapGetters} from "vuex";
import {getUserId} from "@/utils/auth";

export default {
  //用户部分
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },

  data() {
    return {
      noticeList: [],

      //房屋数据表
      houseUsage: {
        houseCount: 0,
        houseFree: 0,
        houseUsage: 0,
      },

      //车位数据表
      parkUsage: {
        parkCount: 0,
        parkFree: 0,
        parkUsage: 0,
      },

      liveUser: {
        title: "业主",
        number: "0",
      },
      notice: {
        title: "公告",
        number: "0",
      },
      complaint: {
        title: "投诉待处理",
        number: "0",
      },
      repair: {
        title: "维修待处理",
        number: "0",
      },

      parms: {
        currentPage: 1,
        pageSize: 10,
      },

      noticeParms: {
        currentPage: 1,
        pageSize: 10,
        title: "",
        total: 0,
      },

      //用户部分
      //数据部分
      myComplaintParm: {
        currentPage: 1,
        pageSize: 10,
        title: "",
        complaintContent: "",
        total: 0,
        userId: getUserId(),
      },
      myRepairParms: {
        currentPage: 1,
        pageSize: 10,
        userId: getUserId(),
        repairContent: "",
        total: 0,
      },
      //显示部分
      user: {
        title: "当前登录用户",
        number:'null'
      },

      myComplaint: {
        title: "未处理投诉",
        number: "0",
      },

      myRepair: {
        title: "未处理报修",
        number: "0",
      },
    };
  },

  created() {
    this.getLiveUserTotal();
    this.getNoticeTotal();
    this.getComplaint();
    this.getHouseCount();
    this.getParkCount();
    this.getRepair();
    this.getTop();
    //用户部分
    this.getMyComplaintList();
    this.getMyRepair();
  },

  methods: {
    async getLiveUserTotal() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        this.liveUser.number = res.data.total;
      }
    },

    async getNoticeTotal() {
      let res = await getNoticeApi(this.noticeParms);
      if (res && res.code == 200) {
        this.notice.number = res.data.total;
        // this.noticeList = res.data.records;
      }
    },

    async getComplaint() {
      let res = await getWaitingComplaintApi();
      if (res && res.code == 200) {
        this.complaint.number = res.data;
      }
    },

    async getRepair() {
      let res = await getWaitingRepairApi();
      if (res && res.code == 200) {
        this.repair.number = res.data;
      }
    },

    async getHouseCount() {
      let res = await getHouseCountApi();
      if (res && res.code == 200) {
        this.houseUsage.houseCount = res.data.houseCount;
        this.houseUsage.houseFree = res.data.houseFree;
        this.houseUsage.houseUsage = res.data.houseUsage;
      }
    },

    async getParkCount() {
      let res = await getParkCountApi();
      if (res && res.code == 200) {
        this.parkUsage.parkCount = res.data.parkCount;
        this.parkUsage.parkFree = res.data.parkFree;
        this.parkUsage.parkUsage = res.data.parkUsage;
      }
    },

    async getTop(){
      let res = await getTopApi();
      if(res && res.code == 200){
        this.noticeList = res.data;
      }
    },

    //用户部分
    async getMyComplaintList() {
      let res = await getMyComplaintNoApi(this.myComplaintParm);
      console.log(res);
      if (res && res.code == 200) {
        this.myComplaint.number = res.data;
      }
    },

    async getMyRepair() {
      let res = await getMyRepairNoApi(this.myRepairParms);
      if (res && res.code == 200) {
        this.myRepair.number = res.data;
      }
    },
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.header .el-card {
  width: 24%;
  border-radius: 20px;
}
.detail {
  margin-left: auto;
  margin-top: 25px;
  text-align: right;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}
.detail .num {
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  margin: 0px;
}
.detail .text {
  font-size: 20px;
  color: #fff;
  margin-top: 5px;
}
.icon {
  font-size: 80px;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  margin-top: 25px;
  margin-left: 20px;
  color: #fff;
}
.footer {
  display: flex;
  justify-content: space-between;
}
.cardHead {
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.cardBodyTotal {
  position: relative;
  text-align: center;
  width: auto;
  height: auto;
  margin-bottom: 10px;
}
.circleCenter {
  width: auto;
  align-content: center;
  margin-top: -115px;
  padding-bottom: 75px;
}
.circleCenter .centerTitel {
  margin: 0;
}
.circleCenter .centerNum {
  color: #1e90ff;
  font-size: 25px;
  font-weight: bold;
  margin: 0;
}
.el-progress-circle {
  margin-top: 10px;
}
.cardFooter {
  display: flex;
}
.card-left {
  flex: 1;
  height: auto;
  align-content: center;
  line-height: auto;
}
.card-left .ftotal {
  font-size: 30px;
  color: #1e90ff;
  text-align: center;
  margin: 0;
  margin-bottom: 10px;
}
.card-left .fname {
  margin: 0;
  font-size: 20px;
  text-align: center;
}
.card-right {
  flex: 1;
}
.card-right .ftotal {
  font-size: 30px;
  color: #1e90ff;
  text-align: center;
  margin: 0;
  margin-bottom: 10px;
}
.card-right .fname {
  margin: 0;
  font-size: 20px;
  text-align: center;
}
.footer .el-card {
  width: 32.5%;
  height: 370px;
  border-radius: 20px;
}

/* 用户部分 */

.userHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.userHeader .el-card {
  width: 32.5%;
  border-radius: 20px;
}
/* .userfooter{
  display: flex;
  justify-content: space-between;
} */
.userfooter .el-card{
  /* width: 49.4%; */
  height: 370px;
  border-radius: 20px;
}
</style>
