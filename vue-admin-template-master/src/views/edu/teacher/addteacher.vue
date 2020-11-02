<template>
  <div class="app-container">
    <el-form
      :model="teacher"
      :rules="rules"
      ref="teacher"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序" prop="sort">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--数据类型一定要和取出的json中的一致，否则没法,回填因此，这里value使用动态绑定的值，保证其数据类型是number-->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介" prop="intro">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="submitForm('teacher')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";

export default {
  data() {
    return {
      teacher: {
        name: null,
        sort: 0,
        level: 1,
        career: null,
        intro: null,
        avatar: null,
      },

      rules: {
        name: [
          { required: true, message: "请输入讲师名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        sort: [{ required: true, message: "请选择排序", trigger: "change" }],
        level: [{ required: true, message: "请选择等级", trigger: "change" }],
        career: [{ required: true, message: "讲师资历", trigger: "change" }],
        intro: [{ required: true, message: "讲师简介", trigger: "change" }],
      },

      saveBtnDisabled: false, //保存按钮是否禁用
    };
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.fetchDataById(id);
    }
  },

  methods: {
    testFunc() {
      this.saveBtnDisabled = true;
      this.saveData();
    },

    submitForm(formName) {
      //"submitForm('teacher')"
      if (!this.teacher.id) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveBtnDisabled = true;
            this.saveData();
          } else {
            return false;
          }
        });
      } else {
        this.updateTeacher();
      }
    },

    saveData() {
      teacherApi
        .addNewTeacher(this.teacher)
        .then((response) => {
          if (response.success) {
            this.$router.push({ path: "/teacher/teacherList" });
            return this.$message({
              type: "success",
              message: "保存成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: response.data.message,
            });
            this.saveBtnDisabled = false;
          }
        })
        .catch((response) => {
          console.log(response.success);
          this.$message({
            type: "error",
            message: "保存失败",
          });
          this.saveBtnDisabled = false;
        });
    },

    updateTeacher() {
      teacherApi
        .updateByID(this.teacher)
        .then((response) => {
          if (response.success) {
            this.$router.push({ path: "/teacher/teacherList" });
            return this.$message({
              type: "success",
              message: "保存成功!",
            });
          }
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: response.message,
          });
        });
    },

    fetchDataById(id) {
      teacherApi
        .getById(id)
        .then((response) => {
          this.teacher = response.data.teacher;
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "获取数据失败",
          });
        });
    },
  },
};
</script>
