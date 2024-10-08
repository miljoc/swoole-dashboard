<template>
  <el-row
    :gutter="24"
    class="panel-group"
  >
    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div
          class="card-panel"
      >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon
              name="clock-fill"
              class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Uptime
          </div>
          <span class="card-panel-num" v-if="serverStats.start_time > 0"> {{ serverStats.start_time | parseUptime }} </span>
          <span class="card-panel-num" v-else> {{ serverStats.start_time }} </span>
        </div>
      </div>
    </el-col>

    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div
          class="card-panel"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon
              name="connection"
              class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Connections
          </div>
          <span class="card-panel-num"> {{ serverStats.connection_num | amountRule }} </span>
        </div>
      </div>
    </el-col>

    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div
          class="card-panel"
      >
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon
              name="bug"
              class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Abort
          </div>
          <span class="card-panel-num"> {{ serverStats.abort_count | amountRule }} </span>
        </div>
      </div>
    </el-col>

    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon
              name="start-circle-fill"
              class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Accept
          </div>
          <span class="card-panel-num"> {{ serverStats.accept_count | amountRule }} </span>
        </div>
      </div>
    </el-col>

    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div
        class="card-panel"
      >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon
            name="message"
            class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Dispatch
          </div>
          <span class="card-panel-num"> {{ serverStats.dispatch_count | amountRule }} </span>
        </div>
      </div>
    </el-col>

    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div
          class="card-panel"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon
            name="terminal"
            class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Request
          </div>
          <span class="card-panel-num"> {{ serverStats.request_count | amountRule }} </span>
        </div>
      </div>
    </el-col>

    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div
          class="card-panel"
      >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon
              name="guide"
              class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Response
          </div>
          <span class="card-panel-num"> {{ serverStats.response_count | amountRule }} </span>
        </div>
      </div>
    </el-col>

    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="3"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-close">
          <svg-icon
              name="stop-circle-fill"
              class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Close
          </div>
          <span class="card-panel-num"> {{ serverStats.close_count | amountRule }} </span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { amountRule, numberFormat, parseUptime } from '@/utils'
import { IServerStats } from '@/api/types'

@Component({
  name: 'PanelGroup',
  filters: {
    parseUptime: parseUptime,
    numberFormat: numberFormat,
    amountRule: amountRule
  }
})
export default class extends Vue {
  @Prop({ required: true }) private serverStats?: IServerStats

  private handleSetLineChartData(type: string) {
    this.$emit('handle-set-line-chart-data', type)
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
         background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-close {
        background: #ffba00;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-close {
      color: #ffba00;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 18px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
