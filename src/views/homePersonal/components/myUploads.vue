<template>
  <div :class="ns.b()">
    <template v-if="pageStatus === 1">
      <div :class="[ns.b('top')]">
        <h3>我的产品</h3>
        <el-button type="primary" @click="onSettlement()">产品入驻</el-button>
      </div>
      <el-table :data="mainData" style="width: 810px">
        <el-table-column label="产品名称" prop="name" />
        <el-table-column label="企业名称" prop="enterprise" min-width="120px" />
        <el-table-column label="产品图片" width="110px">
          <template #default="scope">
            <div @click="handleViewImages(scope.row.image)" class="table-image">
              <img class="image" :src="fileUrl + scope.row.image[0]" />
              <div v-if="scope.row.image.length > 1" class="image-marck">
                +{{ scope.row.image.length - 1 }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="name" min-width="90px">
          <template #default="scope">
            <span v-if="scope.row.reviewType.status === 1">审核中</span>
            <span
              style="color: #f75964"
              v-if="scope.row.reviewType.status === 2"
            >
              审核未通过
            </span>
            <span v-if="scope.row.reviewType.status === 3">草稿</span>
            <span v-if="scope.row.reviewType.status === 0">审核通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template #default="scope">
            <div class="button-list">
              <div class="button-item" @click="handelViewAttribute(scope.row)">
                查看属性
              </div>
              <div class="button-line" />
              <div
                class="button-item"
                @click="
                  handelReUpload(scope.row.id, scope.row.reviewType.status)
                "
              >
                重新上传
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="paging.page"
          :page-size="paging.limit"
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <template v-else>
      <div :class="ns.b('details')">
        <div :class="ns.b('header')">
          <div>
            <el-button
              @click="
                handelReUpload(detailsData.id, detailsData.reviewType.status)
              "
              type="primary"
            >
              重新上传
            </el-button>
            <el-button @click="pageStatus = 1"> 返回列表 </el-button>
          </div>
          <div :class="ns.b('product-state')">
            <div
              v-if="detailsData.reviewType.status === 0"
              :class="[
                ns.b('product-state-success'),
                ns.b('product-state-item'),
              ]"
            >
              审核通过
            </div>
            <div
              v-if="detailsData.reviewType.status === 2"
              :class="[ns.b('product-state-error'), ns.b('product-state-item')]"
            >
              未通过原因：{{ detailsData.reviewType.remark }}
            </div>
            <div
              v-if="detailsData.reviewType.status === 1"
              :class="[ns.b('product-state-warn'), ns.b('product-state-item')]"
            >
              审核中
            </div>
          </div>
          <div :class="ns.b('product-info')">
            <div :class="ns.b('product-info-left')">
              <img :src="fileUrl + detailsData.image[0]" alt="" />
            </div>
            <div :class="ns.b('product-info-right')">
              <div :class="ns.b('product-info-title')">
                {{ detailsData.name }}
              </div>
              <div :class="ns.b('product-info-subtitle')">
                {{ detailsData.enterprise }}
              </div>
              <div :class="ns.b('product-info-file')">
                <div :class="ns.b('product-info-file-left')">
                  产品说明书/产品文档：
                </div>
                <div :class="ns.b('product-info-file-right')">
                  <div
                    v-for="item in detailsData.specificationDocumentFile"
                    :key="item.path"
                    :class="ns.b('product-info-file-item')"
                  >
                    {{ item.name }}
                    <span>
                      <a
                        :href="`https://pdf.eesaexpo.com/?file=${fileUrl}${item.path}`"
                        target="_blank"
                      >
                        查看
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-table :data="tableField" style="max-width: 810px; width: 100%">
          <el-table-column label="" fixed="left" prop="label" width="160px" />
          <el-table-column
            v-for="(item, index) in detailsData.models"
            :key="index"
            label=""
            prop="type"
            min-width="310px"
          >
            <template #default="scope">
              <div
                class="input-box"
                v-if="stepField[scope.$index].type !== 'title'"
              >
                <div
                  v-if="
                    stepField[scope.$index].type === 'input' ||
                    (stepField[scope.$index].type === 'select' &&
                      !stepField[scope.$index].multiple)
                  "
                >
                  {{
                    detailsData.models[index][stepField[scope.$index].showProp]
                  }}
                </div>
                <div v-if="stepField[scope.$index].multiple">
                  <span
                    v-for="(option, i) in detailsData.models[index][
                      stepField[scope.$index].showProp
                    ]"
                    :key="option"
                  >
                    {{ option }}
                    <span
                      v-if="
                        i <
                        detailsData.models[index][
                          stepField[scope.$index].showProp
                        ].length -
                          1
                      "
                    >
                      、
                    </span>
                  </span>
                </div>
                <div v-if="stepField[scope.$index].type === 'inputs'">
                  <span
                    v-for="(option, i) in detailsData.models[index][
                      stepField[scope.$index].showProp
                    ]"
                    :key="option"
                  >
                    {{ option }}
                    <span
                      v-if="
                        i <
                        detailsData.models[index][
                          stepField[scope.$index].showProp
                        ].length -
                          1
                      "
                    >
                      -
                    </span>
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <el-image-viewer
      v-if="showBig"
      :onClose="handelViewImgClose"
      :url-list="showBigImgList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import {
  getProductCheckInListApi,
  getProductDetailsApi,
} from "@/api/searchProduct";
import { step3Field } from "@/views/searchProduct/productCheckIn/components/data";

const total = ref(0);
const showBig = ref(false);
const showBigImgList = ref([]);
const stepField = ref<any>(step3Field);
const mainData = ref([]);
const tableField = ref([]);
const pageStatus = ref(1);
const router = useRouter();
const detailsData = ref<any>({});
const ns = useNamespace("MyUploads");
const paging = ref({ limit: 10, page: 1 });
const { fileUrl } = useUserStoreHook().$state;

