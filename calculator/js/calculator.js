/**
 * 业务提升潜力测算应用脚本
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化范围滑块
    initRangeSlider();
    
    // 设置默认表单显示
    showActivePart();
    
    // 加载当前计数
    loadUserCounter();
});

/**
 * 初始化范围滑块控件
 */
function initRangeSlider() {
    const slider = document.getElementById('aiAwareness');
    const valueDisplay = document.getElementById('aiAwarenessValue');
    
    if (slider && valueDisplay) {
        // 更新初始值
        updateRangeValue(slider.value);
        
        // 监听滑块变化
        slider.addEventListener('input', function() {
            updateRangeValue(this.value);
        });
    }
}

/**
 * 更新范围滑块值的显示
 * @param {string} value - 滑块值
 */
function updateRangeValue(value) {
    const valueDisplay = document.getElementById('aiAwarenessValue');
    const valueText = {
        '1': '完全不了解',
        '2': '了解较少',
        '3': '中等了解',
        '4': '了解较多',
        '5': '非常了解'
    };
    
    valueDisplay.textContent = valueText[value] || '中等了解';
}

/**
 * 显示当前活动表单部分
 */
function showActivePart() {
    const parts = document.querySelectorAll('.calculator-form');
    const reportSection = document.getElementById('report');
    
    parts.forEach(part => {
        part.style.display = 'none';
    });
    
    if (reportSection) {
        reportSection.style.display = 'none';
    }
    
    const activePart = document.querySelector('.calculator-form.active');
    if (activePart) {
        activePart.style.display = 'block';
    }
}

/**
 * 切换到下一个表单部分
 */
function nextPart() {
    const currentPart = document.querySelector('.calculator-form.active');
    if (!currentPart) return;
    
    // 简单的表单验证
    if (!validateCurrentPart(currentPart)) {
        return;
    }
    
    const currentId = currentPart.id;
    let nextId;
    
    if (currentId === 'part1') {
        nextId = 'part2';
    } else if (currentId === 'part2') {
        nextId = 'part3';
    }
    
    if (nextId) {
        currentPart.classList.remove('active');
        document.getElementById(nextId).classList.add('active');
        showActivePart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * 切换到上一个表单部分
 */
function prevPart() {
    const currentPart = document.querySelector('.calculator-form.active');
    if (!currentPart) return;
    
    const currentId = currentPart.id;
    let prevId;
    
    if (currentId === 'part2') {
        prevId = 'part1';
    } else if (currentId === 'part3') {
        prevId = 'part2';
    }
    
    if (prevId) {
        currentPart.classList.remove('active');
        document.getElementById(prevId).classList.add('active');
        showActivePart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * 验证当前表单部分
 * @param {HTMLElement} formPart - 当前表单部分
 * @returns {boolean} 验证结果
 */
function validateCurrentPart(formPart) {
    const inputs = formPart.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.type === 'radio') {
            // 对于单选按钮，检查同名的按钮组中是否有选中项
            const name = input.name;
            const radioGroup = formPart.querySelectorAll(`input[name="${name}"]`);
            let radioValid = false;
            
            radioGroup.forEach(radio => {
                if (radio.checked) {
                    radioValid = true;
                }
            });
            
            if (!radioValid) {
                isValid = false;
                // 找到包含这些单选按钮的 .form-group 并添加错误样式
                const formGroup = getParentByClassName(input, 'form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                    setTimeout(() => formGroup.classList.remove('error'), 3000);
                }
            }
        } else if (input.type === 'checkbox' && input.required) {
            if (!input.checked) {
                isValid = false;
                const formGroup = getParentByClassName(input, 'form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                    setTimeout(() => formGroup.classList.remove('error'), 3000);
                }
            }
        } else if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 3000);
        }
    });
    
    if (!isValid) {
        alert('请填写所有必填项');
    }
    
    return isValid;
}

/**
 * 获取具有特定类名的父元素
 * @param {HTMLElement} element - 子元素
 * @param {string} className - 父元素的类名
 * @returns {HTMLElement|null} 找到的父元素或null
 */
