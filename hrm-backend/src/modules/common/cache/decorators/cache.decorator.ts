import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { CACHE_EACH_USER_CONFIG_META_KEY, CACHE_WITH_HASH_BODY } from '../constants/cache.constant';
import { CacheHttpInterceptor } from '../interceptors/cache.http.interceptor';
// import { UserObjectCacheHttpInterceptor } from '../interceptors/user-object-cache.http.interceptor';
interface ConfigCache {
    cacheKey: string | undefined;
    cacheTTL: number | undefined | 'endOfDay'; // miliseconds
    cacheForEachUser: boolean | undefined;
    cacheWithHashBody: boolean;
}

export function CacheDecorator(config: ConfigCache): MethodDecorator {
    return applyDecorators(
        UseInterceptors(CacheHttpInterceptor),
        SetMetadata(CACHE_KEY_METADATA, config.cacheKey),
        SetMetadata(CACHE_TTL_METADATA, config.cacheTTL),
        SetMetadata(CACHE_EACH_USER_CONFIG_META_KEY, config.cacheForEachUser),
        SetMetadata(CACHE_WITH_HASH_BODY, config.cacheWithHashBody),
    );
}

// export function UserObjectCacheDecorator(config: ConfigCache): MethodDecorator {
//     return applyDecorators(
//         UseInterceptors(UserObjectCacheHttpInterceptor),
//         SetMetadata(CACHE_KEY_METADATA, config.cacheKey),
//         SetMetadata(CACHE_TTL_METADATA, config.cacheTTL),
//         SetMetadata(CACHE_EACH_USER_CONFIG_META_KEY, config.cacheForEachUser),
//         SetMetadata(CACHE_WITH_HASH_BODY, config.cacheWithHashBody),
//     );
// }
