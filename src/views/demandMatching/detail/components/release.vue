<template>
  <div :class="[ns.b()]">
    <h5>评论</h5>
    <span :class="ns.b('comment_desc')">共 158 条评论</span>
    <div :class="ns.b('comment_content')">
      <Select
        type="input"
        specialType="textarea"
        :defaultValue="commentContent"
        :showWordLimit="false"
        :rows="4"
        @onChange="
          (val) => {
            return (commentContent = val);
          }
        "
      />
      <el-button
        @click="
          onRelease({
            baseEntityType: 'NEED_COMMENT',
            entityId: route.query.id,
            entityType: 'NEED_COMMENT',
            entityUserId: userId,
          });
          commentContent = '';
          delayData();
        "
        type="primary"
        >发布</el-button
      >
    </div>
    <template v-if="!loading">
      <template v-if="!commentList.length">
        <div :class="ns.b('empty')">
          <img :src="MessageCenterEmpty" alt="" />
          <h3>暂无评论</h3>
        </div>
      </template>
      <template v-if="commentList.length">
        <div
          :class="ns.b('comment_list')"
          v-for="item in commentList"
          :key="item.id"
        >
          <div :class="ns.b('comment_item')">
            <img :src="AvatarIcon" alt="" />
            <div>
              <h5>{{ item.user.realName }}</h5>
              <p>{{ item.createTime }}</p>
            </div>
          </div>
          <h5 :class="ns.be('comment_item', 'content')">{{ item.content }}</h5>
          <div :class="ns.be('comment_item', 'option')">
            <p
              :class="ns.be('comment_item', 'reply')"
              @click="item.reply = !item.reply"
            >
              回复
            </p>
            <p>删除</p>
          </div>
          <template v-if="item.reply">
            <div :class="ns.b('reply')">
              <Select
                type="input"
                :defaultValue="replyContent"
                :placeholder="'回复 ' + item.user.realName + '：'"
                @onChange="
                  (val) => {
                    return (replyContent = val);
                  }
                "
              />
              <div :class="ns.be('reply', 'option')">
                <el-button
                  @click="
                    item.reply = false;
                    replyContent = '';
                  "
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  @click="
                    onRelease({
                      baseEntityType: 'NEED_COMMENT',
                      entityId: item.id,
                      entityType: 'REPLY_COMMENT',
                      content: replyContent,
                      entityUserId: item.user.id,
                    });
                    item.reply = false;
                    replyContent = '';
                    delayData();
                  "
                  >发布</el-button
                >
              </div>
            </div>
          </template>
          <div v-for="_item in item.subComments" :key="_item.id">
            <div :class="ns.b('comment_children')">
              <img :src="AvatarIcon" alt="" />
              <h5>
                {{ _item.user.realName
                }}{{ _item.parentId !== item.id ? getReply(_item, item) : "" }}
              </h5>
              <p>{{ _item.content }}</p>
            </div>
            <div :class="ns.be('comment_children', 'option')">
              <p>{{ _item.createTime }}</p>
              <p
                :class="ns.be('comment_children', 'reply')"
                @click="_item.reply = !_item.reply"
              >
                回复
              </p>
            </div>
            <template v-if="_item.reply">
              <div :class="ns.b('reply')">
                <Select
                  type="input"
                  :defaultValue="replyContent"
                  :placeholder="'回复 ' + _item.user.realName + '：'"
                  @onChange="
                    (val) => {
                      return (replyContent = val);
                    }
                  "
                />
                <div :class="ns.be('reply', 'option')">
                  <el-button
                    @click="
                      _item.reply = false;
                      replyContent = '';
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="
                      onRelease({
                        baseEntityType: 'NEED_COMMENT',
                        entityId: _item.id,
                        entityType: 'REPLY_COMMENT',
                        content: replyContent,
                        entityUserId: _item.user.id,
                      });
                      _item.reply = false;
                      replyContent = '';
                      delayData();
                    "
                    >发布</el-button
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { publishCommentApi, getCommentListApi } from "@/api/demandMatching";
import { useRoute } from "vue-router";
import AvatarIcon from "@/assets/img/common/avatar-icon.png";
import useNamespace from "@/utils/nameSpace";
import MessageCenterEmpty from "@/assets/img/common/message-center-empty.png";
const route = useRoute();
const ns = useNamespace("demandMatchingRelease");
const commentContent: Ref<string> = ref(""); // 评论内容
const replyContent: Ref<string> = ref(""); // 回复内容
const commentList: Ref<any> = ref([]); // 评论列表
const loading: Ref<boolean> = ref(false); // 加载中
defineProps({
  userId: {
    type: Number,
    default: 0,
  },
});
// 发布评论
const onRelease = async (data: any) => {
  const _data = {
    baseEntityId: route.query.id,
    baseEntityType: "",
    content: commentContent.value,
    entityId: route.query.id,
    entityType: "NEED_COMMENT",
  };
  await publishCommentApi(Object.assign(_data, data));
};
// 获取评论回复
const getReply = (_data: any, data: any) => {
  let _text = "";
  console.log(data.subComments);
  data.subComments.forEach((subItem: any) => {
    if (subItem.id === _data.parentId) {
      _text = subItem.user.realName;
    }
  });
  return ` 回复 ${_text}：`;
};
const delayData = () => {
  setTimeout(() => {
    getCommentList();
  }, 700);
};
// 获取评论列表
const getCommentList = async () => {
  loading.value = true;
  const { resp_code, datas } = await getCommentListApi({
    entityId: route.query.id,
    entityType: "NEED_COMMENT",
    page: 1,
    limit: 100,
  });
  if (resp_code === 0) {
    loading.value = false;
    commentList.value = datas.records;
    commentList.value.forEach((item) => {
      item.reply = false;
      item.subComments.forEach((subItem) => {
        subItem.reply = false;
      });
    });
  }
};
getCommentList();
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatchingRelease {
  margin-top: 16px;
  h5 {
    line-height: 24px;
    margin-bottom: 4px;
  }
  &-comment_desc {
    @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
  }
  &-comment_content {
    @include relative();
    .el-button {
      @include absolute(1, none, 16px, 16px, none);
    }
  }
  &-comment_list {
    margin-top: 24px;
  }
  .select {
    width: 100% !important;
    height: 160px !important;
  }
  .select__input {
    width: 100% !important;
    height: 160px !important;
    background-color: #f6f8fa !important;
  }
  .el-textarea__inner {
    box-shadow: none;
    padding: 16px;
    padding-bottom: 0;
  }
  .el-textarea__inner {
    background-color: #f6f8fa;
    &:focus {
      box-shadow: none !important;
    }
  }
}
.es-demandMatchingRelease-empty {
  text-align: center;
  margin-top: 40px;
  img {
    @include widthAndHeight(120px, 120px);
  }
}
.es-demandMatchingRelease-reply {
  padding-left: 40px;
  .select {
    height: 40px !important;
  }
  .select__input {
    height: 40px !important;
  }
  .el-input__wrapper {
    height: 40px;
  }
  .el-input__inner {
    height: 40px;
  }
}
.es-demandMatchingRelease-reply__option {
  @include flex(center, flex-end, nowrap);
  margin: 8px 0 16px;
}
.es-demandMatchingRelease-comment_item {
  @include flex(center, flex-start, nowrap);
  img {
    @include widthAndHeight(32px, 32px);
    margin-right: 8px;
  }
  div {
    width: 100%;
    h5 {
      @include font(14px, 600, rgba(0, 0, 0, 0.9), 14px);
      margin-bottom: 0;
    }
    p {
      @include font(12px, 400, rgba(0, 0, 0, 0.4), 20px);
    }
  }
}
.es-demandMatchingRelease-comment_item__content {
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  margin: 8px 0 10px 40px;
}
.es-demandMatchingRelease-comment_item__option {
  @include flex(flex-start, flex-start, nowrap);
  margin-left: 40px;
  p {
    @include font(12px, 400, rgba(0, 0, 0, 0.4), 20px);
    margin: 8px 16px 24px 0;
    cursor: pointer;
  }
}
.es-demandMatchingRelease-comment_item__reply {
  cursor: pointer;
}
.es-demandMatchingRelease-comment_children {
  @include flex(center, flex-start, nowrap);
  padding-left: 40px;
  height: 24px;
  img {
    @include widthAndHeight(24px, 24px);
    margin-right: 8px;
  }
  h5 {
    @include font(14px, 600, rgba(0, 0, 0, 0.9), 14px);
    margin: 0 16px 0 0;
  }
  p {
    @include font(12px, 400, rgba(0, 0, 0, 0.4), 12px);
  }
}
.es-demandMatchingRelease-comment_children__option {
  padding-left: 40px;
  @include flex(center, flex-start, nowrap);
  margin: 4px 0 24px;
  p {
    @include font(12px, 400, rgba(0, 0, 0, 0.4), 20px);
    margin-right: 16px;
    cursor: pointer;
  }
}
</style>
