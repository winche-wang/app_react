/**
 * 包含多个工具函数的模块
 */

 /**
  * 根据usertype用户类型判断路径path是老板还是求职者
  * 根据header头像判断路径path是老板完善信息还是求职者完善信息
  * @param {*} usertype 
  * @param {*} header 
  */
 export const getRedirectPath = (usertype, header)=>{
     let path = ''

     path += usertype ==='laoban'?'/laoban':'/qiuzhizhe'

     if(!header){
         path += 'info'
     }

     return path
 }