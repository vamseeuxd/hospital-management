// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'tat-clinic',
    appId: '1:86393212815:web:811e894a50f54e1d3885fa',
    storageBucket: 'tat-clinic.appspot.com',
    apiKey: 'AIzaSyC1aQI-IjgCDCahARcoweD5PVzWnXGLqac',
    authDomain: 'tat-clinic.firebaseapp.com',
    messagingSenderId: '86393212815',
  },
  production: false,
  apiUrl: "http://localhost:4200",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
