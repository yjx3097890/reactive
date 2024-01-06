import { track, trigger } from './effect.js';
export function reactive(target) {
    return new Proxy(target, {
        get(target, key) {
            // 依赖收集
            track(target, key);
            return target[key]; // 返回对象的相应属性值
        },
        set(target, key, value) {
            // 派发更新
            trigger(target, key);
            return Reflect.set(target, key, value); // 设置对象的相应属性值
        },
    });
}
