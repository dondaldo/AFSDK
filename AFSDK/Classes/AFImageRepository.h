//
//  AFImageRepository.h
//  core
//
//  Created by Karthik Thirumalasetti on 03/01/18.
//  Copyright © 2018 Karthik Thirumalasetti. All rights reserved.
//

#import <Foundation/Foundation.h>
@import UIKit;

@interface AFImageRepository : NSObject
+(id)sharedInstance;
-(void)fetchImageWithUrl:(NSURL *)url withCompletionHandler:(void (^ __nullable)(UIImage *image))completion;
@end
