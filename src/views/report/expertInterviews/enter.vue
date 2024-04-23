<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('title')">专家访谈</div>
    <div :class="ns.b('content')">
      <div :class="ns.be('content', 'records')">
        <div
          v-for="item in interviewRecordsData"
          :key="item.id"
          @click="handleOpenReport(item)"
          :class="ns.be('content', 'records_item')"
        >
          <div :class="ns.be('content', 'records_item-title')">
            <a :href="item.link" target="_blank" onclick="return false;">{{
              item.reportName
            }}</a>
          </div>
          <div :class="ns.be('content', 'records_item-content')">
            <div :class="ns.be('content', 'records_item-content-left')">
              <div
                class="tag-item"
                v-for="(tag, index) in item.reportTag"
                :key="index"
              >
                {{ tag }}
              </div>
            </div>
            <div :class="ns.be('content', 'records_item-content-right')">
              <span v-for="author in item.author" :key="author" class="author">
                {{ author }}
              </span>
              <span v-if="item.author?.length" class="line">|</span>
              <span>{{ item.writingTime }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="paginationTotal > 10" :class="ns.be('content', 'pagination')">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.limit"
          background
          hide-on-single-page
          layout="total, prev, pager, next"
          :total="paginationTotal"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useNamespace from "@/utils/nameSpace";
import { getExpertInterviewList } from "@/api/data";
const router = useRouter();
const paginationTotal = ref<number>(0);
const ns = useNamespace("expertInterviews");
const pagination = ref({ limit: 10, page: 1 });
const interviewRecordsData = ref<Array<any>>([]);
// 分页
function handleCurrentChange(val: number) {
  pagination.value.page = val;
  getExpertInterviews();
}
async function getExpertInterviews() {
  const {
    datas: { total, records },
    resp_code,
  } = await getExpertInterviewList({
    ...pagination.value,
  });
  if (resp_code === 0) {
    paginationTotal.value = total;
    interviewRecordsData.value = records;
  }
}
function handleOpenReport(item: any) {
  router.push(`/reportDetail?id=${item.id}&moduleName=${item.moduleName}`);
}
getExpertInterviews();
</script>
<style lang="scss" scoped>
@import "@/style";

.es-expertInterviews {
  padding: 80px 24px;

  .es-expertInterviews-title {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
  }

  .es-expertInterviews-content {
    .es-expertInterviews-content__records {
      margin-top: 32px;

      .es-expertInterviews-content__records_item {
        cursor: pointer;
        padding-bottom: 15px;
        border-bottom: 1px solid #dbdce2;
        padding-top: 24px;

        &:first-child {
          padding-top: 0;
        }

        &:hover {
          .es-expertInterviews-content__records_item-title {
            a {
              color: #244bf1;
            }
          }
        }

        .es-expertInterviews-content__records_item-title {
          a {
            text-decoration: none;
            @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
          }
        }

        .es-expertInterviews-content__records_item-content {
          margin-top: 8px;
          @include flex(center, space-between, wrap);

          .es-expertInterviews-content__records_item-content-left {
            @include flex(center, flex-start, wrap);

            .tag-item {
              background: #fff3eb;
              border-radius: 4px;
              border: 1px solid #ff892e;
              @include font(12px, 400, #ff892e, 20px);
              @include padding(2px, 8px, 2px, 8px);
              margin-right: 8px;

              &:last-child {
                margin-right: 0;
              }
            }
          }

          .es-expertInterviews-content__records_item-content-right {
            span {
              @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
            }

            .line {
              margin: 0 6px;
            }

            .author {
              margin-left: 4px;

              &:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
    }

    .es-expertInterviews-content__pagination {
      margin-top: 16px;
      height: 64px;
      flex-direction: row-reverse;
      @include flex(center, flex-start, wrap);
    }
  }
}
</style>

<style lang="scss">
@import "@/style";

.es-expertInterviews {
  .el-pagination .el-pagination__total {
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  }

  .el-pagination.is-background .btn-prev:disabled,
  .el-pagination.is-background .btn-next:disabled,
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev {
    background: none !important;
  }

  .el-pagination.is-background .el-pager li {
    background: none;
  }

  .el-pagination.is-background .el-pager li.is-active {
    background: #dee8ff;
    border-radius: 4px;
    color: #244bf1;
  }
}
</style>
