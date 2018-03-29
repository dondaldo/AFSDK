//
//  AFMicroAppInstance.h
//  core
//
//  Created by Karthik Thirumalasetti on 11/12/17.
//  Copyright © 2017 Karthik Thirumalasetti. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MicroMessageDelegate : NSObject
-(id _Nonnull)initWithBlock:(void(^ _Nonnull)(NSDictionary * _Nonnull message))handler;
@end

@interface AFMicroAppInstance : NSObject
@property (readonly) NSDictionary * _Nonnull theme;
@property (readonly) NSDictionary * _Nonnull businessParams;
@property (readonly) NSDictionary * _Nonnull intents;
@property (readonly) NSDictionary * _Nonnull components;
@property (weak, nonatomic) id _Nullable delegate;
-(instancetype _Nonnull )initWithHandle:(NSString * _Nonnull)handle metadata:(NSDictionary * _Nonnull)metadata andExecutionData:(NSDictionary * _Nonnull)executionData;
-(void)sendMessage:(NSDictionary * _Nonnull)message withTags:(NSMutableDictionary * _Nullable)tags;
-(void)sendMessage:(NSDictionary * _Nonnull)message;
-(MicroMessageDelegate * _Nonnull)addMessageDelegate:(MicroMessageDelegate * _Nonnull)delegate;
-(void)removeMessageDelegate:(MicroMessageDelegate * _Nonnull)delegate;
@end
