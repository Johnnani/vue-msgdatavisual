import crypto from 'crypto';
import uuid from 'uuid';

/**
 * @description 加密工具类
 * @author ycyoes
 * @date 2018-01-17
 *
 */
var encrypt = {
  // 生成指定位数(2*len)随机数
  getRandom: function (len) {
    return crypto.randomBytes(len).toString('hex');
  },

  /**
   * 生成指定位数随机数(纯数字)
   */
  getRandomNum: function (num) {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let res = '';
    for (let i = 0; i < num; i++) {
      let id = Math.ceil(Math.random() * 9);
      res += chars[id];
    }
    return res;
  },

  /**
   * hash算法
   * algorithm: hash算法，可通过getHashes获取可使用的加密算法，常用的有MD5,SHA1,SHA256
   * data:待加密明文
   * key: 加密密钥
   * encoding: 编码，可以是 'hex'、'binary' 或 'base64'
   */
  hmacSha: function (algorithm, data, key, encoding) {
    return crypto.createHmac('hash', key).update(data).digest(encoding);
  },

  /**
   * md5加密
   * data: 待加密内容
   */
  md5: function (data) {
    return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
  },

  /**
   * aes加密
   * data: 待加密数据
   * key: 密钥
   */
  aesEncrypt: function (data, key) {
    let encrypted = '';
    let cipher = crypto.createCipher('aes192', key);
    encrypted += cipher.update(new Buffer(data), 'binary', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },

  aes128Encrypt: function (data, key) {
    let encrypted = '';
    let cipher = crypto.createCipher('aes-128-ecb', key);
    encrypted += cipher.update(new Buffer(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },

  aes128Decrypt: function (data, key) {
    let decrypted = '';
    let decipher = crypto.createDecipher('aes-128-ecb', key);
    decrypted += decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },

  /**
   * aes解密
   * data: 待解密数据
   * key: 密钥
   */
  aesDecrypt: function (data, key) {
    let decrypted = '';
    let decipher = crypto.createDecipher('aes192', key);
    decrypted += decipher.update(data, 'hex', 'binary');
    decrypted += decipher.final('binary');
    return decrypted;
  },

  /**
   * 根据系统ID生成app-secret
   */
  getAppSecret: function (sysId) {
    let salt = this.getRandom(8);
    return salt + this.aesEncrypt(sysId, this.md5(sysId));
  },

  // 生成UUID
  uuid: function () {
    return uuid.v4().split('-').join('');
  }

};
export default encrypt;
