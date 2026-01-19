const buildLocationConditions = (locationColumn: string, boundaries: [number, number, number, number][]) => {
    const columns = locationColumn.split(';');
    if (columns.length !== 2 && columns.length !== 4) {
        throw new Error('locationColumn must contain either 2 or 4 semicolon-separated values');
    }

    const boundaryConditions = boundaries
        .map(([minLng, minLat, maxLng, maxLat]) => {
            if (columns.length === 2) {
                // Case: 2 columns (lat, lon)
                const [latColumn, lonColumn] = columns;
                return `(${latColumn} BETWEEN ${minLat} AND ${maxLat} AND ${lonColumn} BETWEEN ${minLng} AND ${maxLng})`;
            } else {
                // Case: 4 columns (lat1, lon1, lat2, lon2)
                const [lat1Column, lon1Column, lat2Column, lon2Column] = columns;
                const condition1 = `(${lat1Column} BETWEEN ${minLat} AND ${maxLat} AND ${lon1Column} BETWEEN ${minLng} AND ${maxLng})`;
                const condition2 = `(${lat2Column} BETWEEN ${minLat} AND ${maxLat} AND ${lon2Column} BETWEEN ${minLng} AND ${maxLng})`;
                return `(${condition1} OR ${condition2})`;
            }
        })
        .join(' OR ');

    return boundaries.length > 1 ? `(${boundaryConditions})` : boundaryConditions;
};

const getLocationFilter = (locationColumn?: string, boundaries?: [number, number, number, number][]) => {
    if (!locationColumn || !boundaries?.length) return '';

    const boundaryConditions = buildLocationConditions(locationColumn, boundaries);
    return `WHERE (${boundaryConditions})`;
};

export const buildQueryWithCount = async ({
    queryNote,
    dateColumn,
    locationColumn,
    date,
    isDateRange,
    boundaries,
}: {
    queryNote?: string;
    dateColumn?: string;
    locationColumn?: string;
    date?: Date;
    isDateRange?: boolean;
    boundaries?: [number, number, number, number][];
}) => {
    if (!queryNote) {
        return {
            query: null,
            queryCount: null,
        };
    }
    const locationFilter = getLocationFilter(locationColumn, boundaries);

    let whereClause = '';
    if (dateColumn) {
        const [startDateColumn, endDateColumn] = dateColumn.split(';');
        if (date) {
            whereClause =
                startDateColumn && endDateColumn && isDateRange
                    ? `
                WHERE TRUNC(${startDateColumn}) <= TRUNC(TO_DATE('${date}', 'YYYY-MM-DD'))
                AND TRUNC(${endDateColumn}) >= TRUNC(TO_DATE('${date}', 'YYYY-MM-DD'))
            `
                    : `
                WHERE TRUNC(${startDateColumn}) = TRUNC(TO_DATE('${date}', 'YYYY-MM-DD'))
            `;
        } else {
            whereClause = `
            WHERE ${startDateColumn} >= (
                SELECT TRUNC(MAX(${startDateColumn})) FROM base_query
            )
        `;
        }
    }

    const withQuery = `
        WITH base_query AS (
            ${queryNote}
        ),
        filtered_data AS (
            SELECT
                *
            FROM (
                SELECT
                    *
                FROM base_query
                ${locationFilter}
            )
            ${whereClause}
        ),
        result_data AS (
            SELECT 
                filtered_data.*, 
                COUNT(*) OVER() as "TOTAL_RESULT" 
            FROM filtered_data
        )
    `;

    return {
        query: `
            ${withQuery}
            SELECT *
            FROM result_data
        `,
        queryCount: `
            ${withQuery}
            SELECT MAX("TOTAL_RESULT") AS "queryCount" 
            FROM filtered_data
        `,
    };
};
export const buildQueryAvailableDates = async ({
    queryNote,
    dateColumn,
    locationColumn,
    boundaries,
}: {
    queryNote?: string;
    dateColumn?: string;
    locationColumn?: string;
    boundaries?: [number, number, number, number][];
}) => {
    if (!queryNote || !dateColumn) {
        return {
            query: null,
            key: null,
            queryCount: null,
        };
    }
    //@ts-ignore
    const [startDateColumn, endDateColumn] = dateColumn.split(';');
    const isOracleFunction = /\bTO_DATE\b|\bTO_CHAR\b|\bSYSDATE\b|\bCURRENT_DATE\b/i.test(startDateColumn);
    const formattedStartDateColumn = isOracleFunction ? startDateColumn : `"${startDateColumn}"`;

    const locationFilter = getLocationFilter(locationColumn, boundaries);

    // Optimize by using GROUP BY instead of DISTINCT
    const withQuery = `
        WITH data_view AS (
            SELECT 
                TRUNC(${formattedStartDateColumn}) as "DATA_DATE"
            FROM (${queryNote}) base_query
            ${locationFilter}
            GROUP BY TRUNC(${formattedStartDateColumn})
        ),
        date_stats AS (
            SELECT 
                "DATA_DATE",
                COUNT(*) OVER () as "TOTAL_DATES"
            FROM data_view
        )
    `;

    return {
        query: `
            ${withQuery}
            SELECT "DATA_DATE", "TOTAL_DATES"
            FROM date_stats
            ORDER BY "DATA_DATE" DESC
        `,
        queryCount: `
            ${withQuery}
            SELECT total_dates AS "queryCount"
            FROM date_stats
        `,
        key: 'DATA_DATE',
    };
};
