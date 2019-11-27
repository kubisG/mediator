import * as _path from "path";

export function getFileExtension(path: string): string {
    const dotExtension: string = _path.extname(path);
    return (dotExtension) ? dotExtension.split(".")[1] : null;
}

export function createPath(basePath: string, ...pathParts: string[]): string {
    const sanitizedBasePath: string = _path.resolve(basePath);
    return _path.join(sanitizedBasePath, ...pathParts);
}

export function getDirectoryName(repoName: string): string {
    const repoParts: string[] = (repoName) ? repoName.split("/") : null;
    const dirName = (repoParts) ? repoParts.pop() : null;
    const dirParts: string[] = (dirName) ? dirName.split(".") : null;
    return (dirParts) ? dirParts.shift() : null;
}
