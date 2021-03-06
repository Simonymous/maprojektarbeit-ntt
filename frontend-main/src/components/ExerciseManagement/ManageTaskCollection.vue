<template>
  <div>
    <div class="taskCollectionInputs p-grid">
      <div class="p-col-12 p-md-6 p-lg-3">
        <span class="p-float-label">
          <InputText
            type="text"
            v-model="taskCollection._id"
            id="ID"
            disabled="true"
          />
          <label for="ID">ID</label>
        </span>
      </div>
      <div class="p-col-12 p-md-6 p-lg-3">
        <span class="p-float-label">
          <InputText type="text" v-model="taskCollection.title" id="Titel" />
          <label for="Titel">Titel</label>
        </span>
      </div>
      <div class="p-col-12 p-md-6 p-lg-3">
        <span class="p-float-label">
          <InputText type="text" v-model="taskCollection.tags" id="Tags" />
          <label for="Tags">Tags</label>
        </span>
      </div>
      <div class="p-col-12 p-md-6 p-lg-3">
        <span class="p-float-label">
          <InputText type="text" v-model="taskCollection.course" id="Course" />
          <label for="Course">Course</label>
        </span>
      </div>
      <div class="p-col-12">
        <span class="p-float-label">
          <Textarea
            v-model="taskCollection.description"
            id="Description"
            rows="5"
            cols="60"
          />
          <label for="Description">Description</label>
        </span>
      </div>
    </div>

    <DataTable
      :value="taskCollection?.tasks"
      @row-reorder="onRowReorder"
      editMode="cell"
    >
      <Column :rowReorder="true" headerStyle="width: 3rem" />

      <Column field="title" header="Aufgabenname"></Column>
      <Column field="weighting">
        <template #header>
          {{ "Gewichtung (Absolut), Gesamt: " + totalPoints }}
        </template>
        <template #body="slotProps">
          <InputText
            v-model="slotProps.data.weighting"
            @input="calcTotalPoints()"
            className="p-inputtext p-component p-filled weightingInput"
          />
        </template>
      </Column>
      <Column field="weighting" :header="'Gewichtung (in Relation)'">
        <template #body="slotProps">
          {{
            Math.round((slotProps.data.weighting * 10000) / this.totalPoints) /
            100
          }}
          %
        </template>
      </Column>
      <Column :exportable="false">
        <template #header>
          <customAutocomplete @addTask="addTask" />
        </template>

        <template #body="slotProps">
          <Button
            icon="pi pi-search"
            class="p-button-rounded p-button-text"
            @click="handleInspectTask(slotProps)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger p-button-text"
            @click="handleRemoveTask(slotProps)"
          />
        </template>
      </Column>
    </DataTable>

    <div class="createTaskCollectionFooter">
      <Button label="Save" v-on:click="handleSaveClick"></Button>
      <Button
        label="Delete"
        v-on:click="handleDeleteClick"
        class="p-button-danger"
      ></Button>
      <Button label="Export" v-on:click="handleExportClick"></Button>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import Autocomplete from "./Autocomplete";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

import { getBackendRequestDummy } from "../../helper/dummyRequests";
import {
  getBackendRequest,
  postBackendRequest,
  deleteBackendRequest,
  putBackendRequest,
} from "../../helper/requests";
const PATHS = require("../../../config.json").URL_PATHS;

const TASK_PATH = PATHS.TASK_PATH;
const TASK_COLLECTION_PATH = PATHS.TASK_COLLECTION_PATH;
const CREATE_TASK_COLLECTION_PATH = PATHS.CREATE_TASK_COLLECTION_PATH;
const UPDATE_TASK_COLLECTION_PATH = PATHS.UPDATE_TASK_COLLECTION_PATH;
const DELETE_TASK_COLLECTION_PATH = PATHS.DELETE_TASK_COLLECTION_PATH;
const DEEP_EXPORT_TASK_COLLECTION = PATHS.DEEP_EXPORT_TASK_COLLECTION;

