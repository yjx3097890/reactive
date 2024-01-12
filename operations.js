

export const TrackTypes = {
    GET: 'get',
    HAS: 'has',
    ITERATE: 'iterate'
}

export const TriggerTypes = {
    ADD: 'add',
    SET: 'set',
    DELETE: 'delete'
}

export const typesMaps = {
    [TriggerTypes.ADD]: [TrackTypes.GET, TrackTypes.HAS, TrackTypes.ITERATE],
    [TriggerTypes.SET]: [TrackTypes.GET],
    [TriggerTypes.DELETE]: [TrackTypes.HAS, TrackTypes.GET, TrackTypes.ITERATE]
}
