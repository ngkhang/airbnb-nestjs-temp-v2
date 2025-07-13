export type ServiceReturn<TData> = Promise<TData>;

export type ControllerResponse<TData> = { data: TData; message: string };
