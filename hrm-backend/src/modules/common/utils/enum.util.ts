export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum SystemObjectType {
    PARENT = 'PARENT',
    CHILD = 'CHILD',
    CELL = 'CELL',
    SITE = 'SITE',
}

export enum UserObjectStatus {
    READY = 'READY',
    IN_PROGRESS = 'IN_PROGRESS',
}

export enum SmartFeatureStatus {
    NONE = 'NONE',
    IN_PROGRESS = 'IN_PROGRESS',
    READY = 'READY',
}

export enum UserObjectType {
    LINE = 'LINE',
    POLYGON = 'POLYGON',
    POINT = 'POINT',
    PROJECT = 'PROJECT',
    ARNO = 'ARNO',
    ARNP = 'ARNP',
    FOLDER = 'FOLDER',
}

export enum UserObjectDetailType {
    LINESTRING = 'LINESTRING',
    MULTILINESTRING = 'MULTILINESTRING',
    POLYGON = 'POLYGON',
    MULTIPOLYGON = 'MULTIPOLIGON',
    POINT = 'POINT',
    MULTIPOINT = 'MULTIPOINT',
    GEOMETRYCOLLECTION = 'GEOMETRYCOLLECTION',
}

export enum SmartFeatureArnoTypeEnum {
    'BestServingCells' = 'BestServingCells',
    'Cell' = 'Cell',
    'Pilot' = 'Pilot',
    'RSRP' = 'RSRP',
    'TopCells' = 'TopCells',
    'Volume' = 'Volume',
}

export enum SmartFeatureArnpTypeEnum {
    'pop' = 'pop',
    'rsrp' = 'rsrp',
}

export enum SmartFeatureSourceEnum {
    RAW = 'RAW',
    USER_OBJECT = 'USER_OBJECT',
    SYSTEM_OBJECT = 'SYSTEM_OBJECT',
}

export class GeoJSon {
    [k: string]: any;
}

export enum FeedBackStatus {
    SENT = 'SENT',
    RECEIVED = 'RECEIVED',
    RESPONSED = 'RESPONSED',
}

export enum LogType {
    SYSTEM = 'SYSTEM',
    USER = 'USER',
}

export enum LogAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    VIEW = 'VIEW',
}

export enum FileType {
    USER_OBJECT = 'USER_OBJECT',
    SYSTEM_OBJECT = 'SYSTEM_OBJECT',
    FEEDBACK = 'FEEDBACK',
}

export enum SystemConfigType {
    LEGEND = 'LEGEND',
    USER_OBJECT_CONFIG = 'USER_OBJECT_CONFIG',
    SYSTEM_OBJECT_CONFIG = 'SYSTEM_OBJECT_CONFIG',
    DISTANCE = 'DISTANCE',
    AREA = 'AREA',
    PROJECT_SMART_FEATURE = 'PROJECT_SMART_FEATURE',
}

export enum QueueName {
    USER_OBJECT_DETAIL_QUEUE = 'userObjectDetailQueue',
}

export enum UserStatus {
    active = 'active',
    inactive = 'inactive',
}

export enum SystemDataType {
    CELL = 'CELL',
    SITE = 'SITE',
    DGHC = 'DGHC',
    BIN10 = 'QUALITY_BIN10',
    BIN50 = 'QUALITY_BIN50',
    POLYGON = 'POLYGON',
    MULTIPOLYGON = 'MULTIPOLYGON',
    LINE = 'LINE',
    BBU_CRAN = 'BBU-CRAN',
    POPULATION = 'POPULATION',
    ARNO = 'ARNO',
    ARNP = 'ARNP',
    MULTILINESTRING = 'MULTILINESTRING',
    LINESTRING = 'LINESTRING',
    LOCATION = 'LOCATION',
}

export enum QUEUES {
    CLUSTER_QUEUE = 'MLMT_QUEUE.CLUSTER',
}

export enum QUEUE_JOBS {
    MAKE_CLUSTER = `${QUEUES.CLUSTER_QUEUE}.MAKE_CLUSTER`,
}
