import { TableColumn } from 'typeorm';

export const commonColumns = [
    new TableColumn({ name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' }),
    new TableColumn({ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
    }),
    new TableColumn({ name: 'created_by', type: 'varchar', isNullable: true }),
    new TableColumn({ name: 'updated_by', type: 'varchar', isNullable: true }),
    new TableColumn({ name: 'deleted_at', type: 'timestamp', isNullable: true, default: null }),
];
