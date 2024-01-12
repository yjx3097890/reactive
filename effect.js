

let shouldTrack = true;
export function stopTrack(target) {
    shouldTrack = false;
}

export function resumeTrack(target) {
    shouldTrack = true;
}

// 依赖收集
export function track(target, type, key) {
    if (!shouldTrack) {
        return;
    }
    console.log(`%c依赖收集：${type} ${key}`, 'color: #f00');
}

export function trigger(target, type, key) {
    console.log(`%c派发更新：${type} ${key}`, 'color: #00f');
}
