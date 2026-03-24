<template>
  <div>
    <b-card>
      <b-row class="mb-2">
        <b-col cols="12" md="4">
          <h4>{{ $t('reservation.myReservations') }}</h4>
        </b-col>
      </b-row>

      <b-form @submit.prevent="applyFilters" class="mb-2">
        <b-row>
          <b-col cols="12" md="4" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.search" :placeholder="$t('reservation.searchByClientOrNotes')" />
          </b-col>
          <b-col cols="6" md="3" class="mb-1 mb-md-0">
            <b-form-select v-model="filters.status" :options="statusOptions" />
          </b-col>
          <b-col cols="6" md="2" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.date_from" type="date" :placeholder="$t('reservation.from')" />
          </b-col>
          <b-col cols="6" md="2" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.date_to" type="date" :placeholder="$t('reservation.to')" />
          </b-col>
          <b-col cols="12" md="12" class="text-right mt-1">
            <b-button type="submit" variant="primary" class="mr-1" :disabled="loading">
              {{ $t('filters.apply') }}
            </b-button>
            <b-button variant="outline-secondary" size="sm" @click="resetFilters" :disabled="loading">
              {{ $t('filters.reset') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>

      <b-table
        :items="reservations"
        :fields="fields"
        responsive
        striped
        hover
        :busy="loading"
        show-empty
      >
        <template #cell(status)="data">
          <b-badge :variant="getStatusVariant(data.value)">
            {{ $t('reservation.' + data.value) }}
          </b-badge>
        </template>

        <template #cell(actions)="data">
          <b-button
            v-b-tooltip.hover
            :title="$t('actions.view')"
            variant="info"
            size="sm"
            class="mr-1"
            @click="viewReservation(data.item)"
          >
            <feather-icon icon="EyeIcon" />
          </b-button>
          <b-button
            v-if="data.item.status !== 'completed' && data.item.status !== 'cancelled'"
            variant="success"
            size="sm"
            class="mr-1"
            @click="showCompleteModal(data.item)"
          >
            <feather-icon icon="CheckIcon" class="mr-50" />
            {{ $t('reservation.completeReservation') }}
          </b-button>
          <b-button
            v-if="data.item.status === 'completed' && data.item.treatment"
            variant="primary"
            size="sm"
            @click="printPrescription(data.item)"
          >
            <feather-icon icon="PrinterIcon" class="mr-50" />
            {{ $t('reservation.printPrescription') }}
          </b-button>
        </template>

        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle" />
          </div>
        </template>
      </b-table>

      <b-pagination
        v-model="pagination.current_page"
        :total-rows="pagination.total"
        :per-page="pagination.per_page"
        @change="onPageChange"
        class="mt-2"
        align="center"
      />
      <div class="text-center text-muted small mt-1" v-if="pagination.total">
        {{ paginationCountText(pagination) }}
      </div>
    </b-card>

    <!-- Complete Modal -->
    <b-modal
      v-model="completeModalShow"
      :title="$t('reservation.completeReservation')"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="completeReservation">
        <b-alert variant="info" show>
          <div v-if="selectedReservation && selectedReservation.client">
            <p class="mb-25"><strong>{{ $t('reservation.client') }}:</strong> {{ selectedReservation.client.name }}</p>
            <p class="mb-25"><strong>{{ $t('reservation.clientPhone') }}:</strong> {{ selectedReservation.client.phone }}</p>
            <p class="mb-25" v-if="selectedReservation.client.date_of_birth"><strong>{{ $t('client.dateOfBirth') }}:</strong> {{ selectedReservation.client.date_of_birth }}</p>
            <p class="mb-25" v-if="selectedReservation.client.height"><strong>{{ $t('client.height') }}:</strong> {{ selectedReservation.client.height }} cm</p>
            <p class="mb-25" v-if="selectedReservation.client.weight"><strong>{{ $t('client.weight') }}:</strong> {{ selectedReservation.client.weight }} kg</p>
            <p class="mb-0" v-if="selectedReservation.client.medical_history"><strong>{{ $t('client.medicalHistory') }}:</strong> {{ selectedReservation.client.medical_history }}</p>
          </div>
          <p v-if="selectedReservation" class="mb-0 mt-50"><strong>{{ $t('reservation.appointment') }}:</strong> {{ formatDateTime(selectedReservation.appointment_date) }}</p>
        </b-alert>

        <b-form-group :label="$t('reservation.diagnosis')" label-for="diagnosis">
          <b-form-textarea
            id="diagnosis"
            v-model="completeForm.diagnosis"
            rows="4"
            :placeholder="$t('reservation.enterDiagnosis')"
          />
        </b-form-group>

        <b-form-group :label="$t('reservation.treatment')" label-for="treatment">
          <b-form-textarea
            id="treatment"
            v-model="completeForm.treatment"
            rows="4"
            :placeholder="$t('reservation.enterTreatment')"
          />
        </b-form-group>

        <!-- Drug Search with Tabs -->
        <b-card class="mb-2">
          <b-tabs v-model="drugTabIndex" content-class="mt-1" fill>
            <!-- Egypt Drugs Tab -->
            <b-tab :title="$t('openfda.egyptDrugs')" active>
              <b-row class="mb-1">
                <b-col cols="12" md="5">
                  <b-form-input
                    v-model="egyptDrugQuery"
                    :placeholder="$t('openfda.egyptSearchPlaceholder')"
                    @keyup.enter="searchEgyptDrugs"
                    :disabled="egyptSearching"
                    size="sm"
                  />
                </b-col>
                <b-col cols="6" md="3">
                  <b-form-select
                    v-model="egyptCategoryFilter"
                    :options="egyptCategoryOptions"
                    size="sm"
                  />
                </b-col>
                <b-col cols="6" md="3">
                  <b-form-select
                    v-model="egyptFormFilter"
                    :options="egyptFormOptions"
                    size="sm"
                  />
                </b-col>
                <b-col cols="12" md="1">
                  <b-button variant="primary" size="sm" block @click="searchEgyptDrugs" :disabled="egyptSearching || !egyptDrugQuery">
                    <b-spinner v-if="egyptSearching" small />
                    <feather-icon v-else icon="SearchIcon" />
                  </b-button>
                </b-col>
              </b-row>

              <div v-if="egyptResults.length > 0">
                <small class="text-muted d-block mb-1">{{ $t('openfda.resultsFound', { count: egyptResultsTotal }) }}</small>
                <div class="drug-results-scroll">
                  <div
                    v-for="(drug, index) in egyptResults"
                    :key="'eg-' + index"
                    class="border rounded p-1 mb-1"
                    style="cursor: pointer;"
                    :class="{ 'border-success bg-light': selectedEgyptDrug === drug }"
                    @click="selectedEgyptDrug = selectedEgyptDrug === drug ? null : drug"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{{ drug.name }}</strong>
                        <div class="d-flex flex-wrap mt-25">
                          <b-badge v-if="drug.form" variant="light-info" class="mr-50 mb-25">{{ drug.form }}</b-badge>
                          <b-badge v-if="drug.category" variant="light-primary" class="mr-50 mb-25">{{ drug.category }}</b-badge>
                        </div>
                        <small v-if="drug.company" class="text-muted d-block">{{ drug.company }}</small>
                      </div>
                      <b-button
                        size="sm"
                        variant="outline-success"
                        @click.stop="appendEgyptDrugToTreatment(drug)"
                      >
                        <feather-icon icon="PlusIcon" size="14" />
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>

              <b-alert v-if="egyptSearched && egyptResults.length === 0" variant="warning" show class="mb-0 mt-1">
                {{ $t('openfda.noResults') }}
              </b-alert>
            </b-tab>

            <!-- OpenFDA International Tab -->
            <b-tab :title="$t('openfda.fdaDrugs')">
              <b-input-group class="mb-1">
                <b-form-input
                  v-model="drugSearchQuery"
                  :placeholder="$t('openfda.searchPlaceholder')"
                  @keyup.enter="searchDrugs"
                  :disabled="drugSearching"
                  size="sm"
                />
                <b-input-group-append>
                  <b-button variant="outline-primary" size="sm" @click="searchDrugs" :disabled="drugSearching || !drugSearchQuery">
                    <b-spinner v-if="drugSearching" small />
                    <feather-icon v-else icon="SearchIcon" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>

              <div v-if="drugResults.length > 0">
                <small class="text-muted d-block mb-1">{{ $t('openfda.resultsFound', { count: drugResultsTotal }) }}</small>
                <div class="drug-results-scroll">
                  <div
                    v-for="(drug, index) in drugResults"
                    :key="'fda-' + index"
                    class="border rounded p-1 mb-1"
                    :class="{ 'border-primary bg-light': selectedDrug === drug }"
                    @click="selectDrug(drug)"
                    style="cursor: pointer;"
                  >
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{{ drug.brand_name || drug.generic_name }}</strong>
                        <small v-if="drug.generic_name && drug.brand_name" class="text-muted d-block">
                          {{ $t('openfda.genericName') }}: {{ drug.generic_name }}
                        </small>
                        <small v-if="drug.manufacturer" class="text-muted d-block">
                          {{ $t('openfda.manufacturer') }}: {{ drug.manufacturer }}
                        </small>
                        <small v-if="drug.dosage_form" class="text-muted d-block">
                          {{ $t('openfda.dosageForm') }}: {{ drug.dosage_form }}
                        </small>
                        <small v-if="drug.route" class="text-muted d-block">
                          {{ $t('openfda.route') }}: {{ drug.route }}
                        </small>
                      </div>
                      <div>
                        <b-button
                          size="sm"
                          variant="outline-info"
                          class="mr-50"
                          @click.stop="showDrugDetails(drug)"
                        >
                          <feather-icon icon="InfoIcon" size="14" />
                        </b-button>
                        <b-button
                          size="sm"
                          variant="outline-success"
                          @click.stop="appendDrugToTreatment(drug)"
                        >
                          <feather-icon icon="PlusIcon" size="14" />
                        </b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <b-alert v-if="drugSearched && drugResults.length === 0" variant="warning" show class="mb-0">
                {{ $t('openfda.noResults') }}
              </b-alert>
            </b-tab>
          </b-tabs>
        </b-card>

        <!-- Drug Details Modal -->
        <b-modal
          v-model="drugDetailModalShow"
          :title="drugDetailData ? (drugDetailData.brand_name || drugDetailData.generic_name) : ''"
          ok-only
          size="lg"
          scrollable
        >
          <div v-if="drugDetailLoading" class="text-center my-3">
            <b-spinner />
          </div>
          <div v-else-if="drugDetailData">
            <b-row>
              <b-col cols="12" md="6">
                <p v-if="drugDetailData.brand_name"><strong>{{ $t('openfda.brandName') }}:</strong> {{ drugDetailData.brand_name }}</p>
                <p v-if="drugDetailData.generic_name"><strong>{{ $t('openfda.genericName') }}:</strong> {{ drugDetailData.generic_name }}</p>
                <p v-if="drugDetailData.manufacturer"><strong>{{ $t('openfda.manufacturer') }}:</strong> {{ drugDetailData.manufacturer }}</p>
                <p v-if="drugDetailData.dosage_form"><strong>{{ $t('openfda.dosageForm') }}:</strong> {{ drugDetailData.dosage_form }}</p>
              </b-col>
              <b-col cols="12" md="6">
                <p v-if="drugDetailData.route"><strong>{{ $t('openfda.route') }}:</strong> {{ drugDetailData.route }}</p>
                <p v-if="drugDetailData.substance_name"><strong>{{ $t('openfda.substanceName') }}:</strong> {{ drugDetailData.substance_name }}</p>
                <p v-if="drugDetailData.product_type"><strong>{{ $t('openfda.productType') }}:</strong> {{ drugDetailData.product_type }}</p>
              </b-col>
            </b-row>

            <div v-if="drugDetailData.indications">
              <hr>
              <h6>{{ $t('openfda.indications') }}</h6>
              <p class="small">{{ truncateText(drugDetailData.indications, 800) }}</p>
            </div>

            <div v-if="drugDetailData.dosage">
              <hr>
              <h6>{{ $t('openfda.dosage') }}</h6>
              <p class="small">{{ truncateText(drugDetailData.dosage, 800) }}</p>
            </div>

            <div v-if="drugDetailData.warnings">
              <hr>
              <h6 class="text-danger">{{ $t('openfda.warnings') }}</h6>
              <p class="small text-danger">{{ truncateText(drugDetailData.warnings, 800) }}</p>
            </div>

            <div v-if="drugDetailData.adverse_reactions">
              <hr>
              <h6 class="text-warning">{{ $t('openfda.adverseReactions') }}</h6>
              <p class="small">{{ truncateText(drugDetailData.adverse_reactions, 600) }}</p>
            </div>

            <div v-if="drugDetailData.drug_interactions">
              <hr>
              <h6>{{ $t('openfda.drugInteractions') }}</h6>
              <p class="small">{{ truncateText(drugDetailData.drug_interactions, 600) }}</p>
            </div>

            <div v-if="drugDetailData.contraindications">
              <hr>
              <h6 class="text-danger">{{ $t('openfda.contraindications') }}</h6>
              <p class="small">{{ truncateText(drugDetailData.contraindications, 600) }}</p>
            </div>
          </div>

          <template #modal-footer="{ ok }">
            <b-button variant="success" class="mr-1" @click="appendDrugToTreatment(drugDetailData); ok()">
              <feather-icon icon="PlusIcon" size="14" class="mr-50" />
              {{ $t('openfda.addToTreatment') }}
            </b-button>
            <b-button variant="secondary" @click="ok()">
              {{ $t('actions.close') }}
            </b-button>
          </template>
        </b-modal>

        <hr>
        <h6>{{ $t('reservation.additionalRequirements') }}</h6>

        <b-form-checkbox
          v-model="completeForm.requires_xray"
          switch
          class="mb-1"
        >
          {{ $t('reservation.requiresXray') }}
        </b-form-checkbox>
        <b-form-group
          v-if="completeForm.requires_xray"
          :label="$t('reservation.xrayNotes')"
          label-for="xray-notes"
        >
          <b-form-textarea
            id="xray-notes"
            v-model="completeForm.xray_notes"
            rows="2"
            :placeholder="$t('reservation.enterXrayNotes')"
          />
        </b-form-group>

        <b-form-checkbox
          v-model="completeForm.requires_lab"
          switch
          class="mb-1"
        >
          {{ $t('reservation.requiresLab') }}
        </b-form-checkbox>
        <b-form-group
          v-if="completeForm.requires_lab"
          :label="$t('reservation.labNotes')"
          label-for="lab-notes"
        >
          <b-form-textarea
            id="lab-notes"
            v-model="completeForm.lab_notes"
            rows="2"
            :placeholder="$t('reservation.enterLabNotes')"
          />
        </b-form-group>

        <div class="text-right">
          <b-button variant="secondary" class="mr-1" @click="completeModalShow = false">
            {{ $t('actions.cancel') }}
          </b-button>
          <b-button type="submit" variant="success" :disabled="completing">
            <b-spinner v-if="completing" small class="mr-1" />
            {{ $t('reservation.completeReservation') }}
          </b-button>
        </div>
      </b-form>
    </b-modal>

    <!-- View Modal -->
    <b-modal
      v-model="viewModalShow"
      :title="$t('reservation.reservationDetails')"
      ok-only
      size="lg"
    >
      <div v-if="selectedReservation">
        <!-- Client Details Card -->
        <b-card v-if="selectedReservation.client" class="mb-2" no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0">{{ $t('client.clientDetails') }}</h6>
            <b-button size="sm" variant="outline-primary" @click="openEditClientModal(selectedReservation.client)">
              <feather-icon icon="EditIcon" size="14" class="mr-25" />
              {{ $t('client.editClient') }}
            </b-button>
          </b-card-header>
          <b-card-body>
            <b-row>
              <b-col cols="12" md="6">
                <p class="mb-50"><strong>{{ $t('client.name') }}:</strong> {{ selectedReservation.client.name }}</p>
                <p class="mb-50"><strong>{{ $t('reservation.clientEmail') }}:</strong> {{ selectedReservation.client.email }}</p>
                <p class="mb-50"><strong>{{ $t('reservation.clientPhone') }}:</strong> {{ selectedReservation.client.phone }}</p>
                <p class="mb-50"><strong>{{ $t('client.dateOfBirth') }}:</strong> {{ selectedReservation.client.date_of_birth || $t('reservation.na') }}</p>
              </b-col>
              <b-col cols="12" md="6">
                <p class="mb-50"><strong>{{ $t('client.height') }}:</strong> {{ selectedReservation.client.height ? selectedReservation.client.height + ' cm' : $t('reservation.na') }}</p>
                <p class="mb-50"><strong>{{ $t('client.weight') }}:</strong> {{ selectedReservation.client.weight ? selectedReservation.client.weight + ' kg' : $t('reservation.na') }}</p>
                <p class="mb-50"><strong>{{ $t('client.address') }}:</strong> {{ selectedReservation.client.address || $t('reservation.na') }}</p>
              </b-col>
            </b-row>
            <div v-if="selectedReservation.client.medical_history" class="mt-50">
              <p class="mb-25"><strong>{{ $t('client.medicalHistory') }}:</strong></p>
              <b-alert variant="warning" show class="mb-0">
                {{ selectedReservation.client.medical_history }}
              </b-alert>
            </div>
          </b-card-body>
        </b-card>

        <b-row>
          <b-col cols="12" md="6">
            <p><strong>{{ $t('reservation.status') }}:</strong> 
              <b-badge :variant="getStatusVariant(selectedReservation.status)">
                {{ selectedReservation.status }}
              </b-badge>
            </p>
          </b-col>
          <b-col cols="12" md="6">
            <p><strong>{{ $t('reservation.appointment') }}:</strong> {{ formatDateTime(selectedReservation.appointment_date) }}</p>
            <p><strong>{{ $t('reservation.created') }}:</strong> {{ formatDateTime(selectedReservation.created_at) }}</p>
            <p v-if="selectedReservation.completed_at">
              <strong>{{ $t('reservation.completedAt') }}:</strong> {{ formatDateTime(selectedReservation.completed_at) }}
            </p>
          </b-col>
        </b-row>
        <hr>
        <p><strong>{{ $t('reservation.notes') }}:</strong></p>
        <p>{{ selectedReservation.notes || $t('reservation.na') }}</p>

        <div v-if="selectedReservation.diagnosis">
          <hr>
          <p><strong>{{ $t('reservation.diagnosis') }}:</strong></p>
          <p>{{ selectedReservation.diagnosis }}</p>
        </div>
        <div v-if="selectedReservation.treatment">
          <p><strong>{{ $t('reservation.treatment') }}:</strong></p>
          <p>{{ selectedReservation.treatment }}</p>
        </div>

        <div v-if="selectedReservation.requires_xray || selectedReservation.requires_lab">
          <hr>
          <h6>{{ $t('reservation.additionalRequirements') }}</h6>
          <div v-if="selectedReservation.requires_xray" class="mb-1">
            <b-badge variant="warning" class="mr-1">
              <feather-icon icon="ImageIcon" size="12" class="mr-25" />
              {{ $t('reservation.requiresXray') }}
            </b-badge>
            <p v-if="selectedReservation.xray_notes" class="mt-50 text-muted small">{{ selectedReservation.xray_notes }}</p>
          </div>
          <div v-if="selectedReservation.requires_lab">
            <b-badge variant="info" class="mr-1">
              <feather-icon icon="ActivityIcon" size="12" class="mr-25" />
              {{ $t('reservation.requiresLab') }}
            </b-badge>
            <p v-if="selectedReservation.lab_notes" class="mt-50 text-muted small">{{ selectedReservation.lab_notes }}</p>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- Edit Client Modal -->
    <b-modal
      v-model="editClientModalShow"
      :title="$t('client.editClient')"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="saveClientData">
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.name')" label-for="client-name">
              <b-form-input id="client-name" v-model="clientForm.name" required />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="Email" label-for="client-email">
              <b-form-input id="client-email" v-model="clientForm.email" type="email" required />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.phone')" label-for="client-phone">
              <b-form-input id="client-phone" v-model="clientForm.phone" required />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.dateOfBirth')" label-for="client-dob">
              <b-form-input id="client-dob" v-model="clientForm.date_of_birth" type="date" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.height')" label-for="client-height">
              <b-form-input id="client-height" v-model="clientForm.height" type="number" step="0.01" min="0" max="300" :placeholder="$t('client.heightPlaceholder')" />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.weight')" label-for="client-weight">
              <b-form-input id="client-weight" v-model="clientForm.weight" type="number" step="0.01" min="0" max="500" :placeholder="$t('client.weightPlaceholder')" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group :label="$t('client.address')" label-for="client-address">
          <b-form-textarea id="client-address" v-model="clientForm.address" rows="2" />
        </b-form-group>
        <b-form-group :label="$t('client.medicalHistory')" label-for="client-history">
          <b-form-textarea id="client-history" v-model="clientForm.medical_history" rows="3" />
        </b-form-group>
        <div class="text-right">
          <b-button variant="secondary" class="mr-1" @click="editClientModalShow = false">
            {{ $t('actions.cancel') }}
          </b-button>
          <b-button type="submit" variant="primary" :disabled="savingClient">
            <b-spinner v-if="savingClient" small class="mr-1" />
            {{ $t('actions.save') }}
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BButton,
  BTable,
  BPagination,
  BModal,
  BForm,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormTextarea,
  BFormCheckbox,
  BSpinner,
  BBadge,
  BAlert,
  BInputGroup,
  BInputGroupAppend,
  BTabs,
  BTab,
  VBTooltip,
} from 'bootstrap-vue'
import reservationsService from '@/services/reservations'
import openfdaService from '@/services/openfda'
import clientsService from '@/services/clients'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BCard,
    BRow,
    BCol,
    BButton,
    BTable,
    BPagination,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormTextarea,
    BFormCheckbox,
    BSpinner,
    BBadge,
    BAlert,
    BInputGroup,
    BInputGroupAppend,
    BTabs,
    BTab,
    BCardHeader: () => import('bootstrap-vue').then(m => m.BCardHeader),
    BCardBody: () => import('bootstrap-vue').then(m => m.BCardBody),
  },
  data() {
    return {
      reservations: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
      loading: false,
      completeModalShow: false,
      viewModalShow: false,
      completing: false,
      selectedReservation: null,
      completeForm: {
        diagnosis: '',
        treatment: '',
        requires_xray: false,
        xray_notes: '',
        requires_lab: false,
        lab_notes: '',
      },
      // OpenFDA drug search
      drugTabIndex: 0,
      drugSearchQuery: '',
      drugResults: [],
      drugResultsTotal: 0,
      drugSearching: false,
      drugSearched: false,
      selectedDrug: null,
      drugDetailModalShow: false,
      drugDetailData: null,
      drugDetailLoading: false,
      // Egypt drug search
      egyptDrugQuery: '',
      egyptResults: [],
      egyptResultsTotal: 0,
      egyptSearching: false,
      egyptSearched: false,
      selectedEgyptDrug: null,
      egyptCategoryFilter: '',
      egyptFormFilter: '',
      egyptCategories: [],
      egyptForms: [],
      filters: {
        search: '',
        status: '',
        date_from: '',
        date_to: '',
      },
      // Client edit
      editClientModalShow: false,
      savingClient: false,
      editingClientId: null,
      clientForm: {
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        height: '',
        weight: '',
        address: '',
        medical_history: '',
      },
    }
  },
  mounted() {
    const today = this.getTodayDate()
    this.filters.date_from = today
    this.filters.date_to = today
    this.fetchReservations()
    this.fetchEgyptDrugFilters()
  },
  watch: {
    '$store.state.broadcast.eventCounter'() {
      this.fetchReservations()
    },
  },
  computed: {
    fields() {
      return [
        { key: 'client.name', label: this.$t('table.client'), sortable: true },
        { key: 'appointment_date', label: this.$t('reservation.appointment'), formatter: this.formatDateTime, sortable: true },
        { key: 'status', label: this.$t('table.status'), sortable: true },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    },
    statusOptions() {
      return [
        { value: '', text: this.$t('filters.all') },
        { value: 'pending', text: this.$t('reservation.pending') },
        { value: 'confirmed', text: this.$t('reservation.confirmed') },
        { value: 'completed', text: this.$t('reservation.completed') },
        { value: 'cancelled', text: this.$t('reservation.cancelled') },
      ]
    },
    egyptCategoryOptions() {
      return [
        { value: '', text: this.$t('openfda.allCategories') },
        ...this.egyptCategories.map(c => ({ value: c, text: c })),
      ]
    },
    egyptFormOptions() {
      return [
        { value: '', text: this.$t('openfda.allForms') },
        ...this.egyptForms.map(f => ({ value: f, text: f })),
      ]
    },
  },
  methods: {
    async fetchReservations() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.current_page,
        }
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.date_from) params.date_from = this.filters.date_from
        if (this.filters.date_to) params.date_to = this.filters.date_to
        const response = await reservationsService.getReservations(params)
        this.reservations = response.data.data
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
        }
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: 'Error',
            text: 'Failed to load reservations',
            variant: 'danger',
          },
        })
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.pagination.current_page = 1
      this.fetchReservations()
    },
    resetFilters() {
      const today = this.getTodayDate()
      this.filters = { search: '', status: '', date_from: today, date_to: today }
      this.pagination.current_page = 1
      this.fetchReservations()
    },
    onPageChange(page) {
      this.pagination.current_page = page
      this.fetchReservations()
    },
    showCompleteModal(reservation) {
      this.selectedReservation = reservation
      this.completeForm = {
        diagnosis: '',
        treatment: '',
        requires_xray: false,
        xray_notes: '',
        requires_lab: false,
        lab_notes: '',
      }
      // Reset drug search state
      this.drugSearchQuery = ''
      this.drugResults = []
      this.drugResultsTotal = 0
      this.drugSearched = false
      this.selectedDrug = null
      // Reset Egypt drug search state
      this.egyptDrugQuery = ''
      this.egyptResults = []
      this.egyptResultsTotal = 0
      this.egyptSearched = false
      this.selectedEgyptDrug = null
      this.egyptCategoryFilter = ''
      this.egyptFormFilter = ''
      this.drugTabIndex = 0
      this.completeModalShow = true
    },
    viewReservation(reservation) {
      this.selectedReservation = reservation
      this.viewModalShow = true
    },
    async completeReservation() {
      this.completing = true
      try {
        await reservationsService.completeReservation(
          this.selectedReservation.id,
          this.completeForm
        )
        // this.$toast({
        //   component: 'ToastificationContent',
        //   props: {
        //     title: this.$t('messages.success'),
        //     text: this.$t('messages.reservationCompleted'),
        //     variant: 'success',
        //   },
        // })
        this.completeModalShow = false
        this.fetchReservations()
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.completeReservationError'),
            variant: 'danger',
          },
        })
      } finally {
        this.completing = false
      }
    },
    async printPrescription(reservation) {
      try {
        const response = await reservationsService.generatePrescription(reservation.id)
        
        // Create blob URL and download
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `prescription_${reservation.id}_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.prescriptionDownloaded'),
            variant: 'success',
          },
        })
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.generatePrescriptionError'),
            variant: 'danger',
          },
        })
      }
    },
    async fetchEgyptDrugFilters() {
      try {
        const response = await openfdaService.getEgyptDrugFilters()
        this.egyptCategories = response.data.categories || []
        this.egyptForms = response.data.forms || []
      } catch (error) {
        // Silently fail — filters are optional
      }
    },
    async searchEgyptDrugs() {
      if (!this.egyptDrugQuery || this.egyptDrugQuery.length < 1) return
      this.egyptSearching = true
      this.egyptSearched = false
      try {
        const response = await openfdaService.searchEgyptDrugs(this.egyptDrugQuery, {
          category: this.egyptCategoryFilter || undefined,
          form: this.egyptFormFilter || undefined,
        })
        this.egyptResults = response.data.results || []
        this.egyptResultsTotal = response.data.total || 0
      } catch (error) {
        this.egyptResults = []
        this.egyptResultsTotal = 0
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: this.$t('openfda.searchError'),
            variant: 'danger',
          },
        })
      } finally {
        this.egyptSearching = false
        this.egyptSearched = true
      }
    },
    appendEgyptDrugToTreatment(drug) {
      if (!drug) return
      const name = drug.name
      const form = drug.form ? ` - ${drug.form}` : ''
      const price = drug.price ? ` (${drug.price} EGP)` : ''
      const entry = `${name}${form}${price}`

      if (this.completeForm.treatment) {
        this.completeForm.treatment += '\n' + entry
      } else {
        this.completeForm.treatment = entry
      }

      this.$toast({
        component: 'ToastificationContent',
        props: {
          title: this.$t('messages.success'),
          text: this.$t('openfda.drugAdded', { name }),
          variant: 'success',
        },
      })
    },
    async searchDrugs() {
      if (!this.drugSearchQuery || this.drugSearchQuery.length < 2) return
      this.drugSearching = true
      this.drugSearched = false
      try {
        const response = await openfdaService.searchDrugs(this.drugSearchQuery)
        this.drugResults = response.data.results || []
        this.drugResultsTotal = response.data.total || 0
      } catch (error) {
        this.drugResults = []
        this.drugResultsTotal = 0
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: this.$t('openfda.searchError'),
            variant: 'danger',
          },
        })
      } finally {
        this.drugSearching = false
        this.drugSearched = true
      }
    },
    selectDrug(drug) {
      this.selectedDrug = this.selectedDrug === drug ? null : drug
    },
    appendDrugToTreatment(drug) {
      if (!drug) return
      const name = drug.brand_name || drug.generic_name
      const generic = drug.generic_name && drug.brand_name ? ` (${drug.generic_name})` : ''
      const form = drug.dosage_form ? ` - ${drug.dosage_form}` : ''
      const route = drug.route ? ` [${drug.route}]` : ''
      const entry = `${name}${generic}${form}${route}`

      if (this.completeForm.treatment) {
        this.completeForm.treatment += '\n' + entry
      } else {
        this.completeForm.treatment = entry
      }

      this.$toast({
        component: 'ToastificationContent',
        props: {
          title: this.$t('messages.success'),
          text: this.$t('openfda.drugAdded', { name }),
          variant: 'success',
        },
      })
    },
    async showDrugDetails(drug) {
      const name = drug.brand_name || drug.generic_name
      if (!name) return
      this.drugDetailModalShow = true
      this.drugDetailLoading = true
      this.drugDetailData = null
      try {
        const response = await openfdaService.getDrugDetails(name)
        this.drugDetailData = response.data
      } catch (error) {
        this.drugDetailData = drug // fallback to search result data
      } finally {
        this.drugDetailLoading = false
      }
    },
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },
    getStatusVariant(status) {
      const variants = {
        pending: 'warning',
        confirmed: 'info',
        completed: 'success',
        cancelled: 'danger',
      }
      return variants[status] || 'secondary'
    },
    formatDateTime(value) {
      if (!value) return 'N/A'
      // Parse as local time since backend returns Y-m-d H:i:s format
      const date = new Date(value + (value.includes(' ') ? '' : ''))
      return date.toLocaleString()
    },
    getTodayDate() {
      const d = new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    paginationCountText(paginationState) {
      if (!paginationState?.total) return '0 / 0'
      const from = ((paginationState.current_page - 1) * paginationState.per_page) + 1
      const to = Math.min(paginationState.current_page * paginationState.per_page, paginationState.total)
      return `${from}-${to} / ${paginationState.total}`
    },
    openEditClientModal(client) {
      this.editingClientId = client.id
      this.clientForm = {
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        date_of_birth: client.date_of_birth ? client.date_of_birth.substring(0, 10) : '',
        height: client.height || '',
        weight: client.weight || '',
        address: client.address || '',
        medical_history: client.medical_history || '',
      }
      this.editClientModalShow = true
    },
    async saveClientData() {
      this.savingClient = true
      try {
        const { data } = await clientsService.updateClient(this.editingClientId, this.clientForm)
        // Update client in selected reservation
        if (this.selectedReservation && this.selectedReservation.client) {
          Object.assign(this.selectedReservation.client, data)
        }
        this.editClientModalShow = false
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.updateSuccess'),
            variant: 'success',
          },
        })
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.saveError'),
            variant: 'danger',
          },
        })
      } finally {
        this.savingClient = false
      }
    },
  },
}
</script>

<style scoped>
.drug-results-scroll {
  max-height: 300px;
  overflow-y: auto;
}
</style>


