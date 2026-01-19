export enum EventEnum {
    INIT_CLUSTER = 'INIT_CLUSTER',
}

export class InitClusterEvent {
    public systemObjectId: string;
    public date?: string;

    constructor(data: { systemObjectId: string; date?: string }) {
        this.systemObjectId = data.systemObjectId;
        this.date = data.date;
    }
}
