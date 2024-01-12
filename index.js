import { reactive } from './reactive.js';

const obj={
    a: 1,
    b:2,
}
const state1 = reactive(obj);
// 删除不存在的属性
//  delete state1.abc
// 值没有变化
state1.a = 1;
