export default {
  route: {
    'Swoole Dashboard': '首页',
    'Worker Stats': '进程状态',
    ZendVM: 'ZendVM',
    Composer: 'Composer',
    Extensions: '扩展',
    'Extension Detail': '扩展详情',
    'Included Files': '已加载文件',
    'Included Files Content': '文件内容',
    'GC Status': '垃圾回收状态',
    Classes: '类',
    'Class Info': '类详情',
    Functions: '函数',
    'Function Content': '函数详情',
    Resources: '资源',
    Constants: '常量',
    Interfaces: '接口',
    Objects: '对象',
    'Object Var Dump': '对象信息',
    Swoole: 'Swoole',
    Processes: '进程',
    'Worker Detail': '进程详情',
    Coroutines: '协程',
    Connections: '连接',
    'Connection Info': '连接信息',
    'Network Traffic': '网络传输信息',
    'Socket Info': 'Socket详情',
    Events: '事件',
    Timers: '定时器',
    Globals: '全局变量',

    dashboard: '首页',
    documentation: '文档',
    guide: '引导页',
    permission: '权限测试页',
    rolePermission: '角色权限',
    pagePermission: '页面权限',
    directivePermission: '指令权限',
    icons: '图标',
    components: '组件',
    tinymce: '富文本编辑器',
    markdown: 'Markdown',
    jsonEditor: 'JSON 编辑器',
    splitPane: 'Splitpane',
    avatarUpload: '头像上传',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    componentMixin: '小组件',
    backToTop: '返回顶部',
    draggableDialog: '可拖拽对话框',
    draggableKanban: '可拖拽看板',
    draggableList: '可拖拽列表',
    draggableSelect: '可拖拽选择',
    charts: '图表',
    barChart: '柱状图表',
    lineChart: '折线图',
    mixedChart: '混合图表',
    example: '综合实例',
    nested: '路由嵌套',
    menu1: '菜单 1',
    'menu1-1': '菜单 1-1',
    'menu1-2': '菜单 1-2',
    'menu1-2-1': '菜单 1-2-1',
    'menu1-2-2': '菜单 1-2-2',
    'menu1-3': '菜单 1-3',
    menu2: '菜单 2',
    table: '表格',
    dynamicTable: '动态表格',
    draggableTable: '可拖拽表格',
    inlineEditTable: '表格内编辑',
    complexTable: '综合表格',
    tab: '分栏',
    form: '表单',
    createArticle: '创建文章',
    editArticle: '编辑文章',
    articleList: '文章列表',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    errorLog: '错误日志',
    excel: 'Excel',
    exportExcel: '导出 Excel',
    selectExcel: '导出 已选择项',
    mergeHeader: '导出 多级表头',
    uploadExcel: '上传 Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: '导出 Zip',
    theme: '换肤',
    clipboard: '粘贴板',
    i18n: '国际化',
    externalLink: '外链',
    profile: '个人中心'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    theme: '换肤',
    size: '布局大小',
    profile: '个人中心',
    issues: '问题反馈'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    register: '还没账号？前往注册',
    username: '账号',
    password: '密码',
    thirdparty: '第三方登录',
    name: '请输入正确的用户名，只支持手机号',
    pwd: '密码不能少于6位',
    address: 'admin-server 地址',
    address_error: '请输入正确的 admin-server 地址'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    createRole: '新增角色',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips: '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '确定',
    cancel: '取消'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    changeLanguageTips: '切换语言成功',
    changeAdminServerTips: 'admin-server 切换为：',
    deleteAdminServerTips: '已移除 admin-server：'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定'
  },
  example: {
    warning: '创建和编辑页面是不能被 keep-alive 缓存的，因为keep-alive 的 include 目前不支持根据路由来缓存，所以目前都是基于 component name 来进行缓存的。如果你想类似的实现缓存效果，可以使用 localStorage 等浏览器缓存方案。或者不要使用 keep-alive 的 include，直接缓存所有页面。详情见'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  pdf: {
    tips: '这里使用 window.print() 来实现下载pdf的功能'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    showTagsView: '显示 Tags-View',
    showSidebarLogo: '显示侧边栏 Logo',
    fixedHeader: '固定 Header',
    sidebarTextTheme: '侧边栏文字主题色'
  },
  includedfiles: {
    filename: '文件名'
  },
  common: {
    search: '搜索',
    clear: '清空',
    sourceFile: '文件信息',
    actions: '操作',
    varDump: '输出打印',
    detail: '查看详情',
    close: '关闭',
    cancel: '取消',
    reload: '重载服务',
    shutDown: '关闭服务',
    reloadSuccess: '服务已重载',
    shutDownSuccess: '服务已关闭',
    reloadWarning: '是否确认重载服务',
    shutDownWarning: '是否确认关闭服务'
  },
  extensions: {
    classes: '类',
    constants: '常量',
    iniEntries: 'ini配置项',
    dependencies: '依赖扩展',
    functions: '函数',
    info: '信息',
    name: '名称',
    version: '版本'
  },
  classes: {
    placeholder: '类名 或 文件信息',
    name: '类名',
    constants: '常量',
    constantName: '常量名',
    constantValue: '常量值',
    properties: '属性',
    staticProperties: '静态属性',
    modifiers: '修饰符',
    propertiesName: '属性名',
    propertiesValue: '属性值',
    methods: '方法',
    staticMethods: '静态方法',
    methodName: '方法名',
    parentClass: '父类',
    interface: '接口'
  },
  functions: {
    placeholder: '函数名 或 文件信息',
    type: '类型',
    name: '函数名'
  },
  function_detail: {
    type: '类型',
    name: '变量名',
    default: '默认值',
    full: '参数信息',
    variadic: '可变参数',
    by_reference: '引用参数',
    optional: '可选参数',
    num: '参数个数',
    user_defined: '用户定义',
    extension: '扩展',
    filename: '文件名'
  },
  resources: {
    name: '资源名',
    type: '资源类型',
    info: '资源信息'
  },
  constants: {
    name: '常量名',
    value: '常量值'
  },
  interfaces: {
    name: '接口名'
  },
  globals: {
    name: '变量名',
    type: '变量类型',
    value: '变量值'
  },
  objects: {
    placeholder: '文件信息',
    objectID: '对象ID',
    objectHASH: '对象HASH',
    className: '类名',
    memorySize: '占用内存'
  },
  processes: {
    reloadCount: '重载次数',
    timeOfLastReload: '最后重载时间',
    coroutines: '协程',
    events: '事件',
    timers: '定时器',
    objects: '对象',
    resources: '资源',
    memoryUsage: '内存占用',
    memoryRealUsage: '内存实际占用',
    dispatchCount: '处理数量',
    vmSize: '虚拟内存',
    vmRSS: '虚拟内存驻留集合',
    vcs: '自愿上下文切换',
    nvcs: '非自愿上下文切换',
    timerNum: '定时器数量',
    coroutineNum: '协程数量'
  },
  coroutines: {
    placeholder: '调用函数 或 文件信息',
    elapsed: '时长',
    stackUsage: '已用堆栈',
    calledFunction: '调用函数',
    backTrace: '查看回溯'
  },
  connections: {
    socketName: 'Socket名称',
    serverPort: '服务端口',
    connectTime: '发起连接时间',
    lastReceivedTime: '最后接收时间',
    lastSendTime: '最后发送时间',
    recvQueuedBytes: '接收队列大小',
    sendQueuedBytes: '发送队列大小',
    numberOfBytesReceived: '已接收的字节数',
    numberOfBytesSend: '已发送的字节数',
    resetSession: '重置',
    closeSession: '断开',
    resetWarning: '是否确认重置连接',
    closeWarning: '是否确认断开连接',
    reset: '重置',
    close: '断开',
    closeSuccess: '连接已断开',
    closedWarning: '连接已关闭'
  },
  events: {
    eventType: '事件类型',
    socketType: 'Socket类型',
    fdType: 'FD类型',
    port: '端口',
    'Ip:Port': 'IP:端口',
    sendBufferSize: '发送缓冲区大小',
    numberOfBytesReceived: '已接收的字节数',
    numberOfBytesSend: '已发送的字节数'
  },
  timers: {
    interval: '时间间隔',
    execMsec: '执行毫秒数',
    execCount: '执行次数',
    round: 'round'
  },
  composer: {
    name: '名称',
    aliases: '别名',
    devRequirement: '开发依赖',
    type: '类型',
    version: '版本',
    reference: 'Reference',
    installPath: '安装目录'
  }
}
