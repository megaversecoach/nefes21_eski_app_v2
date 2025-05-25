<template>
  <div class="p-grid">
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <div style="text-align: center">
          <h3><b>Goals</b></h3>
          <p v-for="uxItem in userExperience.goals" :key="uxItem">
            {{ uxItem }}
          </p>
        </div>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <div style="text-align: center">
          <h3><b>Mood Segments</b></h3>
          <p v-for="uxItem in userExperience.mood_segments" :key="uxItem">
            {{ uxItem }}
          </p>
        </div>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <info-card :options="options"> </info-card>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <h3>Reminders</h3>
        <DataTable :value="userExperience.reminders" showGridlines>
          <Column field="reminder_id" header="Reminder ID" />
          <Column field="weekDays" header="Weekdays" />
          <Column field="isActive" header="isActive" />
          <Column field="timeOfDayHours" header="Hour" />
          <Column field="timeOfDayMins" header="Min" />
        </DataTable>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <h3>Track Progressions</h3>
        <DataTable
          :paginator="true"
          :rows="4"
          :value="userExperience.track_progressions"
          showGridlines
        >
          <Column field="track_id" header="Track ID" />
          <Column field="content_id" header="Content ID" />
          <Column header="Progression Date">
            <template #body="{ data }">
              <p>{{ convertToDate(data.dateCreated) }}</p>
            </template>
          </Column>
        </DataTable>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <h3>Part Progressions</h3>
        <DataTable
          :paginator="true"
          :rows="4"
          :value="userExperience.part_progressions"
          showGridlines
        >
          <Column field="part_id" header="Part ID" />
          <Column field="section_id" header="Section ID" />
          <Column field="program_id" header="Program ID" />
          <Column header="Progression Date">
            <template #body="{ data }">
              <p>{{ convertToDate(data.dateCreated) }}</p>
            </template>
          </Column>
        </DataTable>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <h3>Mood Check-ins</h3>
        <DataTable
          :paginator="true"
          :rows="4"
          :value="userExperience.mood_checkins"
          showGridlines
        >
          <Column field="checkin_id" header="Check-in ID" />
          <Column field="feeling_id" header="Feeling ID" />
          <Column field="mood_id" header="Mood ID" />
          <Column header="Check-in Date">
            <template #body="{ data }">
              <p>{{ convertToDate(data.dateCreated) }}</p>
            </template>
          </Column>
        </DataTable>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <h3>Favourites</h3>
        <DataTable :value="userExperience.favourites" showGridlines>
          <Column field="item_type" header="Item Type" />
          <Column field="item_id" header="Item ID" />
          <Column field="parent_id" header="Parent ID" />
        </DataTable>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card style="border-radius: 20px">
        <h3>Dimension Ratings</h3>
        <DataTable :value="userExperience.dimension_ratings" showGridlines>
          <Column field="dimension_id" header="Dimension Id" />
          <Column field="rating" header="Rating" />
        </DataTable>
      </base-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import InfoCard from '../../UI/ InfoCard'

export default {
  components: { InfoCard },
  props: ['userId'],
  computed: {
    ...mapGetters({
      userExperience: 'users/userExperience'
    }),
    options() {
      return [
        {
          name: 'isPushSubscribed',
          key: 'isPushSubscribed',
          value: this.userExperience.isPushSubscribed
        },
        {
          name: 'Meditation Experience',
          key: 'meditation_experience',
          value: this.userExperience.meditation_experience
        },
        {
          name: 'isPushPermitted',
          key: 'isPushPermitted',
          value: this.userExperience.isPushPermitted
        },
        {
          name: 'isEmailSubscribed',
          key: 'isEmailSubscribed',
          value: this.userExperience.isEmailSubscribed
        },
        {
          name: 'isMyplanShown',
          key: 'isMyplanShown',
          value: this.userExperience.isMyplanShown
        },
        {
          name: 'Onboarding Status',
          key: 'onboarding_status',
          value: this.userExperience.onboarding_status
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      getUserExperience: 'users/getUserExperience'
    })
  },
  async created() {
    await this.getUserExperience({
      userId: this.userId
    })
  }
}
</script>
