/**
 * 初始化网站功能
 */
document.addEventListener('DOMContentLoaded', function() {
    initMenuToggle();
    initScrollEffects();
    initCounterAnimation();
    initScrollIndicator();
    initTechItemsAnimation();
    initPageLoadAnimation();
    handleScrollAnimations();
    initUserCounter();
});

/**
 * 初始化菜单切换功能
 */
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * 初始化滚动效果
 */
function initScrollEffects() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 检查元素是否进入视口
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animate');
            }
        });
    });
}

/**
 * 检查元素是否在视口中
 * @param {Element} el - DOM元素
 * @returns {boolean} - 元素是否在视口中
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

/**
 * 初始化计数器动画
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // 数值越大，动画越慢
    
    // 首次进入页面时检查
    document.addEventListener('DOMContentLoaded', () => {
        checkCounters();
    });
    
    // 滚动时检查
    window.addEventListener('scroll', () => {
        checkCounters();
    });
    
    /**
     * 检查计数器元素是否在视口中
     */
    function checkCounters() {
        counters.forEach(counter => {
            const parent = counter.closest('.hero-stats, .case-results, .tech-category');
            
            if (parent && isElementInViewport(parent) && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                
                const target = +counter.getAttribute('data-target');
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / speed;
                    
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
            }
        });
    }
}

/**
 * 初始化滚动指示器
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // 滚动到下一个部分
            const heroHeight = document.querySelector('.hero').offsetHeight;
            window.scrollTo({
                top: heroHeight - 50,
                behavior: 'smooth'
            });
        });
    }
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
        const colors = ['rgba(0, 173, 181, 0.75)', 'rgba(57, 62, 70, 0.65)', 'rgba(238, 238, 238, 0.5)'];
        
        // 设置位置和样式
        const iconRect = icon.getBoundingClientRect();
        const x = iconRect.left + iconRect.width / 2 - size / 2;
        const y = iconRect.top + iconRect.height / 2 - size / 2;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[colorIndex];
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.boxShadow = `0 0 ${size}px ${colors[colorIndex]}`;
        
        // 添加到DOM
        document.body.appendChild(particle);
        
        // 随机动画
        const angle = Math.random() * 360 * Math.PI / 180;
        const velocity = Math.random() * 50 + 30;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        gsap.to(particle, {
            x: tx,
            y: ty,
            opacity: 0,
            duration: Math.random() * 1 + 0.5,
            onComplete: function() {
                particle.remove();
            }
        });
    }
}

/**
 * 为交互元素添加粒子效果
 */
function initParticleEffects() {
    const interactiveItems = document.querySelectorAll('.card-icon, .tech-item, .feature-icon, .case-icon');
    
    interactiveItems.forEach(item => {
        item.addEventListener('mouseenter', createParticleEffect);
    });
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
            background-color: rgba(34, 40, 49, 0.95);
            backdrop-filter: blur(8px);
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-on-scroll.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // 为需要在滚动时显示动画的元素添加类
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionHeader = section.querySelector('.section-header');
        const cards = section.querySelectorAll('.challenge-card, .solution-card, .case-card, .tech-category, .feature-item');
        
        if (sectionHeader) {
            sectionHeader.classList.add('animate-on-scroll');
        }
        
        cards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

/**
 * 初始化技术能力矩阵的交互动画
 */
function initTechItemsAnimation() {
    const techItems = document.querySelectorAll('.tech-item');
    const techCategories = document.querySelectorAll('.tech-category');
    
    // 为技术项添加鼠标悬停效果
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                // 添加图标震动效果
                icon.style.animation = 'pulse 0.5s ease-in-out';
                
                // 动画结束后移除，以便再次触发
                setTimeout(() => {
                    icon.style.animation = '';
                }, 500);
                
                // 创建粒子效果
                createParticleEffect({ currentTarget: this });
            }
        });
    });
    
    // 为技术类别添加连线效果
    techCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            // 添加发光边框效果
            this.style.boxShadow = '0 0 30px rgba(0, 173, 181, 0.4)';
            
            // 添加背景动画
            const h3 = this.querySelector('h3');
            if (h3) {
                h3.style.color = 'var(--primary-color)';
            }
        });
        
        category.addEventListener('mouseleave', function() {
            // 恢复正常样式
            this.style.boxShadow = '';
            
            const h3 = this.querySelector('h3');
            if (h3) {
                h3.style.color = '';
            }
        });
    });
    
    // 添加CSS关键帧动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * 处理滚动动画
 */
function handleScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (isElementInViewport(section)) {
            section.classList.add('visible');
        }
    });
}

// 添加滚动事件监听
window.addEventListener('scroll', function() {
    handleScrollAnimations();
});

// 窗口大小改变时也检查
window.addEventListener('resize', function() {
    handleScrollAnimations();
});

// 移动端菜单切换功能
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    // 菜单切换
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            // 切换图标
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // 点击菜单项后自动关闭菜单
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                menu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992 && menu.classList.contains('active')) {
            if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
                menu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // 窗口大小改变时的处理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && menu.classList.contains('active')) {
            menu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

/**
 * 计算器点击计数功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 为"立即测算"点击绑定事件
    const calculatorLinks = document.querySelectorAll('.potential-qrcode a');
    calculatorLinks.forEach(link => {
        link.addEventListener('click', function() {
            incrementUserCounter();
        });
    });
});

/**
 * 初始化用户计数器
 */
function initUserCounter() {
    // 检查是否存在计数
    let count = parseInt(localStorage.getItem('calculationCount')) || 2847;
    updateUserCountDisplay(count);
}

/**
 * 增加用户计数
 */
function incrementUserCounter() {
    // 获取当前计数
    let count = parseInt(localStorage.getItem('calculationCount')) || 2847;
    
    // 增加计数
    count += 1;
    
    // 保存到localStorage
    localStorage.setItem('calculationCount', count);
    
    // 更新显示
    updateUserCountDisplay(count);
}

/**
 * 更新用户计数显示
 * @param {number} count - 要显示的计数
 */
function updateUserCountDisplay(count) {
    const userCountElements = document.querySelectorAll('.user-count strong');
    userCountElements.forEach(element => {
        element.textContent = count.toLocaleString('zh-CN');
    });
} 