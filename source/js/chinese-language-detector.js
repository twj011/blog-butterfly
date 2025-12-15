(() => {
  /**
   * 中文语言检测模块
   * 用于区分简体中文和繁体中文
   */

  // 简体中文特有字符（部分示例）
  const simplifiedOnlyChars = '吗得了呢吧啊哦嗯哈唉哎哟喂啦嘛呗喽嚏嘞咗哚啲咁喺佢冇嘅冚哋係靓叻乜嘢冇嘛点解做乜嘢乜嘢喺边度唔好唔该多谢';
  
  // 繁体中文特有字符（部分示例）
  const traditionalOnlyChars = '嗎了呢吧啊哦嗯哈唉哎喲餵啦嘛唄睏嚏嘞咗哚啲咁喺佢冇嘅冚哋係靚叻乜嘢冇嘛點解做乜嘢乜嘢喺邊度唔好唔該多謝';
  
  // 常见简体词汇
  const simplifiedWords = ['我们', '什么', '时间', '可以', '应该', '因为', '所以', '但是', '然后', '现在', '已经', '还是', '或者', '这个', '那个', '电脑', '网络', '软件', '程序', '数据', '系统', '问题', '方法', '公司', '工作', '学习', '生活', '朋友', '家庭', '健康'];
  
  // 常见繁体词汇
  const traditionalWords = ['我們', '什麼', '時間', '可以', '應該', '因為', '所以', '但是', '然後', '現在', '已經', '還是', '或者', '這個', '那個', '電腦', '網絡', '軟件', '程序', '數據', '系統', '問題', '方法', '公司', '工作', '學習', '生活', '朋友', '家庭', '健康'];
  
  // 简体到繁体的字符映射（部分示例）
  const simplifiedToTraditionalMap = {
    '吗': '嗎', '呢': '呢', '了': '了', '吧': '吧', '啊': '啊', '哦': '哦', '嗯': '嗯', '哈': '哈', '唉': '唉',
    '哎': '哎', '哟': '喲', '喂': '餵', '啦': '啦', '嘛': '嘛', '呗': '唄', '们': '們', '什': '什', '么': '麼',
    '时': '時', '间': '間', '应': '應', '该': '該', '因': '因', '为': '為', '所': '所', '以': '以', '但': '但',
    '是': '是', '然': '然', '后': '後', '现': '現', '在': '在', '已': '已', '经': '經', '还': '還',
    '或': '或', '者': '者', '这': '這', '个': '個', '那': '那', '电': '電', '脑': '腦', '网': '網',
    '络': '絡', '软': '軟', '件': '件', '程': '程', '序': '序', '数': '數', '据': '據', '系': '係',
    '统': '統', '问': '問', '题': '題', '方': '方', '法': '法', '公': '公', '司': '司', '工': '工',
    '作': '作', '学': '學', '习': '習', '生': '生', '活': '活', '朋': '朋', '友': '友', '家': '家',
    '庭': '庭', '健': '健', '康': '康'
  };

  /**
   * 检测单个字符是简体还是繁体
   * @param {string} char - 单个字符
   * @returns {string} 'simplified', 'traditional', 'common' 或 'non-chinese'
   */
  function detectCharacterType(char) {
    // 检查是否为中文字符
    if (!/[\u4e00-\u9fff]/.test(char)) {
      return 'non-chinese';
    }
    
    // 检查是否为简体特有字符
    if (simplifiedOnlyChars.includes(char)) {
      return 'simplified';
    }
    
    // 检查是否为繁体特有字符
    if (traditionalOnlyChars.includes(char)) {
      return 'traditional';
    }
    
    // 检查是否在简繁转换映射中
    if (simplifiedToTraditionalMap[char]) {
      return 'simplified';
    }
    
    // 检查是否是繁体字符（通过反向映射）
    for (const [simplified, traditional] of Object.entries(simplifiedToTraditionalMap)) {
      if (traditional === char) {
        return 'traditional';
      }
    }
    
    // 通用字符
    return 'common';
  }

  /**
   * 统计文本中的字符类型
   * @param {string} text - 要检测的文本
   * @returns {Object} 包含各种字符数量的统计对象
   */
  function getCharacterStats(text) {
    const stats = {
      simplified: 0,
      traditional: 0,
      common: 0,
      nonChinese: 0,
      total: 0,
      chineseChars: []
    };
    
    for (const char of text) {
      const type = detectCharacterType(char);
      stats[type]++;
      stats.total++;
      
      if (type !== 'non-chinese') {
        stats.chineseChars.push({
          char: char,
          type: type
        });
      }
    }
    
    return stats;
  }

  /**
   * 统计文本中的词汇类型
   * @param {string} text - 要检测的文本
   * @returns {Object} 包含简繁词汇数量的统计对象
   */
  function getWordStats(text) {
    const stats = {
      simplifiedWords: 0,
      traditionalWords: 0
    };
    
    // 检测简体词汇
    for (const word of simplifiedWords) {
      const regex = new RegExp(word, 'g');
      const matches = text.match(regex);
      if (matches) {
        stats.simplifiedWords += matches.length;
      }
    }
    
    // 检测繁体词汇
    for (const word of traditionalWords) {
      const regex = new RegExp(word, 'g');
      const matches = text.match(regex);
      if (matches) {
        stats.traditionalWords += matches.length;
      }
    }
    
    return stats;
  }

  /**
   * 检测中文文本的语言类型
   * @param {string} text - 要检测的文本
   * @returns {Object} 包含检测结果和详细信息的对象
   */
  function detectChineseLanguage(text) {
    try {
      // 处理非字符串输入
      if (typeof text !== 'string') {
        return {
          language: 'error',
          confidence: 0,
          message: '输入必须是字符串类型',
          details: {
            error: 'INVALID_INPUT_TYPE',
            inputType: typeof text
          }
        };
      }
      
      // 处理空输入
      if (!text || text.trim().length === 0) {
        return {
          language: 'unknown',
          confidence: 0,
          message: '输入文本为空',
          details: {
            error: 'EMPTY_INPUT',
            simplifiedRatio: 0,
            traditionalRatio: 0,
            mixedRatio: 0
          }
        };
      }
      
      // 处理过长的文本（限制为10000字符）
      if (text.length > 10000) {
        return {
          language: 'error',
          confidence: 0,
          message: '输入文本过长，请限制在10000字符以内',
          details: {
            error: 'INPUT_TOO_LONG',
            length: text.length,
            maxLength: 10000
          }
        };
      }
    
    // 获取字符统计
    const charStats = getCharacterStats(text);
    const wordStats = getWordStats(text);
    
    // 计算中文字符比例
    const chineseCharCount = charStats.simplified + charStats.traditional + charStats.common;
    const chineseRatio = chineseCharCount / charStats.total;
    
    // 如果中文字符比例太低，认为是非中文文本
    if (chineseRatio < 0.3) {
      return {
        language: 'non-chinese',
        confidence: 0.9,
        message: '文本中中文字符比例过低',
        details: {
          simplifiedRatio: 0,
          traditionalRatio: 0,
          mixedRatio: 0,
          chineseRatio: chineseRatio
        }
      };
    }
    
    // 计算简繁体字符比例（排除通用字符）
    const specificCharCount = charStats.simplified + charStats.traditional;
    const simplifiedCharRatio = specificCharCount > 0 ? charStats.simplified / specificCharCount : 0;
    const traditionalCharRatio = specificCharCount > 0 ? charStats.traditional / specificCharCount : 0;
    
    // 计算简繁体词汇比例
    const totalWords = wordStats.simplifiedWords + wordStats.traditionalWords;
    const simplifiedWordRatio = totalWords > 0 ? wordStats.simplifiedWords / totalWords : 0;
    const traditionalWordRatio = totalWords > 0 ? wordStats.traditionalWords / totalWords : 0;
    
    // 综合计算简繁体比例（字符权重0.7，词汇权重0.3）
    const finalSimplifiedRatio = simplifiedCharRatio * 0.7 + simplifiedWordRatio * 0.3;
    const finalTraditionalRatio = traditionalCharRatio * 0.7 + traditionalWordRatio * 0.3;
    
    // 确定语言类型和置信度
    let language, confidence, message;
    
    if (finalSimplifiedRatio > 0.8 && finalTraditionalRatio < 0.2) {
      language = 'simplified';
      confidence = Math.min(0.9, finalSimplifiedRatio);
      message = '简体中文';
    } else if (finalTraditionalRatio > 0.8 && finalSimplifiedRatio < 0.2) {
      language = 'traditional';
      confidence = Math.min(0.9, finalTraditionalRatio);
      message = '繁体中文';
    } else if (finalSimplifiedRatio > 0.2 && finalTraditionalRatio > 0.2) {
      language = 'mixed';
      confidence = 0.7;
      message = '混合中文';
    } else {
      // 通用字符过多，无法确定
      language = 'unknown';
      confidence = 0.5;
      message = '无法确定（通用字符过多）';
    }
    
    return {
      language: language,
      confidence: confidence,
      message: message,
      details: {
        simplifiedRatio: finalSimplifiedRatio,
        traditionalRatio: finalTraditionalRatio,
        mixedRatio: Math.min(finalSimplifiedRatio, finalTraditionalRatio),
        chineseRatio: chineseRatio,
        charStats: charStats,
        wordStats: wordStats
      }
    };
    
    } catch (error) {
      // 捕获任何意外错误
      return {
        language: 'error',
        confidence: 0,
        message: '检测过程中发生错误',
        details: {
          error: 'DETECTION_ERROR',
          errorMessage: error.message,
          errorStack: error.stack
        }
      };
    }
  }

  /**
   * 获取文本的详细字符统计信息
   * @param {string} text - 要分析的文本
   * @returns {Object} 详细的字符统计信息
   */
  function getChineseCharacterStats(text) {
    try {
      // 处理非字符串输入
      if (typeof text !== 'string') {
        return {
          error: 'INVALID_INPUT_TYPE',
          message: '输入必须是字符串类型',
          inputType: typeof text
        };
      }
      
      // 处理空输入
      if (!text || text.trim().length === 0) {
        return {
          error: 'EMPTY_INPUT',
          message: '输入文本为空'
        };
      }
      
      // 处理过长的文本
      if (text.length > 10000) {
        return {
          error: 'INPUT_TOO_LONG',
          message: '输入文本过长，请限制在10000字符以内',
          length: text.length,
          maxLength: 10000
        };
      }
    
    const charStats = getCharacterStats(text);
    const wordStats = getWordStats(text);
    
    // 获取简体字符列表
    const simplifiedChars = [];
    const traditionalChars = [];
    
    for (const item of charStats.chineseChars) {
      if (item.type === 'simplified') {
        simplifiedChars.push(item.char);
      } else if (item.type === 'traditional') {
        traditionalChars.push(item.char);
      }
    }
    
    return {
      totalCharacters: charStats.total,
      chineseCharacters: charStats.simplified + charStats.traditional + charStats.common,
      simplifiedCharacters: charStats.simplified,
      traditionalCharacters: charStats.traditional,
      commonCharacters: charStats.common,
      nonChineseCharacters: charStats.nonChinese,
      simplifiedWords: wordStats.simplifiedWords,
      traditionalWords: wordStats.traditionalWords,
      simplifiedCharList: [...new Set(simplifiedChars)], // 去重
      traditionalCharList: [...new Set(traditionalChars)] // 去重
    };
    
    } catch (error) {
      // 捕获任何意外错误
      return {
        error: 'STATS_ERROR',
        message: '统计过程中发生错误',
        errorMessage: error.message,
        errorStack: error.stack
      };
    }
  }

  // 将函数暴露到全局作用域
  window.ChineseLanguageDetector = {
    detectChineseLanguage,
    getChineseCharacterStats,
    detectCharacterType
  };

  // 如果是模块环境，也导出模块
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      detectChineseLanguage,
      getChineseCharacterStats,
      detectCharacterType
    };
  }
})();