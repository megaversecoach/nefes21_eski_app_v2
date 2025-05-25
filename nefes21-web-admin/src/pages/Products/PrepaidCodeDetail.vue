<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Prepaid Code Detail</h3>
          <div>
            <label v-if="!isOnEditState" class="p-mr-2">Quantity:</label>
            <Dropdown
              v-if="!isOnEditState"
              id="quantity"
              v-model="quantity"
              class="p-button-secondary p-mr-4"
              :options="quantityOptions"
              placeholder="Select Quantity..."
              @hide="v$.quantity.$touch()"
            />

            <Button
              class="p-button-secondary p-mr-4"
              icon="pi pi-times"
              label="Discard"
              @click="$router.back()"
            />
            <Button
              v-if="isOnEditState"
              :class="[isRefunded ? 'p-button-danger' : '']"
              icon="pi pi-refresh"
              :label="refundButtonLabel"
              :disabled="isRefunded"
              @click="refundCode"
            />
            <Button
              v-else
              icon="pi pi-check"
              label="Create Code"
              @click="saveData"
            />
          </div>
        </div>

        <div class="p-fluid p-d-flex">
          <div class="p-col-6">
            <div class="p-field p-col-12 p-mt-4 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="codeId"
                  style="margin-top: 3px"
                  v-model="data.code_id"
                  class="code-input disabled-input"
                  disabled
                  type="text"
                />
                <label>Code ID</label>
              </span>
            </div>
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Product</label>
              <Dropdown
                id="productId"
                v-model="v$.data.product_id.$model"
                :class="{
                  'disabled-input': isOnEditState,
                  'p-invalid': v$.data.product_id.$error
                }"
                :disabled="isOnEditState"
                :options="products"
                optionLabel="product_id"
                optionValue="product_id"
                placeholder="Select Product..."
                @hide="v$.data.product_id.$touch()"
              >
              </Dropdown>
              <small
                class="p-error"
                v-for="error of v$.data.product_id.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mt-4 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="dateCreated"
                  v-model="data.dateCreated"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Creation Date</label>
              </span>
            </div>
            <div class="p-field p-col-12 p-mt-4 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="dateCreatedFormatted"
                  v-model="dateCreatedFormatted"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Creation Date Formatted</label>
              </span>
            </div>
          </div>
          <div class="p-col-6">
            <div class="p-d-flex">
              <div class="p-field p-col-6 p-mb-0">
                <label class="dropdown-label">Code Validation</label>
                <Dropdown
                  v-model="data.code_isValid"
                  class="disabled-input"
                  :options="isValidOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Validation..."
                  disabled
                />
              </div>
              <div class="p-field p-col-6 p-mb-0">
                <label class="dropdown-label">Code Redemption</label>
                <Dropdown
                  v-model="data.code_isRedeemed"
                  class="disabled-input"
                  :options="isRedeemedOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Redemption..."
                  disabled
                />
              </div>
            </div>
            <div class="p-field p-col-12 p-mt-2 p-mb-0">
              <label class="dropdown-label">Supplier</label>
              <Dropdown
                id="supplierId"
                v-model="v$.data.supplier_id.$model"
                :class="{
                  'disabled-input': isOnEditState,
                  'p-invalid': v$.data.supplier_id.$error
                }"
                :disabled="isOnEditState"
                :options="suppliers"
                optionLabel="supplier_label"
                optionValue="supplier_id"
                placeholder="Select Supplier..."
                @hide="v$.data.supplier_id.$touch()"
              >
              </Dropdown>
              <small
                class="p-error"
                v-for="error of v$.data.supplier_id.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-field p-col-12 p-mt-4 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="expirationDate"
                  v-model="data.expiration_date"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Expiration Date</label>
              </span>
            </div>
            <div class="p-field p-col-12 p-mt-4 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="expirationDateFormatted"
                  v-model="expirationDateFormatted"
                  class="disabled-input"
                  disabled
                  type="text"
                />
                <label>Expiration Date Formatted</label>
              </span>
            </div>
          </div>
        </div>
      </base-card>
    </div>
  </div>
  <Dialog
    :header="'Generated Prepaid Codes'"
    v-model:visible="displayModal"
    :style="{ width: '30rem' }"
    :closable="false"
    :closeOnEscape="false"
    :modal="true"
  >
    <div class="p-col-12">
      <DataTable
        :value="generatedPrepaidCodes"
        responsiveLayout="scroll"
        showGridlines
      >
        <template #header>
          <Button label="Export" />
        </template>
        <Column field="code_id" header="Code ID" />
        <Column field="supplier_id" header="Supplier ID" />
      </DataTable>
      <Button label="Done" @click="closeModal" />
    </div>
  </Dialog>
