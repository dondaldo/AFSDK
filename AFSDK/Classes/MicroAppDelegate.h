//
//  MicroAppDelegate.h
//  micro-app
//
//  Created by Karthik Thirumalasetti on 28/03/18.
//  Copyright © 2018 Karthik Thirumalasetti. All rights reserved.
//

#ifndef MicroAppDelegate_h
#define MicroAppDelegate_h


#endif /* MicroAppDelegate_h */

#import "AFMicroAppInstance.h"
#import <Foundation/Foundation.h>


@protocol MicroAppDelegate <NSObject>
-(void)microappInstance:(AFMicroAppInstance *)instance sentMessage:(NSDictionary *)message;
@end
