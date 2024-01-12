import {track, trigger} from "./effect.js";
import {reactive} from "./reactive.js";
import {isObject} from "./utils.js";
import {TrackTypes, TriggerTypes} from "./operations.js";

const get = function (target, key, receiver) {

    // 依赖收集
    track(target, TrackTypes.GET, key);
    const value = target[key]; // 返回对象的相应属性值
    if ( isObject(value)) {
        return reactive(value);
    }
    return Reflect.get(target, key, receiver); // 返回对象的相应属性值
};

const  set = function (target, key, value, receiver) {
    let type = TriggerTypes.ADD;
    if (target.hasOwnProperty(key)) {
        type = TriggerTypes.SET;
    }
    const oldValue = target[key];
    if (!Object.is(value, oldValue) || type === TriggerTypes.ADD) {
        // 派发更新
        trigger(target, type, key);
    }

    return Reflect.set(target, key, value, receiver); // 设置对象的相应属性值
}

const has = function (target, key) {
    // 依赖收集
    track(target, TrackTypes.HAS, key);
    return Reflect.has(target, key); // 返回对象是否有相应属性
}

const  ownKeys = function (target) {
    track(target, TrackTypes.ITERATE); // 依赖收集
    return Reflect.ownKeys(target); // 返回对象的所有属性名称
}

const deleteProperty = function (target, key) {
    if (target.hasOwnProperty(key)) {
        trigger(target, TriggerTypes.DELETE, key);
    }
    return Reflect.deleteProperty(target, key);
}



export const handlers = {
    get,
    set,
    has,
    ownKeys,
    deleteProperty
}
