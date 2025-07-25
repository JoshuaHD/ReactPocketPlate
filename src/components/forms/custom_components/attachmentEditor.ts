import AttachmentEditor, { AttachmentEditorOptions } from "@/components/ui/AttachmentEditor.js"
import { ComponentProps } from "react"
import { z } from "zod"

export const allowedFileTypePresets = {
  images: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/bmp",
    "image/svg+xml",
    "image/webp",
    "image/tiff",
  ],
  audio: [
    "audio/aac", // AAC audio
    "audio/flac", // FLAC audio
    "audio/midi", // MIDI audio
    "audio/mpeg", // MP3 audio
    "audio/ogg", // OGG Vorbis audio
    "audio/opus", // Opus audio
    "audio/wav", // WAV audio
    "audio/webm", // WebM audio
    "audio/3gpp", // 3GPP audio (mobile)
    "audio/3gpp2", // 3GPP2 audio (mobile)
    "audio/x-wav", // WAV (alternative)
    "audio/x-m4a", // M4A audio (Apple)
    "audio/x-ms-wma", // WMA audio (Windows Media)
    "audio/x-aiff", // AIFF audio
    "audio/x-flac" // FLAC audio (alternative)
  ],
  videos: [
    "video/mp4",
    "video/mpeg",
    "video/ogg",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
  ],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "text/plain",
    "text/csv",
    "application/json",
  ],
  archives: [
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/x-tar",
    "application/gzip",
  ],
};

/**
 * Generates a schema for the attachment editor component.
 *
 * @param {string} filesFieldName - The name of the field storing attachments.
 * @param {string} label - The label to be displayed for the editor.
 * @param {AttachmentEditorOptions} [options] - Optional settings for the attachment editor.
 * @returns {any} The configuration schema for the attachment editor.
 *
 * ### Zod Refiner Example:
 *
 * ```ts
 * z.object({
 *   "my_files_field-": z.array(z.string()).transform((val) => (val.length < 1 ? undefined : val)).optional(), // array to remove files
 *   "_my_files_field": z.any(),
 *   "my_files_field+": getFileUploadSchema({ maxFiles: 9, uploadSizeLimitMb: 32 }).optional() // field to add files
 * }).transform((data) => {
 *   let newData = data;
 *   delete newData._my_files_field; // we don't need this anymore
 *   return newData;
 * });
 *
 * ```
 *
 * @example
 * const schema = getAttachmentEditorSchema("my_files_field", "Update My Files", {
 *   allowedFileTypes: ["text/plain", "text/csv", "application/json"],
 *   filesProtected: false,
 *   maxFiles: 3,
 *   uploadSizeLimitMb: 6.5
 * });
 * console.log(schema);
 */

export function getAttachmentEditorSchema(filesFieldName: string, label: string, options?: AttachmentEditorOptions): any {
  return {
    defaultValue: (_: any, allData: any) => {
      return { dataset: allData, field: filesFieldName, key: new Date().getTime() }
    },
    label,
    component: {
      component: AttachmentEditor,
      props: (field: ComponentProps<typeof AttachmentEditor>) => {
        field.options = options ?? {} as AttachmentEditorOptions
        return field as any
      }
    }
  }
}

export const getAttachmentZodSchema = (options?: AttachmentEditorOptions) => {
  options = options ?? {} as AttachmentEditorOptions
  const defaultFieldName = "attachments"
  return {
    ["_" + (options?.db_field_name ?? defaultFieldName)]: z.any(),//.transform(() => undefined),
    [(options?.db_field_name ?? defaultFieldName) + "-"]: z.array(z.string()).transform((val) => (val.length < 1 ? undefined : val)).optional(), // array to remove files
    [(options?.db_field_name ?? defaultFieldName) + "+"]: getFileUploadFieldsZodSchema(options).optional(),
  }
}

const getFileUploadFieldsZodSchema = ({ uploadSizeLimitMb, maxFiles, allowedFileTypes }: AttachmentEditorOptions) => {
  // Conditionally add refiners
  let fileListSchema: any = z.instanceof(FileList).transform((val) => Array.from(val as any));
  let fileArraySchema: any = z.array(z.instanceof(File));

  // Apply refiners based on the passed arguments
  if (maxFiles) {
    const fileNumberRefiner = (files: FileList | File[] | unknown[]) => {
      return files.length <= maxFiles
    }
    const fileNumberRefinerMessage = (files: FileList | File[] | unknown[]) => ({ message: `You can upload up to ${maxFiles} files only (got ${Array.from(files).length})` })

    fileListSchema = fileListSchema.refine(fileNumberRefiner, fileNumberRefinerMessage);
    fileArraySchema = fileArraySchema.refine(fileNumberRefiner, fileNumberRefinerMessage);
  }

  if (uploadSizeLimitMb) {
    const fileSizeRefiner = (files: FileList | File[] | any[]) => Array.from(files).reduce((acc, file) => acc + file.size, 0) <= uploadSizeLimitMb * 1024 * 1024
    const fileSizeRefinerMessage = (files: FileList | File[] | any[]) => ({ message: `Total file size should not exceed ${Math.round(uploadSizeLimitMb * 100) / 100}MB (${(Array.from(files).reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)}MB Selected)` })

    fileListSchema = fileListSchema.refine(fileSizeRefiner, fileSizeRefinerMessage);
    fileArraySchema = fileArraySchema.refine(fileSizeRefiner, fileSizeRefinerMessage);
  }

  if (allowedFileTypes && allowedFileTypes.length > 0) {
    const fileTypeRefiner = (files: FileList | File[] | any[]) => {
      return Array.from(files).every((file) =>
        allowedFileTypes.includes(
          file.type
        )
      )
    }
    const fileTypeRefinerMessage = (files: FileList | File[] | any[]) => {
      const invalidFiles = Array.from(files)
        .filter((file) => !allowedFileTypes.includes(file.type))
        .map((file) => file.type)
        .join(", ");

      return { message: `Invalid file type(s): ${invalidFiles}` };
    }

    fileListSchema = fileListSchema.refine(fileTypeRefiner, fileTypeRefinerMessage);
    fileArraySchema = fileArraySchema.refine(fileTypeRefiner, fileTypeRefinerMessage);
  }

  // Return the schema with conditional refiners
  return z.union([
    fileListSchema,
    fileArraySchema,
    z.literal("") // Case 3: Allow an empty string as a default (no images)
  ]);
}