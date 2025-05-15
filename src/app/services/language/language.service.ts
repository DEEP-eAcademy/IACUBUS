import { Injectable, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { Logging } from "../logging/logging.service";
import { Logger } from "../logging/logging.api";

/**
 * @author Jakub Niewelt <jakubniewelt@icloud.com>
 * @version 1.0.0
 * @since v4.10.0
 */

@Injectable({
    providedIn: "root",
})
export class LanguageService {
    private readonly log: Logger = Logging.getLogger("LanguageService");
    constructor(
        private translate: TranslateService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    setLanguage(lang: string) {
        this.translate.use(lang);
        this.setDirection(lang);
    }

    setDirection(lang: string) {
        const dir = ["ar", "he", "fa", "ur"].includes(lang) ? "rtl" : "ltr";
        this.document.documentElement.dir = dir;
        this.document.documentElement.lang = lang;
        this.log.info(() => "App direction changed!");
    }
}
