document.addEventListener('DOMContentLoaded', () => {
    
    // 1. إخفاء شاشة التحميل بعد اكتمال تحميل الصفحة
    const loadingScreen = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // 2. إدارة قائمة التنقل للجوال (Mobile Menu)
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // تغيير شكل زر القائمة (الهمبرغر)
            menuToggle.classList.toggle('open');
        });

        // إغلاق القائمة عند النقر على أي رابط
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. تغيير خلفية الهيدر عند التمرير (Header Scroll Effect)
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. منطق سلايدر القائمة (Coverflow Slider Logic)
    // استخدام هيكل بيانات لتخزين حالة السلايدر
    const sliderState = {
        currentIndex: 0,
        items: document.querySelectorAll('.coverflow-item'),
        container: document.getElementById('coverflowContainer'),
        isPlaying: true,
        interval: null
    };

    const updateSlider = () => {
        const { currentIndex, items, container } = sliderState;
        
        items.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentIndex) {
                item.classList.add('active');
            }
        });

        // حساب الإزاحة لتحريك الحاوية
        const itemWidth = items[0].offsetWidth + 20; // العرض + الفجوة
        const offset = -(currentIndex * itemWidth);
        container.style.transform = `translateX(${offset}px)`;
    };

    const nextSlide = () => {
        sliderState.currentIndex = (sliderState.currentIndex + 1) % sliderState.items.length;
        updateSlider();
    };

    const prevSlide = () => {
        sliderState.currentIndex = (sliderState.currentIndex - 1 + sliderState.items.length) % sliderState.items.length;
        updateSlider();
    };

    // أزرار التحكم
    document.getElementById('nextBtn')?.addEventListener('click', nextSlide);
    document.getElementById('prevBtn')?.addEventListener('click', prevSlide);

    // التشغيل التلقائي
    const startAutoPlay = () => {
        sliderState.interval = setInterval(nextSlide, 3000);
    };

    const stopAutoPlay = () => {
        clearInterval(sliderState.interval);
    };

    document.getElementById('playPauseBtn')?.addEventListener('click', (e) => {
        if (sliderState.isPlaying) {
            stopAutoPlay();
            e.target.textContent = '▶';
        } else {
            startAutoPlay();
            e.target.textContent = 'II';
        }
        sliderState.isPlaying = !sliderState.isPlaying;
    });

    startAutoPlay();

    // 5. تأثيرات الظهور عند التمرير (Reveal on Scroll)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // تشغيل أولي للعناصر الظاهرة بالفعل

    // 6. دعم الكيبورد (Keyboard Accessibility)
    document.addEventListener('keydown', (e) => {
        // التنقل في السلايدر بالأسهم
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
        
        // إغلاق القائمة بمفتاح Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // 7. حماية النماذج (Form Security & Validation)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // التحقق من البيانات (Client-side validation)
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // تنظيف البيانات لمنع XSS (Basic Sanitization)
            const sanitize = (str) => str.replace(/[&<>"']/g, (m) => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            }[m]));

            console.log('تم إرسال الرسالة بأمان:', {
                name: sanitize(name),
                email: sanitize(email),
                message: sanitize(message)
            });

            alert('شكراً لتواصلك معنا! تم استلام رسالتك بنجاح.');
            contactForm.reset();
        });
    }
});
