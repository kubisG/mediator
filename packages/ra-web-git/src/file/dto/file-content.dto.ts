export class FileContentDto {
    type: "json" | "yaml" | "properties" | "text";
    content: string;
}