//
//  AFMicroAppProvider.h
//  micro-app
//
//  Created by Karthik Thirumalasetti on 12/12/17.
//  Copyright © 2017 Karthik Thirumalasetti. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <core/MicroAppDelegate.h>

@interface AFMicroAppProvider : NSObject
+(AFMicroAppProvider * _Nonnull)defaultProvider;
-(void)presentMicroApp:(NSString *_Nonnull)handle OverController:(UIViewController * _Nonnull)controller withIntent:(NSString * _Nonnull)intent andData:(NSDictionary *_Nonnull)data;
-(void)presentMicroApp:(NSString *_Nonnull)handle OverController:(UIViewController * _Nonnull)controller withIntent:(NSString * _Nonnull)intent data:(NSDictionary *_Nonnull)data andDelegate:(id<MicroAppDelegate> _Nullable)delegate;
@end
