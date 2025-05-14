/** angular */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
/** misc */
import { OnboardingPage } from "./onboarding";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [{ path: "", component: OnboardingPage }];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule,
        RouterModule.forChild(routes),
    ],
    declarations: [OnboardingPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OnboardingPageModule {}
