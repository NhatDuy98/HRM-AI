import { v4 as uuidv4 } from 'uuid';
import { SystemDataType } from './enum.util';

const getCenterOSquarePolygon = (polygonString: string) => {
    let sumX = 0,
        sumY = 0,
        pointCount = 0;
    const coordinatesString = polygonString.replace('POLYGON ((', '').replace('))', '');

    // Split by commas, then split each pair into numbers
    coordinatesString.split(', ').map((pair) => {
        const [x, y] = pair.split(' ').map(Number); // Split by space and convert to numbers
        sumX += x;
        sumY += y;
        pointCount++;
        return [x, y]; // Return as a [longitude, latitude] pair
    });

    // Calculate the average of the coordinates
    const centerX = sumX / pointCount;
    const centerY = sumY / pointCount;

    return [centerX, centerY];
};

const convertDghcData = (data: any) => {
    return {
        properties: {
            data: {
                VALUE: data['VALUE'],
            },
        },
        geometry: {
            type: 'Point',
            coordinates: [data['LONGITUDE'], data['LATITUDE'], 0],
        },
    };
};

const convertCellData = (data: any) => {
    if (!data['LONGITUDE'] || !data['LATITUDE']) return null;
    return {
        properties: {
            data: {
                VALUE: data['VALUE'],
            },
        },
        geometry: {
            type: 'Point',
            coordinates: [data['LONGITUDE'], data['LATITUDE'], 0],
        },
    };
};

const convertSiteData = (data: any) => {
    if (!data['LONGITUDE'] || !data['LATITUDE']) return null;
    return {
        properties: {
            data: {
                VALUE: data['VALUE'],
            },
        },
        geometry: {
            type: 'Point',
            coordinates: [data['LONGITUDE'], data['LATITUDE'], 0],
        },
    };
};

const convertBin50Data = (data: any) => {
    if (!data['LONGITUDE'] || !data['LATITUDE']) return null;
    return {
        properties: {
            data: {
                VALUE: data['VALUE'],
            },
        },
        geometry: {
            type: 'Point',
            coordinates: [data['LONGITUDE'], data['LATITUDE'], 0],
        },
    };
};

const convertBin10Data = (data: any, bin10KeyValue: string = 'RSRP') => {
    if (!data['BIN_GEOMETRY']) return null;
    const centrePoint = getCenterOSquarePolygon(data['BIN_GEOMETRY']);

    return {
        properties: {
            data: {
                VALUE: data[bin10KeyValue] ?? data['VALUE'],
            },
        },
        geometry: {
            type: 'Point',
            coordinates: [centrePoint[0], centrePoint[1]],
        },
    };
};

const handleStringToLine = (polygonString: string) => {
    // Loại bỏ tiền tố "POLYGON ((" và hậu tố "))"
    if (polygonString.includes('MULTILINESTRING')) {
        const coordinatesString = polygonString.replace('MULTILINESTRING Z ((', '').replace('))', '');
        const coordinates = coordinatesString.split('), (').map((pair) => {
            const coordinate = pair.split(', ').map((cond) => cond.split(' ').map(Number));
            return coordinate;
        });
        return {
            type: 'MultiLineString',
            coordinates: coordinates,
        };
    }

    const coordinatesString = polygonString.replace('LINESTRING Z (', '').replace(')', '');
    // Chuyển đổi chuỗi tọa độ thành một mảng
    const coordinates = coordinatesString.split(', ').map((pair) => {
        const [x, y, z] = pair.split(' ').map(Number);
        if (isNaN(x) || isNaN(y) || isNaN(z)) console.log('Error: ', pair);
        return [x, y, z];
    });

    return {
        type: 'LineString',
        coordinates: coordinates,
    };
};

const convertLineData = (data: any) => {
    if (!data['WKT_GEOMETRY']) return null;
    const { WKT_GEOMETRY, ...restData } = data;
    const dataPolyline = handleStringToLine(WKT_GEOMETRY || '');
    return {
        properties: {
            data: {
                VALUE: data['VALUE'],
            },
        },
        geometry: dataPolyline as any,
    };
};

const convertBbuCranData = (data: any) => {
    if (!data) return null;

    if (!data['TRAM_GOC_LON'] || !data['TRAM_GOC_LAT']) {
        data['TRAM_GOC_LON'] = data['TRAM_REMOTE_LON'];
        data['TRAM_GOC_LAT'] = data['TRAM_REMOTE_LAT'];
    }
    if (!data['TRAM_REMOTE_LON'] || !data['TRAM_REMOTE_LAT']) {
        data['TRAM_REMOTE_LON'] = data['TRAM_GOC_LON'];
        data['TRAM_REMOTE_LAT'] = data['TRAM_GOC_LAT'];
    }
    if (!data['TRAM_GOC_LON'] || !data['TRAM_REMOTE']) return null;
    const id = uuidv4();
    const commonData = {
        id,
        properties: {
            data: {
                VALUE: data['VALUE'],
            },
        },
    };
    return [
        {
            ...commonData,
            geometry: {
                type: 'LineString',
                coordinates: [
                    [data['TRAM_GOC_LON'], data['TRAM_GOC_LAT'], 0],
                    [data['TRAM_REMOTE_LON'], data['TRAM_REMOTE_LAT'], 0],
                ],
            },
        },
        {
            ...commonData,
            id: id + '_GOC',
            geometry: {
                type: 'Point',
                coordinates: [data['TRAM_GOC_LON'], data['TRAM_GOC_LAT'], 0],
            },
        },
        {
            ...commonData,
            id: id + '_REMOTE',
            geometry: {
                type: 'Point',
                coordinates: [data['TRAM_REMOTE_LON'], data['TRAM_REMOTE_LAT'], 0],
            },
        },
    ];
};

const handleStringToPolygon = (polygonString: string) => {
    // Loại bỏ tiền tố "POLYGON ((" và hậu tố "))"
    const coordinatesString = polygonString.replace('POLYGON Z ((', '').replace('))', '');

    // Chuyển đổi chuỗi tọa độ thành một mảng
    const coordinates = coordinatesString.split('), (').map((pair) => {
        const coordinate = pair.split(', ').map((cond) => cond.split(' ').map(Number));
        return coordinate;
    });

    return {
        type: 'Polygon',
        coordinates: coordinates,
    };
};
const convertPopulationData = (data: any) => {
    if (!data['GEOMETRY']) return null;
    const { GEOMETRY, ...restData } = data;
    const geometry = handleStringToPolygon(GEOMETRY);
    const population = Math.round((data['DENSITY'] * data['AREA']) / 1e6);
    restData['POPULATION'] = population;
    return {
        properties: {
            data: {
                VALUE: data['VALUE'],
            },
        },
        geometry: geometry as any,
    };
};

export const convertDetailData = (type: string, data: any, bin10KeyValue: string = 'RSRP') => {
    switch (type) {
        case SystemDataType.DGHC:
            return convertDghcData(data);
        case SystemDataType.CELL:
            return convertCellData(data);
        case SystemDataType.SITE:
            return convertSiteData(data);
        case SystemDataType.BIN50:
            return convertBin50Data(data);
        case SystemDataType.BIN10:
            return convertBin10Data(data, bin10KeyValue);
        case SystemDataType.LINE:
            return convertLineData(data);
        case SystemDataType.BBU_CRAN:
            return convertBbuCranData(data);
        case SystemDataType.POPULATION:
            return convertPopulationData(data);
        default:
            return null;
    }
};

export {};
