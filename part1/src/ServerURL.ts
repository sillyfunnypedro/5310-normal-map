
// if you want to use the files on github use the following URL

export const GitHubPrefix = 'https://raw.githubusercontent.com/sillyfunnypedro/5310-Fall-2023-Resources/main/objects/';

export const LocalServerPrefix = 'http://localhost:8080/objects/';
let usingLocalServer = false;

export function SelectLocalServer(local: boolean) {
    usingLocalServer = local;
}

export function ServerURLPrefix(): string {
    if (usingLocalServer) {
        return LocalServerPrefix;
    }
    return GitHubPrefix;
}