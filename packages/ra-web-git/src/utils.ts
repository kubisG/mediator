import * as _path from "path";
import * as _ from "lodash";

export function getFileExtension(path: string): string | null {
    if (path) {
        const dotExtension: string = _path.extname(path);
        return (dotExtension) ? dotExtension.split(".")[1] : null;
    } else {
        return null;
    }
}

export function createPath(basePath: string, ...pathParts: string[]): string | null {
    if (basePath && !_.some(pathParts, (part) => _.isNil(part))) {
        const sanitizedBasePath: string = _path.resolve(basePath);
        return _path.join(sanitizedBasePath, ...pathParts);
    } else {
        return null;
    }
}

export function getDirectoryName(repoName: string): string | null {
    if (repoName) {
        const repoParts: string[] = repoName.split("/");
        const dirName = repoParts.pop();
        const dirParts: string[] = dirName.split(".");
        return dirParts.shift();
    } else {
        return null;
    }
}
