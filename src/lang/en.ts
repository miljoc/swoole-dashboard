export default {
  route: {
    'Swoole Dashboard': 'Home',
    Settings: 'Settings',
    Cluster: 'Cluster',
    Groups: 'Groups',
    'Worker Stats': 'Worker Stats',
    ZendVM: 'ZendVM',
    Extensions: 'Extensions',
    'Extension Info': 'Extension Info',
    'Included Files': 'Included Files',
    'Included File Info': 'Included File Info',
    Composer: 'Composer',
    'GC Status': 'GC Status',
    Classes: 'Classes',
    'Class Info': 'Class Info',
    Functions: 'Functions',
    'Function Content': 'Function Content',
    Resources: 'Resources',
    Constants: 'Constants',
    Interfaces: 'Interfaces',
    Objects: 'Objects',
    'Object Var Dump': 'Object VarDump',
    Swoole: 'Swoole',
    Processes: 'Processes',
    'Worker Info': 'Worker Info',
    Coroutines: 'Coroutines',
    Connections: 'Connections',
    'Connection Info': 'Connection Info',
    'Network Traffic': 'Network Traffic',
    'Socket Info': 'Socket Info',
    Events: 'Events',
    Timers: 'Timers',
    Globals: 'Globals',

    dashboard: 'Dashboard',
    documentation: 'Documentation',
    guide: 'Guide',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    rolePermission: 'Role Permission',
    directivePermission: 'Directive Permission',
    icons: 'Icons',
    components: 'Components',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    splitPane: 'SplitPane',
    avatarUpload: 'Avatar Upload',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    componentMixin: 'Mixin',
    backToTop: 'Back To Top',
    draggableDialog: 'Draggable Dialog',
    draggableKanban: 'Draggable Kanban',
    draggableList: 'Draggable List',
    draggableSelect: 'Draggable Select',
    charts: 'Charts',
    barChart: 'Bar Chart',
    lineChart: 'Line Chart',
    mixedChart: 'Mixed Chart',
    example: 'Example',
    nested: 'Nested Routes',
    menu1: 'Menu 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menu 2',
    table: 'Table',
    dynamicTable: 'Dynamic Table',
    draggableTable: 'Draggable Table',
    inlineEditTable: 'Inline Edit Table',
    complexTable: 'Complex Table',
    tab: 'Tab',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    mergeHeader: 'Merge Header',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: 'Theme',
    clipboard: 'Clipboard',
    i18n: 'I18n',
    externalLink: 'External Link',
    profile: 'Profile'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    theme: 'Theme',
    size: 'Global Size',
    profile: 'Profile',
    issues: 'Issue'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    thirdparty: 'Or connect with',
    name: 'Please enter the correct user name. Only mobile phone numbers are supported',
    pwd: 'The password can not be less than 6 digits',
    address: 'admin-server address'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    createRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    changeLanguageTips: 'Switch Language Success',
    changeAdminServerTips: 'Switch admin-server：',
    deleteAdminServerTips: 'Delete admin-server：'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Importance',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'Reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive\'s \'include\' currently does not support caching based on routes, so now it\'s cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or don\'t use keep-alive\'s \'include\' to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    showTagsView: 'Open Tags-View',
    showSidebarLogo: 'Sidebar Logo',
    fixedHeader: 'Fixed Header',
    sidebarTextTheme: 'Sidebar Text Theme'
  },
  includedfiles: {
    filename: 'Filename'
  },
  common: {
    search: 'Search',
    clear: 'Clear',
    sourceFile: 'Source File',
    actions: 'Actions',
    varDump: 'Var Dump',
    detail: 'Detail',
    close: 'Close',
    cancel: 'Cancel',
    reload: 'Reload',
    shutDown: 'ShutDown',
    reloadSuccess: 'Server Is Reload',
    shutDownSuccess: 'Server Is ShutDown',
    reloadWarning: 'Confirm whether to reload the server？',
    shutDownWarning: 'Confirm whether to shutdown the server？',
    networkError: 'Please check the admin-server connection status, refresh and retry',
    status: 'Status'
  },
  extensions: {
    classes: 'Classes',
    constants: 'Constants',
    iniEntries: 'IniEntries',
    dependencies: 'Dependencies',
    functions: 'Functions',
    info: 'Info',
    name: 'Extension Name',
    version: 'Version'
  },
  classes: {
    placeholder: 'Class Name or Source File',
    name: 'Class Name',
    constants: 'Constants',
    constantName: 'Constant Name',
    constantValue: 'Constant Value',
    properties: 'Properties',
    staticProperties: 'Static Properties',
    modifiers: 'Modifiers',
    propertiesName: 'Property Name',
    propertiesValue: 'Property Value',
    methods: 'Methods',
    staticMethods: 'Static Methods',
    methodName: 'Method Name',
    parentClass: 'ParentClass',
    interface: 'Interface'
  },
  functions: {
    placeholder: 'FunctionName or Source File',
    type: 'Type',
    name: 'Function Name'
  },
  function_info: {
    type: 'Type',
    name: 'Name',
    default: 'Default',
    full: 'Full',
    variadic: 'IsVariadic',
    by_reference: 'IsPassedByReference',
    optional: 'Optional',
    num: 'Num',
    user_defined: 'User Defined',
    extension: 'Extension',
    filename: 'Filename'
  },
  resources: {
    name: 'Resources',
    type: 'Type',
    info: 'Info'
  },
  constants: {
    name: 'Constants Name',
    value: 'Constants Value'
  },
  interfaces: {
    name: 'Interfaces Name'
  },
  globals: {
    name: 'Globals Name',
    type: 'Type',
    value: 'Value'
  },
  objects: {
    placeholder: 'Source File',
    objectID: 'Object ID',
    objectHASH: 'Object Hash',
    className: 'Class Name',
    memorySize: 'Memory Size'
  },
  processes: {
    reloadCount: 'Reload Count',
    timeOfLastReload: 'Time Of Last Reload',
    coroutines: 'Coroutines',
    events: 'Events',
    timers: 'Timers',
    objects: 'Objects',
    resources: 'Resources',
    memoryUsage: 'Memory Usage',
    memoryRealUsage: 'Memory Real Usage',
    dispatchCount: 'Dispatch Count',
    vmSize: 'VM-Size',
    vmRSS: 'VM-RSS',
    vcs: 'V-CS',
    nvcs: 'NV-CS',
    timerNum: 'Timer Num',
    coroutineNum: 'Coroutine Num'
  },
  coroutines: {
    placeholder: 'Called Function or Source File',
    elapsed: 'Elapsed',
    stackUsage: 'Stack Usage',
    calledFunction: 'Called Function',
    backTrace: 'Back Trace'
  },
  connections: {
    socketName: 'Socket Name',
    serverPort: 'Server Port',
    connectTime: 'Connect Time',
    lastReceivedTime: 'Last Received Time',
    lastSendTime: 'Last Send Time',
    recvQueuedBytes: 'Recv Queued Bytes',
    sendQueuedBytes: 'Send Queued Bytes',
    numberOfBytesReceived: 'Number Of Bytes Received',
    numberOfBytesSend: 'Number Of Bytes Send',
    resetSession: 'Reset',
    closeSession: 'Close',
    resetWarning: 'Confirm whether to reset the connection？',
    closeWarning: 'Confirm whether to close the connection？',
    reset: 'Reset Session',
    close: 'Close Session',
    closeSuccess: 'Session Closed',
    closedWarning: 'Connection is closed'
  },
  events: {
    eventType: 'Events',
    socketType: 'Socket Type',
    fdType: 'Fd Type',
    port: 'Port',
    'Ip:Port': 'IP:Port',
    sendBufferSize: 'Send Buffer Size',
    numberOfBytesReceived: 'Number Of Bytes Received',
    numberOfBytesSend: 'Number Of Bytes Send'
  },
  timers: {
    interval: 'Interval',
    execMsec: 'Exec Msec',
    execCount: 'Exec Count',
    round: 'Round'
  },
  composer: {
    name: 'Name',
    aliases: 'Aliases',
    devRequirement: 'Dev Requirement',
    type: 'Type',
    version: 'Version',
    reference: 'Reference',
    installPath: 'Install Path'
  },
  admin_server: {
    placeholder: 'Node Name',
    admin_server_url: 'Node Url',
    admin_server_group: 'Group',
    admin_add: 'Add Node',
    server_name: 'Name',
    server_server_url: 'Admin Server Url',
    access_token: 'Access Token',
    remark: 'Remark',
    actions: 'Actions',
    server_del: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel',
    title: 'Add Admin Server',
    delWarning: 'Confirm whether to delete the server？',
    delText: 'Delete',
    success: 'Success',
    error: 'Data cannot be empty',
    address_error: 'Please enter the correct admin-server address'
  },
  admin_server_group: {
    placeholder: 'Group Name',
    group_name: 'Group Name',
    admin_add: 'Add Group',
    actions: 'Actions',
    group_edit: 'Edit',
    group_del: 'Delete',
    error: 'Data cannot be empty',
    success: 'Success',
    phone_error: 'Illegal mobile phone number',
    delWarning: 'Confirm whether to delete the server？',
    cancel: 'Cancel',
    delText: 'Delete',
    readonly: 'ReadOnly',
    readwrite: 'ReadWrite',
    search_title: 'Search User By Phone Num',
    phone: 'Phone Num',
    search: 'Search',
    confirm: 'Confirm'
  }
}
