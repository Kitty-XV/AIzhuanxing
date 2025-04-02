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
    }, 2500);
}

/**
 * 收集所有表单数据
 * @returns {Object} 表单数据对象
 */
function collectFormData() {
    const formData = {
        company: {
            name: document.getElementById('companyName').value,
            industry: document.getElementById('industry').value,
            size: document.getElementById('companySize').value,
            revenue: document.getElementById('annualRevenue').value
        },
        assessment: {
            digitalLevel: document.querySelector('input[name="digitalLevel"]:checked')?.value || 'medium',
            challenges: getSelectedCheckboxValues('challenges'),
            priorityArea: document.getElementById('priorityArea').value,
            aiAwareness: document.getElementById('aiAwareness').value,
            dataUsage: document.querySelector('input[name="dataUsage"]:checked')?.value || 'medium',
            techAcceptance: document.querySelector('input[name="techAcceptance"]:checked')?.value || 'medium',
            itBudget: document.getElementById('itBudget').value,
            aiExpectations: getSelectedCheckboxValues('aiExpectations'),
            competitorsStatus: document.getElementById('competitorsStatus').value
        }
    };
    
    return formData;
}

/**
 * 获取复选框选中的值
 * @param {string} name - 复选框的name属性
 * @returns {Array} 选中的值数组
 */
function getSelectedCheckboxValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

/**
 * 根据表单数据生成分析报告
 * @param {Object} formData - 表单数据对象
 */
