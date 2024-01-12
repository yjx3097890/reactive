 import {isObject} from "./utils.js";
import {handlers} from "./handlers.js";


const targets = new WeakMap();

export function reactive(target) {
    if (!isObject(target)) {
         return target;
    }

    if(targets.has(target)) {
        return targets.get(target);
    }

    const proxy =new Proxy(target, handlers);
    targets.set(target, proxy);
    return proxy;
}
