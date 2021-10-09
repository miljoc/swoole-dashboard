<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="right-menu">
      <div class="right-menu-item version" style="font-size: 14px">
        <span>OS: <b>{{ versionInfo.os }}</b></span>
        <span>Swoole: <b>{{ versionInfo.swoole }}</b></span>
        <span>PHP: <b>{{ versionInfo.php }}</b></span>
        <span>IP: <b>{{ versionInfo.ip }}</b></span>
      </div>

      <lang-select class="right-menu-item hover-effect" />

      <server-action class="right-menu-item hover-effect" />

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="avatar"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <a
            target="_blank"
            href="https://wenda.swoole.com/my-info"
          >
            <el-dropdown-item>
              <svg-icon name="user" /> {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="logout"
            >
              <svg-icon name="logout" /> {{ $t('navbar.logOut') }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import ServerAction from '@/components/ServerActions/index.vue'
import { getVersionInfo } from '@/api/phpinfos'
import { IVersionInfo } from '@/api/types'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect,
    ServerAction
  }
})
export default class extends Vue {
  private versionInfo: IVersionInfo = {
    os: '',
    swoole: '',
    php: '',
    ip: ''
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  get avatar() {
    return UserModule.avatar
  }

  created() {
    this.$nextTick(function() {
      this.getVersion()
    })
  }

  private async getVersion() {
    const { data } = await getVersionInfo()
    this.versionInfo = data
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private async logout() {
    await UserModule.LogOut()
    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .version {
    span {
      margin-right: 20px;
      b {
        color: #46a6ff;
        font-weight: normal;
      }
    }
  }
}
</style>
