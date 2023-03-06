import { DingConfig, DingMessageType, DingSendParams, RobotDingConfig } from "../types/robot-ding";
export default class RobotDing {
    protected webhook: string;
    protected secret: string;
    constructor(config: RobotDingConfig);
    sendDing<T = any>(config: DingConfig, msgtype?: DingMessageType): Promise<T>;
    protected sendService<T = any>(postData: DingSendParams, timestamp: number, sign: string): Promise<T>;
}
