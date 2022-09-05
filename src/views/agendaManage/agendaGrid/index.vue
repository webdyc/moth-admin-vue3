<!--
 * @Author: 郝荣 haorong@unioncast.cn
 * @Date: 2022-08-24 14:48:42
 * @LastEditors: 郝荣 haorong@unioncast.cn
 * @LastEditTime: 2022-08-30 16:53:41
 * @FilePath: \moth-admin-vue3\src\views\agendaManage\agendaGrid\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-content">日程</div>
  <div id="calendar"></div>
  <a-modal
    v-model:visible="updateFormVisible"
    title="Basic Modal"
    wrapClassName="box"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="rightIcon">
      <a-popover v-model:visible="popoverVisible" placement="bottom" trigger="click">
        <template #content>
          <div @click="calenderDelete">删除</div>
        </template>
        <ellipsis-outlined />
      </a-popover>
    </div>
    <a-form :model="updateForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off">
      <a-form-item label="Username" v-bind="validateInfos.titleValue">
        <a-input v-model:value="updateForm.titleValue" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { ref, onMounted, createVNode } from 'vue';
import { Calendar } from '@fullcalendar/core';  //日历组件
import { reactive, toRefs, toRaw } from '@vue/reactivity'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';  // 视图
import interactionPlugin from '@fullcalendar/interaction';  // 拖动
import { Form, Modal } from 'ant-design-vue';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
const useForm = Form.useForm;
class PersonForm {
  // 值
  constructor() {
    this.titleValue = ''
  }
  // 验证方法
  static getRule () {
    return {
      titleValue: [{ required: true, message: '请填写标题名称', trigger: 'blur' }]
    }
  }
}
export default ({
  components: {
    EllipsisOutlined,
    ExclamationCircleOutlined
  },
  setup () {
    const cal = document.getElementById("calendar");
    const stateData = reactive({
      updateFormVisible: false,
      events: [],
      calendar: '',
      calendarData: '',
      updateForm: new PersonForm,
      popoverVisible: false
    })
    const { resetFields, validate, validateInfos } = useForm(
      stateData.updateForm,
      reactive(new PersonForm.getRule()),
    );
    onMounted(() => {
      const calendarEl = document.getElementById('calendar');
      stateData.calendar = new Calendar(calendarEl, {
        plugins: [resourceTimeGridPlugin, interactionPlugin],  // 组件
        timeZone: 'UTC',
        initialView: 'resourceTimeGridDay',  // 视图
        selectable: true,  // 选择区域
        locale: 'zh-cn',  // 语言
        editable: true,   // 开启拖动
        resources: [   // 表头标题
          { id: 'a', title: '场馆1' },
          { id: 'b', title: '场馆2' },
          { id: 'c', title: '场馆3' },
          { id: 'd', title: '场馆4' }
        ],  // 自定义表头
        // events: 'https://fullcalendar.io/api/demo-feeds/events.json?with-resources=5&single-day',   // 数据接口
        events: stateData.events, // 初始化数据
        select: function (info) {
          // 日历选择事件
          let rgb = `rgba(${Math.floor(Math.random() * 225)},${Math.floor(Math.random() * 225)},${Math.floor(Math.random() * 225)},1)`
          let eventsData = {
            resourceId: info.resource._resource.id, // 对应日历事件标头数据id
            title: '',// 日历事件标题
            start: info.startStr,//日历事件开始时间
            end: info.endStr,  //日历事件结束时间
            color: rgb, // 日历事件背景颜色
            id: new Date().getTime() + Math.floor(Math.random() * 100) //随机id以方便操作修改数据
          }
          stateData.events.push(eventsData)  // 备用数据暂时无用
          stateData.calendar.addEvent(eventsData);  // 添加数据
          stateData.calendarData = eventsData  // 暂存数据以方便数据编辑后回填
          stateData.updateFormVisible = true;
        },
        eventClick: function (info) {
          var eventObj = info.event;
          let eventsData = {
            resourceId: eventObj.resourceId,
            title: eventObj.title,
            start: eventObj.start,
            end: eventObj.end,
            color: eventObj.color,
            id: eventObj.id
          }
          stateData.updateForm.titleValue = eventObj.title
          stateData.calendarData = eventsData
          stateData.updateFormVisible = true;
        },
      });

      stateData.calendar.render();
    })
    // 弹出模态框确定事件
    const handleOk = (values) => {
      validate()
        .then(res => {
          console.log(res, toRaw(stateData.updateForm));
          var event = stateData.calendar.getEventById(stateData.calendarData.id) // an event object!
          event.setProp('title', stateData.updateForm.titleValue)  // 修改数据
          closeForm()
        })
        .catch(err => {
          console.log('error', err);
        });

      // console.log(stateData.calendar.getEvents());
      // let Events = stateData.calendar.getEvents()
      // let EventsData = []
      // Events.forEach(e => {
      //   EventsData.push({
      //     resourceId: e.resourceId,
      //     title: e.title,
      //     start: e.start,
      //     end: e.end,
      //     color: e.color,
      //     id: e.id
      //   })
      // })
      // console.log(EventsData);
    }
    // 模态框取消事件
    const handleCancel = () => {
      var event = stateData.calendar.getEventById(stateData.calendarData.id)
      if (!event.title) {
        event.remove()
      }
      closeForm()
    }
    // 删除日程数据
    const calenderDelete = () => {
      stateData.popoverVisible = false
      Modal.confirm({
        title: `是否删除该数据`,
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除数据，请谨慎操作!',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk () {
          var event = stateData.calendar.getEventById(stateData.calendarData.id)
          event.remove()
          closeForm()
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
    // 关闭弹窗
    const closeForm = () => {
      stateData.updateForm = new PersonForm()
      stateData.updateFormVisible = false;
    }
    return {
      ...toRefs(stateData),
      handleOk,
      handleCancel,
      validateInfos,
      calenderDelete,
      closeForm
    }
  },
})
</script>
<style lang="scss" scoped>
.rightIcon {
  position: absolute;
  top: 9px;
  right: 56px;
  font-size: 24px;
}
</style>
