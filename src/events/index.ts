export interface Event {
    name: string,
    run(...args: any[]): Promise<void>
}