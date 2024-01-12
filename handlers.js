import {resumeTrack, stopTrack, track, trigger} from "./effect.js";
import {reactive} from "./reactive.js";
import {isObject} from "./utils.js";
import {TrackTypes, TriggerTypes} from "./operations.js";

const originObj =  Symbol('originObj');

const obj = {};

 ['includes', 'lastIndexOf', 'indexOf'].forEach((key)=> {
     obj[key] = function (...args) {
         let result = Array.prototype[key].apply(this, args);
         if  (result < 0  || result === false) {
             result = Array.prototype[key].apply(this[originObj], args);
         }
         return result;
     }
});

['push', 'pop', 'shift', 'unshift', 'splice'].forEach((key) => {
    obj[key] = function (...args) {
        stopTrack();
        const result = Array.prototype[key].apply(this, args);
        resumeTrack();
         return result;
    }
})

const get = function (target, key, receiver) {
    if (key === originObj) {
        return target;
    }
    // 依赖收集
    track(target, TrackTypes.GET, key);

    if(obj.hasOwnProperty(key) && Array.isArray(target)) {
        return obj[key];
    }

    const value = Reflect.get(target, key, receiver); // 返回对象的相应属性值
    if ( isObject(value)) {
        return reactive(value);
    }
    return value; // 返回对象的相应属性值
};

const  set = function (target, key, value, receiver) {
    let type = TriggerTypes.ADD;
    if (target.hasOwnProperty(key)) {
        type = TriggerTypes.SET;
    }
    const oldValue = target[key];
    const oldLength =  Array.isArray(target) ? target.length: undefined;
    const result = Reflect.set(target, key, value, receiver);
    const newLength =  Array.isArray(target) ? target.length: undefined;

    if (!Object.is(value, oldValue) || type === TriggerTypes.ADD) {
        // 派发更新
        trigger(target, type, key);

        if(Array.isArray(target) && newLength!==oldLength ) {
            if (key !== 'length') {
                trigger(target, TriggerTypes.SET, 'length');
            } else {
                for (let i = newLength; i < oldLength; i++) {
                    trigger(target, TriggerTypes.DELETE, i);
                }
            }
        }

    }

    return  result;// 设置对象的相应属性值
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
