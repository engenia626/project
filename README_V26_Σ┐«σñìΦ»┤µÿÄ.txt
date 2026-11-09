《小满·见微》V26 修复说明

本次只修复3D结束页的Three.js模块解析，不改动背景、前景素材、人物帧动画、任务、音乐或网页布局。

问题原因：GLTFLoader.js内部使用了裸模块标识符 `three`，浏览器原先没有Import Map映射，因此报错：
TypeError: Failed to resolve module specifier "three". Relative references must start with either "/", "./", or "../".

修复方式：在index.html中增加Import Map，将 `three` 和 `three/addons/` 映射到同版本Three.js CDN；ending.js改为通过映射后的模块名导入。加载失败时，结束页会显示具体错误并写入控制台。

注意：Three.js仍从jsDelivr在线加载，需要本机网络可访问 https://cdn.jsdelivr.net 。如果CDN被网络策略拦截，3D结束页仍不能加载；2D游览不受影响。
