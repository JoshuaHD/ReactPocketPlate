
export type PageSetup<TSchema> = {
    collection: string;
    queryOptions?: RecordOptions;  
    listEntriesProps: ListEntriesProps,

    // Use ZodSchema for form schemas to ensure type safety
    formCreateSchema: ZodSchema<TSchema>;
  
    // Allow any type for form metadata, but it's tied to the schema
    formCreateMetadata: ZodFormMetadata<TSchema>;
  
    formUpdateSchema: ZodSchema<TSchema>;
  
    formUpdateMetadata: ZodFormMetadata<TSchema>;
  };

export type Pages = {
    [key: string]: PageSetup<any>
}