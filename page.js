function create(node = 'div', cls) {
    const ele = document.createElement(node);
    ele.className = cls;
    return ele;
}


class Page {
    constructor(options) {
        this.init(options);
    }
    init(options) {
        const defaults = {
            prev: '&lt;',
            next: '&gt;',
            size: 15, // 每一页的数据
            max: 8, // 一个页面包含几页
            pages: 2, // 页数 可以通过item和size计算
            items: 0, // 总数据数
            curr: 20, // 当前页码
            info: true, // 页码信息
            jump: true, // 跳页
            selector: null,
        };
        this.options = Object.assign({}, defaults, options);
        this.curr = this.options.curr;
        this.pages = this.options.pages;
        this.render();
    }
    render() {
        const { items, size, selector, prev, next } = this.options;
        let { max } = this.options;
        if (items && size) this.pages = Math.ceil(items / size);
        max = Math.min(max, this.pages);
        const half = Math.ceil(max / 2);
        const list = [];
        selector.innerHTML = '';
        for (let i = 1; i <= this.pages; i += 1) {
            if (this.curr === i) {
                list.push(`<li class="page-item active" data-id="${this.curr}">${this.curr}</li>`);
                continue;
            }
            list.push(`<li class="page-item" data-id="${i}">${i}</li>`);
        }
        const elips = '<li class="page-eslips" data-id="eslips">...</li>';
        if (this.pages > max) {
            const isLeft = this.curr <= half;
            const isRight = this.curr >= this.pages - half;
            const isCenter = !isLeft && !isRight;
            let len = list.length;
            if (isLeft) {
                list.splice(max - 1, len - max, elips);
            }
            if (isRight) {
                list.splice(1, this.pages - max, elips);
            }
            if (isCenter) {
                list.splice(1, this.curr - half, elips);
                len = list.length;
                list.splice(max, len - max - 1, elips);
            }
        }
        if (prev) {
            list.unshift(`<li class="page-prev" data-id="prev">${prev}</li>`);
        }
        if (next) {
            list.push(`<li class="page-next" data-id="next">${next}</li>`);
        }
        const ul = create('ul', 'page-ui');

        ul.innerHTML = list.join('');
        selector.appendChild(ul);
        this.setActive(this.curr);
        this.bindEvents();
    }
    bindEvents() {
        const { selector } = this.options;
        const ul = selector.firstChild;
        ul.addEventListener('click', (e) => {
            e = e || window.event;
            let target;
            if (e.target.tagName.toUpperCase() === 'LI') {
                target = e.target;
            } else {
                target = e.target.parentElement;
            }
            const text = target.innerText;
            if (/\d+/.test(text)) {
                this.curr = text;
                this.render();
            }
            if (text === '<') {
                if (this.curr <= 1) return;
                this.curr--;
                this.render();
            }
            if (text === '>') {
                if (this.curr >= this.pages) return;
                this.curr++;
                this.render();
            }
        });
    }
    setActive(index) {
        const ele = document.querySelectorAll('.page-item');
        const len = ele.length;
        for (let i = 0; i < len; i += 1) {
            if (ele[i].innerHTML === index) {
                ele[i].classList.add('active');
            }
        }
    }
}
