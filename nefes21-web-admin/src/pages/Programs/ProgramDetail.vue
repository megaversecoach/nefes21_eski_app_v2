<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between p-mb-4">
          <div class="p-d-flex">
            <h3 class="p-ml-3">Program Detail</h3>
            <div class="p-mt-3 p-ml-4">
              <Button
                v-if="!isStateNew"
                icon="pi pi pi-video"
                label="View Parts"
                @click="onViewPartsClick"
              />
            </div>
          </div>
          <div>
            <Button
              class="p-button-secondary p-mr-4"
              :icon="isStatePublished ? 'pi pi-angle-left' : 'pi pi pi-times'"
              :label="isStatePublished ? 'Back' : 'Discard'"
              @click="$router.back()"
            />
            <Button
              v-if="!isStatePublished"
              icon="pi pi-check"
              label="Save As Draft"
              @click="saveAsDraft"
            />
            <Button
              v-if="isStatePublished && !isPublishedProgramExistsOnDraft"
              class="p-button"
              label="Move Program to Draft"
              @click="moveProgramToDraft"
            />
            <small
              class="p-error"
              v-if="isStatePublished && isPublishedProgramExistsOnDraft"
            >
              Program is already in Draft! Please go to
              <strong>Drafted Programs</strong> Section to edit.
            </small>
          </div>
        </div>
        <div class="p-fluid p-d-flex">
          <div class="p-col-8">
            <div class="p-d-flex">
              <div class="p-col-6">
                <div class="p-field p-col-12 p-mt-4 p-mb-0">
                  <span class="p-float-label">
                    <InputText
                      id="programTitle"
                      style="margin-top: 3px"
                      v-model="v$.data.program_title.$model"
                      :class="{
                        'p-invalid': v$.data.program_title.$error,
                        'disabled-input': isStatePublished
                      }"
                      :disabled="isStatePublished"
                      @blur="v$.data.program_title.$touch()"
                    />
                    <label>Program Title</label>
                  </span>
                  <small
                    class="p-error"
                    v-for="error of v$.data.program_title.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Author</label>
                  <Dropdown
                    v-model="v$.data.author_id.$model"
                    :class="{
                      'p-invalid': v$.data.author_id.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="authors"
                    optionLabel="author_label"
                    optionValue="author_id"
                    placeholder="Select Author..."
                    @hide="v$.data.author_id.$touch()"
                  >
                    <template #option="slotProps">
                      <div>
                        <span style="margin-left: 0.5em; vertical-align: middle"
                          >{{ slotProps.option.author_id }} -
                          {{ slotProps.option.author_label }}</span
                        >
                      </div>
                    </template>
                  </Dropdown>

                  <small
                    class="p-error"
                    v-for="error of v$.data.author_id.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Program Is On Sale</label>
                  <Dropdown
                    v-model="v$.data.program_isOnSale.$model"
                    :class="{
                      'p-invalid': v$.data.program_isOnSale.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="isOnSaleOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Sale State..."
                    @hide="v$.data.program_isOnSale.$touch()"
                  />

                  <small
                    class="p-error"
                    v-for="error of v$.data.program_isOnSale.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
              </div>
              <div class="p-col-6">
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Program Validation</label>
                  <Dropdown
                    v-model="v$.data.program_isValid.$model"
                    :class="{
                      'p-invalid': v$.data.program_isValid.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="isValidOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Validation..."
                    @hide="v$.data.program_isValid.$touch()"
                  />
                  <small
                    class="p-error"
                    v-for="error of v$.data.program_isValid.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Program isFree</label>
                  <Dropdown
                    v-model="data.program_isFree"
                    :class="{
                      'disabled-input': isStatePublished
                    }"
                    :options="isFreeOptions"
                    disabled
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Free/Premium..."
                  />
                </div>
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Program isNew</label>
                  <Dropdown
                    v-model="v$.data.program_isNew.$model"
                    :class="{
                      'p-invalid': v$.data.program_isNew.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="isNewOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select New State..."
                    @hide="v$.data.program_isNew.$touch()"
                  />
                  <small
                    class="p-error"
                    v-for="error of v$.data.program_isNew.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </small>
                </div>
              </div>
            </div>
            <div class="p-col-12">
              <div class="p-col-12 p-mt-3">
                <span class="p-float-label">
                  <Textarea
                    id="programDescription"
                    v-model="v$.data.program_description.$model"
                    :class="{
                      'p-invalid': v$.data.program_description.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :autoResize="true"
                    rows="8"
                    @blur="v$.data.program_description.$touch()"
                  />
                  <label>Program Description</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.program_description.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
            </div>
            <div class="p-col-12">
              <div class="p-col-12 p-mt-2">
                <span class="p-float-label">
                  <Textarea
                    id="programInformation"
                    v-model="v$.data.program_information.$model"
                    :class="{
                      'p-invalid': v$.data.program_information.$error,
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :autoResize="true"
                    rows="8"
                    @blur="v$.data.program_information.$touch()"
                  />
                  <label>Program Information</label>
                </span>
                <small
                  class="p-error"
                  v-for="error of v$.data.program_information.$errors"
                  :key="error.$uid"
                >
                  {{ error.$message }}
                </small>
              </div>
            </div>
            <div class="p-d-flex">
              <div class="p-col-4">
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Product ID</label>
                  <Dropdown
                    v-model="data.product_id"
                    :class="{
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="programProducts"
                    optionLabel="product_label"
                    optionValue="product_id"
                    placeholder="Select Product..."
                  />
                </div>
              </div>
              <div class="p-col-4">
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Discounted Product ID</label>
                  <Dropdown
                    v-model="data.discounted_product_id"
                    :class="{
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="discountedProgramProducts"
                    optionLabel="product_label"
                    optionValue="product_id"
                    placeholder="Select Discounted Product..."
                  />
                </div>
              </div>
              <div class="p-col-4">
                <div class="p-field p-col-12 p-mb-0">
                  <label class="dropdown-label">Discount Rate</label>
                  <Dropdown
                    v-model="data.discountRate"
                    :class="{
                      'disabled-input': isStatePublished
                    }"
                    :disabled="isStatePublished"
                    :options="discountRateOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Discount Rate..."
                  />
                </div>
              </div>
            </div>
            <div
              :class="[
                'p-col-12 p-mb-4',
                { 'file-upload-error': v$.data.program_gains.$error }
              ]"
            >
              <DataTable
                :value="data.program_gains"
                responsiveLayout="scroll"
                showGridlines
              >
                <template #header>
                  <div
                    class="p-d-flex p-jc-between p-flex-column p-flex-sm-row"
                  >
                    <h3 class="p-mt-2 p-mb-0">Program Gains</h3>
                    <div>
                      <Button
                        v-if="!isStatePublished"
                        icon="pi pi-plus-circle"
                        label="Add New Gain"
                        @click="toggleGainDetailDialog(_, 'new')"
                      />
                    </div>
                  </div>
                </template>
                <template #empty
                  ><h4>Program has no Gains, start adding a new one...</h4>
                </template>
                <Column
                  field="orderInSection"
                  header="#"
                  headerStyle="text-align: center; width: 3rem;"
                />
                <Column field="title" header="Title" />
                <Column field="description" header="Description" />

                <Column
                  headerStyle="text-align: center; width: 8rem;"
                  header="Actions"
                  bodyStyle="text-align: center;"
                  :style="{
                    display: isStatePublished ? 'none' : ''
                  }"
                >
                  <template #body="{ data }">
                    <div class="p-d-flex">
                      <Button
                        label="Edit"
                        icon="pi pi-ellipsis-v"
                        class="p-button-outlined"
                        @click="toggleGainDetailDialog(data, 'edit')"
                      />
                      <Button
                        icon="pi pi-trash"
                        class="p-button-danger p-button-outlined p-ml-2"
                        @click="onDeleteGain(data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
              <small
                class="p-error"
                v-for="error of v$.data.program_gains.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div
              :class="[
                'p-col-12 p-mb-4',
                { 'file-upload-error': v$.data.program_sections.$error }
              ]"
            >
              <DataTable
                :value="data.program_sections"
                responsiveLayout="scroll"
                showGridlines
              >
                <template #header>
                  <div
                    class="p-d-flex p-jc-between p-flex-column p-flex-sm-row"
                  >
                    <h3 class="p-mt-2 p-mb-0">Program Sections</h3>
                    <div>
                      <Button
                        v-if="!isStatePublished"
                        icon="pi pi-plus-circle"
                        label="Add New Section"
                        @click="toggleSectionDetailDialog(_, 'new')"
                      />
                    </div>
                  </div>
                </template>
                <template #empty
                  ><h4>Program has no Sections, start adding a new one...</h4>
                </template>
                <Column
                  field="order"
                  header="#"
                  headerStyle="text-align: center; width: 3rem;"
                />
                <Column field="section_id" header="Section ID" />
                <Column field="section_title" header="Section Title" />

                <Column
                  headerStyle="text-align: center; width: 8rem;"
                  header="Actions"
                  bodyStyle="text-align: center;"
                  :style="{
                    display: isStatePublished ? 'none' : ''
                  }"
                >
                  <template #body="{ data }">
                    <div class="p-d-flex">
                      <Button
                        label="Edit"
                        icon="pi pi-ellipsis-v"
                        class="p-button-outlined"
                        @click="toggleSectionDetailDialog(data, 'edit')"
                      />
                      <Button
                        icon="pi pi-trash"
                        class="p-button-danger p-button-outlined p-ml-2"
                        @click="confirmDeleteSection(data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
              <small
                class="p-error"
                v-for="error of v$.data.program_sections.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="p-d-flex">
              <div class="p-field p-col-3">
                <span class="p-float-label">
                  <InputText
                    id="programDuration"
                    v-model="data.program_duration"
                    class="disabled-input"
                    disabled
                    type="text"
                  />
                  <label>Program Duration</label>
                </span>
              </div>
              <div class="p-field p-col-3">
                <span class="p-float-label">
                  <InputText
                    id="programPartCount"
                    v-model="data.program_partCount"
                    class="disabled-input"
                    disabled
                    type="text"
                  />
                  <label>Part Count</label>
                </span>
              </div>
              <div class="p-field p-col-3">
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
              <div class="p-field p-col-3">
                <span class="p-float-label">
                  <InputText
                    id="datePublished"
                    v-model="data.datePublished"
                    class="disabled-input"
                    disabled
                    type="text"
                  />
                  <label>Publish Date</label>
                </span>
              </div>
            </div>
          </div>
          <div class="p-col-4">
            <div class="p-d-flex p-mt-5">
              <div class="p-col-6">
                <div class="p-field">
                  <span class="p-float-label">
                    <InputText
                      id="programId"
                      v-model="data.program_id"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>Program ID</label>
                  </span>
                </div>
              </div>
              <div class="p-col-6">
                <div class="p-field">
                  <span class="p-float-label">
                    <InputText
                      id="programVersion"
                      v-model="data.program_version"
                      class="disabled-input"
                      disabled
                      type="text"
                    />
                    <label>Program Version</label>
                  </span>
                </div>
              </div>
            </div>
            <div class="p-text-center p-col-12">
              <h4 class="p-mt-0 p-mb-0">Cover Image</h4>
              <small>JPG - 1:1 - (1600x1600)</small>
              <div class="p-d-flex p-col-12 p-justify-center">
                <img
                  :src="activeCoverImageUrl"
                  :class="[
                    'program-cover-image p-shadow-4',
                    { 'image-error': v$.data.coverImageUrl.file.$error }
                  ]"
                />
              </div>
              <small
                class="p-error"
                v-for="error of v$.data.coverImageUrl.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
              <Button
                v-if="!isStatePublished && !isPublishedProgramExistsOnDraft"
                style="margin-top: 10px; margin-bottom: 10px; width: 24rem"
                label="Select Cover Image"
                @click="toggleCoverImageCropper"
              />
              <Cropper
                v-model="coverImageCropperShow"
                :width="1600"
                :height="1600"
                :noSquare="false"
                :noCircle="true"
                field="coverImage"
                img-format="jpg"
                lang-type="en"
                @crop-success="cropSuccess"
              />
            </div>
            <div class="p-text-center p-col-12">
              <h4 class="p-mt-0 p-mb-0">Quest Background Image</h4>
              <small>JPG - 1:1 - (1000x750)</small>
              <div class="p-d-flex p-col-12 p-justify-center">
                <img
                  :src="activeBgImageUrl"
                  :class="[
                    'bg-image p-shadow-4',
                    { 'image-error': v$.data.bgImageUrl.file.$error }
                  ]"
                />
              </div>
              <small
                class="p-error"
                v-for="error of v$.data.bgImageUrl.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
              <Button
                v-if="!isStatePublished && !isPublishedProgramExistsOnDraft"
                style="margin-top: 10px; margin-bottom: 10px; width: 24rem"
                label="Select Quest Background Image"
                @click="toggleBgImageCropper"
              />
              <Cropper
                v-model="bgImageCropperShow"
                :width="1000"
                :height="750"
                :noSquare="false"
                :noCircle="true"
                field="bgImage"
                img-format="jpg"
                lang-type="en"
                @crop-success="cropSuccess"
              />
            </div>
            <div class="p-text-center p-col-12">
              <h4 class="p-mt-0 p-mb-0">Trailer Cover Image</h4>
              <small>JPG - 1:1 - (1600x900)</small>
              <div class="p-d-flex p-col-12 p-justify-center">
                <img
                  :src="activeTrailerCoverImageUrl"
                  :class="[
                    'trailer-cover-image p-shadow-4',
                    { 'image-error': v$.data.trailerCoverImageUrl.file.$error }
                  ]"
                />
              </div>
              <small
                class="p-error"
                v-for="error of v$.data.trailerCoverImageUrl.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
              <Button
                v-if="!isStatePublished && !isPublishedProgramExistsOnDraft"
                style="margin-top: 10px; margin-bottom: 10px; width: 24rem"
                label="Select Trailer Cover Image"
                @click="toggleTrailerCoverImageCropper"
              />
              <Cropper
                v-model="trailerCoverImageCropperShow"
                :width="1600"
                :height="900"
                :noSquare="false"
                :noCircle="true"
                field="trailerCoverImage"
                img-format="jpg"
                lang-type="en"
                @crop-success="cropSuccess"
              />
            </div>
            <div
              v-if="!isStatePublished"
              :class="[
                'p-text-center p-col-12',
                { 'file-upload-error': v$.data.trailerUrl.file.$error }
              ]"
            >
              <h4 class="p-mt-0 p-mb-0">Trailer Video</h4>
              <small>MP4 - 16:9 - (min720p)</small>
              <FileUpload
                :fileLimit="1"
                :maxFileSize="100000000"
                :multiple="false"
                :showUploadButton="false"
                :showCancelButton="false"
                accept="video/mp4"
                @select="selectMp4"
              >
                <template #empty>
                  <p>Drag and drop mp4 to here to upload.</p>
                </template>
              </FileUpload>
              <small
                class="p-error"
                v-for="error of v$.data.trailerUrl.file.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}
              </small>
            </div>
          </div>
        </div>
      </base-card>
    </div>
  </div>
  <Dialog
    v-model:visible="isGainDetailDialogShow"
    header="Program Gain Detail"
    :style="{ width: '35rem' }"
    :modal="true"
    :closable="false"
    :closeOnEscape="false"
  >
    <div class="p-fluid p-grid">
      <div class="p-col-12">
        <div class="p-field p-mt-4">
          <span class="p-float-label">
            <InputText
              v-model="programGain.orderInSection"
              disabled
              class="disabled-input"
            />
            <label>Order In Section</label>
          </span>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <InputText
              v-model="v$.programGain.title.$model"
              :class="{
                'p-invalid': v$.programGain.title.$error
              }"
              @blur="v$.programGain.title.$touch()"
            />
            <label>Gain Title</label>
          </span>
          <small
            class="p-error"
            v-for="error of v$.programGain.title.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <Textarea
              v-model="v$.programGain.description.$model"
              :class="{
                'p-invalid': v$.programGain.description.$error
              }"
              :autoResize="true"
              rows="4"
              @blur="v$.programGain.description.$touch()"
            />
            <label>Gain Description</label>
          </span>
          <small
            class="p-error"
            v-for="error of v$.programGain.description.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        class="p-button-secondary"
        label="Discard"
        @click="onDiscardGainDetailDialog"
      ></Button>
      <Button
        :label="programGain.state === 'new' ? 'Add Gain' : 'Update Gain'"
        @click="onSaveGainDetailDialog"
      ></Button>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="isSectionDetailDialogShow"
    header="Program Section Detail"
    :style="{ width: '35rem' }"
    :modal="true"
    :closable="false"
    :closeOnEscape="false"
  >
    <div class="p-fluid p-grid">
      <div class="p-col-12">
        <div class="p-field p-mt-4">
          <span class="p-float-label">
            <InputText
              v-model="programSection.sectionId"
              disabled
              class="disabled-input"
            />
            <label>Section Id</label>
          </span>
        </div>
        <div class="p-field p-mt-4">
          <span class="p-float-label">
            <InputText
              v-model="programSection.order"
              disabled
              class="disabled-input"
            />
            <label>Order In Section</label>
          </span>
        </div>
      </div>
      <div class="p-col-12">
        <div class="p-field">
          <span class="p-float-label">
            <InputText
              v-model="v$.programSection.sectionTitle.$model"
              :class="{
                'p-invalid': v$.programSection.sectionTitle.$error
              }"
              @blur="v$.programSection.sectionTitle.$touch()"
            />
            <label>Section Title</label>
          </span>
          <small
            class="p-error"
            v-for="error of v$.programSection.sectionTitle.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        class="p-button-secondary"
        label="Discard"
        @click="onDiscardSectionDetailDialog"
      ></Button>
      <Button
        :label="
          programSection.state === 'new' ? 'Add Section' : 'Update Section'
        "
        @click="onSaveSectionDetailDialog"
      ></Button>
    </template>
  </Dialog>
  <ConfirmDialog :closable="false" :closeOnEscape="false" />
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import {
  maxLength,
  minLength,
  required,
  requiredIf
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import utilities from '../../utilities/utilities'
export default {
  props: ['programId', 'state'],
  data() {
    return {
      data: {
        program_id: '',
        program_title: '',
        program_description: '',
        program_information: '',
        program_gains: [],
        program_duration: 0,
        author_id: '',
        coverImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        bgImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        program_partCount: 0,
        program_sections: [],
        trailerUrl: {
          url: '',
          file: null
        },
        trailerCoverImageUrl: {
          url: '',
          editedUrl: '',
          file: null
        },
        program_isNew: '',
        program_isFree: false,
        program_isOnSale: true,
        product_id: '',
        discounted_product_id: '',
        discountRate: null,
        dateCreated: 0,
        datePublished: 0,
        program_isValid: '',
        program_version: 0
      },
      coverImageCropperShow: false,
      bgImageCropperShow: false,
      trailerCoverImageCropperShow: false,
      isOnSaleOptions: [
        { label: 'True', value: true },
        { label: 'False', value: false }
      ],
      isValidOptions: [
        { label: 'Valid', value: true },
        { label: 'Invalid', value: false }
      ],
      isFreeOptions: [
        { label: 'Free', value: true },
        { label: 'Premium', value: false }
      ],
      isNewOptions: [
        { label: 'True', value: true },
        { label: 'False', value: false }
      ],
      discountRateOptions: [
        { label: 'None', value: null },
        { label: '10%', value: 0.1 },
        { label: '20%', value: 0.2 },
        { label: '30%', value: 0.3 },
        { label: '40%', value: 0.4 },
        { label: '50%', value: 0.5 },
        { label: '60%', value: 0.6 },
        { label: '70%', value: 0.7 },
        { label: '80%', value: 0.8 },
        { label: '90%', value: 0.9 }
      ],
      isGainDetailDialogShow: false,
      programGain: {
        title: '',
        description: '',
        orderInSection: '',
        state: ''
      },
      isSectionDetailDialogShow: false,
      programSection: {
        sectionId: '',
        sectionTitle: '',
        order: '',
        state: ''
      }
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      data: {
        program_title: {
          required,
          minLength: minLength(10),
          maxLength: maxLength(30)
        },
        program_description: {
          required,
          minLength: minLength(70),
          maxLength: maxLength(130)
        },
        program_information: {
          required,
          minLength: minLength(200),
          maxLength: maxLength(400)
        },
        program_gains: { required },
        program_sections: { required },
        coverImageUrl: {
          file: { requiredIf: requiredIf(this.state === 'new') }
        },
        bgImageUrl: {
          file: { requiredIf: requiredIf(this.state === 'new') }
        },
        trailerCoverImageUrl: {
          file: { requiredIf: requiredIf(this.state === 'new') }
        },
        trailerUrl: {
          file: { requiredIf: requiredIf(this.state === 'new') }
        },
        author_id: { required },
        program_isNew: { required },
        program_isOnSale: { required },
        program_isValid: { required }
      },
      programGain: {
        title: { required, minLength: minLength(30), maxLength: maxLength(65) },
        description: {
          required,
          minLength: minLength(70),
          maxLength: maxLength(150)
        }
      },
      programSection: {
        sectionTitle: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(25)
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      getPublishedProgramById: 'programs/getPublishedProgramById',
      isProgramExistsOnDraft: 'programs/isProgramExistsOnDraft',
      authors: 'authors/getPublishedAuthors',
      programProducts: 'products/getProgramProducts',
      discountedProgramProducts: 'products/getDiscountedProgramProducts',
      draftedParts: 'parts/draftedParts',
      publishedParts: 'parts/publishedParts'
    }),

    isPublishedProgramExistsOnDraft() {
      if (this.isStatePublished) {
        return this.isProgramExistsOnDraft(this.programId)
      } else {
        return false
      }
    },
    activeCoverImageUrl() {
      if (this.data.coverImageUrl.file) {
        return this.data.coverImageUrl.editedUrl
      } else if (this.data.coverImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.coverImageUrl.url
        )
      } else {
        return require('@/assets/placeholder1x1.jpg')
      }
    },
    activeTrailerCoverImageUrl() {
      if (this.data.trailerCoverImageUrl.file) {
        return this.data.trailerCoverImageUrl.editedUrl
      } else if (this.data.trailerCoverImageUrl.url) {
        return this.$store.getters.getImageSourceURL(
          this.data.trailerCoverImageUrl.url
        )
      } else {
        return require('@/assets/placeholder16x9.jpg')
      }
    },
    activeBgImageUrl() {
      if (this.data.bgImageUrl.file) {
        return this.data.bgImageUrl.editedUrl
      } else if (this.data.bgImageUrl.url) {
        return this.$store.getters.getImageSourceURL(this.data.bgImageUrl.url)
      } else {
        return require('@/assets/placeholder4x3.jpg')
      }
    },
    isStatePublished() {
      console.log('(published) ProgramState: ', this.state)
      return this.state === 'publish'
    },
    isStateNew() {
      console.log('(new) ProgramState: ', this.state)
      return this.state === 'new'
    }
  },
  methods: {
    ...mapActions({
      getDraftedProgramById: 'programs/getDraftedProgramById',
      getProducts: 'products/getProducts',
      saveProgramAsDraft: 'programs/saveProgramAsDraft',
      getDraftedPartsByProgramId: 'parts/getDraftedPartsByProgramId',
      getPublishedPartsByProgramId: 'parts/getPublishedPartsByProgramId',
      savePartsAsDraft: 'parts/savePartAsDraft'
    }),
    async moveProgramToDraft() {
      this.$store.dispatch('changeUploadingState', { uploadingState: true })
      const result = await this.saveProgramAsDraft({
        state: this.state,
        programData: this.data
      })
      if (result) {
        const partResult = await this.savePartsAsDraft({
          state: 'draft',
          parts: this.publishedParts
        })
        if (partResult) {
          this.$store.dispatch('changeUploadingState', {
            uploadingState: false
          })
          this.$router.back()
        }
      }
    },
    isSectionSafeToDelete(sectionId) {
      console.log(
        'Section Safe to Delete: ',
        !this.draftedParts.some((part) => part.section_id === sectionId)
      )
      return !this.draftedParts.some((part) => part.section_id === sectionId)
    },
    confirmDeleteSection(data) {
      if (this.isSectionSafeToDelete(data.section_id)) {
        this.$confirm.require({
          message: 'Are you sure you want to delete the Section?',
          header: 'Delete Section from Program',
          icon: 'pi pi-trash',
          acceptClass: 'p-button-danger',
          acceptLabel: 'Delete',
          rejectLabel: 'Cancel',
          accept: () => {
            this.deleteSection(data.section_id)
            this.$confirm.close()
          },
          reject: () => {
            this.$confirm.close()
          }
        })
      } else {
        this.$confirm.require({
          message: 'It is not available to delete a Section with Parts in it.',
          header: 'Section is unavailable to delete',
          icon: 'pi pi-exclamation-circle',
          acceptLabel: 'OK',
          rejectLabel: 'Cancel',
          accept: () => {
            this.$confirm.close()
          },
          reject: () => {
            this.$confirm.close()
          }
        })
      }
    },
    onViewPartsClick() {
      this.$router.push({
        name: 'Parts',
        params: {
          programId: this.data.program_id,
          state: this.state
        }
      })
    },
    selectMp4(event) {
      this.data.trailerUrl.file = event.files[0]
    },
    onAddNewSection() {
      const newSectionOrder = this.data.program_sections.length + 1
      const newSection = {
        section_id: 'section-' + Math.floor(100000 + Math.random() * 900000),
        section_title: '',
        order: newSectionOrder
      }
      this.data.program_sections.push(newSection)
    },
    deleteSection(sectionId) {
      console.log('DeleteSection: ', sectionId)
      const index = this.data.program_sections.findIndex(
        (section) => section.section_id === sectionId
      )
      this.data.program_sections.splice(index, 1)
      this.reorderProgramSections()
    },
    reorderProgramSections() {
      this.data.program_sections.forEach(function (item, index) {
        item.order = index + 1
      })
    },
    reorderProgramGains() {
      this.data.program_gains.forEach(function (item, index) {
        item.orderInSection = index + 1
      })
    },
    onDeleteGain(data) {
      console.log('DeleteGain: ', data)
      this.data.program_gains.splice(data.orderInSection - 1, 1)
      this.reorderProgramGains()
    },
    onDiscardSectionDetailDialog() {
      this.isSectionDetailDialogShow = false
    },
    onSaveSectionDetailDialog() {
      this.v$.programSection.$touch()
      if (this.v$.programSection.$error) {
        console.log('SaveSectionError:', this.v$.programGain.$error)
        return false
      } else {
        if (this.programSection.state === 'edit') {
          const index = this.data.program_sections.findIndex(
            (section) => section.section_id === this.programSection.sectionId
          )
          this.data.program_sections[
            index
          ].title = this.programSection.sectionTitle
        } else {
          const newProgramSection = {
            section_id:
              'section-' + Math.floor(100000 + Math.random() * 900000),
            section_title: this.programSection.sectionTitle,
            order: this.data.program_sections.length + 1
          }
          this.data.program_sections.push(newProgramSection)
        }
        this.isSectionDetailDialogShow = false
      }
    },
    toggleSectionDetailDialog(data, state) {
      this.v$.programSection.$reset()
      this.programSection.state = state
      if (state === 'edit') {
        this.programSection.sectionId = data.section_id
        this.programSection.sectionTitle = data.section_title
        this.programSection.order = data.order
      } else {
        this.clearProgramSection()
      }

      this.isSectionDetailDialogShow = true
    },
    clearProgramSection() {
      this.programSection.sectionId = ''
      this.programSection.sectionTitle = ''
      this.programSection.order = ''
    },
    onDiscardGainDetailDialog() {
      this.isGainDetailDialogShow = false
    },
    onSaveGainDetailDialog() {
      this.v$.programGain.$touch()
      if (this.v$.programGain.$error) {
        console.log('SaveGainError:', this.v$.programGain.$error)
        return false
      } else {
        if (this.programGain.state === 'edit') {
          const index = this.data.program_gains.findIndex(
            (gain) => gain.orderInSection === this.programGain.orderInSection
          )
          this.data.program_gains[index].title = this.programGain.title
          this.data.program_gains[
            index
          ].description = this.programGain.description
        } else {
          const newProgramGain = {
            title: this.programGain.title,
            description: this.programGain.description,
            orderInSection: this.data.program_gains.length + 1
          }
          this.data.program_gains.push(newProgramGain)
        }
        this.isGainDetailDialogShow = false
      }
    },
    toggleGainDetailDialog(data, state) {
      this.v$.$reset()
      this.programGain.state = state
      if (state === 'edit') {
        this.programGain.title = data.title
        this.programGain.description = data.description
        this.programGain.orderInSection = data.orderInSection
      } else {
        this.clearProgramGain()
      }

      this.isGainDetailDialogShow = true
    },
    clearProgramGain() {
      this.programGain.title = ''
      this.programGain.description = ''
      this.programGain.orderInSection = ''
    },
    cropSuccess(imageDataUrl, field) {
      utilities
        .convertUrlToFile(imageDataUrl, field, 'image/jpg')
        .then((file) => {
          if (field === 'coverImage') {
            this.data.coverImageUrl.file = file
            this.data.coverImageUrl.editedUrl = imageDataUrl
          } else if (field === 'bgImage') {
            this.data.bgImageUrl.file = file
            this.data.bgImageUrl.editedUrl = imageDataUrl
          } else {
            this.data.trailerCoverImageUrl.file = file
            this.data.trailerCoverImageUrl.editedUrl = imageDataUrl
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleCoverImageCropper() {
      this.coverImageCropperShow = !this.coverImageCropperShow
    },
    toggleBgImageCropper() {
      this.bgImageCropperShow = !this.bgImageCropperShow
    },
    toggleTrailerCoverImageCropper() {
      this.trailerCoverImageCropperShow = !this.trailerCoverImageCropperShow
    },
    configure(object) {
      this.data.program_id = object.program_id
      this.data.program_title = object.program_title
      this.data.program_description = object.program_description
      this.data.program_information = object.program_information
      this.data.program_gains = object.program_gains
      this.data.program_duration = object.program_duration
      this.data.author_id = object.author_id
      this.data.coverImageUrl.url = object.coverImageUrl
      this.data.bgImageUrl.url = object.bgImageUrl
      this.data.program_partCount = object.program_partCount
      this.data.program_sections = object.program_sections
      this.data.trailerUrl.url = object.trailerUrl
      this.data.trailerCoverImageUrl.url = object.trailerCoverImageUrl
      this.data.program_isNew = object.program_isNew
      this.data.program_isFree = object.program_isFree
      this.data.program_isOnSale = object.program_isOnSale
      this.data.product_id = object.product_id
      this.data.discounted_product_id = object.discounted_product_id
      this.data.discountRate = object.discountRate
      this.data.dateCreated = object.dateCreated
      this.data.datePublished = object.datePublished
      this.data.program_isValid = object.program_isValid
      this.data.program_version = object.program_version
    },
    async saveAsDraft() {
      this.v$.data.$touch()
      if (this.v$.data.$error) {
        console.log('ProgramValidationError')
        return
      } else {
        console.log('ProgramSaveAttempt')
        this.$store.dispatch('changeUploadingState', { uploadingState: true })
        const result = await this.saveProgramAsDraft({
          state: this.state,
          programData: this.data
        })
        if (result) {
          this.$store.dispatch('changeUploadingState', {
            uploadingState: false
          })
          this.$router.back()
        } else {
          console.log('Program Save Error')
        }
      }
    }
  },
  async created() {
    await this.getProducts()
    if (!this.isStateNew) {
      if (this.isStatePublished) {
        await this.getPublishedPartsByProgramId({ program_id: this.programId })
        const data = this.getPublishedProgramById(this.programId)
        this.configure(data)
      } else {
        await this.getDraftedPartsByProgramId({ program_id: this.programId })
        const data = await this.getDraftedProgramById({
          program_id: this.programId
        })
        this.configure(data)
      }
    }
  }
}
</script>

<style scoped>
.program-cover-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 24rem;
  height: 24rem;
  object-fit: cover;
}
.bg-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 24rem;
  height: 18rem;
  object-fit: cover;
}
.trailer-cover-image {
  border-radius: 20px;
  border-style: solid;
  border-width: 3px;
  border-color: white;
  width: 24rem;
  height: 13.5rem;
  object-fit: cover;
}
.invalid-div {
  background-color: red !important;
}
.file-upload-error {
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  border-color: #f44336;
}
.image-error {
  border-color: #f44336;
}
</style>
