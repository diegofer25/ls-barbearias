import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default ({ app, router, Vue }) => {
  Vue.prototype.$xlsx = {
    XLSX,
    saveAs
  }
}
