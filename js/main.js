/**
 * 특허법인 테헤란 FAQ 페이지 스크립트
 */

(function () {
    'use strict';

    /**
     * DOM이 로드된 후 초기화
     */
    document.addEventListener('DOMContentLoaded', function () {
        initAccordion();
        initNavigation();
        initScrollSpy();
        initMenuToggle();
        initModal();
    });

    /**
     * 아코디언 기능 초기화
     */
    function initAccordion() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');

        accordionHeaders.forEach(function (header) {
            header.addEventListener('click', function () {
                const item = this.parentElement;
                const accordion = item.parentElement;
                const isActive = item.classList.contains('active');

                // 같은 아코디언 내의 다른 아이템 닫기
                accordion.querySelectorAll('.accordion-item').forEach(function (i) {
                    i.classList.remove('active');
                });

                // 클릭한 아이템 토글
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    /**
     * 네비게이션 클릭 이벤트 초기화
     */
    function initNavigation() {
        // 사이드바 네비게이션
        const navLinks = document.querySelectorAll('.nav-link');
        // 헤더 네비게이션
        const headerNavLinks = document.querySelectorAll('.header-nav-link');

        // 사이드바 네비게이션 클릭 이벤트
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                scrollToSection(this.getAttribute('href'));
                
                // 활성 상태 업데이트
                navLinks.forEach(function (l) {
                    l.classList.remove('active');
                });
                this.classList.add('active');
            });
        });

        // 헤더 네비게이션 클릭 이벤트
        headerNavLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                scrollToSection(this.getAttribute('href'));
            });
        });
    }

    /**
     * 특정 섹션으로 스크롤
     * @param {string} targetId - 타겟 섹션 ID
     */
    function scrollToSection(targetId) {
        const target = document.querySelector(targetId);

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    /**
     * 메뉴 토글 기능 초기화
     */
    function initMenuToggle() {
        const menuBtn = document.getElementById('menuBtn');
        const headerNav = document.getElementById('headerNav');
        const headerNavLinks = document.querySelectorAll('.header-nav-link');

        if (menuBtn && headerNav) {
            menuBtn.addEventListener('click', function () {
                menuBtn.classList.toggle('active');
                headerNav.classList.toggle('active');
            });

            // 메뉴 링크 클릭 시 메뉴 닫기
            headerNavLinks.forEach(function (link) {
                link.addEventListener('click', function () {
                    menuBtn.classList.remove('active');
                    headerNav.classList.remove('active');
                });
            });

            // 메뉴 외부 클릭 시 닫기
            document.addEventListener('click', function (e) {
                if (!menuBtn.contains(e.target) && !headerNav.contains(e.target)) {
                    menuBtn.classList.remove('active');
                    headerNav.classList.remove('active');
                }
            });
        }
    }

    /**
     * 스크롤 스파이 기능 초기화
     */
    function initScrollSpy() {
        const sections = document.querySelectorAll('.guide-section, .faq-section');
        const navLinks = document.querySelectorAll('.nav-link');

        // 스크롤 이벤트 최적화를 위한 throttle
        let isScrolling = false;

        window.addEventListener('scroll', function () {
            if (!isScrolling) {
                window.requestAnimationFrame(function () {
                    updateActiveNav(sections, navLinks);
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }

    /**
     * 현재 스크롤 위치에 따라 활성 네비게이션 업데이트
     * @param {NodeList} sections - FAQ 섹션들
     * @param {NodeList} navLinks - 네비게이션 링크들
     */
    function updateActiveNav(sections, navLinks) {
        let currentSection = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 150;

            if (scrollPosition >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');

            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    /**
     * 모달 기능 초기화
     */
    function initModal() {
        const guideCards = document.querySelectorAll('.guide-card');
        const modals = document.querySelectorAll('.modal');

        // 가이드 카드 클릭 시 모달 열기
        guideCards.forEach(function (card) {
            card.addEventListener('click', function () {
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);

                if (modal) {
                    openModal(modal);
                }
            });
        });

        // 모달 닫기 버튼
        modals.forEach(function (modal) {
            const closeBtn = modal.querySelector('.modal-close');
            const overlay = modal.querySelector('.modal-overlay');

            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    closeModal(modal);
                });
            }

            if (overlay) {
                overlay.addEventListener('click', function () {
                    closeModal(modal);
                });
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });

        // 절차 아코디언 초기화
        initProcedureAccordion();
    }

    /**
     * 절차 아코디언 기능 초기화
     */
    function initProcedureAccordion() {
        const procedureHeaders = document.querySelectorAll('.procedure-header');

        procedureHeaders.forEach(function (header) {
            header.addEventListener('click', function () {
                const item = this.parentElement;
                const isActive = item.classList.contains('active');

                // 다른 아이템 닫기
                item.parentElement.querySelectorAll('.procedure-item').forEach(function (i) {
                    i.classList.remove('active');
                });

                // 클릭한 아이템 토글
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    /**
     * 모달 열기
     * @param {Element} modal - 모달 요소
     */
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * 모달 닫기
     * @param {Element} modal - 모달 요소
     */
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

})();

