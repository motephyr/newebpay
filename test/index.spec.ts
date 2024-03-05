import TradeDto from '../src/dto/trade-init.dto';
import { TradeModules } from '../src/index';
// Above Data is all fake data, please do not reference it

const tradeModules = new TradeModules();

describe('# TradesModules', () => {
  beforeAll(async done => {
    const trade = await tradeModules.setTrade({
      URL: 'http://localhost:3000/api',
      MerchantID: 'MS88888888',
      HashKey: 'sdfkalusalfksmkfljsdkafulT41vTwL',
      HashIV: 'asdfasdfasd32mLP',
      PayGateWay: 'https://ccore.newebpay.com/MPG/mpg_gateway',
      ClientBackURL: 'http://localhost:3000/api/orders',
    });
    if (trade instanceof TradeDto) tradeModules.trade = trade;
    done();
  });

  describe('# When Request reqeust coming into TradesModules', () => {
    it('Should be able to init TradeModules', () => {
      expect(tradeModules.trade.URL).toEqual('http://localhost:3000/api');
      expect(tradeModules.trade.MerchantID).toEqual('MS88888888');
      expect(tradeModules.trade.HashKey).toEqual(
        'sdfkalusalfksmkfljsdkafulT41vTwL',
      );
      expect(tradeModules.trade.HashIV).toEqual('asdfasdfasd32mLP');
      expect(tradeModules.trade.PayGateWay).toEqual(
        'https://ccore.newebpay.com/MPG/mpg_gateway',
      );
      expect(tradeModules.trade.ClientBackURL).toEqual(
        'http://localhost:3000/api/orders',
      );
    });

    describe('Request getTradeInfo()', () => {
      it('Should return results as an Object which contains correct data', () => {
        const result = tradeModules.getTradeInfo(3700, '1', 'test@test.com');
        expect(result.MerchantID).toEqual('MS88888888');
        expect(result.PayGateWay).toEqual(
          'https://ccore.newebpay.com/MPG/mpg_gateway',
        );
      });

      it('Should return Error when Amt is less than zero', () => {
        expect(() => {
          tradeModules.getTradeInfo(-1, '1', 'test@test.com');
        }).toThrow('Input Amt cannot less than zero');
      });

      it('Should return Error when Desc is incorrect', () => {
        expect(() => {
          tradeModules.getTradeInfo(3700, '', 'test@test.com');
        }).toThrow(`Input Desc:  length cannot less than 1`);
      });

      it('Should return Error when Email is incorrect', () => {
        expect(() => {
          tradeModules.getTradeInfo(3700, 'test', 'test.malwaretest.com');
        }).toThrow('Input email content test.malwaretest.com malware');
      });
    });

    describe('Request createMpgAesDecrypt', () => {
      const mpgAesEncrypt =
        '7e55d47e6554150fc3d6446a96ca223db83e1b6f4a58268812fb95f0aa890c4799db14888cf00c55ef4153657935367a4c0da6176a048a97377bbb61902763e3501c056db18435a072037c3be59692bdbf42b1c22a65361053dfd004f60befb865364c9be596f3bfcb81e8a45c16118c1a8905d499eb6d8a03ce291532b970e571e83351c5caf8607e284503131a0d8b402f6ad78a6c227218d9e23646955fe274f622fcb1b34c3b46ca9f1e3581be1e5707b41bea1ac22ac3a0644ba55d0f00189f0c0f2684a290b93afbee4d6af392f7052e19142d9d92bc5e35d0aa7c2e4a7f84670daa38667262bcf54de670134dc919b6cafe2f5202e0b54ea6cc059520e530fc1dfaa950a2585fcdd4f15efb1333a34161159baef61fbb03fcbb5fc5fae26f4fbad1ab6500817b971b022fbfc48b9af50edd12851eea4d732a5ffd6a41c0f041dfb34d14a253a92d7a9b4e62f6';

      it('Should return Decrypt Data hex when we call the function', () => {
        const data = tradeModules.createMpgAesDecrypt(mpgAesEncrypt);
        expect(data.MerchantID).toEqual('test1test1');
        expect(data.MerchantOrderNo).toEqual('1581755183872');
        expect(data.Email).toEqual('test1@example.com');
      });
    });
  });
});
