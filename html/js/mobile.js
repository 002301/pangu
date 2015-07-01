/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-06-11 15:02:52
 * @version $Id$
 */

var mySwiper = new Swiper('.swiper-container',{
    pagination: '.pagination',//自动生成下标圆点
    paginationClickable: true,
    mode:'vertical',//运动两种模式,horizontal(水平滑动)以及vertical（垂直运动的滑动）
    loop:'false'//无限滑动滑块，true为不无限
  })