/* Copyrignt (C) 2013 Qianye(hohai_wow@hotmail.com) All rights reserved. */

var util = require(util);

exports.LSA2LA = LSA2LA;
exports.LA2LSA = LA2LSA;
exports.L2LA = L2LA;
exports.L = L;
exports.LW2LP = LW2LP;

/*
 * 比声级换算声级
 * @param LSA {Number} 比声级 dB(A)
 * @param Q {Number} 流量 m3/min
 * @param P {Number} 全压 Pa
 * @retrun {Number} 声级 dB(A)
 */
function LSA2LA(LSA, Q, P){
  //AMCA301算法 Q单位m3/s
  //return LSA + Math.log(Q * P * P) * 10 / Math.LN10;
  //上海通用算法 
  //return LSA + Math.log(Q * Math.pow(P / 9.807, 2) / 60) * 10 / Math.LN10;
  
  //浙江亿利达算法 上海通用和浙江亿利达算法其实是相同的 参见 GBT 2888-2008 10.2.3
  return LSA + Math.log(Q * P * P / 60) * 10 / Math.LN10 - 19.8;
}

/*
 * 声级换算比声级
 * @param LA {Number} 声级 dB(A)
 * @param Q {Number} 流量 m3/min
 * @param P {Number} 全压 Pa
 * @retrun {Number} 比声级 dB(A)
 */
function LA2LSA(LA, Q, P){
  return LA - Math.log(Q * Math.pow(P, 2) / 60) * 10 / Math.LN10 + 19.8;
}


/* 倍频声级修正值  63 125 250 500 1000 2000 4000 8000*/
var LAi = [-26.2, -16.1, -8.6, -3.2, 0, 1.2, 1, -1.1];

/*
 * 倍频声级修正 
 * @param Li {Array} 倍频声级 dB(A)
 * @retrun {Array} 修正后倍频声级 dB(A)
 */
function L2LA(Li){
  if(!util.isArray(Li)){
    throw Error('参数类型必须为数组。');
  }
  
  if(Li.length != 8){
    throw Error('参数类型必须为数组且长度必须为8。');
  }
  
  var i, result = [];
  
  for(i = 0; i < 8; i++){
    result[i] = Li[i] + LAi[i];
  }
  
  return result;
}

/*
 * 声级叠加
 * @param Li {Array} 声级 dB(A)
 * @retrun {Number} 声级 dB(A)
 */
function L(Li){
  if(!util.isArray(Li)){
    throw Error('参数类型必须为数组。');
  }
  
  var sum = 0, i,
      length = Li.length;
  
  for(i = 0; i < length; i++){
    sum += Math.pow(10, 0.1 * Li[i]);
  }
  
  return 10 * Math.log(sum) / Math.LN10;
}

/*
 * 声功率级换算声压级 按照点声源公式计算 LP=LW-10lg(4πR^2)
 * 按自由空间计算 LP=LW-20lgR-11
 * 按半自由空间计算 LP=LW-20lgR-8 （选择半自由空间计算）
 * @param LW {Number, Array} 声功率级 dB(A)
 * @param R {Number, Array} 测试点与声源距离 m
 * @retrun {Number, Array} 声压级 dB(A)
 */
function LW2LP(LW, R){
  if(!util.isArray(LW)){
    var LP;
    if(R){
      if(util.isArray(R)){
        throw Error('参数1与参数2必须类型相同（同为数值或数组）。');
      }
      
      LP = LW - 20 * Math.log(R) / Math.LN10 - 8;
    }else{
      LP = LW - 8;
    } 
    
    return LP;
  }else{
    var LP = [], i, length = LW.length;
    if(R){
      if(!util.isArray(R)){
        throw Error('参数1与参数2必须类型相同（同为数值或数组）。');
      }
      
      if(length != R.length){
        throw Error('参数1与参数2同为数组时长度必须相等。');
      }
      
      for(i = 0; i < length; i++){
        LP[i] = LW[i] - 20 * Math.log(R) / Math.LN10 - 8;
      }
    }else{
      for(i = 0; i < length; i++){
        LP[i] = LW[i] - 8;
      }
    }
    
    return LP;
  }
}
