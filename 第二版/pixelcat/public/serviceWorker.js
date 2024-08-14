/* 监听安装事件，install 事件一般是被用来设置你的浏览器的离线缓存逻辑 */
// this.addEventListener('install', function (event) {
//  	console.log(111111111111111)
//   /* 通过这个方法可以防止缓存未完成，就关闭serviceWorker */
//   event.waitUntil(
//       /* 创建一个名叫V1的缓存版本 */
//       caches.open('v1').then(function (cache) {
//           /* 指定要缓存的内容，地址为相对于跟域名的访问路径 */
//           return cache.addAll([
//               './index.html'
//           ]);
//       })
//   );
// });

/* 注册fetch事件，拦截全站的请求 */
// this.addEventListener('fetch', function(event) {
// event.respondWith((async () => {
//   // Try to get the response from a cache.
//   const cachedResponse = await caches.match(event.request);
//   // Return it if we found one.
//   if (cachedResponse) return cachedResponse;
//   // If we didn't find a match in the cache, use the network.
//   event.request.url = event.request.url + '?pzj=333'
//   console.log('1111111111', event.request)
//   console.log('2222',  event.request.url)
//   return fetch(event.request);
// })());
// });

this.addEventListener('fetch', event => {
  event.respondWith(customHeaderRequestFetch(event))
})

function customHeaderRequestFetch(event) {
  // decide for yourself which values you provide to mode and credentials
  const newRequest = new Request(event.request, {
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'x-my-custom-header': 'The Most Amazing Header Ever'
    }
  })
  return fetch(newRequest)
}