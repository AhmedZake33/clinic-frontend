import Vue from 'vue'
import Permission from './ability'

// Register a global method to check permissions
Vue.prototype.$can = function(action, resource) {
  return Permission(resource)
}
