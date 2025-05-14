/** angular */
import { Component, ViewChild, ElementRef } from "@angular/core";
import { AppVersion } from "@awesome-cordova-plugins/app-version/ngx";
import { NavController } from "@ionic/angular";
@Component({
    templateUrl: "onboarding.html",
    styleUrls: ["./onboarding.scss"],
    host: {
        "(window:resize)": "onResize()",
    },
})
export class OnboardingPage {
    readonly appName: Promise<string>;
    @ViewChild("swiper") swiperRef: ElementRef;

    constructor(
        private readonly navCtrl: NavController,
        appVersion: AppVersion
    ) {
        this.appName = appVersion.getAppName();
    }

    onResize(): void {
        if (this.swiperRef?.nativeElement?.swiper) {
            this.swiperRef.nativeElement.swiper.options = {
                width: window.outerWidth,
            };
        }
    }

    async nextSlide(): Promise<void> {
        if (this.swiperRef?.nativeElement.swiper.isEnd) {
            this.dismiss();
            return;
        }

        await this.swiperRef?.nativeElement.swiper.slideNext(300);
    }

    dismiss(): void {
        this.navCtrl.navigateRoot(["/login"]);
    }
}