export default {
  components: {
    customAutocomplete: Autocomplete,
  },
  props: {
    taskCollectionID: String,
  },
  setup(props, { emit }) {
    const totalPoints = ref();
    const confirm = useConfirm();
    const toast = useToast();
    const router = useRouter();

    let emptyTaskCollection = {
      _id: -1,
      type: "TaskCollection",
      title: "",
      description: "",
      date: new Date(),
      tags: [],
      course: "",
      creator: "",
      tasks: [],
    };

    const taskCollection = ref({ ...emptyTaskCollection });

    init();
    async function init() {
      if (props.taskCollectionID === -1) {
        taskCollection.value = { ...emptyTaskCollection };
      } else {
        await getTaskCollections();
      }
      calcTotalPoints();
    }

    watch(
      () => props.taskCollectionID,
      () => init()
    );

    async function getTaskCollections() {
      try {
        if (process.env.VUE_APP_BACKEND_ONLINE === "true") {
          taskCollection.value = await getBackendRequest(
            TASK_COLLECTION_PATH + "/" + props.taskCollectionID
          );
        } else {
          taskCollection.value = getBackendRequestDummy(
            TASK_COLLECTION_PATH + "/" + props.taskCollectionID
          );
        }
      } catch (error) {
        toast.add({
          severity: "error",
          summary: error.message,
          life: 10000,
        });
      }
    }

    async function handleSaveClick() {
      try {
        if (taskCollection.value._id === -1) {
          await postBackendRequest(
            CREATE_TASK_COLLECTION_PATH,
            taskCollection.value
          );
        } else {
          await putBackendRequest(
            UPDATE_TASK_COLLECTION_PATH,
            taskCollection.value
          );
        }
        router.go();
        toast.add({
          severity: "success",
          summary: "TaskCollection wurde gespeichert",
          life: 10000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: error.message,
          life: 10000,
        });
      }
      router.go();
    }

    async function handleDeleteClick() {
      try {
        confirm.require({
          message: "Möchten sie das Aufgabenblatt löschen?",
          header: "Aufgabenblatt löschen",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            await deleteBackendRequest(
              DELETE_TASK_COLLECTION_PATH + "/" + taskCollection.value._id
            );
            taskCollection.value = { ...emptyTaskCollection };
            router.go();
          },
        });
        toast.add({
          severity: "success",
          summary: "TaskCollection wurde gelöscht",
          life: 10000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: error.message,
          life: 10000,
        });
      }
    }

    function calcTotalPoints() {
      totalPoints.value = 0;

      for (let i = 0; i < taskCollection.value.tasks.length; i++) {
        totalPoints.value += +taskCollection.value.tasks[i].weighting;
      }
      // taskCollection.value.tasks.forEach((task) => {
      //});
    }

    function onRowReorder(event) {
      taskCollection.value.tasks = event.value;
    }

    function handleRemoveTask(event) {
      console.log(event);
      taskCollection.value.tasks.splice(event.index, 1);
    }

    async function handleExportClick(event) {
      try {
        let exportCollection = [taskCollection.value];
        for (let i = 0; i < taskCollection.value.tasks.length; i++) {
          exportCollection.push(
            await getBackendRequest(
              TASK_PATH + "/" + taskCollection.value.tasks[i]._id
            )
          );
        }

        const data = JSON.stringify(exportCollection);
        const blob = new Blob([data], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download =
          exportCollection[0].title + "-" + exportCollection[0]._id;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.add({
          severity: "success",
          summary: "TaskCollection wurde exportiert",
          life: 10000,
        });
      } catch (e) {
        toast.add({
          severity: "error",
          summary: e.message,
          life: 10000,
        });
      }
    }

    function handleInspectTask(item) {
      emit("exerciseSelected", { id: item.data._id, kindOfExercise: "task" });
    }

    function addTask(payload) {
      taskCollection.value.tasks.push({
        title: payload.title,
        _id: payload._id,
        weighting: 0,
      });
      console.log(payload);
    }

    function test(t) {
      console.log(t);
    }

    return {
      taskCollection,
      onRowReorder,
      addTask,
      totalPoints,
      calcTotalPoints,
      handleSaveClick,
      handleDeleteClick,
      handleRemoveTask,
      handleInspectTask,
      handleExportClick,
      test,
    };
  },
};
</script>
<style  lang="scss">
.pointsIncorrect {
  color: black !important;
  background: red !important;
}

.pointsCorrect {
  color: green !important;
}

.weightingInput {
  width: 100%;
}

.taskCollectionInputs {
  padding-top: 15px;
}

.p-float-label {
  margin-top: 15px;
}

.p-inputtext {
  width: 100%;
}
.createTaskCollectionFooter {
  .p-button {
    margin: 5px;
  }
}
</style>
