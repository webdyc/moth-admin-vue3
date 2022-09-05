<template>
  <div class="app-content">
    日程
    <div id="calendar"></div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
export default ({
  setup () {
    const cal = document.getElementById("calendar");
    onMounted(() => {
      var calendarEl = document.getElementById('calendar');
      var calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        timeZone: 'UTC',
        events: 'https://fullcalendar.io/api/demo-feeds/events.json',
        editable: true,
        selectable: true
      });

      calendar.render();
    })
  },
})
</script>

