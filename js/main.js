/**
 * 初始化网站功能
 */
document.addEventListener('DOMContentLoaded', () => {
    // 导航菜单功能
    initNavigation();
    
    // 表单提交功能
    initFormSubmission();
    
    // 滚动动画效果
    initScrollEffects();
});

/**
 * 初始化导航菜单功能
 */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu a');
    
    // 菜单切换功能
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // 点击链接关闭菜单
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.06)';
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
        
        if (pageYOffset >= (sectionTop - 200)) {
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
 * 初始化表单提交功能
 */
function initFormSubmission() {
    const consultForm = document.getElementById('consultForm');
    
    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value,
                contact: document.getElementById('contact').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                industry: document.getElementById('industry').value,
                message: document.getElementById('message').value
            };
            
            // 表单验证
            if (!validateForm(formData)) {
                return;
            }
            
            // 显示提交成功信息
            showFormSuccessMessage(consultForm);
            
            // 在实际应用中，这里会发送数据到后端
            // sendFormData(formData);
            
            // 重置表单
            consultForm.reset();
        });
    }
}

/**
 * 验证表单数据
 * @param {Object} formData - 表单数据对象
 * @returns {boolean} 验证结果
 */
function validateForm(formData) {
    let isValid = true;
    
    // 简单验证示例
    if (!formData.name.trim()) {
        alert('请输入公司名称');
        isValid = false;
    } else if (!formData.contact.trim()) {
        alert('请输入联系人姓名');
        isValid = false;
    } else if (!formData.phone.trim()) {
        alert('请输入联系电话');
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        alert('请输入有效的电子邮箱');
        isValid = false;
    }
    
    return isValid;
}

/**
 * 验证电子邮箱格式
 * @param {string} email - 电子邮箱
 * @returns {boolean} 验证结果
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * 显示表单提交成功信息
 * @param {HTMLElement} form - 表单元素
 */
function showFormSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>提交成功!</h3>
        <p>我们已收到您的咨询信息，将在1个工作日内与您联系。</p>
    `;
    
    form.innerHTML = '';
    form.appendChild(successMessage);
    
    // 添加成功消息的样式
    const style = document.createElement('style');
    style.textContent = `
        .success-message {
            text-align: center;
            padding: 30px 0;
        }
        
        .success-icon {
            font-size: 3rem;
            color: #10b981;
            margin-bottom: 20px;
        }
        
        .success-message h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
        }
        
        .success-message p {
            color: var(--text-light);
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化滚动动画效果
 */
function initScrollEffects() {
    // 滚动到元素时添加动画效果
    const elements = document.querySelectorAll('.challenge-card, .solution-card, .step-card, .case-card, .tech-category');
    
    function checkScroll() {
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.9) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // 设置初始样式
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    });
    
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    
    // 初始检查
    checkScroll();
} 