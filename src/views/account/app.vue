<template>
  <div class="account">
    <h2 style="color: #fff; margin-bottom: 2vw">账户信息</h2>
    <div class="user-info account-item" @click="editDialogVisible = true">
      <div class="user-info-left">
        <img :src="useUserStoreHook().$state.userInfo.avatar_url" alt="" />
        <div>
          <span>{{ useUserStoreHook().$state.userInfo.nickname }}</span
          ><br />
          <p>UID {{ useUserStoreHook().$state.userInfo.uid }}</p>
        </div>
      </div>
      <img class="more-icon" :src="EditIcon" alt="" />
    </div>
    <div class="account-item">
      <p class="account-item-left">电子邮箱</p>
      <p class="account-item-right">
        {{ useUserStoreHook().$state.userInfo.email }}
      </p>
    </div>
    <div class="account-item">
      <p class="account-item-left">密码设定</p>
      <p
        class="account-item-right"
        style="cursor: pointer"
        @click="editPassword()"
      >
        修改密码
      </p>
    </div>
    <div class="account-item">
      <p class="account-item-left">邀请码</p>
      <p class="account-item-right">
        {{ useUserStoreHook().$state.userInfo.invite_code }}
      </p>
    </div>
    <div class="account-item">
      <template v-if="useUserStoreHook().$state.userInfo.shifu_info !== null">
        <p class="account-item-left">师傅信息</p>
        <div class="invite-info" v-if="useUserStoreHook().$state.userInfo.shifu_info !== null">
          <img :src="useUserStoreHook().$state.userInfo.shifu_info.avatar_url" alt="">
          <p>{{ useUserStoreHook().$state.userInfo.shifu_info.nickname }}</p>
        </div>
      </template>
      <template v-else>
        <el-input
          v-model="inviteCode"
          style="width: 30vw; height: 2vw"
          placeholder="请输入邀请码"
          maxlength="6"
        >
        <template #suffix>
          <div class="invite-info" v-if="inviteInfo !== null">
            <img :src="inviteInfo.avatar_url" alt="">
            <p>{{ inviteInfo.nickname }}</p>
          </div>
        </template>
        </el-input>
        <div
          class="account-item-right"
          style="cursor: pointer"
          @click="editCode()"
          v-if="inviteCode !== ''"
        >
          确认
        </div>
      </template>
    </div>
  </div>
  <EditInfo v-if="editDialogVisible" @close="editDialogVisible = false" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import EditIcon from "@/assets/img/edit-icon.webp";
import { useUserStoreHook } from "@/store/modules/user";
import { editUserInfoApi, getInviteCodeApi } from "@/api/index";
import { ElMessage } from "element-plus";
const inviteCode = ref(""); // 邀请码
const editDialogVisible = ref(false);
// 修改邀请码
const editCode = () => {
  editUserInfoApi({ invite_code: inviteCode.value }).then((res) => {
    if (res.code === 200) {
      ElMessage.success("修改成功");
      useUserStoreHook().handleGetUserInfo();
    }
  });
};
// 修改密码
const editPassword = () => {
  useUserStoreHook().openLogin(true, "editPassword");
};
const inviteInfo: Ref<any> = ref(null);
watch(
  () => inviteCode.value,
  async(newVal) => {
    if( newVal.length === 6 ) {
      const { data, code } = await getInviteCodeApi({
        invite_code: newVal,
      });
      if ( code === 200 ){
        inviteInfo.value = data
      }
    }else{
      inviteInfo.value = null;
    }
  },
);
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.account {
  width: 62.5vw;
  padding: 1.25vw;
  border-radius: 1.25vw;
  background-color: #171616;
  margin: 0 auto;
}
.user-info {
  @include flex(center, space-between, nowrap);
  cursor: pointer;
  .user-info-left {
    @include flex(center, flex-start, nowrap);
    img {
      @include widthAndHeight(2.5vw, 2.5vw);
      border-radius: 50%;
      margin-right: 0.625vw;
    }
    span {
      @include font(0.625vw, 400, #ffffff, 1.04167vw);
    }
    div {
      @include font(0.625vw, 400, #6f6d6d, 1.04167vw);
    }
  }
}
.account-item {
  border: 1px solid #3b3939;
  padding: 0.625vw;
  border-radius: 0.625vw;
  margin-bottom: 0.625vw;
  @include flex(center, space-between, nowrap);
  .account-item-left {
    @include font(0.625vw, 400, #6f6d6d, 1.04167vw);
  }
  .account-item-right {
    @include font(0.625vw, 400, #ffffff, 1.04167vw);
  }
}
.invite-info {
  @include flex(center,flex-start, nowrap);
  img {
    @include widthAndHeight(2vw, 2vw);
    border-radius: 50%;
    margin-right: 0.5vw;
  }
  p{
    @include font(0.625vw, 400, #ffffff, 1.04167vw);
  }
}
</style>
