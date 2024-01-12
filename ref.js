import {isObject} from "./utils.js";
import {reactive} from "./reactive.js";
import {track, trigger} from "./effect.js";
import {TrackTypes, TriggerTypes} from "./operations.js";


export default function (value) {
    let _value = isObject(value)? reactive(value): value;
    return {
        get value(){
            track(this, TrackTypes.GET, 'value')
            return _value;
        },
        set value(val){
            _value = val;
            trigger(this,  TriggerTypes.SET, 'value')
        }
    }
}
