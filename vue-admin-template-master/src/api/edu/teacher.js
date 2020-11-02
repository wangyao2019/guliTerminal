import request from '@/utils/request'
import { remove } from 'js-cookie'

export default {

    teacherList(page, limit, teacherQuery) {
        return request({
            url: `/edu/teacher/pageTeacherCondition/${page}/${limit}`,
            method: 'post',
            // params
            //data 把对象转换成json传递l
            data: teacherQuery
        })
    },

    addNewTeacher(teacher) {
        return request({
            url: `/edu/teacher/addNewTeacher`,
            method: 'post',
            data:teacher
        })
    },

    removeById(teacherID){
        return request({
            url: `/edu/teacher/delete/${teacherID}`,
            method: 'delete',
        })
    }

}