/**
 * 业务提升潜力测算应用脚本
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化范围滑块
    initRangeSlider();
    
    // 设置默认表单显示
    showActivePart();
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
 * 提交表单并生成报告
 */
function submitForm() {
    const currentPart = document.querySelector('.calculator-form.active');
    if (!validateCurrentPart(currentPart)) {
        return;
    }
    
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
                <h3>开启您的AI转型之旅</h3>
                <p>根据本报告规划您的数字化升级路径</p>
                <a href="../index.html" class="btn-action">返回主页获取更多信息</a>
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
    
    // 定义评分维度和权重 - 优化权重分配和评分函数，整体提升基础分数
    const dimensions = {
        digitalLevel: {
            weight: 0.22,
            score: function(value) {
                // 提高基础分数，尤其是低数字化水平的企业
                if (value === 'low') return 1.00;      // 低数字化提升空间最大
                if (value === 'medium') return 0.88;   // 提高中等水平分数
                if (value === 'high') return 0.70;     // 提高高水平基础分
                return 0.88;
            }
        },
        challenges: {
            weight: 0.18,
            score: function(values) {
                // 更细致的挑战类型权重，整体提高基础分
                const challengeWeights = {
                    'labor_cost': 0.92,
                    'data_quality': 0.98,
                    'market_competition': 0.85,
                    'system_limitation': 0.95,
                    'roi_uncertain': 0.78
                };
                
                if (!values || values.length === 0) return 0.75; // 提高默认值
                
                let challengeScore = 0;
                // 考虑挑战类型的组合效应
                let combinedEffect = 1.0;
                
                // 如果同时存在数据质量和系统限制问题，增加额外权重
                if (values.includes('data_quality') && values.includes('system_limitation')) {
                    combinedEffect = 1.15;
                }
                
                // 如果同时存在人力成本和市场竞争问题，增加额外权重
                if (values.includes('labor_cost') && values.includes('market_competition')) {
                    combinedEffect = 1.18;
                }
                
                for (const challenge of values) {
                    challengeScore += challengeWeights[challenge] || 0.85;
                }
                
                // 考虑挑战数量的非线性影响，提高基础系数
                const countEffect = Math.min(values.length, 3) / 3 * 0.2 + 0.90;
                
                return Math.min((challengeScore / Math.max(values.length, 2)) * combinedEffect * countEffect, 1.0);
            }
        },
        industry: {
            weight: 0.12,
            score: function(value) {
                // 增加行业间评分差异，但提高整体基础分
                const industryScores = {
                    'manufacturing': 0.95,
                    'retail': 0.92,
                    'service': 0.85,
                    'logistics': 0.98,
                    'healthcare': 1.00,
                    'finance': 0.97,
                    'education': 0.88,
                    'other': 0.85
                };
                return industryScores[value] || 0.85;
            }
        },
        companySize: {
            weight: 0.08,
            score: function(value) {
                // 提高各规模企业基础分
                if (value === 'medium') return 0.98; 
                if (value === 'large') return 0.95; 
                if (value === 'small') return 0.90; 
                return 0.95;
            }
        },
        dataUsage: {
            weight: 0.16,
            score: function(value) {
                // 提高数据应用各等级基础分
                if (value === 'low') return 0.95;   // 数据应用低，提升空间大
                if (value === 'medium') return 0.85;
                if (value === 'high') return 0.75;  // 已有良好数据应用，仍有提升空间
                return 0.85;
            }
        },
        techAcceptance: {
            weight: 0.14,
            score: function(value) {
                // 提高技术接受度各级别基础分
                if (value === 'high') return 0.99;  // 高接受度，几乎满分
                if (value === 'medium') return 0.85;
                if (value === 'low') return 0.70;   // 提高低接受度基础分
                return 0.85;
            }
        },
        itBudget: {
            weight: 0.15,
            score: function(value) {
                // 提高各预算等级基础分
                const budgetScores = {
                    'verylow': 0.65,  // 提高极低预算基础分
                    'low': 0.75,
                    'medium': 0.85,
                    'high': 0.95,
                    'veryhigh': 1.00
                };
                return budgetScores[value] || 0.80;
            }
        },
        aiExpectations: {
            weight: 0.08,
            score: function(values) {
                if (!values || values.length === 0) return 0.75; // 提高默认值
                
                // 期望种类影响分数，全面提高基础分
                const expectationWeights = {
                    'efficiency': 0.90,
                    'decision': 0.95,
                    'innovation': 0.98,
                    'cost': 0.88,
                    'quality': 0.92
                };
                
                let expectationScore = 0;
                for (const exp of values) {
                    expectationScore += expectationWeights[exp] || 0.85;
                }
                
                // 提高基础系数
                return 0.7 + Math.min(expectationScore / 5, 1) * 0.3;
            }
        },
        competitorsStatus: {
            weight: 0.15,
            score: function(value) {
                // 提高竞争压力各等级基础分
                if (value === 'behind') return 0.85;  // 领先竞争对手，仍有动力
                if (value === 'similar') return 0.90; // 需要保持同步
                if (value === 'ahead') return 0.95;   // 急需赶上
                if (value === 'leading') return 1.00; // 极度紧迫
                return 0.90;
            }
        },
        aiAwareness: {
            weight: 0.08,
            score: function(value) {
                // 提高AI认知水平基础系数
                const awareness = parseInt(value) || 3;
                return 0.7 + (awareness / 5) * 0.3; // 1-5分映射到0.7-1.0
            }
        },
        revenue: {
            weight: 0.06,
            score: function(value) {
                // 提高各营收规模基础分
                const revenueScores = {
                    'level1': 0.85, // 1000万以下
                    'level2': 0.88, // 1000-5000万
                    'level3': 0.92, // 5000万-1亿
                    'level4': 0.98, // 1-10亿
                    'level5': 0.95  // 10亿以上
                };
                return revenueScores[value] || 0.90;
            }
        }
    };
    
    // 计算每个维度的得分与总分 - 添加维度交叉影响
    // 创建交叉影响矩阵 - 某些因素组合会产生额外效果，增加更多有利组合
    const combinationEffects = [
        {
            factors: ['digitalLevel', 'dataUsage'],
            condition: (values) => values.digitalLevel === 'low' && values.dataUsage === 'low',
            effect: 1.15 // 数字化低+数据利用低，AI提升空间最大
        },
        {
            factors: ['techAcceptance', 'itBudget'],
            condition: (values) => values.techAcceptance === 'high' && (values.itBudget === 'high' || values.itBudget === 'veryhigh'),
            effect: 1.12 // 技术接受度高+预算充足，转型顺利度高
        },
        {
            factors: ['companySize', 'challenges'],
            condition: (values) => values.companySize === 'medium' && values.challenges.includes('labor_cost'),
            effect: 1.10 // 中型企业+人力成本挑战，自动化效益高
        },
        {
            factors: ['industry', 'dataUsage'],
            condition: (values) => (values.industry === 'manufacturing' || values.industry === 'logistics') && values.dataUsage === 'medium',
            effect: 1.08 // 制造业/物流+中等数据应用，数字孪生等技术应用潜力大
        },
        {
            factors: ['industry', 'competitorsStatus'],
            condition: (values) => values.competitorsStatus === 'ahead' || values.competitorsStatus === 'leading',
            effect: 1.10 // 任何行业+竞争对手领先，转型紧迫性高
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
    
    // 应用组合效应，最多应用两个效应，防止分数过高超出真实性
    let appliedEffects = 0;
    for (const effect of combinationEffects) {
        if (effect.condition(factorValues) && appliedEffects < 2) {
            totalScore = totalScore * effect.effect;
            appliedEffects++;
            // 记录加成效果
            console.log(`应用组合效应: ${effect.factors.join('+')} 乘以 ${effect.effect}`);
        }
    }
    
    // 基础分增加，确保最低分数
    totalScore = Math.max(totalScore, 45); // 设置最低45分的基础分
    
    // 添加偏向高分的随机因素(±5%)
    const randomFactor = 1 + ((Math.random() * 8) - 3) / 100; // 更偏向正向调整
    totalScore = totalScore * randomFactor;
    
    // 非线性得分曲线 - 调整S曲线使中间分数偏高
    const normalizedScore = totalScore / 100;
    // 修改S曲线参数，使分数整体偏高
    const curvedScore = 1 / (1 + Math.exp(-12 * (normalizedScore - 0.4))) * 100;
    
    // 确保最终分数在中等以上并取整
    const finalScore = Math.min(Math.max(Math.round(curvedScore), 55), 100); // 设置最低得分为55
    
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
    
    // 第一步：评估与规划
    steps.push({
        title: '业务评估与规划',
        description: '全面评估当前业务流程，识别AI应用机会点，制定详细实施计划。',
        timeline: '2-4周'
    });
    
    // 第二步：数据准备
    steps.push({
        title: '数据准备与治理',
        description: '整合并清洗相关业务数据，建立数据标准，为AI应用奠定基础。',
        timeline: '3-6周'
    });
    
    // 根据优先领域添加特定步骤
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
    
    // 第四步：培训与调整
    steps.push({
        title: '人员培训与系统调优',
        description: '对相关人员进行系统操作培训，根据实际使用情况对系统进行持续优化。',
        timeline: '3-4周'
    });
    
    // 第五步：扩展与迭代
    if (potentialScore >= 70) {
        steps.push({
            title: '全面推广与持续迭代',
            description: '将成功经验推广到更多业务场景，建立长效迭代机制，持续提升系统价值。',
            timeline: '持续进行'
        });
    } else {
        steps.push({
            title: '效果评估与扩展规划',
            description: '评估试点效果，总结经验教训，规划下一阶段扩展方向。',
            timeline: '4-6周后启动'
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
    if (score >= 90) {
        return '#00b894'; // 明亮的绿色-蓝色
    } else if (score >= 80) {
        return '#00cec9'; // 青绿色
    } else if (score >= 70) {
        return '#0984e3'; // 鲜艳的蓝色
    } else if (score >= 60) {
        return '#6c5ce7'; // 紫蓝色
    } else if (score >= 50) {
        return '#a29bfe'; // 淡紫色
    } else if (score >= 40) {
        return '#fdcb6e'; // 黄色
    } else if (score >= 30) {
        return '#e17055'; // 珊瑚色
    } else if (score >= 20) {
        return '#d63031'; // 红色
    } else {
        return '#636e72'; // 灰色
    }
}

/**
 * 获取潜力得分对应的描述
 * @param {number} score - 潜力得分
 * @returns {string} 描述文本
 */
function getScoreDescription(score) {
    if (score >= 90) {
        return '您的企业具有极高的AI转型潜力，各方面条件已经非常成熟，可以立即启动全面的AI战略布局，有望获得行业领先优势。';
    } else if (score >= 80 && score < 90) {
        return '您的企业具有很高的AI转型潜力，基础条件良好，建议尽快制定并实施全面的AI战略计划，可以获得显著的业务提升。';
    } else if (score >= 70 && score < 80) {
        return '您的企业具有较高的AI转型潜力，多项关键指标表现良好，建议优先针对核心业务痛点开展AI应用，将获得明显收益。';
    } else if (score >= 60 && score < 70) {
        return '您的企业具有良好的AI转型潜力，具备实施AI解决方案的基础条件，建议从小规模试点开始，逐步扩大应用范围。';
    } else if (score >= 50 && score < 60) {
        return '您的企业具有中等偏上的AI转型潜力，在某些领域已具备应用AI的条件，建议选择成熟度高的AI解决方案进行试点。';
    } else if (score >= 40 && score < 50) {
        return '您的企业具有中等的AI转型潜力，可能在数据基础或技术接受度方面存在一定挑战，建议先完善数字化基础，同时开展小范围AI应用探索。';
    } else if (score >= 30 && score < 40) {
        return '您的企业具有一定的AI转型潜力，但可能面临多方面挑战，建议优先提升数据管理能力和数字化水平，为未来AI应用奠定基础。';
    } else if (score >= 20 && score < 30) {
        return '您的企业目前AI转型潜力较为有限，可能需要首先解决数字化转型中的基础问题，建议从流程优化和数据收集开始，为未来应用AI做准备。';
    } else {
        return '您的企业当前AI转型潜力较低，建议先专注于基础数字化能力建设，完善IT基础设施和数据采集流程，待条件成熟后再考虑AI应用。';
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