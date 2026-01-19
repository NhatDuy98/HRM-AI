import path from 'path';
import Supercluster from 'supercluster';
import { workerData } from 'worker_threads';
import { convertDetailData } from '../../utils/layer.util';

export const filename = path.resolve(__filename);

const MAX_CLUSTER_ZOOM = workerData?.maxZoom ?? 11;
const MIN_CLUSTER_ZOOM = workerData?.minZoom ?? 1;

interface ClusterProperties {
    mean: number;
    median: number;
    histogram: Record<number, number>; // Histogram để tính median gần đúng
    point_count: number;
    [key: string]: any;
}

// Initialize Supercluster (shared across tasks)
const index = new Supercluster({
    maxZoom: MAX_CLUSTER_ZOOM,
    radius: 50 * Math.sqrt(2),
    map: (props: any) => ({
        ...props,
        mean: props.data?.['VALUE'] || 0,
        histogram: createHistogram(props.data?.['VALUE'] || 0), // Assume createHistogram is available
        point_count: 1,
    }),
    reduce: (accumulated: ClusterProperties, props: ClusterProperties) => {
        accumulated.mean =
            (accumulated.mean * accumulated.point_count + props.mean * props.point_count) /
            (accumulated.point_count + props.point_count);
        accumulated.histogram = mergeHistograms(accumulated.histogram, props.histogram); // Assume mergeHistograms is available
        accumulated.point_count += props.point_count;
    },
});

function createHistogram(value: number): Record<number, number> {
    const bin = Math.round(value * 10) / 10; // Làm tròn đến 1 chữ số thập phân
    return { [bin]: 1 };
}

function mergeHistograms(hist1: Record<number, number>, hist2: Record<number, number>): Record<number, number> {
    const merged: any = { ...hist1 };
    for (const [bin, count] of Object.entries(hist2)) {
        merged[bin] = (merged[bin] || 0) + count;
    }
    return merged;
}

let store: any[] = [];

export default async function ({
    dataType,
    rows,
    type,
    bin10KeyValue,
}: {
    dataType: string;
    rows: any[];
    type: 'add' | 'load' | 'get-clusters';
    bin10KeyValue: string;
}) {
    try {
        switch (type) {
            case 'add':
                if (rows) {
                    const converted = rows
                        .map((row: any) => convertDetailData(dataType, row, bin10KeyValue))
                        .filter((item) => item != null); // Assume convertDetailData is available
                    store.push(...converted);
                }
                return null;
            case 'load':
                // Process batch of rows
                index.load(store as any);
                store = [];
                return null;
            case 'get-clusters':
                const clusters: { [zoom: number]: any[] } = {};
                for (let zoom = MIN_CLUSTER_ZOOM; zoom <= MAX_CLUSTER_ZOOM; zoom++) {
                    clusters[zoom] = index.getClusters([-180, -85, 180, 85], zoom);
                }
                return clusters;
            default:
                return null;
        }
    } catch (error) {
        throw new Error(`Worker error: ${error.message}`);
    }
}
