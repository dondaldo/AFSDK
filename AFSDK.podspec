#
# Be sure to run `pod lib lint AFSDK.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'AFSDK'
  s.version          = '0.1.1'
  s.summary          = 'Appsfly Ios Sdk'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/dondaldo/AFSDK'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'srikanth.android@hotmail.com' => 'srikanth@appsfly.io' }
  s.source           = { :git => 'https://github.com/dondaldo/AFSDK.git', :tag => s.version.to_s }

  s.ios.deployment_target = '8.0'
  
  s.source_files = 'AFSDK/Classes/*.{c,h,hh,m,mm}'
  s.pod_target_xcconfig = { 'SWIFT_VERSION' => '4.0' }
  s.public_header_files = 'AFSDK/Classes/*.h'
#   s.dependency 'Texture'
#   s.dependency 'Socket.IO-Client-Swift', '~> 13.1.0'
 s.pod_target_xcconfig = {'SWIFT_VERSION' =>'4.0'}
   s.ios.vendored_frameworks = 'appsfly/core.framework'
   s.ios.vendored_frameworks = 'appsfly/micro_app.framework'
   
   
end
