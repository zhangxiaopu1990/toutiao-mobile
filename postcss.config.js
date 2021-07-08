// PostCSS配置文件需要导出一个对象
module.exports = {
  // 配置使用的相关插件
  plugins: {
    // 自动添加浏览器厂商声明前缀，用来兼容不同的浏览器
    // VueCLI 已经默认配置了 autoprefixer
    // 'autoprefixer': {
    // browsers 用来配置要兼容到的系统环境
    // 这个配置没有问题，但是写到这里会有控制台编译警告
    // .browserslistrc文件来配置要兼容的环境信息
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 把px转为rem
    'postcss-pxtorem': {
      // 转换的跟元素基准值
      // 正常情况下按照你的设计稿来
      // 750 宽的设计稿，750 / 10 = 75
      // 375 宽的设计稿，375 / 10 = 37.5
      // Vant 组件库是基于375宽 写的
      // 移动端页面一般都是以iPhone 6/7/8为原型设计的
      // Vant组件库是基于逻辑像素375写的
      // 设计稿是基于物理像素750宽设计的
      // 在测量我们的设计稿的时候我们必须让你的测量单位 / 2
      // 有没有更好的办法 不用计算
      rootValue: 37.5,
      //* 就是所有属性都要转换
      propList: ['*']
    }
  }
}
