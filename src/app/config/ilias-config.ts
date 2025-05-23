/** angular */
import { Injectable, InjectionToken } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationProvider } from "../providers/authentication.provider";
/** misc */
import { HttpClient, HttpResponse } from "../providers/http";
import { isDefined } from "../util/util.function";
import { Optional } from "../util/util.optional";

const CONFIG_FILE: string = "./assets/config.json";

export interface ILIASConfig {
    readonly installations: Array<ILIASInstallation>;
}

export interface ILIASInstallation {
    readonly id: number;
    readonly title: string;
    readonly url: string;
    readonly clientId: string;
    readonly apiKey: string;
    readonly apiSecret: string;
    readonly accessTokenTTL: number;
    readonly privacyPolicy: string;
}

export const CONFIG_PROVIDER: InjectionToken<ConfigProvider> =
    new InjectionToken<ConfigProvider>("Token for ConfigProvider");

/**
 * Describes a provider for the config file of this app.
 *
 * @author nmaerchy <nm@studer-raimann.ch>
 * @version 1.0.0
 */
export interface ConfigProvider {
    /**
     * Loads the config file.
     *
     * @returns {Promise<ILIASConfig>} the resulting
     */
    loadConfig(): Promise<ILIASConfig>;

    /**
     * Loads the config file and searches for an installation
     * matching the given {@code installationId}.
     *
     * @param {number} installationId unique identifier of the installation
     *
     * @returns {Promise<ILIASInstallation>} the resulting ILIAS installation
     * @throw {ReferenceError} if the given id does not exists
     */
    loadInstallation(
        installationId: number
    ): Promise<Optional<ILIASInstallation>>;

    /**
     * Returns the last loaded installation
     *
     * @returns {Promise<ILIASInstallation>} the resulting ILIAS installation
     */
    getInstallation(): Promise<Optional<Readonly<ILIASInstallation>>>;
}

/**
 * Provider for the config file. The file is loaded over angular {@link Http}.
 * This class assumes, that the config file is valid.
 *
 * @author nmaerchy <nm@studer-raimann.ch>
 * @version 1.0.0
 */
@Injectable()
export class ILIASConfigProvider implements ConfigProvider {
    private readonly config: Promise<ILIASConfig>;
    private installation: Promise<Optional<ILIASInstallation>> =
        Promise.resolve(Optional.empty());

    constructor(
        private readonly http: HttpClient,
        private readonly translate: TranslateService
    ) {
        this.config = this.loadFile();
        this.observeTranslation();
    }

    observeTranslation(): void {
        this.translate.onLangChange.subscribe(async (lang: string) => {
            if (AuthenticationProvider.isLoggedIn())
                await this.loadInstallation(
                    AuthenticationProvider.getUser().installationId
                );
        });
    }

    async getInstallation(): Promise<Optional<Readonly<ILIASInstallation>>> {
        return this.installation;
    }

    async loadConfig(): Promise<ILIASConfig> {
        return this.config;
    }

    async loadInstallation(
        installationId: number
    ): Promise<Optional<Readonly<ILIASInstallation>>> {
        const iliasConfig: ILIASConfig = await this.config;

        let installation: ILIASInstallation | undefined =
            iliasConfig.installations.find((it) => it.id == installationId);

        installation = {
            id: installation.id,
            title: installation.title,
            url: installation.url,
            clientId: installation.clientId,
            apiKey: installation.apiKey,
            apiSecret: installation.apiSecret,
            accessTokenTTL: installation.accessTokenTTL,
            privacyPolicy: installation.privacyPolicy
                ? installation.privacyPolicy
                : `https://deepportal.hq.nato.int/eacademy/${await this.translate
                      .get("privacy")
                      .toPromise()}/`,
        };

        if (isDefined(installation)) {
            this.installation = Promise.resolve(Optional.of(installation));
            return Optional.of(installation);
        }

        throw new ReferenceError(
            `Installation with id '${installationId}' does not exists in file: ${CONFIG_FILE}`
        );
    }

    private async loadFile(): Promise<ILIASConfig> {
        const response: HttpResponse = await this.http.get(CONFIG_FILE);

        return response.json<ILIASConfig>(configSchema);
    }
}

const configSchema: object = {
    title: "config",
    type: "object",
    properties: {
        installations: {
            type: "array",
            "items:": {
                type: "object",
                properties: {
                    id: {
                        type: "number",
                        min: 1,
                    },
                    title: { type: "string" },
                    url: { type: "string" },
                    clientId: { type: "string" },
                    apiKey: { type: "string" },
                    apiSecret: { type: "string" },
                    accessTokenTTL: { type: "number" },
                    privacyPolicy: {
                        type: "string",
                        default:
                            "https://deepportal.hq.nato.int/eacademy/iacubus-privacy-policy/",
                    },
                },
                required: [
                    "id",
                    "title",
                    "url",
                    "clientId",
                    "apiKey",
                    "apiSecret",
                    "accessTokenTTL",
                ],
            },
        },
    },
    required: ["installations"],
};