function getParentByClassName(element, className) {
    let parent = element.parentElement;
    while (parent) {
        if (parent.classList.contains(className)) {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null;
}

/**
 * 加载用户计数
 */
function loadUserCounter() {
    // 获取当前localStorage中的计数，如果没有则使用默认值
    let count = parseInt(localStorage.getItem('calculationCount')) || 2847;
    
    // 如果是通过提交表单到达报告页面，在localStorage中存储新的计数
    if (window.location.hash === '#report') {
        incrementUserCounter(count);
    }
}

/**
 * 增加用户计数
 * @param {number} currentCount - 当前计数值
 */
function incrementUserCounter(currentCount) {
    // 获取当前计数或使用传入值
    let count = currentCount || parseInt(localStorage.getItem('calculationCount')) || 2847;
    
    // 增加计数
    count += 1;
    
    // 保存到localStorage
    localStorage.setItem('calculationCount', count);
    
    return count;
}

/**
 * 提交表单并生成报告
 */
function submitForm() {
    const currentPart = document.querySelector('.calculator-form.active');
    if (!validateCurrentPart(currentPart)) {
        return;
    }
    
    // 增加用户计数
    incrementUserCounter();
    
    // 隐藏表单，显示报告部分
    document.querySelectorAll('.calculator-form').forEach(part => {
        part.style.display = 'none';
        part.classList.remove('active');
    });
    
    const reportSection = document.getElementById('report');
    reportSection.style.display = 'block';
    
    // 显示加载动画
    const loadingSpinner = document.getElementById('loadingSpinner');
    const reportBody = document.getElementById('reportBody');
    
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
    
    if (reportBody) {
        reportBody.style.display = 'none';
    }
    
    // 收集所有表单数据
    const formData = collectFormData();
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 生成报告内容
        generateReport(formData);
        
        // 隐藏加载动画，显示报告
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        if (reportBody) {
            reportBody.style.display = 'block';
        }
        
        // 滚动到报告顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
}

/**
 * 收集所有表单数据
 * @returns {Object} 表单数据对象
 */
function collectFormData() {
    try {
        // 移除公司名称收集
        const industry = document.getElementById('industry')?.value || 'other';
        const companySize = document.getElementById('companySize')?.value || 'medium';
        const annualRevenue = document.getElementById('annualRevenue')?.value || 'level2';
        
        const digitalLevel = document.querySelector('input[name="digitalLevel"]:checked')?.value || 'medium';
        
        const challengesElements = document.querySelectorAll('input[name="challenges"]:checked');
        const challenges = Array.from(challengesElements).map(checkbox => checkbox.value);
        if (challenges.length === 0) challenges.push('market_competition'); // 默认值
        
        const priorityArea = document.getElementById('priorityArea')?.value || 'management';
        const aiAwareness = document.getElementById('aiAwareness')?.value || '3';
        
        const dataUsage = document.querySelector('input[name="dataUsage"]:checked')?.value || 'medium';
        const techAcceptance = document.querySelector('input[name="techAcceptance"]:checked')?.value || 'medium';
        
        const itBudget = document.getElementById('itBudget')?.value || 'medium';
        
        const aiExpectationsElements = document.querySelectorAll('input[name="aiExpectations"]:checked');
        const aiExpectations = Array.from(aiExpectationsElements).map(checkbox => checkbox.value);
        if (aiExpectations.length === 0) aiExpectations.push('efficiency'); // 默认值
        
        const competitorsStatus = document.getElementById('competitorsStatus')?.value || 'similar';
        
    const formData = {
        company: {
                industry: industry,
                size: companySize,
                revenue: annualRevenue
        },
        assessment: {
                digitalLevel: digitalLevel,
                challenges: challenges,
                priorityArea: priorityArea,
                aiAwareness: aiAwareness,
                dataUsage: dataUsage,
                techAcceptance: techAcceptance,
                itBudget: itBudget,
                aiExpectations: aiExpectations,
                competitorsStatus: competitorsStatus
            },
            // 为了避免数据结构问题，添加扁平化的字段
            industry: industry,
            priorityArea: priorityArea,
            challenges: challenges
        };
        
        console.log('收集的表单数据:', formData);
    return formData;
    } catch (error) {
        console.error('收集表单数据时出错:', error);
        // 返回默认数据，确保页面不会崩溃
        return {
            company: {
                industry: 'manufacturing',
                size: 'medium',
                revenue: 'level2'
            },
            assessment: {
                digitalLevel: 'medium',
                challenges: ['market_competition', 'labor_cost'],
                priorityArea: 'management',
                aiAwareness: '3',
                dataUsage: 'medium',
                techAcceptance: 'medium',
                itBudget: 'medium',
                aiExpectations: ['efficiency', 'decision'],
                competitorsStatus: 'similar'
            },
            industry: 'manufacturing',
            priorityArea: 'management',
            challenges: ['market_competition', 'labor_cost']
        };
    }
}

/**
 * 生成报告
 * @param {Object} formData - 收集的表单数据
 */
function generateReport(formData) {
    // 计算潜力评分
    const potentialScore = calculatePotentialScore(formData);
    
    // 获取推荐方案
    const recommendations = getRecommendations(formData);
    
    // 获取实施细节
    const implementationDetails = getImplementationDetails(formData, potentialScore);
    
    // 获取当前用户计数
    const userCount = parseInt(localStorage.getItem('calculationCount')) || 2847;
    
    // 构建报告HTML
    const reportBody = document.getElementById('reportBody');
    
    // 创建报告内容
    const reportHTML = `
        <div class="report-container">
            <div class="report-section-header">
                <h3>业务提升潜力综合评分</h3>
                <p>基于您提供的信息，算法分析的业务提升空间</p>
                </div>
            
            <div class="score-container">
                <div class="score-circle" style="background: conic-gradient(${getScoreColor(potentialScore)} ${potentialScore}%, rgba(0, 173, 181, 0.1) 0)">
                    <div class="score-inner">
                        <span class="score-value">${potentialScore}%</span>
                        <span class="score-label">提升潜力</span>
                    </div>
                </div>
                <div class="score-description">
                    <h4>评估结果</h4>
                    <p>${getScoreDescription(potentialScore)}</p>
                </div>
            </div>
            
            <div class="report-section-header">
                <h3>行业特性分析</h3>
                <p>基于${getIndustryName(formData.industry)}行业AI应用现状的评估</p>
            </div>
            
            <div class="industry-analysis">
                <div class="analysis-item">
                    <h4>行业现状</h4>
                    <p>您所在的${getIndustryName(formData.industry)}行业目前${formData.competitorsStatus === 'leading' || formData.competitorsStatus === 'ahead' ? '已有较多企业开展数字化转型' : '数字化转型整体尚处于早期阶段'}，${formData.competitorsStatus === 'leading' ? '领先企业已经通过AI技术获得了显著竞争优势' : formData.competitorsStatus === 'ahead' ? '部分头部企业已开始利用AI提升业务效率' : '大多数企业仍在探索数字化基础建设'}。</p>
                </div>
                <div class="analysis-item">
                    <h4>机遇与挑战</h4>
                    <p>${formData.competitorsStatus === 'behind' ? '作为行业早期采用者，您有机会通过AI技术建立先发优势，但需要更多的探索和试错。' : formData.competitorsStatus === 'similar' ? '行业处于数字化转型关键期，及时部署AI解决方案可以帮助您建立竞争优势。' : '行业竞争激烈，需要更精准和创新的AI应用才能脱颖而出。'}</p>
            </div>
        </div>
        
            <div class="report-section-header">
                <h3>推荐优化方案</h3>
                <p>针对${getPriorityAreaName(formData.priorityArea)}领域的具体优化建议</p>
            </div>
            
            <div class="recommendations">
                ${recommendations.map(rec => `
                    <div class="recommendation-card">
                        <div class="recommendation-icon">
                            <i class="${rec.icon}"></i>
                        </div>
                        <div class="recommendation-content">
                            <h4>${rec.title}</h4>
                            <p>${rec.description}</p>
                            <div class="recommendation-metrics">
                                <div class="metric">
                                    <span class="metric-value">${rec.benefitValue}</span>
                                    <span class="metric-label">${rec.benefitLabel}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-value">${rec.timeValue}</span>
                                    <span class="metric-label">${rec.timeLabel}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-value">${rec.costValue}</span>
                                    <span class="metric-label">${rec.costLabel}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="report-section-header">
                <h3>实施路径规划</h3>
                <p>从技术选型、流程优化到人员培训的全面实施计划</p>
        </div>
        
            <div class="implementation-steps">
                ${implementationDetails.map((step, index) => `
                    <div class="implementation-step">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p>${step.description}</p>
                            <div class="timeline">
                                <span class="timeline-label">建议周期：${step.timeline}</span>
                </div>
                </div>
                </div>
                `).join('')}
        </div>
        
            <div class="action-cta">
                <h3>开启您的ZIK Lab之旅</h3>
                <p>根据本报告规划您的数字化升级路径</p>
                <a href="../index.html" class="btn-action">返回主页获取更多信息</a>
                <div class="contact-info">
                    <i class="fas fa-phone-alt"></i>
                    <span>立即预约免费咨询 → +86 132-6472-0888 / +86 150-3531-0160</span>
                </div>
                <div class="user-stats">
                    <i class="fas fa-users"></i>
                    <span>已有<strong>${userCount.toLocaleString('zh-CN')}</strong>家企业完成测算</span>
                </div>
                <div class="disclaimer-note">
                    <i class="fas fa-info-circle"></i>
                    <span>本评估结果基于算法分析，仅供参考，实际业务提升效果可能因企业具体情况而异。</span>
                </div>
            </div>
        </div>
    `;
    
    // 显示报告
    reportBody.innerHTML = reportHTML;
    reportBody.style.display = 'block';
    
    // 隐藏加载动画
    document.getElementById('loadingSpinner').style.display = 'none';
    
    // 显示报告部分
    document.querySelectorAll('.calculator-form').forEach(form => {
        form.style.display = 'none';
    });
    document.querySelector('.calculator-form.active').classList.remove('active');
    
    document.getElementById('report').style.display = 'block';
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 设置URL哈希以便刷新页面时识别报告状态
    window.location.hash = 'report';
}

/**
 * 计算业务提升潜力得分
 * @param {Object} formData - 表单数据
 * @returns {number} 得分(0-100)
 */
function calculatePotentialScore(formData) {
    // 使用改进的加权评分系统
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // 定义评分维度和权重 - 进一步降低基础系数，增加分数区分度
    const dimensions = {
        digitalLevel: {
            weight: 0.22,
            score: function(value) {
                // 进一步降低基础分数
                if (value === 'low') return 0.72;      // 低数字化提升空间最大，但也有技术挑战
                if (value === 'medium') return 0.60;   // 降低中等水平分数
                if (value === 'high') return 0.45;     // 数字化水平高，AI提升空间相对较小
                return 0.60;
            }
        },
        challenges: {
            weight: 0.18,
            score: function(values) {
                // 降低挑战类型权重，增加区分度
                const challengeWeights = {
                    'labor_cost': 0.70,
                    'data_quality': 0.75,
                    'market_competition': 0.60,
                    'system_limitation': 0.72,
                    'roi_uncertain': 0.55
                };
                
                if (!values || values.length === 0) return 0.50; // 降低默认值
                
                let challengeScore = 0;
                // 降低组合效应影响
                let combinedEffect = 1.0;
                
                // 适度降低组合效应权重
                if (values.includes('data_quality') && values.includes('system_limitation')) {
                    combinedEffect = 1.05;
                }
                
                if (values.includes('labor_cost') && values.includes('market_competition')) {
                    combinedEffect = 1.06;
                }
                
                for (const challenge of values) {
                    challengeScore += challengeWeights[challenge] || 0.60;
                }
                
                // 降低挑战数量影响的基础系数
                const countEffect = Math.min(values.length, 3) / 3 * 0.12 + 0.65;
                
                return Math.min((challengeScore / Math.max(values.length, 2)) * combinedEffect * countEffect, 0.90);
            }
        },
        industry: {
            weight: 0.12,
            score: function(value) {
                // 降低行业评分，增加行业间差异
                const industryScores = {
                    'manufacturing': 0.70,
                    'retail': 0.65,
                    'service': 0.58,
                    'logistics': 0.72,
                    'healthcare': 0.75,
                    'finance': 0.70,
                    'education': 0.60,
                    'other': 0.55
                };
                return industryScores[value] || 0.60;
            }
        },
        companySize: {
            weight: 0.08,
            score: function(value) {
                // 更科学地调整企业规模影响
                if (value === 'medium') return 0.75; // 中型企业最适合智能技术转型
                if (value === 'large') return 0.65; // 大型企业转型复杂度高
                if (value === 'small') return 0.60; // 小型企业资源有限
                return 0.65;
            }
        },
        dataUsage: {
            weight: 0.16,
            score: function(value) {
                // 降低数据应用各等级基础分
                if (value === 'low') return 0.68;   // 数据应用低，虽有提升空间但基础差
                if (value === 'medium') return 0.60;
                if (value === 'high') return 0.48;  // 已有良好数据应用，提升空间有限
                return 0.58;
            }
        },
        techAcceptance: {
            weight: 0.14,
            score: function(value) {
                // 技术接受度直接影响转型成功率
                if (value === 'high') return 0.75;  // 高接受度是成功关键
                if (value === 'medium') return 0.60;
                if (value === 'low') return 0.42;   // 低接受度是严重障碍
                return 0.60;
            }
        },
        itBudget: {
            weight: 0.15,
            score: function(value) {
                // 预算是转型的现实约束
                const budgetScores = {
                    'verylow': 0.35,  // 极低预算很难支持转型
                    'low': 0.48,
                    'medium': 0.60,
                    'high': 0.70,
                    'veryhigh': 0.78
                };
                return budgetScores[value] || 0.55;
            }
        },
        aiExpectations: {
            weight: 0.08,
            score: function(values) {
                if (!values || values.length === 0) return 0.50; // 降低默认值
                
                // 期望类型影响评分
                const expectationWeights = {
                    'efficiency': 0.65,
                    'decision': 0.70,
                    'innovation': 0.75,
                    'cost': 0.62,
                    'quality': 0.68
                };
                
                let expectationScore = 0;
                for (const exp of values) {
                    expectationScore += expectationWeights[exp] || 0.60;
                }
                
                // 降低基础系数
                return 0.45 + Math.min(expectationScore / 5, 1) * 0.3;
            }
        },
        competitorsStatus: {
            weight: 0.15,
            score: function(value) {
                // 竞争压力是转型驱动力
                if (value === 'behind') return 0.55;  // 领先竞争对手，动力较弱
                if (value === 'similar') return 0.65; // 需要保持同步，适中动力
                if (value === 'ahead') return 0.75;   // 急需赶上，较强动力
                if (value === 'leading') return 0.80; // 极度紧迫，强动力
                return 0.65;
            }
        },
        aiAwareness: {
            weight: 0.08,
            score: function(value) {
                // AI认知水平影响实施效果
                const awareness = parseInt(value) || 3;
                return 0.40 + (awareness / 5) * 0.35; // 1-5分映射到0.40-0.75
            }
        },
        revenue: {
            weight: 0.06,
            score: function(value) {
                // 营收规模影响投资能力
                const revenueScores = {
                    'level1': 0.55, // 1000万以下
                    'level2': 0.60, // 1000-5000万
                    'level3': 0.65, // 5000万-1亿
                    'level4': 0.70, // 1-10亿
                    'level5': 0.68  // 10亿以上，规模大但转型复杂
                };
                return revenueScores[value] || 0.60;
            }
        }
    };
    
    // 计算每个维度的得分与总分 - 降低维度交叉影响
    // 创建交叉影响矩阵 - 降低组合效应
    const combinationEffects = [
        {
            factors: ['digitalLevel', 'dataUsage'],
            condition: (values) => values.digitalLevel === 'low' && values.dataUsage === 'low',
            effect: 1.04 // 降低组合效应
        },
        {
            factors: ['techAcceptance', 'itBudget'],
            condition: (values) => values.techAcceptance === 'high' && (values.itBudget === 'high' || values.itBudget === 'veryhigh'),
            effect: 1.05 // 降低组合效应
        },
        {
            factors: ['companySize', 'challenges'],
            condition: (values) => values.companySize === 'medium' && values.challenges.includes('labor_cost'),
            effect: 1.03 // 降低组合效应
        },
        {
            factors: ['industry', 'dataUsage'],
            condition: (values) => (values.industry === 'manufacturing' || values.industry === 'logistics') && values.dataUsage === 'medium',
            effect: 1.03 // 降低组合效应
        }
    ];
    
    // 添加负面组合效应 - 某些因素组合会产生负面影响
    const negativeCombinationEffects = [
        {
            factors: ['techAcceptance', 'itBudget'],
            condition: (values) => values.techAcceptance === 'low' && (values.itBudget === 'verylow' || values.itBudget === 'low'),
            effect: 0.90 // 技术接受度低且预算低，转型难度大增
        },
        {
            factors: ['digitalLevel', 'dataUsage'],
            condition: (values) => values.digitalLevel === 'low' && values.dataUsage === 'low' && values.techAcceptance === 'low',
            effect: 0.85 // 数字化水平低、数据应用低、技术接受度低，三重障碍
        },
        {
            factors: ['companySize', 'itBudget'],
            condition: (values) => values.companySize === 'small' && values.itBudget === 'verylow',
            effect: 0.92 // 小企业低预算，资源严重不足
        }
    ];
    
    // 创建评分数据对象
    const factorValues = {
        digitalLevel: formData.assessment.digitalLevel,
        dataUsage: formData.assessment.dataUsage,
        techAcceptance: formData.assessment.techAcceptance,
        itBudget: formData.assessment.itBudget,
        aiAwareness: formData.assessment.aiAwareness,
        challenges: formData.assessment.challenges,
        companySize: formData.company.size,
        industry: formData.company.industry,
        revenue: formData.company.revenue,
        aiExpectations: formData.assessment.aiExpectations,
        competitorsStatus: formData.assessment.competitorsStatus
    };
    
    // 基础得分计算
    for (const [key, dimension] of Object.entries(dimensions)) {
        // 处理不同数据结构访问路径
        const value = factorValues[key];
        if (value === undefined) continue; // 跳过缺失值
        
        const dimensionScore = dimension.score(value) * dimension.weight * 100;
        totalScore += dimensionScore;
        maxPossibleScore += dimension.weight * 100;
    }
    
    // 应用正面组合效应，限制一个效应
    let appliedEffects = 0;
    for (const effect of combinationEffects) {
        if (effect.condition(factorValues) && appliedEffects < 1) {
            totalScore = totalScore * effect.effect;
            appliedEffects++;
            // 记录加成效果
            console.log(`应用正面组合效应: ${effect.factors.join('+')} 乘以 ${effect.effect}`);
        }
    }
    
    // 应用负面组合效应，负面效应可以叠加，最多两个
    let appliedNegativeEffects = 0;
    for (const effect of negativeCombinationEffects) {
        if (effect.condition(factorValues) && appliedNegativeEffects < 2) {
            totalScore = totalScore * effect.effect;
            appliedNegativeEffects++;
            // 记录负面效果
            console.log(`应用负面组合效应: ${effect.factors.join('+')} 乘以 ${effect.effect}`);
        }
    }
    
    // 设置分数下限，但不要过高
    totalScore = Math.max(totalScore, 20); // 降低最低保底分为20分
    
    // 小幅随机波动，增加区分度
    const randomFactor = 1 + ((Math.random() * 5) - 2.5) / 100; // ±2.5%的随机波动
    totalScore = totalScore * randomFactor;
    
    // 完全重构S曲线，使分数分布更均匀，避免集中在高分区
    // 使用更平缓的S曲线转换，让中低分更常见
    const normalizedScore = totalScore / 100;
    
    // 新的S曲线参数，使得分布更合理
    // 使用更平缓的斜率和中点位于0.6，这样大部分分数会在中低区间
    const curvedScore = 1 / (1 + Math.exp(-8 * (normalizedScore - 0.6))) * 100;
    
    // 确保分数有合理分布，同时降低最高分
    let finalScore = Math.min(Math.max(Math.round(curvedScore), 20), 90); 
    
    // 特殊情况处理：极端低值组合
    if (factorValues.digitalLevel === 'low' && 
        factorValues.dataUsage === 'low' && 
        factorValues.techAcceptance === 'low' && 
        (factorValues.itBudget === 'verylow' || factorValues.itBudget === 'low')) {
        // 几乎所有关键指标都很差，强制降低分数
        finalScore = Math.min(finalScore, 30);
    }
    
    // 特殊情况处理：极端高值组合
    if (factorValues.techAcceptance === 'high' && 
        factorValues.dataUsage === 'high' && 
        (factorValues.itBudget === 'high' || factorValues.itBudget === 'veryhigh') &&
        factorValues.competitorsStatus === 'ahead') {
        // 几乎所有关键指标都很好，但最高分仍有上限
        finalScore = Math.min(Math.max(finalScore, 75), 90);
    }
    
    // 调试信息
    console.log('原始潜力得分:', totalScore.toFixed(2));
    console.log('S曲线调整后得分:', curvedScore.toFixed(2));
    console.log('最终潜力得分:', finalScore);
    
    return finalScore;
}

/**
 * 获取推荐方案
 * @param {Object} formData - 表单数据
 * @returns {Array} 推荐方案数组
 */
function getRecommendations(formData) {
    const industry = formData.company?.industry || formData.industry;
    const priorityArea = formData.assessment?.priorityArea || formData.priorityArea;
    const challenges = formData.assessment?.challenges || formData.challenges || [];
    
    const recommendations = [];
    
    // 根据行业和优先领域推荐方案
    if (industry === 'manufacturing') {
        if (priorityArea === 'production') {
            recommendations.push({
                title: '智能生产排程系统',
                description: '基于AI的生产排程系统，可优化生产计划，减少停机时间，提高设备利用率。',
                icon: 'fas fa-industry',
                benefitValue: '25-35%',
                benefitLabel: '效率提升',
                timeValue: '3-5月',
                timeLabel: '实施周期',
                costValue: '中等',
                costLabel: '投入成本'
            });
        } else if (priorityArea === 'sales') {
            recommendations.push({
                title: '销售预测分析平台',
                description: '结合历史销售数据与市场趋势，精准预测未来需求，帮助优化库存管理和生产计划。',
                icon: 'fas fa-chart-line',
                benefitValue: '15-20%',
                benefitLabel: '销售提升',
                timeValue: '2-4月',
                timeLabel: '实施周期',
                costValue: '中低',
                costLabel: '投入成本'
            });
        }
    } else if (industry === 'retail') {
        if (priorityArea === 'sales') {
            recommendations.push({
                title: '个性化推荐引擎',
                description: '基于客户行为分析的精准推荐系统，提升用户体验和转化率。',
                icon: 'fas fa-tag',
                benefitValue: '20-30%',
                benefitLabel: '转化提升',
                timeValue: '2-3月',
                timeLabel: '实施周期',
                costValue: '中等',
                costLabel: '投入成本'
            });
        } else if (priorityArea === 'supplychain') {
            recommendations.push({
                title: '智能库存管理系统',
                description: '预测性补货系统，减少库存占用成本，同时避免缺货现象。',
                icon: 'fas fa-boxes',
                benefitValue: '15-25%',
                benefitLabel: '库存优化',
                timeValue: '3-4月',
                timeLabel: '实施周期',
                costValue: '中等',
                costLabel: '投入成本'
            });
        }
    }
    
    // 根据挑战添加通用解决方案
    if (challenges.includes('labor_cost')) {
        recommendations.push({
            title: '流程自动化方案',
            description: '通过RPA和AI技术自动化重复性工作流程，大幅降低人力成本，提高效率。',
            icon: 'fas fa-robot',
            benefitValue: '30-50%',
            benefitLabel: '人力节约',
            timeValue: '2-4月',
            timeLabel: '实施周期',
            costValue: '中高',
            costLabel: '投入成本'
        });
    }
    
    if (challenges.includes('data_quality')) {
        recommendations.push({
            title: '数据治理与分析平台',
            description: '建立统一数据标准和智能分析系统，将分散数据转化为决策支持工具。',
            icon: 'fas fa-database',
            benefitValue: '全局性',
            benefitLabel: '业务提升',
            timeValue: '4-6月',
            timeLabel: '实施周期',
            costValue: '较高',
            costLabel: '投入成本'
        });
    }
    
    // 确保至少有3个推荐方案
    const defaultRecommendations = [
        {
            title: '智能客户服务系统',
            description: '结合NLP技术的智能客服系统，提升响应速度和服务质量，同时降低运营成本。',
            icon: 'fas fa-headset',
            benefitValue: '40-60%',
            benefitLabel: '响应提升',
            timeValue: '2-3月',
            timeLabel: '实施周期',
            costValue: '中等',
            costLabel: '投入成本'
        },
        {
            title: '预测性维护系统',
            description: '基于设备数据分析的预测性维护系统，避免意外停机，延长设备寿命。',
            icon: 'fas fa-tools',
            benefitValue: '20-30%',
            benefitLabel: '停机减少',
            timeValue: '3-5月',
            timeLabel: '实施周期',
            costValue: '中高',
            costLabel: '投入成本'
        },
        {
            title: '业务智能仪表盘',
            description: '实时业务数据可视化平台，帮助管理者快速掌握关键指标，做出数据驱动的决策。',
            icon: 'fas fa-chart-pie',
            benefitValue: '15-25%',
            benefitLabel: '决策优化',
            timeValue: '1-2月',
            timeLabel: '实施周期',
            costValue: '较低',
            costLabel: '投入成本'
        }
    ];
    
    while (recommendations.length < 3) {
        const defaultRec = defaultRecommendations.shift();
        if (defaultRec) {
            recommendations.push(defaultRec);
        } else {
            break;
        }
    }
    
    return recommendations;
}

/**
 * 获取实施细节
 * @param {Object} formData - 表单数据
 * @param {number} potentialScore - 潜力得分
 * @returns {Array} 实施步骤数组
 */
function getImplementationDetails(formData, potentialScore) {
    // 根据业务优先领域和潜力得分生成实施步骤
    const priorityArea = formData.assessment.priorityArea || formData.priorityArea;
    const steps = [];
    
    // 根据分数调整第一步
    if (potentialScore >= 65) {
        // 高分段 - 直接开始业务评估
        steps.push({
            title: '业务评估与规划',
            description: '全面评估当前业务流程，识别AI应用机会点，制定详细实施计划。',
            timeline: '2-4周'
        });
    } else if (potentialScore >= 45) {
        // 中分段 - 需要先进行数字化准备
        steps.push({
            title: '数字化基础评估',
            description: '评估企业数字化基础水平，找出薄弱环节，制定数字化升级计划。',
            timeline: '3-5周'
        });
    } else {
        // 低分段 - 需要基础培训和意识提升
        steps.push({
            title: 'AI认知与基础建设',
            description: '开展AI基础培训，提高团队认知度，同时评估和规划基础数字化建设需求。',
            timeline: '4-6周'
        });
    }
    
    // 第二步根据得分不同调整
    if (potentialScore >= 65) {
        steps.push({
            title: '数据准备与治理',
            description: '整合并清洗相关业务数据，建立数据标准，为AI应用奠定基础。',
            timeline: '3-6周'
        });
    } else if (potentialScore >= 45) {
        steps.push({
            title: '数据收集与管理体系建设',
            description: '建立关键业务数据的采集机制，搭建基础数据管理平台，提升数据质量。',
            timeline: '6-8周'
        });
    } else {
        steps.push({
            title: '数字化流程改造',
            description: '改造关键业务流程，实现数据的数字化采集，建立基础数据库。',
            timeline: '8-12周'
        });
    }
    
    // 根据优先领域和得分添加特定步骤
    if (potentialScore >= 65) {
        // 高分段可以直接实施行业解决方案
        if (priorityArea === 'production') {
            steps.push({
                title: '生产流程智能化改造',
                description: '部署预测性生产排程系统，建立设备智能监控平台，优化生产资源配置。',
                timeline: '6-8周'
            });
        } else if (priorityArea === 'sales') {
            steps.push({
                title: '营销与销售智能系统构建',
                description: '实施客户行为分析系统，建立需求预测模型，开发个性化推荐引擎。',
                timeline: '5-7周'
            });
        } else if (priorityArea === 'service') {
            steps.push({
                title: '智能客户服务平台搭建',
                description: '部署智能客服系统，建立客户画像分析，提升服务效率与满意度。',
                timeline: '4-6周'
            });
        } else if (priorityArea === 'management') {
            steps.push({
                title: '管理决策支持系统构建',
                description: '开发业务智能分析平台，构建预警机制，优化资源调配与绩效管理。',
                timeline: '5-8周'
            });
        } else if (priorityArea === 'supplychain') {
            steps.push({
                title: '供应链优化系统实施',
                description: '建立智能库存管理，优化物流配送路径，提升供应链透明度与响应速度。',
                timeline: '6-9周'
            });
        } else {
            steps.push({
                title: '核心业务流程智能化',
                description: '针对关键业务环节进行智能化改造，提升效率并降低成本。',
                timeline: '5-8周'
            });
        }
    } else {
        // 中低分段需要先进行小规模尝试
        steps.push({
            title: '小规模AI应用试点',
            description: '选择一个低风险、高回报的业务场景，进行AI应用小规模试点，验证效果。',
            timeline: '8-10周'
        });
    }
    
    // 第四步：根据分数调整培训与调整阶段
    if (potentialScore >= 65) {
        steps.push({
            title: '人员培训与系统调优',
            description: '对相关人员进行系统操作培训，根据实际使用情况对系统进行持续优化。',
            timeline: '3-4周'
        });
    } else {
        steps.push({
            title: '能力建设与技术培训',
            description: '加强团队技术能力建设，培养内部数据分析和AI应用人才，为后续扩展做准备。',
            timeline: '6-8周'
        });
    }
    
    // 第五步：根据得分调整扩展计划
    if (potentialScore >= 75) {
        steps.push({
            title: '全面推广与持续迭代',
            description: '将成功经验推广到更多业务场景，建立长效迭代机制，持续提升系统价值。',
            timeline: '持续进行'
        });
    } else if (potentialScore >= 55) {
        steps.push({
            title: '效果评估与阶段性扩展',
            description: '评估试点效果，总结经验教训，分阶段扩展到其他业务领域。',
            timeline: '6-8周后启动'
        });
    } else {
        steps.push({
            title: '效果评估与数字化深化',
            description: '评估初期实施效果，完善数字化基础，为未来可能的智能技术转型做铺垫。',
            timeline: '12周后评估'
        });
    }
    
    return steps;
}

/**
 * 获取潜力得分对应的颜色
 * @param {number} score - 潜力得分
 * @returns {string} 颜色值
 */
function getScoreColor(score) {
    if (score >= 80) {
        return '#00b894'; // 明亮的绿色-蓝色
    } else if (score >= 70) {
        return '#00cec9'; // 青绿色
    } else if (score >= 60) {
        return '#0984e3'; // 鲜艳的蓝色
    } else if (score >= 50) {
        return '#6c5ce7'; // 紫蓝色
    } else if (score >= 40) {
        return '#a29bfe'; // 淡紫色
    } else if (score >= 30) {
        return '#fdcb6e'; // 黄色
    } else if (score >= 20) {
        return '#e17055'; // 珊瑚色
    } else {
        return '#d63031'; // 红色
    }
}

/**
 * 获取潜力得分对应的描述
 * @param {number} score - 潜力得分
 * @returns {string} 描述文本
 */
function getScoreDescription(score) {
    if (score >= 80) {
        return '您的企业在智能技术转型方面具有较高潜力，关键指标表现良好。不过实施过程中仍需注意技术和人员的协调配合，并针对具体业务场景进行定制化设计，避免技术与业务需求脱节。';
    } else if (score >= 70 && score < 80) {
        return '您的企业具有中上水平的智能技术转型潜力，部分条件已经成熟。建议从单一业务场景入手，打造成功案例后再逐步扩展。同时需加强数据治理能力，为后续应用奠定基础。';
    } else if (score >= 60 && score < 70) {
        return '您的企业具有一定的智能技术转型潜力，但同时面临一些挑战。建议选择痛点明确、ROI较高的小规模项目开始，并在实施前深入评估技术条件和组织准备度，以降低风险。';
    } else if (score >= 50 && score < 60) {
        return '您的企业智能技术转型准备度处于中等水平，部分基础条件有待完善。建议首先加强数据收集和处理能力，提升团队数字化意识，选择成熟度较高的标准化解决方案尝试。';
    } else if (score >= 40 && score < 50) {
        return '您的企业在智能技术转型方面面临较多挑战，数字化基础或组织准备度不足。建议先聚焦于基础数字化建设，改进业务流程，培养数据驱动的决策文化，暂缓复杂AI项目。';
    } else if (score >= 30 && score < 40) {
        return '您的企业目前智能技术转型条件尚不成熟，存在多项关键障碍。建议专注于解决数字化转型中的基础问题，如系统整合、数据采集等，并可考虑邀请外部专家进行诊断和指导。';
    } else if (score >= 20 && score < 30) {
        return '您的企业在智能技术转型方面存在明显的基础性障碍，建议现阶段以数字化转型为主要目标，完善IT基础设施，标准化业务流程，为未来可能的AI应用创造条件。';
    } else {
        return '您的企业当前尚未具备智能技术转型的基本条件，面临严峻挑战。建议先解决组织中的根本性数字化问题，投入资源提升基础设施和技术接受度，循序渐进地推进数字化建设。';
    }
}

/**
 * 获取行业中文名称
 * @param {string} industry - 行业代码
 * @returns {string} 行业中文名称
 */
function getIndustryName(industry) {
    const industryNames = {
        'manufacturing': '制造业',
        'retail': '零售电商',
        'service': '服务业',
        'logistics': '物流供应链',
        'healthcare': '医疗健康',
        'other': '其他行业'
    };
    
    return industryNames[industry] || '其他行业';
}

/**
 * 获取优先领域中文名称
 * @param {string} area - 优先领域代码
 * @returns {string} 优先领域中文名称
 */
function getPriorityAreaName(area) {
    const areaNames = {
        'production': '生产制造',
        'sales': '销售营销',
        'service': '客户服务',
        'management': '内部管理',
        'supplychain': '供应链优化'
    };
    
    return areaNames[area] || '其他领域';
} 