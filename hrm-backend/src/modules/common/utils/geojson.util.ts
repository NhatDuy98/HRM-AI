import { Feature, GeoJsonProperties, Geometry, Position } from 'geojson';
import * as turf from '@turf/turf';

export function hexArgbToRgbaArray(hex?: string) {
    if (!hex || hex.length < 6) return [0, 0, 0, 255];
    hex = hex.replace(/^#/, '');

    let a = parseInt(hex.slice(0, 2), 16);
    let b = parseInt(hex.slice(2, 4), 16);
    let g = parseInt(hex.slice(4, 6), 16);
    let r = parseInt(hex.slice(6, 8), 16);

    return [r, g, b, a];
}

export function hexToRgbaArray(hex?: string) {
    if (!hex) return [0, 0, 0, 255];
    hex = hex.replace(/^#/, '');

    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);

    return [r, g, b, 255];
}

export function getKmlStyleColors(kml: Document) {
    const styles = kml.getElementsByTagName('Style');
    const styleColors = Array.from(styles).reduce((acc, style) => {
        const id = style.getAttribute('id');
        if (!id) return acc;
        const color = style.getElementsByTagName('color')[0]?.textContent;
        acc[id] = hexArgbToRgbaArray(color || '00000000');
        return acc;
    }, {} as Record<string, number[]>);
    return styleColors;
}

export const processGeometry = (feature: Feature<Geometry, GeoJsonProperties>): Feature => {
    if (feature.geometry.type === 'Point') {
        // Create a circle with 50m radius around the point
        const center = feature.geometry.coordinates as Position;
        const radius = 50; // 50 meters
        const circle = turf.circle(center, radius, { units: 'meters' });
        return {
            type: 'Feature',
            properties: feature.properties || {},
            geometry: circle.geometry,
        };
    } else if (feature.geometry.type === 'LineString') {
        // Create a 50m buffer around the LineString
        const buffer = turf.buffer(feature, 50, { units: 'meters' });
        return {
            type: 'Feature',
            properties: feature.properties || {},
            geometry: buffer!.geometry,
        };
    }
    return feature;
};

export const isRingWithinOuter = (outerRing: Position[], innerRing: Position[]) => {
    const outerPoly = turf.polygon([outerRing]);
    const innerPoly = turf.polygon([innerRing]);
    return turf.booleanWithin(innerPoly, outerPoly);
};

// Convert a Polygon with multiple rings into a MultiPolygon
// if the extra rings are not contained within the first ring.
export const fixMultiRingPolygon = (feature: { geometry: { type: string; coordinates: any }; properties: any }) => {
    if (feature.geometry.type === 'Polygon') {
        const rings = feature.geometry.coordinates;
        if (rings.length > 1) {
            // Check if all rings after the first are holes (contained in the first ring)
            let allHolesAreWithin = true;
            for (let i = 1; i < rings.length; i++) {
                if (!isRingWithinOuter(rings[0], rings[i])) {
                    allHolesAreWithin = false;
                    break;
                }
            }
            if (!allHolesAreWithin) {
                // Convert to a MultiPolygon: treat each ring as a separate polygon.
                return {
                    type: 'Feature',
                    properties: feature.properties,
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: rings.map((ring: any) => [ring]),
                    },
                };
            }
        }
    }
    return feature;
};

// If a feature is a Polygon with one ring, wrap it as a MultiPolygon.
export const ensureMultiPolygon = (feature: any) => {
    if (feature.geometry.type === 'Polygon') {
        const fixed = fixMultiRingPolygon(feature);
        if (fixed.geometry.type === 'Polygon') {
            // Wrap it as a MultiPolygon if it has only one ring.
            return {
                type: 'Feature',
                properties: fixed.properties,
                geometry: {
                    type: 'MultiPolygon',
                    coordinates: [fixed.geometry.coordinates],
                },
            };
        }
        return fixed;
    }
    return feature;
};
