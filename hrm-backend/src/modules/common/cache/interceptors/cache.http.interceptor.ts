import { CACHE_KEY_METADATA, CACHE_TTL_METADATA, CacheInterceptor } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Observable, of, tap } from 'rxjs';
import {
    CACHE_EACH_USER_CONFIG_META_KEY,
    CACHE_WITH_HASH_BODY,
    DEFAULT_CACHE_TTL_SECONDS,
} from '../constants/cache.constant';
import { encryptData } from '../../utils/encrypt.util';

@Injectable()
export class CacheHttpInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();

        const cacheKey = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());
        const cacheWithHashBody = this.reflector.get(CACHE_WITH_HASH_BODY, context.getHandler());
        const cacheForEachUser = this.reflector.get(CACHE_EACH_USER_CONFIG_META_KEY, context.getHandler());

        let hashBody = '';
        if (cacheWithHashBody) {
            hashBody = '_' + encryptData(JSON.stringify(request.body ?? ''));
        }

        if (cacheKey) {
            if (cacheForEachUser) {
                return `${cacheKey}_user:${request?.user?.id}_${request.url}${hashBody}`;
            } else {
                return `${cacheKey}_${request.url}${hashBody}`;
            }
        } else {
            if (cacheForEachUser) {
                return `user:${request?.user?.id}_${request.url}${hashBody}`;
            } else {
                return `${request.url}${hashBody}`;
            }
        }
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const cacheKey = this.trackBy(context);
        const cacheTTL = this.resolveCacheTTL(context);

        if (!cacheKey) {
            return next.handle();
        }

        const cachedResponse = await this.cacheManager.get(cacheKey);
        if (cachedResponse) {
            return of(cachedResponse);
        }

        return next.handle().pipe(
            tap(async (response) => {
                await this.cacheManager.set(cacheKey, response, cacheTTL);
            }),
        );
    }

    private resolveCacheTTL(context: ExecutionContext): number {
        const ttlMetadata = this.reflector.get<number | 'endOfDay' | undefined>(
            CACHE_TTL_METADATA,
            context.getHandler(),
        );

        if (ttlMetadata === 'endOfDay') {
            const now = moment();
            const endOfDay = moment().endOf('day');
            return Math.max(1, Math.ceil(endOfDay.diff(now) / 1000));
        }

        if (typeof ttlMetadata === 'number') {
            if (ttlMetadata === 0) {
                return 0;
            }

            return Math.max(1, Math.ceil(ttlMetadata / 1000));
        }

        return DEFAULT_CACHE_TTL_SECONDS;
    }
}
