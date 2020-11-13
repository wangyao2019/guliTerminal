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
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 
        <input type="file" name="file"/>
      -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + 'eduOss/user/upPhoto'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

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
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: null,
        sort: 0,
        level: 1,
        career: null,
        intro: null,
        avatar: null
      },

      //上传弹框组件是否显示
      imagecropperShow: false,
      imagecropperKey: 0, //上传组件key值
      BASE_API: process.env.BASE_API, //获取dev.env.js里面地址
      saveBtnDisabled: false, // 保存按钮是否禁用,

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
    this.init();
  },

  watch: {
    //监听
    $route(to, form) {
      //路由变化方式 路由发生变化就会执行
      this.init();
    },
  },
  methods: {
    close() {
      //关闭上传弹框的方法
      this.imagecropperShow = false;
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    //上传成功方法
    cropSuccess(data) {
      this.imagecropperShow = false;
      //上传之后接口返回图片地址
      this.teacher.avatar = data.url;
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.fetchDataById(id);
      } else {
        this.teacher = {};
      }
    },

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
