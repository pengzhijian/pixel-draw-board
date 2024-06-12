// directive.js
// 插件
const resizeObserver = (el: any, callback: any) => {
  let timer: any = null;
  return new ResizeObserver((entries) => {
    console.log('7777', timer);
    const canvas = el.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");
    // 节流，只变最后一次
    canvas.style.width = 'calc(100% - 10px)';
    canvas.style.height = '100%';
    clearTimeout(timer);
    timer = setTimeout(() => {
      canvas.width = el.clientWidth - 10;
      canvas.height = el.clientHeight;
      console.log("变！！！", el.clientWidth);
      console.log('hui', callback);
      clearTimeout(timer);
      timer = null;
      canvas.style.width = 'unset';
      canvas.style.height = 'unset';
      if (callback) {
        console.log("回调！！！");
        ctx.reset();
        callback(canvas);
      }
    }, 200);
  });
};

export function resizeMounted(el: any, binding: any) {
  // console.log(66666666, binding)
  resizeObserver(el, binding.value).observe(el);
}
export function resizeUnmounted(el: any, binding: any) {
  resizeObserver(el, binding.value).unobserve(el);
  // console.log('卸载！！！')
}
