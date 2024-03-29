import { debounce } from '../../../src/utils/debounce-throttle'

export default {
  data() {
    return {
      searchValue: {}
    }
  },
  created() {
    // 绑定响应式 赋默认值
    const searchFormParams = this.searchFormParams
    this.searchFormItems.forEach(item => {
      const prop = item.prop
      const value = searchFormParams[prop] || ''
      this.$set(this.searchValue, prop, value)
    })
  },
  methods: {
    getSearchBtnComponent(item) {
      const key = item.key
      switch (key) {
        case 'search':
        case 'add':
        case 'edit':
        case 'delete':
          return 'el-button'
        default:
          return key
      }
    },
    getSearchBtnType(item) {
      if (item.type) return item.type
      switch (item.key) {
        case 'search':
          return 'primary'
        case 'add':
          return 'success'
        case 'edit':
          return 'primary'
        case 'delete':
          return 'danger'
        default:
          return ''
      }

    },
    getSearchBtnListeners(item) {

      switch (item.key) {
        case 'search':
          return this.onSearch(item)
        case 'add':
          return this.handleAdd(item)
        case 'edit':
          return this.handleEdit(item)
        case 'delete':
          return this.onDelete(item)
        default:
          return () => { }
      }

    },
    getSearchFormItemSlotName() {
      const result = []
      this.searchFormItems.map(item => {
        if (item.slotName) {
          result.push(item.slotName)
        } else if (item.labelSlotName) {
          result.push(item.labelSlotName)
        }
      })
      return result
    },
    onSearch() {
      this.pageValue[this.pageMapKeys.page] = 1
      this.getTableDataList()
    },
    handleAdd() {
      this.visible = true
      this.initFromData = {}
    },
    onDelete() {
      if (!this.tableSelectionList || this.tableSelectionList.length === 0) return
      const ids = this.tableSelectionList.map(item => item.id).join(',')
      this.handleDelete(ids)
    },
    getRequestParams() {
      const pageValue = { ...this.pageValue }
      delete pageValue[this.pageMapKeys.total]
      return { ...pageValue, ...this.searchValue }
    },
    handleSearchFormInput() {
      this.getTableDataList()
    },

  },
  computed: {
    searchFormListeners() {
      const result = {}
      if (this.isSearchFormChangeRequest) {
        const helper = debounce(this.handleSearchFormInput, 300, false).bind(this)
        result.input = helper
      }
      return result
    }
  }
}
