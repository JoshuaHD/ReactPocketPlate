import { Camera, FilePlus, Trash2, Undo2Icon, Upload } from "lucide-react";
import { ComponentProps, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form";
import { Button } from "./button.js";
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';
import { pb } from "@/settings.js";
import { Badge } from "./badge.js";
import { FormMessage } from "./form.js";

export type AttachmentEditorOptions = {
  db_field_name: string,
  uploadSizeLimitMb?: number,
  maxFiles?: number,
  allowedFileTypes?: string[],
  filesProtected?: boolean
}
type AttachmentEditor = ComponentProps<"input"> & {
  options: AttachmentEditorOptions
}

const previewExtensions = [
  "png", "jpg", "jpeg", "gif", "bmp", "webp", "svg", "ico", "tiff", "tif", "avif"
];

const errorMessageIllegalFiletype = "Filetype not allowed"

export default function AttachmentEditor(props: AttachmentEditor) {
  const { allowedFileTypes, filesProtected } = props.options ?? {}
  const firstLoad = useRef(false)
  // Used to get access to pocketbase protected files
  const [fileToken, setFileToken] = useState<string>()

  const { watch, setValue, formState } = useFormContext();
  const { dataset, field, key } = watch(props.name!); // Get the current value of the "attachments" field
  const existing_attachments = (dataset?.[field] && typeof dataset?.[field] === "string") ? [dataset?.[field]] : (dataset?.[field] ?? [])
  const fieldId = props?.id

  const removeAttachmentsKey = `${field}-`
  const addAttachmentsKey = `${field}+`

  const [filesForRemoval, setFilesForRemoval] = useState<Set<number>>(new Set());
  const [files, setFiles] = useState<File[]>([]);

  /* Drag and Drop */
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const debounceErrorTimer = useRef<number | null>(null)

  useEffect(() => {
    if (firstLoad.current || !filesProtected)
      return

    // FIXME This causes autocancelation issues
    (async () => setFileToken(await pb.files.getToken({ requestKey: null })))()
    firstLoad.current = true
  }, [])

  useEffect(() => {
    setFiles([])
  }, [key])

  const setDebouncedError = (error: string, timeout = 200) => {
    if (debounceErrorTimer.current)
      clearTimeout(debounceErrorTimer.current)

    debounceErrorTimer.current = setTimeout(() => {
      setError(error)
    }, timeout) as unknown as number
  }

  const handleMarkedForRemoval = (index: number) => {
    const markedForRemoval = new Set(filesForRemoval);
    if (markedForRemoval.has(index)) {
      markedForRemoval.delete(index);
    } else {
      markedForRemoval.add(index);
    }

    setFilesForRemoval(markedForRemoval);

    // Optionally, update the "attachments" field if needed
    setValue(removeAttachmentsKey, Array.from(markedForRemoval).map((i) => existing_attachments[i]), { shouldDirty: true });
  };

  const existingFiles = <div>
    {existing_attachments && existing_attachments.map((attachment: string, index: number) => {
      const state = (filesForRemoval.has(index)) ? "trashed" : "ok"


      const fileUrl = (fileToken) ? `/api/files/${dataset.collectionId}/${dataset.id}/${attachment}` : ""
      let icon;
      const extension: DefaultExtensionType = (attachment.toLowerCase().split(".").pop() ?? "unknown") as DefaultExtensionType

      if (fileUrl && previewExtensions.includes(extension)) {
        icon = <img src={`${fileUrl}?thumb=100x100&token=${fileToken}`} style={{ height: "40px", width: "40px" }} className="[[data-state=trashed]_&]:opacity-30" />
      }
      else {
        icon = <div style={{ width: "40px" }}><div className="[[data-state=trashed]_&]:opacity-30 m-auto" style={{ height: "35px", width: "30px" }}>
          <FileIcon extension={extension} {...defaultStyles[extension]} />
        </div></div>
      }

      return <div key={index} className={`py-2 ${index !== 0 ? "border-t border-gray-300" : ""}`}>
        <div data-state={state} className="data-[state=trashed]:line-through data-[state=trashed]:text-red-400 flex items-center">
          {icon}
          <a
            href={`${fileUrl}?token=${fileToken}`}
            target="_blank"
            className="break-all flex-1 pl-2 text-left"
          >
            {attachment}
          </a>
          <Button type="button" onClick={() => handleMarkedForRemoval(index)} variant={"ghost"}>{(filesForRemoval.has(index)) ? <Undo2Icon /> : <Trash2 />}</Button>
        </div>
      </div>
    })}
  </div>

  // UPLOAD
  const handlePaste = (event: ClipboardEvent | any) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const pastedFiles: File[] = [];
    for (const item of items) {
      if (allowedFileTypes?.includes(item.type)) {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      } else {
        setError(errorMessageIllegalFiletype);

        setDebouncedError("", 1000);
      }
    }

    const updatedFiles = [...files, ...pastedFiles];
    setFiles(updatedFiles);

    // Update form state with the new file list
    setValue(addAttachmentsKey, updatedFiles, { shouldDirty: true });

  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true)

    if (!allowedFileTypes || allowedFileTypes.length === 0)
      return
    // Check if dragged files contain only allowed types
    const items = Array.from(event.dataTransfer.items);
    const hasOnlyAllowedFiles = items.every(item =>
      item.kind === "file" && allowedFileTypes.includes(item.type)
    );

    if (!error && error !== errorMessageIllegalFiletype) {
      setError(hasOnlyAllowedFiles ? "" : errorMessageIllegalFiletype);
    } else {
      setDebouncedError("", 150)
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);
    setDebouncedError("", 1000);

    const droppedFiles = Array.from(event.dataTransfer.files);

    if (!validateFiles(droppedFiles)) return false;

    const updatedFiles = [...files, ...droppedFiles];
    setFiles(updatedFiles);

    // Update form state with the new file list
    setValue(addAttachmentsKey, updatedFiles, { shouldDirty: true });

  };

  const handleDragLeave = () => {
    setIsDragging(false);
    //setDebouncedError("")
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    // Update form state with the modified file list
    setValue(addAttachmentsKey, updatedFiles, { shouldDirty: true });  // Adjust according to your form structure
  };

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      if (!validateFiles(newFiles)) return false;

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      // Update form state with the new file list
      setValue(addAttachmentsKey, updatedFiles, { shouldDirty: true });  // Adjust according to your form structure
    }
  };

  const validateFiles = (newFiles: File[]) => {
    if (!allowedFileTypes || allowedFileTypes.length === 0)
      return true

    const filteredFiles = newFiles.filter((file) => allowedFileTypes.includes(file.type));

    if (newFiles.length > 0 && filteredFiles.length === 0) {

      if (error !== errorMessageIllegalFiletype)
        setDebouncedError(errorMessageIllegalFiletype);
      return false;
    }

    if (error)
      setDebouncedError("")

    return true
  }

  const handleOpenFile = (file: File) => {
    const objectURL = URL.createObjectURL(file);
    window.open(objectURL, "_blank");
  };

  const newFile = (file: any, index: number) => {
    const state = ""


    let icon;
    const extension: DefaultExtensionType = (file.name.toLowerCase().split(".").pop() ?? "unknown") as DefaultExtensionType

    if (previewExtensions.includes(extension)) {
      const fileURL = URL.createObjectURL(file);
      icon = <div key={index} className="relative w-[40px] h-[40px]">
        <img src={fileURL} alt={file.name} className="w-full h-full object-cover" />
      </div>
    }
    else {
      icon = <div style={{ width: "40px" }}><div className="[[data-state=trashed]_&]:opacity-30 m-auto" style={{ height: "35px", width: "30px" }}>
        <FileIcon extension={extension} {...defaultStyles[extension]} />
      </div></div>
    }
    return <div key={index} className={`py-2 ${(index !== 0 || existing_attachments.length > 0) ? "border-t border-gray-300" : ""}`}>
      <div data-state={state} className="data-[state=trashed]:line-through data-[state=trashed]:text-red-400 flex items-center cursor-pointer" onClick={() => handleOpenFile(file)}>
        {icon}
        <span className="break-all flex-1 pl-2 text-left"><Badge className="bg-emerald-500">new</Badge> {file.name}</span>

        <Button type="button" onClick={() => handleDeleteFile(index)} variant={"ghost"}><Trash2 /></Button>
      </div>
    </div>
  }
  return (
    <div>
      <div
        aria-invalid={!!error}
        tabIndex={0}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-input selection:bg-primary selection:text-primary-foreground border ${(error) ? "bg-red-100" : (isDragging ? "border-green-500 bg-green-100 cursor-pointer" : "border-gray-400")} shadow-xs transition-[color,box-shadow] outline-none p-2 rounded-md focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`}
      >
        <div className="flex justify-between items-center">
          <p aria-invalid={!!error} className={`aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`}>{error || "Paste or Drag & Drop files here"}</p>
          <span className="text-xs">
            {files.length + existing_attachments.length - filesForRemoval.size}/{props.options?.maxFiles ?? "∞"} files {(Array.from(files).reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)}/{props.options?.uploadSizeLimitMb ?? "∞"}MB
          </span>
        </div>
        {files.length + existing_attachments.length < 1 && <label htmlFor={fieldId} className="cursor-pointer p-2">
          <FilePlus className="text-stone-300 m-auto" size={64} />
        </label>}
        {existingFiles}
        <div>
          {files.map((file, index) => {
            return newFile(file, index)
          })}
        </div>

        <div className="flex items-center justify-end">
          <div>
            <input
              type="file"
              id="cameraInput"
              accept="image/*"
              capture="environment" // This triggers the camera
              multiple
              className="hidden"
              onChange={handleAddFiles}
            />
            <label
              htmlFor="cameraInput"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
            >
              <Camera size={18} />
              Take Foto
            </label>
          </div>
          <div>
            <input
              type="file"
              id={fieldId}
              multiple
              className="hidden"
              onChange={handleAddFiles}
            />
            {/* Upload Button */}
            <label
              htmlFor={fieldId}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent"
            >
              <Upload size={18} />
              Add Files
            </label>
          </div>
        </div>
      </div>
      <FormMessage><>{formState.errors?.[removeAttachmentsKey]?.message}</></FormMessage>
      <FormMessage><>{formState.errors?.[addAttachmentsKey]?.message}</></FormMessage>
    </div>
  );
}