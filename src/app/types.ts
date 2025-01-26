export interface Weather {
    name: string;
    main: { temp: number; humidity: number };
    wind: { speed: number };
    weather: Array<{ description: string, icon: string }>;
}