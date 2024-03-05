import { ValidationError } from 'class-validator';
import TradeDto from './dto/trade-init.dto';
import { ITrade, ITradeRequest, ITradeData, ITradeInfo, TParser } from './interface/trade.interface';
export declare class TradeModules {
    trade: ITrade;
    setTrade(tradeDto: ITradeRequest): Promise<TradeDto | ValidationError[]>;
    private genDataChain;
    private createMpgAesEncrypt;
    private parser;
    createMpgAesDecrypt(TradeInfo: string): TParser<ITradeData>;
    private createMpgShaEncrypt;
    getTradeInfo(Amt: number, Desc: string, email: string): ITradeInfo;
}