function generateReport(formData) {
    const reportBody = document.getElementById('reportBody');
    if (!reportBody) return;
    
    // 计算业务提升潜力得分 (0-100)
    const potentialScore = calculatePotentialScore(formData);
    
    // 根据业务领域和行业获取推荐方案
    const recommendations = getRecommendations(formData);
    
    // 预计ROI和实施时间
    const implementation = getImplementationDetails(formData, potentialScore);
    
    // 创建报告HTML
    const reportHTML = `
        <div class="report-overview">
            <div class="potential-score">
                <div class="score-display">
                    <div class="score-value">${potentialScore}</div>
                    <svg viewBox="0 0 36 36" class="score-circle">
                        <path class="score-circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            stroke-width="3"
                            stroke-dasharray="100, 100"
                        />
                        <path class="score-circle-fill"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="${getScoreColor(potentialScore)}"
                            stroke-width="3"
                            stroke-dasharray="${potentialScore}, 100"
                        />
                    </svg>
                </div>
                <div class="score-label">业务提升潜力指数</div>
                <div class="score-description">${getScoreDescription(potentialScore)}</div>
            </div>
            
            <div class="potential-summary">
                <h3>摘要</h3>
                <p>根据您提供的信息，${formData.company.name}作为一家${getIndustryName(formData.company.industry)}企业，在数字化转型方面具有<strong>${potentialScore >= 70 ? '显著' : potentialScore >= 50 ? '中等' : '一定'}</strong>的提升潜力。我们的分析表明，通过AI技术应用，您可以在<strong>${getPriorityAreaName(formData.assessment.priorityArea)}</strong>领域取得明显进步。</p>
            </div>
        </div>
        
        <div class="recommendation-section">
            <h3>AI转型建议</h3>
            <div class="recommendations">
                ${recommendations.map((rec, index) => `
                    <div class="recommendation-item">
                        <div class="recommendation-icon">
                            <i class="${rec.icon}"></i>
                        </div>
                        <div class="recommendation-content">
                            <h4>${rec.title}</h4>
                            <p>${rec.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="implementation-section">
            <h3>实施规划</h3>
            <div class="implementation-details">
                <div class="implementation-item">
                    <div class="implementation-label">预计实施周期</div>
                    <div class="implementation-value">${implementation.timeframe}</div>
                </div>
                <div class="implementation-item">
                    <div class="implementation-label">预计投资回报率</div>
                    <div class="implementation-value">${implementation.roi}</div>
                </div>
                <div class="implementation-item">
                    <div class="implementation-label">建议试点规模</div>
                    <div class="implementation-value">${implementation.pilotScope}</div>
                </div>
            </div>
        </div>
        
        <div class="next-steps">
            <h3>后续步骤</h3>
            <p>如需了解更详细的AI转型解决方案，欢迎随时联系我们的专业顾问进行免费咨询。</p>
            <div class="contact-consultant">
                <a href="../index.html#contact" class="btn-primary">立即联系顾问</a>
            </div>
        </div>
    `;
    
    // 设置报告样式
    const reportStyle = document.createElement('style');
    reportStyle.textContent = `
        .report-overview {
            display: flex;
            gap: 30px;
            margin-bottom: 40px;
            align-items: center;
        }
        
        .potential-score {
            flex: 0 0 200px;
            text-align: center;
        }
        
        .score-display {
            position: relative;
            width: 150px;
            height: 150px;
            margin: 0 auto 15px;
        }
        
        .score-value {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-dark);
        }
        
        .score-circle {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }
        
        .score-circle-bg, .score-circle-fill {
            transition: stroke-dasharray 1s ease;
        }
        
        .score-label {
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--text-dark);
        }
        
        .score-description {
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .potential-summary {
            flex: 1;
        }
        
        .potential-summary h3 {
            margin-bottom: 15px;
            font-size: 1.4rem;
        }
        
        .potential-summary p {
            line-height: 1.6;
            color: var(--text-light);
        }
        
        .recommendation-section {
            margin-bottom: 40px;
        }
        
        .recommendation-section h3 {
            margin-bottom: 20px;
            font-size: 1.4rem;
        }
        
        .recommendations {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .recommendation-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 20px;
            background-color: var(--background-light);
            border-radius: 10px;
            transition: var(--transition);
        }
        
        .recommendation-item:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow);
        }
        
        .recommendation-icon {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color) 0%, #1e40af 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .recommendation-content h4 {
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .recommendation-content p {
            color: var(--text-light);
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .implementation-section {
            margin-bottom: 40px;
        }
        
        .implementation-section h3 {
            margin-bottom: 20px;
            font-size: 1.4rem;
        }
        
        .implementation-details {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }
        
        .implementation-item {
            padding: 20px;
            background-color: var(--background-light);
            border-radius: 10px;
            text-align: center;
        }
        
        .implementation-label {
            margin-bottom: 10px;
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .implementation-value {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .next-steps {
            background-color: var(--background-light);
            padding: 30px;
            border-radius: 10px;
            border-left: 4px solid var(--primary-color);
        }
        
        .next-steps h3 {
            margin-bottom: 15px;
            font-size: 1.4rem;
        }
        
        .next-steps p {
            margin-bottom: 20px;
            color: var(--text-light);
        }
        
        .contact-consultant {
            text-align: center;
            margin-top: 30px;
        }
        
        @media (max-width: 768px) {
            .report-overview {
                flex-direction: column;
            }
            
            .implementation-details {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(reportStyle);
    reportBody.innerHTML = reportHTML;
    
    // 添加图表动画效果
    setTimeout(() => {
        const scoreFill = document.querySelector('.score-circle-fill');
        if (scoreFill) {
            scoreFill.style.strokeDasharray = `${potentialScore}, 100`;
        }
    }, 100);
}

/**
 * 计算业务提升潜力得分
 * @param {Object} formData - 表单数据
 * @returns {number} 得分(0-100)
 */
function calculatePotentialScore(formData) {
    // 基础分数
    let score = 40;
    
    // 根据数字化程度调整
    const digitalLevel = formData.assessment.digitalLevel;
    if (digitalLevel === 'low') {
        score += 15; // 低数字化程度意味着更大的提升空间
    } else if (digitalLevel === 'medium') {
        score += 10;
    } else if (digitalLevel === 'high') {
        score += 5;
    }
    
    // 根据挑战数量调整
    const challenges = formData.assessment.challenges;
    score += Math.min(challenges.length * 3, 12);
    
    // 根据行业调整
    const industry = formData.company.industry;
    const industryBonus = {
        'manufacturing': 7,
        'retail': 8,
        'service': 6,
        'logistics': 9,
        'healthcare': 10,
        'other': 5
    };
    score += industryBonus[industry] || 5;
    
    // 根据企业规模调整
    const companySize = formData.company.size;
    if (companySize === 'medium') {
        score += 5;
    } else if (companySize === 'large') {
        score += 3;
    } else {
        score += 2;
    }
    
    // 根据数据应用现状调整
    const dataUsage = formData.assessment.dataUsage;
    if (dataUsage === 'low') {
        score += 5; // 数据分散，有较大提升空间
    } else if (dataUsage === 'medium') {
        score += 3;
    } else if (dataUsage === 'high') {
        score += 1;
    }
    
    // 根据技术接受度调整
    const techAcceptance = formData.assessment.techAcceptance;
    if (techAcceptance === 'high') {
        score += 5; // 技术接受度高，实施更容易成功
    } else if (techAcceptance === 'medium') {
        score += 3;
    } else {
        score += 0; // 技术接受度低会增加实施难度
    }
    
    // 根据IT预算调整
    const itBudget = formData.assessment.itBudget;
    const budgetBonus = {
        'verylow': 0,
        'low': 2,
        'medium': 4,
        'high': 6,
        'veryhigh': 8
    };
    score += budgetBonus[itBudget] || 0;
    
    // 根据AI期望数量调整
    const aiExpectations = formData.assessment.aiExpectations;
    score += Math.min(aiExpectations.length, 5);
    
    // 根据竞争对手情况调整
    const competitorsStatus = formData.assessment.competitorsStatus;
    if (competitorsStatus === 'behind') {
        score += 6; // 领先机会
    } else if (competitorsStatus === 'similar') {
        score += 4; // 需要跟上
    } else if (competitorsStatus === 'ahead') {
        score += 8; // 急需赶上
    } else if (competitorsStatus === 'leading') {
        score += 10; // 非常急迫
    }
    
    // 确保分数在0-100之间
    return Math.min(Math.max(Math.round(score), 0), 100);
}

/**
 * 获取推荐方案
 * @param {Object} formData - 表单数据
 * @returns {Array} 推荐方案数组
 */
function getRecommendations(formData) {
    const industry = formData.company.industry;
    const priorityArea = formData.assessment.priorityArea;
    const challenges = formData.assessment.challenges;
    
    const recommendations = [];
    
    // 根据行业和优先领域推荐方案
    if (industry === 'manufacturing') {
        if (priorityArea === 'production') {
            recommendations.push({
                title: '智能生产排程系统',
                description: '基于AI的生产排程系统，可优化生产计划，减少停机时间，提高设备利用率。',
                icon: 'fas fa-industry'
            });
        } else if (priorityArea === 'sales') {
            recommendations.push({
                title: '销售预测分析平台',
                description: '结合历史销售数据与市场趋势，精准预测未来需求，帮助优化库存管理和生产计划。',
                icon: 'fas fa-chart-line'
            });
        }
    } else if (industry === 'retail') {
        if (priorityArea === 'sales') {
            recommendations.push({
                title: '个性化推荐引擎',
                description: '基于客户行为分析的精准推荐系统，提升用户体验和转化率。',
                icon: 'fas fa-tag'
            });
        } else if (priorityArea === 'supplychain') {
            recommendations.push({
                title: '智能库存管理系统',
                description: '预测性补货系统，减少库存占用成本，同时避免缺货现象。',
                icon: 'fas fa-boxes'
            });
        }
    }
    
    // 根据挑战添加通用解决方案
    if (challenges.includes('labor_cost')) {
        recommendations.push({
            title: '流程自动化方案',
            description: '通过RPA和AI技术自动化重复性工作流程，大幅降低人力成本，提高效率。',
            icon: 'fas fa-robot'
        });
    }
    
    if (challenges.includes('data_quality')) {
        recommendations.push({
            title: '数据治理与分析平台',
            description: '建立统一数据标准和智能分析系统，将分散数据转化为决策支持工具。',
            icon: 'fas fa-database'
        });
    }
    
    // 确保至少有3个推荐方案
    const defaultRecommendations = [
        {
            title: '智能客户服务系统',
            description: '结合NLP技术的智能客服系统，提升响应速度和服务质量，同时降低运营成本。',
            icon: 'fas fa-headset'
        },
        {
            title: '预测性维护系统',
            description: '基于设备数据分析的预测性维护系统，避免意外停机，延长设备寿命。',
            icon: 'fas fa-tools'
        },
        {
            title: '业务智能仪表盘',
            description: '实时业务数据可视化平台，帮助管理者快速掌握关键指标，做出数据驱动的决策。',
            icon: 'fas fa-chart-pie'
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
 * @returns {Object} 实施细节
 */
function getImplementationDetails(formData, potentialScore) {
    // 根据企业规模和潜力得分确定实施周期
    let timeframe;
    const companySize = formData.company.size;
    
    if (companySize === 'small') {
        timeframe = '2-3个月';
    } else if (companySize === 'medium') {
        timeframe = '3-5个月';
    } else {
        timeframe = '4-6个月';
    }
    
    // 根据潜力得分确定投资回报率
    let roi;
    if (potentialScore >= 80) {
        roi = '300-400%';
    } else if (potentialScore >= 65) {
        roi = '200-300%';
    } else if (potentialScore >= 50) {
        roi = '150-200%';
    } else {
        roi = '100-150%';
    }
    
    // 建议试点规模
    let pilotScope;
    if (potentialScore >= 75) {
        pilotScope = '单部门全流程';
    } else if (potentialScore >= 60) {
        pilotScope = '核心业务流程';
    } else {
        pilotScope = '单一业务场景';
    }
    
    return {
        timeframe,
        roi,
        pilotScope
    };
}

/**
 * 获取潜力得分对应的颜色
 * @param {number} score - 潜力得分
 * @returns {string} 颜色值
 */
function getScoreColor(score) {
    if (score >= 80) {
        return '#10b981'; // 绿色
    } else if (score >= 60) {
        return '#3b82f6'; // 蓝色
    } else if (score >= 40) {
        return '#f59e0b'; // 橙色
    } else {
        return '#ef4444'; // 红色
    }
}

/**
 * 获取潜力得分对应的描述
 * @param {number} score - 潜力得分
 * @returns {string} 描述文本
 */
function getScoreDescription(score) {
    if (score >= 80) {
        return '您的企业具有极高的AI转型潜力';
    } else if (score >= 60) {
        return '您的企业具有良好的AI转型潜力';
    } else if (score >= 40) {
        return '您的企业具有中等的AI转型潜力';
    } else {
        return '您的企业有一定的AI转型潜力';
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