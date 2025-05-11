import 'dotenv/config';

export default {
  expo: {
    name: 'MomentOurs',
    slug: 'MomentOurs',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    icon: './assets/splash-icon.png',
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FF8A8A'
    },
    ios: {
      bundleIdentifier: process.env.IOS_BUNDLE_ID,
      infoPlist: {
        NSPhotoLibraryUsageDescription: '앨범에서 이미지를 선택하기 위해 접근 권한이 필요합니다.',
        NSCameraUsageDescription: '사진을 촬영하기 위해 카메라 접근 권한이 필요합니다.',
        NSPhotoLibraryAddUsageDescription: '이미지를 저장하기 위해 사진 라이브러리 접근 권한이 필요합니다.',
        NSLocationWhenInUseUsageDescription: '현재 위치를 기반으로 지도를 표시하기 위해 필요합니다.',
        NSLocationAlwaysAndWhenInUseUsageDescription: '현재 위치를 기반으로 지도를 표시하기 위해 필요합니다.'
      }
    },
    android: {
      package: 'beyond.momentours',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-secure-store',
      [
        '@mj-studio/react-native-naver-map',
        {
          client_id: process.env.NAVER_CLIENT_ID,
          ios: {
            NSLocationWhenInUseUsageDescription: '현재 위치를 기반으로 지도를 표시하기 위해 필요합니다.',
            NSLocationAlwaysAndWhenInUseUsageDescription: '현재 위치를 기반으로 지도를 표시하기 위해 필요합니다.'
          },
          android: {
            ACCESS_FINE_LOCATION: true,
            ACCESS_COARSE_LOCATION: true,
            ACCESS_BACKGROUND_LOCATION: true
          }
        }
      ]
    ]
  }
};
