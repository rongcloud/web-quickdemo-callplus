// RTC 客户端实例对象
let rtcClient;

let callPlusClient;

// Room 实例
let crtRoom;

let remoteUserId;

/**
 * 通话计时
 */
let callDuration = 0;
let callDurationTimer = null;

let callId = null;
/**
 * 存储可以播放的媒体信息
 */
const availableMedia = [];

/**
 * 初始化 callPlusClient
 */
const initCallPlusClient = (e) => {
  if (!imIsInit) {
    alert('请确保已经初始化完 IM');
    return;
  }
	rtcClient = RongIMLib.installPlugin(window.RCRTC.installer, {
		mediaServer: Config.mediaServer || undefined,
		timeout: 30 * 1000,
		logLevel: window.RCEngine.LogLevel.DEBUG
	});

  callPlusClient = RongIMLib.installPlugin(window.CallPlus.installer, {
    rtcClient,
    logOutputLevel: 4,
  });

  e.parentElement.className = 'input-wrap pass';
};

/**
 * 设置 callPlus 业务层监听事件
 */
const setCallPlusListener = (e) => {
  if (!callPlusClient) {
    alert('请先初始化 callPlus 再设置监听');
    return;
  }

  // 注册 callPlus 业务层监听事件
	callPlusClient.setCallPlusEventListener({
    /** 呼入通知 */
    onReceivedCall(session) {
      callId = session.getCallId();
      remoteUserId = session.getCreatorUserId();
      document.querySelector('.rong-input-accept').removeAttribute('disabled');
      console.log(`呼入通知, callId: ${callId}`);
    },
    /**
     * 此监听触发后，可播放媒体资源
     * @param {*} userId 
     * @param {*} mediaType 
     */
    onUserMediaAvailable(userId, mediaType) {
      console.log(`${userId} 的 ${ mediaType === window.CallPlus.RCCallPlusMediaType.AUDIO ? '音' : '视'}频资源可播放`);
      availableMedia.push({
        userId,
        mediaType
      });
      /**
       * 本端和远端音视频就绪后一起播放
       */
      if (availableMedia.length === 4) {
        document.querySelector('.rong-input-play').removeAttribute('disabled');
      }
    },
    /**
     * 通话已建立，sdk 内部会发布音视频资源
     */
    onCallConnected(session) {
      console.log(`本端加入通话, callId: ${session.getCallId()}`);
    },
    /**
     * 人员状态变更
     */
    onRemoteUserStateChanged(
      // 增量
      callId,
      userId,
      state,
      reason,
    ) {
      console.log(`人员状态变更, callId: ${callId}, ${userId}状态: ${CallPlus.RCCallPlusSessionUserState[state]}, reason: ${reason}`);
    },
    /**
     * 通话结束
     */
    onCallEnded(session, reason) {
      console.log(`通话结束, callId: ${session.getCallId()}, reason: ${reason}`);
      clearPage();
    },
    /**
     * 通话计时开始
     */
    onReceivedCallStart(info) {
      console.log(`通话计时开始, startTime: ${info}`);
      callDuration = Math.floor((+new Date() - info.startTime) / 1000);
      callDurationTimer = setInterval(() => {
        callDuration++;
        document.getElementById('duration').innerText = `${callDuration}s`;
      }, 1000);
    },
    /**
     * 单呼或群呼结束后，服务器下发的通话日志
     */
    onReceivedCallLog(log) {
      console.log(`通话日志下发, log: ${JSON.stringify(log)}`);
    },
  });

  e.parentElement.className = 'input-wrap pass';
};

/**
 * 开始呼叫
 * @param {HTMLElement} e 绑定事件的元素对象
 */
const startCall = async (e) => {
  if (!callPlusClient || !isConnected) {
    alert('请先初始化 callPlus、连接 im，再发起呼叫');
    return;
  }

  remoteUserId = document.getElementById('callTargetId').value;
  if (!remoteUserId) {
    alert('请输入对方 userId');
    return;
  }

	const { code, callId: resCallId } = await callPlusClient.startCall([remoteUserId], window.CallPlus.RCCallPlusType.SINGLE, window.CallPlus.RCCallPlusMediaType.AUDIO_VIDEO);

  if (code !== CallPlus.RCCallPlusCode.SUCCESS) {
    alert(`发起呼叫失败: ${code}`);
    return;
  }
  callId = resCallId;

  e.parentElement.className = 'input-wrap pass';
};

/**
 * 接听
 */
const acceptFn = async (e) => {
  if (!callPlusClient) {
    alert('请先初始化 callPlus，再发起呼叫');
    return;
  }

  const { code } = await callPlusClient.accept(callId);
  if (code !== CallPlus.RCCallPlusCode.SUCCESS) {
    alert(`接听失败: ${code}`);
    return;
  }

  e.parentElement.className = 'input-wrap pass';
};

/**
 * 挂断
 */
const hangup = async () => {
  if (!callPlusClient) {
    alert('请确保已经初始化');
    return;
  }
	await callPlusClient.hangup(callId);

  clearPage();
};

const clearPage = () => {
  callDurationTimer && clearInterval(callDurationTimer);
  document.getElementById('duration').innerText = `0s`;

  callId = null;
  availableMedia.length = 0;
  remoteUserId = '';

  /**
   * 离开房间后，清除所有 video 标签
   */
  const videoWrapEl = document.getElementById('rong-video-box');
  videoWrapEl.innerHTML = '';
}

/**
 * 播放资源
 */
const playMedia = (e) => {
  availableMedia.forEach(({userId, mediaType}) => {
    callPlusClient.playMedia(userId, mediaType);
  });
  e.parentElement.className = 'input-wrap pass';
};

const setLocalVideoView = (e) => {
  const userId = currentUserId;
  setVideoView(userId);
  e.parentElement.className = 'input-wrap pass';
}

const setRemoteVideoView = (e) => {
  setVideoView(remoteUserId);
  e.parentElement.className = 'input-wrap pass';
}

/**
 * 往页面中插入 video 元素
 * @param userId 给
 */
const setVideoView = (userId) => {
  const node = document.createElement('div');
  const tempHtml = `<span class="res-tag">${userId}</span>
                    <video id="rc-video-${userId}"></video>`;
  node.innerHTML = tempHtml;
  node.classList = `video-wrap video-wrap-${userId}`;
  document.getElementById('rong-video-box').appendChild(node);
  const videoEl = document.getElementById(`rc-video-${userId}`);
  callPlusClient.setVideoView([{ userId, videoElement: videoEl, isTiny: false }]);
};
