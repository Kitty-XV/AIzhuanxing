/**
 * 初始化网站功能
 */
document.addEventListener('DOMContentLoaded', () => {
    // 导航菜单功能
    initNavigation();
    
    // 滚动动画效果
    initScrollEffects();
    
    // 二维码测算功能
    initPotentialTest();
    
    // 卡片悬停效果
    initCardHoverEffects();
    
    // 页面加载动画
    initPageLoadAnimation();
});

/**
 * 初始化导航菜单功能
 */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu a');
    const header = document.querySelector('.header');
    
    // 菜单切换功能
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            // 添加菜单图标动画效果
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // 点击链接关闭菜单
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 平滑滚动到目标位置
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            
            menu.classList.remove('active');
            if (menuToggle.querySelector('i.fa-times')) {
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 激活当前部分的导航链接
    window.addEventListener('scroll', highlightNavLink);
}

/**
 * 根据滚动位置高亮导航链接
 */
function highlightNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        if (pageYOffset >= (sectionTop - headerHeight - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * 初始化滚动动画效果
 */
function initScrollEffects() {
    // 滚动到元素时添加动画效果
    const animatedElements = document.querySelectorAll(
        '.section-header, .challenge-card, .solution-card, .step-card, .case-card, .tech-category, .feature-item, .potential-qrcode'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // 一段时间后删除观察，提高性能
                setTimeout(() => {
                    observer.unobserve(entry.target);
                }, 1000);
            }
        });
    }, { threshold: 0.15 });
    
    // 设置初始动画样式
    animatedElements.forEach((element, index) => {
        // 创建不同的动画延迟，形成序列效果
        const delay = Math.min(index * 0.1, 0.5);
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`;
        
        // 添加自定义类以便添加观察
        element.classList.add('scroll-animate');
        
        // 将元素添加到观察器
        observer.observe(element);
    });
    
    // 添加自定义CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .scroll-animate.animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化业务提升潜力测算功能
 */
function initPotentialTest() {
    const qrcodeSection = document.getElementById('potential-test');
    
    if (!qrcodeSection) return;
    
    // 添加悬停效果
    const qrcodeContainer = qrcodeSection.querySelector('.qrcode-container');
    if (qrcodeContainer) {
        qrcodeContainer.addEventListener('mouseenter', () => {
            const scanAnimation = qrcodeContainer.querySelector('.scan-animation');
            if (scanAnimation) {
                scanAnimation.style.animationDuration = '1s';
            }
        });
        
        qrcodeContainer.addEventListener('mouseleave', () => {
            const scanAnimation = qrcodeContainer.querySelector('.scan-animation');
            if (scanAnimation) {
                scanAnimation.style.animationDuration = '2s';
            }
        });
    }
    
    // 当用户停留在这个部分超过5秒时，更新已测算企业数量
    const userCountElement = qrcodeSection.querySelector('.user-count strong');
    if (userCountElement) {
        let isVisible = false;
        let initialCount = parseInt(userCountElement.textContent.replace(/,/g, ''));
        
        // 检测区块是否在视口中
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    // 每隔30-60秒随机增加1-3个数量
                    setInterval(() => {
                        if (isVisible) {
                            const increment = Math.floor(Math.random() * 3) + 1;
                            initialCount += increment;
                            userCountElement.textContent = initialCount.toLocaleString();
                        }
                    }, Math.random() * 30000 + 30000);
                } else {
                    isVisible = false;
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(qrcodeSection);
    }
}

/**
 * 初始化卡片悬停交互效果
 */
function initCardHoverEffects() {
    // 案例卡片数值动画
    const caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach(card => {
        const resultValues = card.querySelectorAll('.result-value');
        
        card.addEventListener('mouseenter', () => {
            resultValues.forEach(value => {
                const finalValue = value.textContent;
                animateCounterValue(value, finalValue);
            });
        });
    });
    
    // 技术能力标签粒子效果
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', createParticleEffect);
    });
}

/**
 * 为数值创建计数动画
 * @param {HTMLElement} element - 显示数值的元素
 * @param {string} finalValue - 最终显示的数值
 */
function animateCounterValue(element, finalValue) {
    // 检查是否已经有动画在进行
    if (element.dataset.animating === 'true') return;
    
    element.dataset.animating = 'true';
    
    // 解析百分比或数字值
    let isPercentage = finalValue.includes('%');
    let isNegative = finalValue.startsWith('-');
    let numericValue = parseFloat(finalValue.replace(/[^0-9.-]/g, ''));
    
    // 确定起始值和增量
    let startValue = 0;
    let duration = 1000; // 动画持续时间（毫秒）
    let interval = 16; // 动画间隔时间（毫秒）
    let steps = duration / interval;
    let increment = numericValue / steps;
    
    // 如果是负值，从负起始值开始
    if (isNegative) {
        startValue = -Math.abs(numericValue / 10);
    }
    
    let currentValue = startValue;
    let timer = setInterval(() => {
        currentValue += increment;
        
        // 检查是否达到最终值
        if ((increment > 0 && currentValue >= numericValue) || 
            (increment < 0 && currentValue <= numericValue)) {
            clearInterval(timer);
            element.textContent = finalValue;
            setTimeout(() => {
                element.dataset.animating = 'false';
            }, 1000);
        } else {
            // 格式化数值显示
            let displayValue = currentValue;
            if (Math.abs(displayValue) >= 10000) {
                displayValue = Math.round(displayValue / 1000) + '万';
            } else {
                displayValue = Math.round(displayValue * 10) / 10;
            }
            
            // 添加百分号或其他修饰符
            if (isPercentage) {
                displayValue = displayValue + '%';
            }
            
            element.textContent = isNegative ? '-' + Math.abs(displayValue) : displayValue;
        }
    }, interval);
}

/**
 * 创建鼠标悬停时的粒子效果
 * @param {Event} e - 鼠标事件
 */
function createParticleEffect(e) {
    const item = e.currentTarget;
    const icon = item.querySelector('i');
    
    if (!icon) return;
    
    // 创建5个粒子
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        
        // 随机样式
        const size = Math.random() * 5 + 3;
        const colorIndex = Math.floor(Math.random() * 3);
        const colors = ['rgba(67, 97, 238, 0.7)', 'rgba(72, 149, 239, 0.7)', 'rgba(247, 37, 133, 0.5)'];
        
        // 设置位置和样式
        const iconRect = icon.getBoundingClientRect();
        const x = iconRect.left + iconRect.width / 2 - size / 2;
        const y = iconRect.top + iconRect.height / 2 - size / 2;
        
        particle.style.position = 'fixed';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[colorIndex];
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        document.body.appendChild(particle);
        
        // 动画
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        // 使用requestAnimationFrame进行平滑动画
        let startTime = null;
        
        function moveParticle(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            
            // 计算新位置
            const nx = x + vx * (elapsed / 1000);
            const ny = y + vy * (elapsed / 1000) - 9.8 * Math.pow(elapsed / 1000, 2) * 20; // 添加重力效果
            
            // 设置透明度
            const opacity = 1 - elapsed / 1000;
            
            if (opacity > 0) {
                particle.style.left = `${nx}px`;
                particle.style.top = `${ny}px`;
                particle.style.opacity = opacity;
                requestAnimationFrame(moveParticle);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(moveParticle);
    }
}

/**
 * 页面加载时的动画效果
 */
function initPageLoadAnimation() {
    document.body.classList.add('page-loaded');
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInPage {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        body.page-loaded {
            animation: fadeInPage 0.5s ease-out;
        }
        
        .header.scrolled {
            padding: 10px 0;
            box-shadow: var(--shadow-md);
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
        }
    `;
    document.head.appendChild(style);
} 