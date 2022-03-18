import {NgModule} from "@angular/core";

import {CoreModule} from "./core/core.module";
import {SharedModule} from "./shared/shared.module";

import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HeaderComponent} from "./layout/header/header.component";
import {PageLoaderComponent} from "./layout/page-loader/page-loader.component";
import {SidebarComponent} from "./layout/sidebar/sidebar.component";
import {RightSidebarComponent} from "./layout/right-sidebar/right-sidebar.component";
import {AuthLayoutComponent} from "./layout/app-layout/auth-layout/auth-layout.component";
import {MainLayoutComponent} from "./layout/app-layout/main-layout/main-layout.component";
import {fakeBackendProvider} from "./core/interceptor/fake-backend";
import {ErrorInterceptor} from "./core/interceptor/error.interceptor";
import {JwtInterceptor} from "./core/interceptor/jwt.interceptor";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule,} from "ngx-perfect-scrollbar";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ClickOutsideModule} from "ng-click-outside";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule,} from "@angular/common/http";
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {SharedComponentsModule} from "./shared-components/shared-components.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    PerfectScrollbarModule,
    ClickOutsideModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    // core & shared
    CoreModule,
    SharedModule,
    SharedComponentsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
