//
//  AFAppsflyProvider.h
//  core
//
//  Created by Karthik Thirumalasetti on 11/12/17.
//  Copyright © 2017 Karthik Thirumalasetti. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFMicroAppInstance.h"

@interface AFAppsflyProvider : NSObject
+(AFAppsflyProvider *_Nullable)defaultProvider;
-(void)configureWithAppKey:(NSString *_Nonnull)appKey andRepoUrl:(NSString *_Nonnull)repoUrl;
-(void)syncMicroApp:(NSString * _Nonnull)handle withCompletion:(void (^ _Nullable)(AFMicroAppInstance * _Nullable, NSError* _Nullable))completionHandler;
-(void)syncMicroApps:(NSArray<NSString *> * _Nonnull)handles withCompletion:(void (^ _Nullable)(NSError* _Nullable))completionHandler;
-(void)syncMicroApp:(NSString * _Nonnull)handle;
-(AFMicroAppInstance * _Nullable)instanceWithHandle:(NSString * _Nonnull)handle;
@end
