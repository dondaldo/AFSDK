//
//  AFLocalStore.h
//  core
//
//  Created by Karthik Thirumalasetti on 14/03/18.
//  Copyright © 2018 Karthik Thirumalasetti. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AFLocalStore : NSObject
+(void)set:(id _Nonnull)data forKey:(NSString *_Nullable)key withExpTime:(NSNumber * _Nullable)time withCallback:(void (^ __nullable)(BOOL success))completion;
+(void)deleteKey:(NSString *_Nullable)key withCallback:(void (^ __nullable)(BOOL success))completion;
+(void)getKey:(NSString *_Nullable)key withCallback:(void (^ __nullable)(id _Nullable response))completion;
@end
