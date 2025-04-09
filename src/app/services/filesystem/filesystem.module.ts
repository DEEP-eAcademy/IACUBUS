import { NgModule } from "@angular/core";
import { FileOpener } from "@awesome-cordova-plugins/file-opener/ngx";
import { File } from "@awesome-cordova-plugins/file/ngx";
import { CORDOVA_FILESYSTEM_FACTORY } from "./filesystem.cordova";
import { FILESYSTEM_TOKEN } from "./filesystem.service";
import { Platform } from "@ionic/angular";

@NgModule({
    providers: [
        FileOpener,
        {
            provide: FILESYSTEM_TOKEN,
            useFactory: CORDOVA_FILESYSTEM_FACTORY,
            deps: [Platform, File, FileOpener],
        },
    ],
})
export class FilesystemModule {}
