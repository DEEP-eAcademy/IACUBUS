import {Component} from "@angular/core";
import {FooterToolbarService} from "../../../services/footer-toolbar.service";

@Component({
    templateUrl: "loading.html"
})
export class LoadingPage {

    constructor(
        readonly footerToolbar: FooterToolbarService
    ) {}
}
