import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.animedaze.app',
  appName: 'Anime Daze',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Uncomment the line below for local testing in emulator
    // url: 'http://10.0.2.2:3000',
    cleartext: true
  }
};

export default config;
