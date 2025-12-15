export enum TuningMethod {
    ZieglerNichols = 'ZN',
    CohenCoon = 'CC',
    IMC = 'IMC'
}

export interface ProcessParams {
    gain: number;         // Kp (Process Gain)
    timeConstant: number; // Tau (Time Constant)
    deadTime: number;     // Theta (Dead Time)
}

export interface PIDResult {
    Kp: number; // Proportional Gain
    Ti: number; // Integral Time (seconds)
    Td: number; // Derivative Time (seconds)
    Ki?: number; // Integral Gain (calculated as Kp/Ti)
    Kd?: number; // Derivative Gain (calculated as Kp*Td)
}

export interface ChartPoint {
    time: number;
    sp: number; // Setpoint
    pv: number; // Process Variable
}