import { ProcessParams, PIDResult, TuningMethod, ChartPoint } from '../types';

/**
 * Calculate PID parameters based on FOPDT model input.
 */
export const calculatePID = (params: ProcessParams, method: TuningMethod): PIDResult => {
    const { gain: K, timeConstant: Tau, deadTime: Theta } = params;
    
    // Prevent division by zero
    const theta = Math.max(Theta, 0.001);
    
    // Ratio of Dead Time to Time Constant
    const ratio = theta / Tau;
    const a = (K * ratio); 

    let Kp = 0, Ti = 0, Td = 0;

    switch (method) {
        case TuningMethod.CohenCoon:
            // Cohen-Coon Formulas
            Kp = (1/a) * (1.35 + 0.25 * ratio);
            Ti = (theta * (1.35 + 0.25 * ratio)) / (0.54 + 0.33 * ratio);
            Td = (0.5 * theta * ratio) / (1.35 + 0.25 * ratio); // Often simplified, using Standard form approximation
            // Refined Cohen-Coon for standard PID
            Kp = (1 / a) * (4/3 + ratio/4);
            Ti = theta * (32 + 6*ratio) / (13 + 8*ratio);
            Td = theta * 4 / (11 + 2*ratio);
            break;

        case TuningMethod.ZieglerNichols:
            // Ziegler-Nichols Open Loop (Reaction Curve)
            // Kp = 1.2 * (Tau / (K * Theta))
            Kp = 1.2 * (Tau / (K * theta));
            Ti = 2.0 * theta;
            Td = 0.5 * theta;
            break;

        case TuningMethod.IMC:
            // Lambda Tuning (Conservative, non-oscillatory)
            // Closed loop time constant Lambda usually set to Tau or > Theta
            const lambda = Math.max(Tau, theta); 
            Kp = (1/K) * (Tau / (lambda + theta));
            Ti = Tau;
            Td = 0; // PI usually, D is often 0 for IMC FOPDT unless specified
            break;
            
        default:
            Kp = 1; Ti = 1; Td = 0;
    }

    return {
        Kp,
        Ti,
        Td,
        Ki: Ti > 0 ? Kp / Ti : 0,
        Kd: Kp * Td
    };
};

/**
 * Simulate the Step Response of a controlled closed-loop system using Euler integration.
 * Model: First Order Plus Dead Time.
 * Controller: PID (Standard Form).
 */
export const simulateStepResponse = (process: ProcessParams, pid: PIDResult): ChartPoint[] => {
    const points: ChartPoint[] = [];
    
    const dt = 0.1; // simulation time step
    const totalTime = Math.max(process.timeConstant * 10, 60); // Simulate enough time to settle
    
    let pv = 0;      // Process Variable
    let error = 0;
    let integral = 0;
    let lastError = 0;
    
    // Delay buffer for Dead Time simulation
    const delaySteps = Math.round(process.deadTime / dt);
    const outputBuffer = new Array(delaySteps + 1).fill(0);
    
    const sp = 1.0; // Unit Step Setpoint

    for (let t = 0; t <= totalTime; t += dt) {
        // 1. Calculate Error
        error = sp - pv;

        // 2. PID Calculation (Standard Form)
        // u(t) = Kp * (e(t) + (1/Ti)*integral + Td*derivative)
        
        integral += error * dt;
        const derivative = (error - lastError) / dt;
        
        // Avoid Integral Windup (simple clamp for simulation visualization)
        // Ideally we clamp the output, but here we just clamp the integral term lightly
        // to prevent massive spikes in this simple visualizer
        
        let output = pid.Kp * (error + (pid.Ti > 0 ? (1/pid.Ti) * integral : 0) + pid.Td * derivative);
        
        // Clamp output to realistic 0-100% or +/- limit relative to gain
        // Assuming linear system for visualization, but clamping helps stability of the graph
        output = Math.max(-100, Math.min(100, output));

        // 3. Process Simulation (FOPDT)
        // Store output in buffer for dead time
        outputBuffer.push(output);
        const delayedOutput = outputBuffer.shift() || 0;

        // dy/dt = (K*u(t-theta) - y(t)) / Tau
        const change = (process.gain * delayedOutput - pv) / process.timeConstant;
        pv += change * dt;

        lastError = error;

        // Downsample for chart (every 0.5s)
        if (t % 0.5 < dt) {
            points.push({
                time: Number(t.toFixed(1)),
                sp,
                pv
            });
        }
    }

    return points;
};