import {TrackTypes, TriggerTypes, typesMaps} from "./operations.js";


let shouldTrack = true;
const targetMap = new WeakMap();
const ITERATOR_KEY = Symbol('iterator');
let currentFunc = null;
export function stopTrack(target) {
    shouldTrack = false;
}

export function resumeTrack(target) {
    shouldTrack = true;
}

export function cleanup(effectFunc) {
    const {deps} = effectFunc;
    if (deps.length > 0) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effectFunc);
        }
        deps.length = 0;
    }
}

export function effect(fn) {

    const effectFunc = () => {
        try {
            currentFunc = effectFunc;
            cleanup(effectFunc)
            return fn();
        } finally {
            currentFunc = null;
        }
    }
    effectFunc.deps = [];
    effectFunc();
}

// 依赖收集
export function track(target, type, key) {
    if (!shouldTrack || currentFunc === null) {
        return;
    }
    let propertyMap = targetMap.get(target);
    if (!propertyMap) {
        propertyMap = new Map();
        targetMap.set(target, propertyMap);
    }
    if (type === TrackTypes.ITERATE) {
        key = ITERATOR_KEY;
    }
    let typeMap = propertyMap.get(key);
    if (!typeMap) {
        typeMap = new Map();
        propertyMap.set(key, typeMap);
    }
    let depSet = typeMap.get(type);
    if (!depSet) {
        depSet = new Set();
        typeMap.set(type, depSet);
    }
    depSet.add(currentFunc);
    currentFunc.deps.push(depSet);

  }

function getEffectsFunction(target, type, key) {
    const propertyMap = targetMap.get(target);
    if (!propertyMap) {
        return [];
    }
    const keys= [key] ;
    const funcs = new Set();
    if( type === TriggerTypes.ADD || type === TriggerTypes.DELETE) {
        keys.push(ITERATOR_KEY);
    }
    keys.forEach((k) => {
        const typeMap = propertyMap.get(k);
        if (typeMap) {
            typesMaps[type].forEach(t => {
                const depSet = typeMap.get(t);
                if (depSet) {
                    depSet.forEach(func => funcs.add(func));
                }
            });
        }
    });
    return funcs;
}

export function trigger(target, type, key) {
    const funcs = getEffectsFunction(target, type, key);
    funcs.forEach(func => {
        func()
    });
}


