// 依赖收集
export function track(target, type, key) {
    console.log(`%c依赖收集：${type} ${key}`, 'color: #f00');
}

export function trigger(target, type, key) {
    console.log(`%c派发更新：${type} ${key}`, 'color: #00f');
}