</template>
<script>
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { mapActions, mapGetters } from 'vuex'
export default {
  props: ['codeId', 'state'],
  data() {
    return {
      data: {
        code_id: '',
        product_id: '',
        supplier_id: '',
        dateCreated: '',
        expiration_date: '',
        code_isRedeemed: '',
        code_isValid: ''
      },
      quantity: 1,
      quantityOptions: [1, 2, 3, 4, 5, 10, 20, 30, 40, 50],
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      isRedeemedOptions: [
        { label: 'Redeemed', value: true },
        { label: 'Not-Redeemed', value: false }
      ],
      displayModal: false,
      generatedPrepaidCodes: []
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        product_id: { required },
        supplier_id: { required }
      },
      quantity: { required }
    }
  },
  computed: {
    ...mapGetters({
      products: 'products/getProducts',
      suppliers: 'products/getSuppliers'
    }),
    dateCreatedFormatted() {
      if (this.data.dateCreated) {
        let date = new Date(0)
        date.setUTCMilliseconds(this.data.dateCreated)
        return date.toLocaleString('tr-TR')
      }
      return ''
    },
    expirationDateFormatted() {
      if (this.data.dateCreated) {
        let date = new Date(0)
        date.setUTCMilliseconds(this.data.expiration_date)
        return date.toLocaleString('tr-TR')
      }
      return ''
    },
    isRefunded() {
      return !this.data.code_isValid
    },
    isOnEditState() {
      console.log('state: ', this.state)
      return this.state === 'edit'
    },
    refundButtonLabel() {
      if (this.data.code_isValid) {
        return 'Refund'
      } else {
        return 'Refunded'
      }
    }
  },
  methods: {
    ...mapActions({
      getProducts: 'products/getProducts',
      getSuppliers: 'products/getSuppliers',
      savePrepaidCode: 'products/savePrepaidCode',
      refundPrepaidCode: 'products/refundPrepaidCode'
    }),
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        const result = await this.savePrepaidCode({
          data: this.data,
          quantity: this.quantity
        })
        if (result) {
          console.log('SavePrepaidResult', result)
          this.generatedPrepaidCodes = result
          this.displayModal = true
        }
      }
    },
    async refundCode() {
      const result = await this.refundPrepaidCode({ data: this.data })
      if (result) {
        this.$router.back()
      }
    },
    closeModal() {
      this.displayModal = false
      this.$router.back()
    },
    configure(object) {
      this.data.code_id = object.code_id
      this.data.product_id = object.product_id
      this.data.supplier_id = object.supplier_id
      this.data.dateCreated = object.dateCreated
      this.data.expiration_date = object.expiration_date
      this.data.code_isRedeemed = object.code_isRedeemed
      this.data.code_isValid = object.code_isValid
    }
  },
  created() {
    if (this.state === 'edit') {
      const data = this.$store.getters['products/getPrepaidCodeById'](
        this.codeId
      )
      this.configure(data)
    }
    this.getProducts()
    this.getSuppliers()
  }
}
</script>
<style scoped>
.code-input {
  font-weight: 700;
  font-size: 26px;
  letter-spacing: 0.5px;
}
</style>
