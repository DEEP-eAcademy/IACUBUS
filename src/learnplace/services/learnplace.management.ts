/** angular */
import {InjectionToken, Inject, Injectable} from "@angular/core";
/** ionic-native */
import {File, FileEntry, RemoveResult} from "@ionic-native/file/ngx";
/** services */
import {Logger} from "../../services/logging/logging.api";
import {Logging} from "../../services/logging/logging.service";
/** entries */
import {PictureBlockEntity} from "../entity/pictureBlock.entity";
import {VideoBlockEntity} from "../entity/videoblock.entity";
/** misc */
import {IOError} from "../../error/errors";
import {LEARNPLACE_REPOSITORY, LearnplaceRepository} from "../providers/repository/learnplace.repository";
import {LEARNPLACE_PATH_BUILDER, LearnplacePathBuilder} from "./loader/resource";

/**
 * Describes a service to manage learnplaces.
 *
 * @author nschaefli <ns@studer-raimann.ch>
 * @version 1.0.0
 */
export interface LearnplaceManager {

    /**
     * Removes the learnplace with the given id.
     * All stored files of the learnplace will be removed as well.
     *
     * @param {number} objectId The object id of the learnplace which should be removed.
     * @param {number} userId The id of the user which owns the learnplace. This id must not be confused with the ILIAS user id which is different.
     *
     * @returns {Promise<void>} Resolves if the removal was successful or rejects a corresponding error in case of failure.
     */
    remove(objectId: number, userId: number): Promise<void>;

    /**
     * Calculates the used storage of the learnplace.
     *
     * Caution: The used storage within the sqlite database is not included.
     *
     * @param {number} objectId The object id of the learnplace which should be calculated.
     * @param {number} userId The id of the user which owns the learnplace. This id must not be confused with the ILIAS user id which is different.
     *
     * @returns {Promise<number>} The used storage in bytes.
     */
    storageSpaceUsage(objectId: number, userId: number): Promise<number>;
}

export const LEARNPLACE_MANAGER: InjectionToken<LearnplaceManager> = new InjectionToken("token for learnplace manager.");

/**
 * Implementation of the learnplace manager interface.
 *
 * @author nschaefli <ns@studer-raimann.ch>
 * @version 1.0.0
 */
@Injectable({
    providedIn: "root"
})
export class LearnplaceManagerImpl implements LearnplaceManager{

    private log: Logger = Logging.getLogger(LearnplaceManagerImpl.name);

    constructor(
        private readonly file: File,
        @Inject(LEARNPLACE_REPOSITORY) private readonly learnplaceRepository: LearnplaceRepository,
        @Inject(LEARNPLACE_PATH_BUILDER) private readonly pathBuilder: LearnplacePathBuilder
    ){}


    async remove(objectId: number, userId: number): Promise<void> {

        return (await this.learnplaceRepository.findByObjectIdAndUserId(objectId, userId)).ifPresent(async(it) => {

            const paths: Array<string> = [];
            const basePath: string = await this.pathBuilder.getStorageLocation();

            it.videoBlocks.forEach((video: VideoBlockEntity) => paths.push(`${basePath}${video.url}`));
            it.pictureBlocks.forEach((picture: PictureBlockEntity) => {
                paths.push(`${basePath}${picture.url}`);
                paths.push(`${basePath}${picture.thumbnail}`);
            });
            it.accordionBlocks.forEach((it) => {
                it.videoBlocks.forEach((video: VideoBlockEntity) => paths.push(`${basePath}${video.url}`));
                it.pictureBlocks.forEach((picture: PictureBlockEntity) => {
                    paths.push(`${basePath}${picture.url}`);
                    paths.push(`${basePath}${picture.thumbnail}`);
                });
            });

            let success: boolean = true;
            for(const fullPath of paths) {
                const [path, filename]: [string, string] = this.splitIntoPathNamePair(fullPath);
                const result: RemoveResult = await this.file.removeFile(path, filename);

                if(!result.success)
                    this.log.warn(() => `Unable to delete file "${fullPath}"`);

                success = success && result.success;
            }

            if(!success)
                throw new IOError(`Unable to delete all files of learnplace object id ${objectId} owned by user with id ${userId}`);

            await this.learnplaceRepository.delete(it);
        });
    }

    private splitIntoPathNamePair(path: string): [string, string] {
        const pathParts: Array<string> = path.split("/");
        const filename: string = pathParts.pop();
        const dirPath: string = pathParts.join("/");
        return [dirPath, filename];
    }

    async storageSpaceUsage(objectId: number, userId: number): Promise<number> {
         let size: number = 0;
         await (await this.learnplaceRepository.findByObjectIdAndUserId(objectId, userId)).ifPresent(async(it) => {

            const paths: Array<string> = [];
            const basePath: string = await this.pathBuilder.getStorageLocation();

            it.videoBlocks.forEach((video: VideoBlockEntity) => paths.push(`${basePath}${video.url}`));
            it.pictureBlocks.forEach((picture: PictureBlockEntity) => {
                paths.push(`${basePath}${picture.url}`);
                paths.push(`${basePath}${picture.thumbnail}`);
            });

            for(const fullPath of paths) {
                const [path, filename]: [string, string] = this.splitIntoPathNamePair(fullPath);
                const result: FileEntry = await this.file.getFile(await this.file.resolveDirectoryUrl(path), filename, {create: false});
                result.getMetadata(it => size += it.size);
            }
        });

         return size;
    }
}
