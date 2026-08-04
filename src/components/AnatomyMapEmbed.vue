<template>
  <div class="anatomy-map-embed">
    <div v-if="loading" class="anatomy-map-loading">
      <b-spinner small variant="primary" />
      <span>{{ isArabic ? 'جاري تحميل خريطة الجسم...' : 'Loading anatomical map...' }}</span>
    </div>
    <iframe
      ref="frame"
      :src="frameUrl"
      :title="isArabic ? 'خريطة الجسم التشريحية التفاعلية' : 'Interactive anatomical body map'"
      class="anatomy-map-frame"
      @load="sendInitialization"
    />
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'AnatomyMapEmbed',
  props: {
    value: {
      type: Object,
      default: () => ({ type: 'general', items: [] }),
    },
    specialization: {
      type: String,
      default: '',
    },
    reservation: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      specializationMap: {},
    }
  },
  computed: {
    isArabic() {
      return String(this.$i18n?.locale || '').toLowerCase().startsWith('ar')
    },
    frameUrl() {
      const query = new URLSearchParams({
        embedded: '1',
        locale: this.isArabic ? 'ar' : 'en',
        specialty: this.specialization || '',
        specialty_key: this.specialtyMapKey,
        sex: this.patientSex,
      })
      return `/medical-anatomy-map/index.html?${query.toString()}`
    },
    specialtyMapKey() {
      return this.specializationMap[this.specialization] || ''
    },
    patientSex() {
      const value = String(this.reservation?.client?.gender || this.reservation?.client?.sex || '').toLowerCase()
      return ['male', 'm', 'ذكر'].includes(value) ? 'male' : 'female'
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.sendInitialization()
      },
    },
    specialization() {
      this.sendInitialization()
    },
    specialtyMapKey() {
      this.sendInitialization()
    },
  },
  async mounted() {
    window.addEventListener('message', this.handleMessage)
    await this.loadSpecializationMap()
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    async loadSpecializationMap() {
      try {
        const { data } = await api.get('/specializations')
        this.specializationMap = (Array.isArray(data) ? data : []).reduce((map, item) => {
          if (item?.value && item?.anatomy_map_key) map[item.value] = item.anatomy_map_key
          return map
        }, {})
      } catch {
        this.specializationMap = {}
      }
    },
    frameWindow() {
      return this.$refs.frame?.contentWindow || null
    },
    sendInitialization() {
      const target = this.frameWindow()
      if (!target) return
      target.postMessage({
        source: 'clinic-reservations',
        type: 'initialize',
        payload: {
          annotations: Array.isArray(this.value?.items) ? this.value.items : [],
          specialty: this.specialization,
          specialtyKey: this.specialtyMapKey,
          sex: this.patientSex,
          physician: this.reservation?.doctor?.name || '',
          visitNumber: this.reservation?.visit_number || this.reservation?.id || '',
          visitId: this.reservation?.id || '',
          doctorId: this.reservation?.doctor_id || this.reservation?.doctor?.id || '',
          dark: document.documentElement.classList.contains('dark-layout'),
        },
      }, window.location.origin)
    },
    handleMessage(event) {
      if (
        event.origin !== window.location.origin
        || event.source !== this.frameWindow()
        || event.data?.source !== 'clinic-anatomy-map'
      ) return

      if (event.data.type === 'ready') {
        this.loading = false
        this.sendInitialization()
        return
      }

      if (event.data.type === 'annotations-change') {
        const chart = event.data.payload || { type: 'general', items: [] }
        this.$emit('input', chart)
        this.$emit('change', chart)
      }
    },
  },
}
</script>

<style scoped>
.anatomy-map-embed {
  position: relative;
  min-height: 760px;
  overflow: hidden;
  border: 1px solid #d8d6de;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.anatomy-map-loading {
  position: absolute;
  z-index: 2;
  inset: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fff;
  color: #6e6b7b;
}

.anatomy-map-frame {
  display: block;
  width: 100%;
  min-height: 760px;
  border: 0;
  background: transparent;
}

@media (max-width: 767.98px) {
  .anatomy-map-embed,
  .anatomy-map-frame {
    min-height: 680px;
  }
}
</style>
