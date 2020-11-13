import request from '@/utils/request'
import { remove } from 'js-cookie'

export default {

    teacherList(page, limit, teacherQuery) {
        return request({
            url: `/eduService/teacher/pageTeacherCondition/${page}/${limit}`,
            method: 'post',
            // params
            //data 把对象转换成json传递l
            data: teacherQuery
        })
    },

    addNewTeacher(teacher) {
        return request({
            url: `/eduService/teacher/addNewTeacher`,
            method: 'post',
            data:teacher
        })
    },

    removeById(teacherID){
        return request({
            url: `/eduService/teacher/delete/${teacherID}`,
            method: 'delete',
        })
    },

    getById(teacherId){
        return request({
            url:`/eduService/teacher/getTeacherByID/${teacherId}`,
            method:'get',
        })
    },

    updateByID(teacher){
        return request({
            url:`/eduService/teacher/updateByID/${teacher.id}`,
            method:'put',
            data:teacher
        })
    }

}