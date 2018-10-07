const get = (ref) => {
  return JSON.parse(localStorage.getItem(ref))
}

const set = (ref, payload) => {
  localStorage.setItem(ref, JSON.stringify(payload))
}

const del = (ref) => {
  localStorage.removeItem(ref)
}

const has = (ref) => {
  return localStorage.hasOwnProperty(ref)
}

const delAll = () => {
  localStorage.clear()
}

export default {
  get,
  set,
  del,
  has,
  delAll
}
