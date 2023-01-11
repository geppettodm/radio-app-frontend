import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'radio app',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen :{
      "launchShowDuration": 0,
      "launchAutoHide": true,
    }
  }
};

export default config;
