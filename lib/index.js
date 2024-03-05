"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const class_validator_1 = require("class-validator");
const trade_init_dto_1 = __importDefault(require("./dto/trade-init.dto"));
class TradeModules {
    constructor() {
        this.trade = {
            URL: '',
            MerchantID: '',
            HashKey: '',
            HashIV: '',
            PayGateWay: '',
            ReturnURL: '',
            NotifyURL: '',
            ClientBackURL: 'http://localhost:8080/orders',
        };
    }
    setTrade(tradeDto) {
        const trade = new trade_init_dto_1.default();
        trade.URL = tradeDto.URL;
        trade.MerchantID = tradeDto.MerchantID;
        trade.HashKey = tradeDto.HashKey;
        trade.HashIV = tradeDto.HashIV;
        trade.PayGateWay = tradeDto.PayGateWay;
        trade.ReturnURL = `${trade.URL}/newebpay/callback?from=ReturnURL`;
        trade.NotifyURL = `${trade.URL}/newebpay/callback?from=NotifyURL`;
        trade.ClientBackURL = tradeDto.ClientBackURL;
        return class_validator_1.validate(tradeDto).then(err => {
            if (err.length > 0)
                return err;
            return trade;
        });
    }
    genDataChain(TradeInfo) {
        const results = [];
        for (const kv of Object.entries(TradeInfo)) {
            results.push(`${kv[0]}=${kv[1]}`);
        }
        return results.join('&');
    }
    createMpgAesEncrypt(TradeInfo) {
        const encrypt = crypto_1.createCipheriv('aes256', this.trade.HashKey, this.trade.HashIV);
        const enc = encrypt.update(this.genDataChain(TradeInfo), 'utf8', 'hex');
        return enc + encrypt.final('hex');
    }
    parser(str) {
        const arr = str.split('&');
        const result = {
            MerchantID: '',
            RespondType: 'JSON',
            TimeStamp: 0,
            Version: 0,
            MerchantOrderNo: 0,
            LoginType: 0,
            OrderComment: 'OrderComment',
            Amt: 0,
            ItemDesc: '',
            Email: '',
            ReturnURL: '',
            NotifyURL: '',
            ClientBackURL: '',
        };
        arr.forEach((element) => {
            if (typeof element === 'string' && element.length > 0) {
                const items = element.split('=');
                result[items[0]] = items[1];
            }
        });
        return result;
    }
    createMpgAesDecrypt(TradeInfo) {
        const decrypt = crypto_1.createDecipheriv('aes256', this.trade.HashKey, this.trade.HashIV);
        decrypt.setAutoPadding(false);
        const text = decrypt.update(TradeInfo, 'hex', 'utf8');
        const plainText = text + decrypt.final('utf8');
        const result = plainText.replace(/[\x00-\x20]+/g, '');
        return this.parser(result);
    }
    createMpgShaEncrypt(TradeInfo) {
        const sha = crypto_1.createHash('sha256');
        const plainText = `HashKey=${this.trade.HashKey}&${TradeInfo}&HashIV=${this.trade.HashIV}`;
        return sha
            .update(plainText)
            .digest('hex')
            .toUpperCase();
    }
    getTradeInfo(Amt, Desc, email) {
        const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if (Amt < 0)
            throw new Error(`Input Amt cannot less than zero`);
        if (Desc.length < 1)
            throw new Error(`Input Desc: ${Desc} length cannot less than 1`);
        if (email.search(emailRule) === -1)
            throw new Error(`Input email content ${email} malware`);
        const data = {
            MerchantID: this.trade.MerchantID,
            RespondType: 'JSON',
            TimeStamp: Date.now(),
            Version: 1.5,
            MerchantOrderNo: Date.now(),
            LoginType: 0,
            OrderComment: 'OrderComment',
            Amt: Amt,
            ItemDesc: Desc,
            Email: email,
            ReturnURL: this.trade.ReturnURL,
            NotifyURL: this.trade.NotifyURL,
            ClientBackURL: this.trade.ClientBackURL,
        };
        const mpgAesEncrypt = this.createMpgAesEncrypt(data);
        const mpgShaEncrypt = this.createMpgShaEncrypt(mpgAesEncrypt);
        const tradeInfo = {
            MerchantID: this.trade.MerchantID,
            TradeInfo: mpgAesEncrypt,
            TradeSha: mpgShaEncrypt,
            Version: 1.5,
            PayGateWay: this.trade.PayGateWay,
            MerchantOrderNo: data.MerchantOrderNo,
        };
        return tradeInfo;
    }
}
exports.TradeModules = TradeModules;
//# sourceMappingURL=index.js.map