async function getProductCheckInList() {
  const { datas, resp_code } = await getProductCheckInListApi(paging.value);
  if (resp_code === 0) {
    total.value = datas.totalElements;
    mainData.value = datas.content;
  }
}
// 产品入驻
function onSettlement() {
  router.push("/searchProductProductCheckIn");
}
async function handelViewAttribute(row) {
  const { resp_code, datas } = await getProductDetailsApi({
    id: row.id,
    productType: "INDUSTRY_ENERGY_STORAGE",
  });
  if (resp_code === 0) {
    detailsData.value = datas;
  }
  pageStatus.value = 2;
}
function handelReUpload(id, status) {
  router.push(`/searchProductProductCheckIn?id=${id}&status=${status}`);
}
function handelViewImgClose() {
  showBig.value = false;
}
function handleViewImages(imgs) {
  showBigImgList.value = imgs.map((item) => fileUrl + item);
  showBig.value = true;
}
getProductCheckInList();

onMounted(() => {
  stepField.value.forEach((item) => {
    tableField.value.push({
      label: item.label,
    });
  });
});
// 页数改变
function handleCurrentChange(val: number) {
  paging.value.page = val;
  getProductCheckInList();
}
</script>
<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-MyUploads-top {
  @include flex(center, space-between);
  @include padding(0, 0, 19px, 0);
  border-bottom: 1px solid #dbdce2;
  @include margin(0, 0, 24px, 0);
  h3 {
    line-height: 56px;
  }
}
.es-MyUploads {
  min-height: 495px;

  .es-MyUploads-title {
    @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
  }

  ::v-deep(.el-table) {
    margin-top: 24px;

    .cell {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .table-image {
      width: 80px;
      height: 80px;
      position: relative;
      cursor: pointer;
      @include flex(center, center);
      .image {
        max-width: 80px;
        max-height: 80px;
      }
      .image-marck {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        @include flex(center, center);
        background-color: rgba(0, 0, 0, 0.2);
        font-size: 20px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .button-list {
    width: 100%;
    @include flex(center, flex-start);
    @include font(14px, 400, #244bf1, 22px);

    .button-line {
      height: 16px;
      width: 1px;
      background-color: #dbdce2;
      margin: 0 8px;
    }

    .button-item {
      cursor: pointer;

      &:hover {
        opacity: 0.6;
      }

      &:active {
        color: #0c36f3;
      }
    }
  }

  .es-MyUploads-details {
    .es-MyUploads-header {
      width: 100%;
      .es-MyUploads-product-state {
        margin-top: 24px;

        .es-MyUploads-product-state-item {
          padding: 8px 16px;
          border-radius: 4px;
          @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
        }

        .es-MyUploads-product-state-success {
          color: #666666;
          background-color: #e5faf1;
        }

        .es-MyUploads-product-state-error {
          color: #fe4f5b;
          background-color: #fdeff0;
        }

        .es-MyUploads-product-state-warn {
          color: #666666;
          background-color: #fff3e6;
        }
      }

      .es-MyUploads-product-info {
        margin-top: 16px;
        display: flex;
        .es-MyUploads-product-info-left {
          width: 200px;
          height: 200px;
          border: 1px solid #dbdce2;
          border-radius: 4px;
          @include flex();

          img {
            border-radius: inherit;
            max-width: 200px;
            max-height: 200px;
            object-fit: cover;
          }
        }

        .es-MyUploads-product-info-right {
          flex: 1;
          padding: 16px;
          .es-MyUploads-product-info-title {
            @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
          }
          .es-MyUploads-product-info-subtitle {
            margin-top: 8px;
            @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
          }
          .es-MyUploads-product-info-file {
            margin-top: 8px;
            display: flex;
            .es-MyUploads-product-info-file-left {
              @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
            }
            .es-MyUploads-product-info-file-right {
              @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
              span {
                cursor: pointer;
                color: #244bf1;
                margin-left: 8px;
                user-select: none;
              }
              div {
                margin-bottom: 4px;
                &:last-child {
                  margin-bottom: 0px;
                }
              }
            }
          }
        }
      }
    }

    ::v-deep(.el-table) {
      margin-top: 22px;
      .el-table__header-wrapper {
        height: 0;
      }
      .el-table__cell {
        padding: 0;
        height: auto !important;
        padding: 9px 24px 7px 15px;
      }
      .cell {
        padding: 0;
      }
      .el-table__inner-wrapper:before {
        background-color: #dbdce2;
      }
      td.el-table__cell {
        border-bottom: 1px solid #dbdce2;
        border-left: 1px solid #dbdce2;
        &:last-child {
          border-right: 1px solid #dbdce2;
        }
      }
      tr {
        &:first-child {
          td.el-table__cell {
            border-top: 1px solid #dbdce2;
          }
        }
        &:nth-child(2),
        &:nth-child(6),
        &:nth-child(9) {
          td.el-table__cell {
            border-left: 1px solid transparent;
            &:nth-child(1),
            &:nth-child(2) {
              border-left: 1px solid #dbdce2;
              font-weight: 600;
              color: rgba(0, 0, 0, 0.9);
            }
          }
        }
        &:hover {
          td {
            background: #fff;
          }
        }
      }
      .el-table__row td:nth-of-type(1) {
        background: #f2f3f5;
        text-align: right;
        @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
        border-right: none !important;
      }
    }
  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-MyUploads {
  .pagination {
    padding: 16px;
    @include flex(center, flex-start);
    flex-direction: row-reverse;
  }
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
