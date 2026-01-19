import { EntityMetadata, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import * as oracledb from 'oracledb';
@EventSubscriber()
export class JsonClobSubscriber {
    beforeInsert(event: InsertEvent<any>): void {
        this.setJsonBinding(event.entity, event.metadata);
    }

    beforeUpdate(event: UpdateEvent<any>): void {
        this.setJsonBinding(event.entity, event.metadata);
    }

    private setJsonBinding(entity: any, meta: EntityMetadata): void {
        if (!entity) return;

        for (const key of Object.keys(entity)) {
            const value = entity[key];
            const type = meta.columns.find((col) => col.propertyName == key)?.type;
            if (value && type == 'clob' && !Array.isArray(value)) {
                entity[key] = {
                    val: JSON.stringify(value), // Serialize JSON
                    type: oracledb.DB_TYPE_CLOB, // Bind as JSON type
                };
            }
        }
    }
}
