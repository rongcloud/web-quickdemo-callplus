// 是否初始化
let imIsInit;

// IM 是否连接成功
let isConnected = false;

// 当前用户
let currentUserId;

/**
 * 初始化 IM
 * @param {HTMLElement} e 绑定事件的元素对象
 */
const initIM = (e) => {
  const appkey = document.getElementById('appkey').value;
  if (!appkey) {
    alert('请输入 appkey');
    return;
  }

  RongIMLib.init({
    appkey,
    navigators: Config.navi ? [Config.navi] : undefined,
    logLevel: 1
  });
  
  imIsInit = true;
  e.parentElement.className = 'input-wrap pass';
};

/**
 * 连接 IM
 */
const connectIM = () => {
  if (!imIsInit) {
    alert('请先初始化 IM');
    return;
  }

  const token = document.getElementById('token').value;
  if (!token) {
    alert('请输入 token');
    return;
  }

  RongIMLib.connect(token).then(user => {
    console.log('connect success', user.data.userId);
    currentUserId = user.data.userId;
    isConnected = true;
    document.querySelector('.boundary-line').style.color = '#09f';
  }).catch(error => {
    console.error(`连接失败: ${error}`);
  });
}
