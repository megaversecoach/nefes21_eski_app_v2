<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <h3 class="p-ml-3">Promo Code Detail</h3>
          <div>
            <Button
              class="p-button-secondary p-mr-4"
              icon="pi pi-times"
              label="Discard"
              @click="$router.back()"
            />
            <Button
              icon="pi pi-check"
              :label="saveButtonLabel"
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
                  v-model="v$.data.code_id.$model"
                  :class="[
                    'code-input',
                    {
                      'disabled-input': isOnEditState
                    },
                    {
                      'p-invalid': v$.data.code_id.$error
                    }
                  ]"
                  :disabled="isOnEditState"
                  type="text"
                  @keydown.space.prevent
                  @input="
                    v$.data.code_id.$model = $event.target.value.toLocaleUpperCase(
                      'tr-TR'
                    )
                  "
                  @blur="v$.data.code_id.$touch()"
                />
                <label>Code ID</label>
              </span>
              <small
                class="p-error"
                v-for="error of v$.data.code_id.$errors"
                :key="error.$uid"
              >
                {{ error.$message }} <br />
              </small>
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
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Code Validation</label>
              <Dropdown
                v-model="v$.data.code_isValid.$model"
                :class="{
                  'p-invalid': v$.data.code_isValid.$error
                }"
                :options="isValidOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Validation..."
                @hide="v$.data.code_isValid.$touch()"
              />
              <small
                class="p-error"
                v-for="error of v$.data.code_isValid.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
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
            <div class="p-field p-col-12 p-mb-0">
              <label class="dropdown-label">Expiration Date</label>
              <Calendar
                id="expirationDate"
                v-model="v$.expirationDate.$model"
                :class="{
                  'p-invalid': v$.expirationDate.$error
                }"
                dateFormat="@"
                :showIcon="true"
                :manualInput="false"
                :minDate="new Date()"
                placeholder="Select Expiration Date..."
                @hide="v$.expirationDate.$touch()"
              />
              <small
                class="p-error"
                v-for="error of v$.expirationDate.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>

            <div class="p-field p-col-12 p-mt-4 p-mb-0">
              <span class="p-float-label">
                <InputText
                  id="expirationDateFormatted"
                  disabled
                  v-model="expirationDateFormatted"
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
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
const XNotAllowed = (value) => !value.startsWith('X')
const JNotAllowed = (value) => !value.startsWith('J')
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
        code_isValid: ''
      },
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      expirationDateFormatted: '',
      expirationDate: ''
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        code_id: {
          mustBeUnique: helpers.withMessage(
            'This field must be unique across Promo Codes',
            this.isUnique
          ),
          XNotAllowed: helpers.withMessage(
            'This field must not start with X !',
            XNotAllowed
          ),
          JNotAllowed: helpers.withMessage(
            'This field must not start with J !',
            JNotAllowed
          ),
          required,
          minLength: minLength(3),
          maxLength: maxLength(12)
        },
        product_id: { required },
        supplier_id: { required },
        expiration_date: { required },
        code_isValid: { required }
      },
      expirationDate: { required }
    }
  },
  watch: {
    expirationDate: {
      handler: function () {
        let date = new Date(0)
        this.data.expiration_date = String(
          date.setUTCMilliseconds(this.expirationDate)
        )
        console.log('data.expiration_date: ', this.data.expiration_date)
        this.expirationDateFormatted = date.toLocaleString('tr-TR')
      }
    }
  },
  computed: {
    ...mapGetters({
      products: 'products/getProducts',
      suppliers: 'products/getSuppliers',
      promoCodes: 'products/getPromoCodes'
    }),
    saveButtonLabel() {
      if (this.state === 'new') {
        return 'Create Code'
      } else {
        return 'Save'
      }
    },
    expirationDateMS() {
      return this.data.expiration_date
    },
    dateCreatedFormatted() {
      if (this.data.dateCreated) {
        let date = new Date(0)
        date.setUTCMilliseconds(this.data.dateCreated)
        return date.toLocaleString('tr-TR')
      }
      return ''
    },
    isOnEditState() {
      return this.state === 'edit'
    }
  },
  methods: {
    ...mapActions({
      getProducts: 'products/getProducts',
      getSuppliers: 'products/getSuppliers',
      getPromoCodes: 'products/getPromoCodes',
      savePromoCode: 'products/savePromoCode'
    }),
    async saveData() {
      this.v$.$touch()
      if (this.v$.$error) return
      else {
        const result = await this.savePromoCode({
          data: this.data
        })
        if (result) {
          console.log('SavePromoResult', result)
        }
      }
    },

    isUnique() {
      if (this.state === 'new') {
        if (this.promoCodes) {
          const data = this.promoCodes.filter(
            (promoCode) => promoCode.code_id === this.data.code_id
          )
          return data.length === 0
        }
      } else {
        return true
      }
    },
    configure(object) {
      this.data.code_id = object.code_id
      this.data.product_id = object.product_id
      this.data.supplier_id = object.supplier_id
      this.data.dateCreated = object.dateCreated
      this.expirationDate = object.expiration_date
      this.data.code_isValid = object.code_isValid

      this.expirationDate = object.expiration_date
    }
  },
  created() {
    if (this.state === 'edit') {
      const data = this.$store.getters['products/getPromoCodeById'](this.codeId)
      this.configure(data)
    }
    this.getProducts()
    this.getSuppliers()
    this.getPromoCodes()
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
